import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronUp, Clock, Download, Eye, FileSpreadsheet, FileText, Globe, ImagePlus, Layers, Plus, Save, Send, ShieldCheck, Upload } from 'lucide-react';
import { useAuth } from '@/application/context/AuthContext';
import { contentService } from '@/services/contentService';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { ResourceState } from '@/components/common/ResourceState';
import { Notice } from '@/components/common/Ui';
import { Modal } from '@/components/common/Modal';
import { ContentForm } from '@/components/admin/ContentForm';
import { CourseThumbnail } from '@/components/course/CourseInfo';
import { LessonActivities } from '@/components/learning/LessonActivities';
import { moveItem } from '@/components/learning/answerUtils';
import './course-studio.css';

const steps = [
  { id: 'info', title: 'Thông tin khóa học', description: 'Tên, mục tiêu và ảnh bìa', icon: FileText },
  { id: 'curriculum', title: 'Cấu trúc & bài học', description: 'Học phần, nội dung và quiz', icon: Layers },
  { id: 'preview', title: 'Xem trước', description: 'Trải nghiệm của học viên', icon: Eye },
  { id: 'publish', title: 'Kiểm tra & xuất bản', description: 'Hoàn thiện và gửi duyệt', icon: Send },
];
const stepGuidance = {
  info: { eyebrow: 'BƯỚC 1 / 4', title: 'Kiểm tra thông tin khóa học', description: 'Hoàn thiện tên, mô tả, mục tiêu, trình độ và ảnh bìa. Lưu thay đổi trước khi sang bước tiếp theo.' },
  curriculum: { eyebrow: 'BƯỚC 2 / 4', title: 'Hoàn thiện cấu trúc và nội dung', description: 'Kiểm tra thứ tự học phần, bài học, hoạt động, quiz bài học và quiz cuối khóa.' },
  preview: { eyebrow: 'BƯỚC 3 / 4', title: 'Xem lại như một học viên', description: 'Mở từng bài để kiểm tra cách nội dung, ảnh, âm thanh, video và quiz được hiển thị.' },
  publish: { eyebrow: 'BƯỚC 4 / 4', title: 'Kiểm tra và gửi duyệt', description: 'Xử lý các mục còn thiếu, kiểm tra lại lần cuối rồi gửi khóa học cho Admin.' },
};
const statusNames = { DRAFT: 'Bản nháp', REVIEW: 'Chờ kiểm duyệt', REJECTED: 'Cần chỉnh sửa', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Đã lưu trữ' };
const issueNames = {
  'Add at least one module.': 'Thêm ít nhất một học phần.',
  'Add at least one lesson.': 'Thêm ít nhất một bài học.',
  'Every module needs a lesson.': 'Mỗi học phần cần có bài học.',
  'Publish every lesson before submitting.': 'Xuất bản tất cả bài học.',
  'Every lesson needs a published required learning activity.': 'Mỗi bài cần một hoạt động học bắt buộc đã xuất bản.',
  'Every lesson needs a published quiz activity.': 'Mỗi bài cần một quiz đã xuất bản và gắn vào bài.',
  'Set a published final course quiz and attach it to a lesson.': 'Thêm quiz cuối khóa, xuất bản và gắn vào bài học.',
};
const slugify = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 190).replace(/-$/g, '');

export function AdminCourseCreatePage() {
  const { isContentManager, isAdmin } = useAuth();
  if (!isContentManager || isAdmin) return <Notice>Bạn cần tài khoản Content Manager để tạo khóa học. <Link to="/admin/courses">Về danh sách</Link></Notice>;
  return <CourseStudio />;
}

export function CourseStudio({ course, reload = () => {} }) {
  const { isAdmin, isContentManager } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedStep = params.get('step');
  const step = steps.some(s => s.id === selectedStep) && course ? selectedStep : 'info';
  const canEdit = isContentManager && !isAdmin && (!course || ['DRAFT', 'REJECTED'].includes(course.status));
  const canReview = isAdmin && course?.status === 'REVIEW';
  const [modal, setModal] = useState(null), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [message, setMessage] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [importedCourseId, setImportedCourseId] = useState(null);
  const [infoEditorOpen, setInfoEditorOpen] = useState(true);
  const dirty = useRef(false);
  const modules = course?.modules || [];
  const lessons = modules.flatMap(m => m.lessons || []);
  const readiness = useAsyncResource(useCallback(signal => course ? contentService.courseReadiness(course.id, signal) : Promise.resolve(null), [course?.id, course?.updatedAt, course?.status]));
  const metadataIssues = course ? [!course.thumbnailUrl && 'Thêm ảnh bìa khóa học.', !course.learningOutcomes?.trim() && 'Bổ sung mục tiêu học tập.'].filter(Boolean) : [];
  const issues = [...metadataIssues, ...(readiness.data?.issues || [])];
  const ready = Boolean(course && readiness.data?.ready && !readiness.isValidating && !readiness.error && !metadataIssues.length);
  const infoComplete = Boolean(course?.title && course?.description && course?.thumbnailUrl && course?.learningOutcomes?.trim());
  const structureStarted = Boolean(modules.length && lessons.length);
  const structureComplete = Boolean(structureStarted && readiness.data && !(readiness.data.issues || []).length);
  const stepComplete = { info: infoComplete, curriculum: structureComplete, preview: false, publish: ready };
  const currentStepIndex = steps.findIndex(item => item.id === step);
  const completionCount = Number(infoComplete) + Number(structureComplete) + Number(ready);
  const completionPercent = Math.round((completionCount / 3) * 100);
  const currentSummary = step === 'info'
    ? infoComplete ? 'Thông tin bắt buộc đã đầy đủ.' : `${metadataIssues.length || 1} mục thông tin cần bổ sung.`
    : step === 'curriculum' ? `${modules.length} học phần · ${lessons.length} bài học · ${readiness.data?.issues?.length || 0} mục cần hoàn thiện.`
      : step === 'preview' ? `${lessons.length} bài học đang sẵn sàng để xem trước.`
        : ready ? 'Khóa học đã đủ điều kiện gửi duyệt.' : `${issues.length} mục cần hoàn thiện trước khi gửi duyệt.`;
  function changeStep(next) {
    if (dirty.current && !window.confirm('Thông tin chưa được lưu. Rời bước này và bỏ thay đổi?')) return;
    dirty.current = false;
    setHasUnsaved(false);
    if (next === 'info' && canEdit) setInfoEditorOpen(true);
    setParams({ step: next });
    setError('');
  }
  function closeInfoEditor() {
    if (dirty.current && !window.confirm('Đóng cửa sổ và bỏ những thay đổi chưa lưu?')) return;
    dirty.current = false;
    setHasUnsaved(false);
    setInfoEditorOpen(false);
  }
  async function mutate(action, success = 'Đã lưu thay đổi.') {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try { await action(); setMessage(success); reload(); readiness.reload(); }
    catch (failure) { setError(failure.message || 'Không thể lưu thay đổi.'); }
    finally { setBusy(false); }
  }
  async function saveModal(body) {
    if (modal.kind === 'module') {
      if (modal.initial?.id) await contentService.updateModule(modal.initial.id, body);
      else await contentService.addModule(course.id, body);
    } else if (modal.kind === 'lesson') {
      if (modal.initial?.id) await contentService.update('lessons', modal.initial.id, body);
      else await contentService.addLesson(modal.module.id, body);
    } else if (modal.kind === 'finalQuiz') {
      const quiz = await contentService.create('quizzes', body);
      // Save the ID immediately so a later network error cannot create a duplicate quiz on retry.
      setModal({ kind: 'linkFinalQuiz', quiz });
      await contentService.setFinalAssessment(course.id, quiz.id);
      setModal(null);
      navigate(`/admin/quizzes/${quiz.id}?newQuestion=1`);
      return;
    }
    setModal(null); reload(); readiness.reload(); setMessage('Đã lưu nội dung.');
  }
  async function editLesson(lesson) {
    await mutate(async () => setModal({ kind: 'lesson', initial: await contentService.get('lessons', lesson.id) }), '');
  }
  function newLesson(module) {
    const suffix = crypto.randomUUID().slice(0, 8);
    setModal({ kind: 'lesson', module, initial: { code: `${course.code.slice(0, 65)}-L-${suffix}` } });
  }
  return <section className="course-studio">
    <Link className="studio-back" to="/admin/courses" onClick={event => { if (dirty.current && !window.confirm('Bỏ những thay đổi chưa lưu?')) event.preventDefault(); }}><ArrowLeft size={16} /> Tất cả khóa học</Link>
    <header className="studio-header">
      <div><p className="studio-eyebrow">KHÔNG GIAN BIÊN SOẠN</p><h1>{!course ? 'Thêm khóa học bằng Excel' : isAdmin ? 'Kiểm duyệt khóa học' : 'Chỉnh sửa khóa học'}</h1><p>{course ? course.titleVi || course.title : 'Tải file mẫu, điền nội dung rồi import để tạo khóa học nháp.'}</p></div>
      <div className="studio-save-state">{course ? <><span className={`studio-status studio-status--${course.status}`}><span />{statusNames[course.status]}</span><small role="status">{hasUnsaved ? 'Có thay đổi chưa lưu' : 'Nội dung đã lưu trên hệ thống'}</small></> : <><span className="studio-status studio-status--DRAFT"><span />Tạo bằng Excel</span><small role="status">{importedCourseId ? 'Đã tạo khóa học nháp' : 'Chưa import file'}</small></>}</div>
    </header>
    {course && <nav className="studio-steps" aria-label="Các bước chỉnh sửa khóa học">{steps.map((item, index) => <button key={item.id} type="button" className={`${step === item.id ? 'is-active ' : ''}${stepComplete[item.id] ? 'is-complete' : ''}`.trim()} aria-current={step === item.id ? 'step' : undefined} disabled={busy} onClick={() => changeStep(item.id)}><span className="studio-step-number">{stepComplete[item.id] ? <Check size={17} /> : index + 1}</span><span><strong>{item.title}</strong><small>{item.description}</small><span className="studio-step-state">{stepComplete[item.id] ? 'Hoàn tất' : step === item.id ? 'Đang thực hiện' : item.id === 'preview' ? 'Bước kiểm tra' : 'Chưa hoàn tất'}</span></span></button>)}</nav>}
    {error && <Notice kind="error">{error}</Notice>}{message && <Notice kind="success">{message}</Notice>}
    {course?.status === 'REJECTED' && <Notice kind="error"><strong>Yêu cầu chỉnh sửa: </strong>{course.reviewNote || 'Vui lòng kiểm tra lại nội dung.'}</Notice>}
    {course && !canEdit && <Notice>{canReview ? 'Xem nội dung và bản xem trước trước khi quyết định phê duyệt.' : 'Khóa học đang ở chế độ chỉ đọc. Bạn vẫn có thể xem cấu trúc và trải nghiệm học.'}</Notice>}
    {course && <section className="studio-step-intro"><div><p className="studio-eyebrow">{stepGuidance[step].eyebrow}</p><h2>{stepGuidance[step].title}</h2><p>{stepGuidance[step].description}</p></div><div className={`studio-step-summary ${stepComplete[step] ? 'is-complete' : ''}`}>{stepComplete[step] && <CheckCircle2 size={17} />}<span>{currentSummary}</span></div></section>}
    <div className={`studio-layout${course ? '' : ' studio-layout--import'}`}>
      <div className="studio-main">
        {!course && <CourseWorkbookPanel canImport={!importedCourseId} importedCourseId={importedCourseId} busy={busy} onBusyChange={setBusy} onImported={setImportedCourseId} />}
        {course && step === 'info' && <>
          {canEdit ? <section className="studio-panel studio-editor-launch"><div><p className="studio-eyebrow">CHỈNH SỬA THEO TỪNG BƯỚC</p><h2>Thông tin khóa học</h2><p>Mở cửa sổ chỉnh sửa để lần lượt hoàn thiện phần giới thiệu, ảnh bìa và thiết lập. Sau khi lưu, hệ thống tự chuyển sang cấu trúc bài học.</p></div><button onClick={() => setInfoEditorOpen(true)}><FileText size={17} /> Mở cửa sổ chỉnh sửa</button></section> : <CourseDetailsForm key={`${course.id}-${course.updatedAt}`} course={course} canEdit={false} onBusyChange={setBusy} onDirty={() => {}} onSave={() => {}} />}
          {canEdit && infoEditorOpen && <Modal title="Chỉnh sửa thông tin khóa học" className="studio-wizard-modal" busy={busy} onClose={closeInfoEditor}><CourseDetailsForm key={`${course.id}-${course.updatedAt}`} wizard course={course} canEdit onCancel={closeInfoEditor} onBusyChange={setBusy} onDirty={value => { dirty.current = value; setHasUnsaved(value); }} onSave={async body => {
            await contentService.update('courses', course.id, body);
            dirty.current = false;
            setHasUnsaved(false);
            setInfoEditorOpen(false);
            reload(); readiness.reload(); setMessage('Đã lưu thông tin. Tiếp tục hoàn thiện cấu trúc khóa học.');
            setParams({ step: 'curriculum' });
          }} /></Modal>}
        </>}
        {step === 'curriculum' && <>
          <div className="studio-content-flow" aria-label="Luồng biên soạn nội dung"><div className="is-current"><span>1</span><strong>Khóa học</strong><small>Thông tin và cấu trúc</small></div><ArrowRight size={16} /><div><span>2</span><strong>Bài học</strong><small>Nội dung và media</small></div><ArrowRight size={16} /><div><span>3</span><strong>Quiz</strong><small>Đánh giá trong bài</small></div><ArrowRight size={16} /><div><span>4</span><strong>Câu hỏi</strong><small>Câu hỏi và đáp án</small></div></div>
          <div className="studio-section-heading"><div><p className="studio-eyebrow">XÂY DỰNG LỘ TRÌNH</p><h2>Cấu trúc khóa học</h2><p>Chia nội dung thành học phần, rồi thêm bài học theo thứ tự.</p></div>{canEdit && <button disabled={busy} onClick={() => setModal({ kind: 'module' })}><Plus size={17} /> Thêm học phần</button>}</div>
          {!modules.length && <div className="studio-empty"><Layers size={38} /><h3>Bắt đầu với học phần đầu tiên</h3><p>Ví dụ: Làm quen tiếng Việt, Giao tiếp ở quán ăn, Khám phá Hà Nội.</p>{canEdit && <button onClick={() => setModal({ kind: 'module' })}><Plus size={16} /> Tạo học phần</button>}</div>}
          {modules.map((module, index) => <details className="studio-module" key={module.id} open>
            <summary><span className="studio-module-icon"><Layers size={20} /></span><span><small>HỌC PHẦN {index + 1}</small><strong>{module.titleVi || module.title}</strong><small>{module.lessons?.length || 0} bài học</small></span><ChevronDown size={18} /></summary>
            {module.descriptionVi || module.description ? <p className="studio-module-description">{module.descriptionVi || module.description}</p> : null}
            {canEdit && module.id !== 0 && <div className="studio-module-tools"><button className="secondary" disabled={busy} onClick={() => setModal({ kind: 'module', initial: module })}>Sửa học phần</button><button className="secondary studio-icon-button" disabled={busy || index === 0 || modules.some(m => m.id === 0)} aria-label={`Đưa học phần ${index + 1} lên`} onClick={() => mutate(() => contentService.reorder(`courses/${course.id}/modules`, moveItem(modules.map(m => m.id), index, -1)))}><ChevronUp size={17} /></button><button className="secondary studio-icon-button" disabled={busy || index === modules.length - 1 || modules.some(m => m.id === 0)} aria-label={`Đưa học phần ${index + 1} xuống`} onClick={() => mutate(() => contentService.reorder(`courses/${course.id}/modules`, moveItem(modules.map(m => m.id), index, 1)))}><ChevronDown size={17} /></button></div>}
            <div className="studio-lessons">{(module.lessons || []).map((lesson, lessonIndex) => <div className="studio-lesson" key={lesson.id}><span className="studio-lesson-number">{String(lessonIndex + 1).padStart(2, '0')}</span><div className="studio-lesson-title"><Link to={canEdit ? `/admin/lessons/${lesson.id}` : `/admin/lessons/${lesson.id}/preview`}>{lesson.titleVi || lesson.title}</Link><small><Clock size={12} /> {lesson.estimatedMinutes || 0} phút <span className={`studio-status studio-status--${lesson.status}`}>{statusNames[lesson.status] || lesson.status}</span></small></div><div className="studio-lesson-actions"><Link className="studio-icon-link" aria-label={`Xem trước ${lesson.titleVi || lesson.title}`} to={`/admin/lessons/${lesson.id}/preview`}><Eye size={17} /></Link>{canEdit && <><button className="secondary" disabled={busy} onClick={() => editLesson(lesson)}>Sửa</button><Link className="button secondary" to={`/admin/lessons/${lesson.id}`}>Nội dung <ArrowRight size={14} /></Link>{module.id !== 0 && <><button className="secondary studio-icon-button" aria-label={`Đưa bài ${lessonIndex + 1} lên`} disabled={busy || lessonIndex === 0} onClick={() => mutate(() => contentService.reorder(`modules/${module.id}/lessons`, moveItem(module.lessons.map(l => l.id), lessonIndex, -1)))}><ChevronUp size={15} /></button><button className="secondary studio-icon-button" aria-label={`Đưa bài ${lessonIndex + 1} xuống`} disabled={busy || lessonIndex === module.lessons.length - 1} onClick={() => mutate(() => contentService.reorder(`modules/${module.id}/lessons`, moveItem(module.lessons.map(l => l.id), lessonIndex, 1)))}><ChevronDown size={15} /></button></>}</>}</div></div>)}</div>
            {canEdit && module.id !== 0 && <button className="secondary studio-add-lesson" disabled={busy} onClick={() => newLesson(module)}><Plus size={17} /> Thêm bài học vào học phần</button>}
          </details>)}
          <section className="studio-panel studio-assessment"><div className="studio-section-heading"><div><h3><ShieldCheck size={19} /> Đánh giá cuối khóa</h3><p>Quiz tổng kết để kiểm tra mục tiêu của toàn khóa học.</p></div>{canEdit && !course.finalAssessmentQuizId && <button className="secondary" disabled={busy || !lessons.length} onClick={() => setModal({ kind: 'finalQuiz' })}><Plus size={16} /> Tạo quiz cuối khóa</button>}</div>{course.finalAssessmentQuizId ? <Link className="text-link" to={`/admin/quizzes/${course.finalAssessmentQuizId}`}>Quản lý câu hỏi và đáp án của quiz cuối khóa <ArrowRight size={15} /></Link> : <small>Thêm ít nhất một bài học để tạo quiz tổng kết.</small>}</section>
        </>}
        {step === 'preview' && <CoursePreview course={course} />}
        {step === 'publish' && <section className="studio-panel studio-publish"><p className="studio-eyebrow">SẴN SÀNG CHO HỌC VIÊN</p><h2>Kiểm tra trước khi xuất bản</h2><p>Hoàn thiện nội dung, xem trước và gửi Admin kiểm duyệt.</p>
          <div className="studio-publish-check"><CheckCircle2 size={20} /><div><strong>Thông tin khóa học</strong><span>{metadataIssues.length ? metadataIssues.join(' ') : 'Đã có ảnh bìa và mục tiêu học tập.'}</span></div>{metadataIssues.length ? <button className="secondary" onClick={() => changeStep('info')}>Bổ sung</button> : <Check size={18} />}</div>
          <ResourceState resource={readiness}>{data => <>
            {data?.issues?.length ? <ul className="studio-issue-list">{data.issues.map(issue => <li key={issue}><span className="studio-pending-dot" /><span>{issueNames[issue] || issue}</span><button className="secondary" onClick={() => changeStep('curriculum')}>Hoàn thiện <ArrowRight size={14} /></button></li>)}</ul> : <Notice kind="success">Cấu trúc bài học, hoạt động và quiz đã đủ điều kiện.</Notice>}
          </>}</ResourceState>
          <button className="secondary" disabled={busy || readiness.isValidating} onClick={readiness.reload}>Kiểm tra lại nội dung</button>
          {canEdit && <div className="studio-publish-action"><ShieldCheck size={25} /><div><h3>{ready ? 'Khóa học đã sẵn sàng gửi duyệt' : 'Hoàn thiện các mục còn thiếu'}</h3><p>Sau khi gửi, khóa học chuyển sang chỉ đọc. Admin phê duyệt sẽ xuất bản cho học viên.</p></div><button disabled={busy || !ready} onClick={() => mutate(() => contentService.submitCourse(course.id), 'Đã gửi Admin kiểm duyệt.')}><Send size={16} />{busy ? 'Đang gửi…' : 'Gửi kiểm duyệt'}</button></div>}
          {canReview && <div className="studio-review"><h3>Quyết định kiểm duyệt</h3><label>Nhận xét cho người biên soạn<textarea rows={4} value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder="Nêu nội dung cần chỉnh sửa nếu từ chối…" disabled={busy} /></label><div className="studio-actions"><button disabled={busy || !ready} onClick={() => mutate(() => contentService.reviewCourse(course.id, 'APPROVE', reviewNote), 'Khóa học đã được phê duyệt và xuất bản.')}><Globe size={17} /> Phê duyệt & xuất bản</button><button className="secondary" disabled={busy || !reviewNote.trim()} onClick={() => mutate(() => contentService.reviewCourse(course.id, 'REJECT', reviewNote), 'Đã gửi yêu cầu chỉnh sửa.')} >Yêu cầu chỉnh sửa</button></div></div>}
          {course.status === 'PUBLISHED' && <Notice kind="success">Khóa học đã xuất bản. <Link to={`/courses/${course.id}`}>Mở trang khóa học dành cho học viên →</Link></Notice>}
        </section>}
        {course && <footer className="studio-footer">{currentStepIndex > 0 ? <button className="secondary" disabled={busy} onClick={() => changeStep(steps[currentStepIndex - 1].id)}><ArrowLeft size={16} /> {steps[currentStepIndex - 1].title}</button> : <span />}
          <span role="status">{hasUnsaved ? 'Lưu thay đổi để tiếp tục.' : step === 'publish' ? 'Kiểm tra đầy đủ trước khi gửi duyệt.' : `Tiếp theo: ${steps[currentStepIndex + 1].title}`}</span>
          {currentStepIndex < steps.length - 1 && <button disabled={busy || hasUnsaved} onClick={() => changeStep(steps[currentStepIndex + 1].id)}>{steps[currentStepIndex + 1].title} <ArrowRight size={16} /></button>}</footer>}
      </div>
      {course && <aside className="studio-sidebar"><div className="studio-side-card"><span className="studio-eyebrow">TỔNG QUAN KHÓA HỌC</span><CourseThumbnail course={course} /><h3>{course.titleVi || course.title}</h3><p>{course.level} · {course.isFree ? 'Miễn phí' : 'Có phí'}</p><div className="studio-stats"><div><Layers size={17} /><strong>{modules.length}</strong><span>học phần</span></div><div><BookOpen size={17} /><strong>{lessons.length}</strong><span>bài học</span></div><div><Clock size={17} /><strong>{lessons.reduce((sum, l) => sum + Number(l.estimatedMinutes || 0), 0)}</strong><span>phút nội dung</span></div></div></div>
        <section className="studio-progress-card"><div className="studio-progress-heading"><div><span className="studio-eyebrow">TIẾN ĐỘ HOÀN THIỆN</span><strong>{completionPercent}%</strong></div><span>{completionCount}/3 nhóm yêu cầu</span></div><div className="studio-progress-track"><span style={{ width: `${completionPercent}%` }} /></div><button className={infoComplete ? 'is-complete' : ''} onClick={() => changeStep('info')}><span>{infoComplete ? <Check size={14} /> : '1'}</span><div><strong>Thông tin khóa học</strong><small>{infoComplete ? 'Đã đầy đủ' : 'Cần bổ sung'}</small></div></button><button className={structureComplete ? 'is-complete' : ''} onClick={() => changeStep('curriculum')}><span>{structureComplete ? <Check size={14} /> : '2'}</span><div><strong>Bài học & hoạt động</strong><small>{structureComplete ? 'Đã đầy đủ' : structureStarted ? 'Đang hoàn thiện' : 'Chưa có nội dung'}</small></div></button><button className={ready ? 'is-complete' : ''} onClick={() => changeStep('publish')}><span>{ready ? <Check size={14} /> : '3'}</span><div><strong>Gửi kiểm duyệt</strong><small>{ready ? 'Đã sẵn sàng' : `${issues.length} mục còn thiếu`}</small></div></button></section>
        <div className="studio-side-tip"><ShieldCheck size={21} /><h3>Mẹo biên soạn</h3><p>Lưu thông tin trước khi chuyển bước. Mở Xem trước để kiểm tra nội dung theo góc nhìn học viên.</p><button className="secondary" disabled={busy || hasUnsaved} onClick={() => changeStep('preview')}>Mở xem trước <ArrowRight size={14} /></button></div>
      </aside>}
    </div>
    {canEdit && modal && modal.kind !== 'linkFinalQuiz' && <Modal title={modal.kind === 'module' ? modal.initial?.id ? 'Chỉnh sửa học phần' : 'Thêm học phần' : modal.kind === 'finalQuiz' ? 'Tạo quiz cuối khóa' : modal.initial?.id ? 'Chỉnh sửa bài học' : 'Thêm bài học'} busy={busy} onClose={() => setModal(null)}><ContentForm kind={modal.kind === 'module' ? 'modules' : modal.kind === 'finalQuiz' ? 'quizzes' : 'lessons'} initial={modal.kind === 'finalQuiz' ? { quizType: 'COURSE', courseId: course.id, lessonId: lessons.at(-1)?.id, passingScore: 70 } : modal.initial || {}} fixedFields={modal.kind === 'finalQuiz' ? ['quizType', 'courseId', 'lessonId'] : []} onCancel={() => setModal(null)} onSave={saveModal} onBusyChange={setBusy} /></Modal>}
    {modal?.kind === 'linkFinalQuiz' && <Modal title="Hoàn tất liên kết quiz" busy={busy} onClose={() => { setModal(null); reload(); }}><p>Quiz đã được tạo. Nếu liên kết chưa hoàn tất, bạn có thể thử lại mà không tạo thêm quiz.</p><button disabled={busy} onClick={() => mutate(async () => { await contentService.setFinalAssessment(course.id, modal.quiz.id); navigate(`/admin/quizzes/${modal.quiz.id}?newQuestion=1`); })}>Liên kết và thêm câu hỏi</button><Link to={`/admin/quizzes/${modal.quiz.id}`}>Mở quiz đã tạo</Link></Modal>}
  </section>;
}

function downloadWorkbook(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function CourseWorkbookPanel({ canImport, importedCourseId, busy, onBusyChange, onImported }) {
  const [file, setFile] = useState(null), [preview, setPreview] = useState(null);
  const [error, setError] = useState(''), [working, setWorking] = useState(false);
  async function run(action) {
    setWorking(true); onBusyChange(true); setError('');
    try { await action(); } catch (failure) { setError(failure.message || 'Không thể xử lý file Excel.'); }
    finally { setWorking(false); onBusyChange(false); }
  }
  const locked = busy || working;
  return <section className="studio-panel studio-workbook" aria-label="Nhập khóa học từ Excel">
    <div className="studio-section-heading"><div><p className="studio-eyebrow">TẠO KHÓA HỌC</p><h2><FileSpreadsheet size={22} /> Import khóa học từ Excel</h2><p>File mẫu gồm thông tin khóa, học phần, bài học, hoạt động, quiz và câu hỏi/đáp án.</p></div></div>
    <div className="studio-workbook-flow" aria-label="Quy trình import khóa học"><div><strong>1</strong><span>Tải file mẫu</span></div><div><strong>2</strong><span>Điền nội dung</span></div><div><strong>3</strong><span>Kiểm tra và import</span></div></div>
    <div className="studio-workbook-actions">
      <button className="secondary" type="button" disabled={locked} onClick={() => run(async () => downloadWorkbook(await contentService.courseWorkbookTemplate(), 'course-studio-template.xlsx'))}><Download size={16} /> Tải file Excel mẫu</button>
    </div>
    {importedCourseId && <Notice kind="success"><strong>Đã tạo khóa học nháp từ file Excel.</strong><div className="studio-workbook-success-actions"><Link className="button" to={`/admin/courses/${importedCourseId}`}>Chỉnh sửa khóa học <ArrowRight size={15} /></Link><Link className="button secondary" to="/admin/courses">Về danh sách khóa học</Link></div></Notice>}
    {canImport && <>
      <label className="studio-workbook-file"><span>Chọn file Excel đã điền (.xlsx, tối đa 10 MB)</span><input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={locked} onChange={event => { setFile(event.target.files?.[0] || null); setPreview(null); setError(''); }} /></label>
      <div className="studio-workbook-actions"><button className="secondary" type="button" disabled={locked || !file} onClick={() => run(async () => setPreview(await contentService.courseWorkbookValidate(file)))}><Eye size={16} /> Kiểm tra file</button>
        <button type="button" disabled={locked || !preview?.valid || !file} onClick={() => run(async () => { const result = await contentService.courseWorkbookImport(file); onImported(result.courseId); })}><Upload size={16} /> {working ? 'Đang nhập…' : 'Nhập thành khóa học nháp'}</button></div>
      {preview && <div className="studio-workbook-preview" role="status"><strong>{preview.valid ? 'File hợp lệ' : 'Cần sửa file trước khi nhập'}</strong><p>{preview.counts?.MODULES || 0} học phần · {preview.counts?.LESSONS || 0} bài học · {preview.counts?.ACTIVITIES || 0} hoạt động · {preview.counts?.QUIZZES || 0} quiz · {preview.counts?.QUESTIONS || 0} câu hỏi.</p><p>{preview.pendingMedia || 0} mục media cần bổ sung sau khi nhập.</p>{preview.errors?.length > 0 && <ul>{preview.errors.slice(0, 20).map((item, index) => <li key={index}>{item}</li>)}</ul>}</div>}
      <p className="studio-workbook-hint">Ảnh bìa và các file ảnh, âm thanh, video có thể tải lên sau trong trình biên soạn. Nội dung nhập luôn ở trạng thái nháp để bạn kiểm tra và hoàn thiện.</p>
    </>}
    {error && <Notice kind="error">{error}</Notice>}
  </section>;
}

function CoursePreview({ course }) {
  const lessons = (course.modules || []).flatMap(m => m.lessons || []);
  const [lessonId, setLessonId] = useState(null);
  return <section className="studio-preview"><div className="studio-section-heading"><div><p className="studio-eyebrow">GÓC NHÌN HỌC VIÊN</p><h2>Xem trước khóa học</h2><p>Kiểm tra cách trình bày trước khi gửi duyệt.</p></div><span className="studio-preview-label"><Eye size={15} /> Bao gồm bản nháp</span></div><article className="studio-preview-hero"><CourseThumbnail course={course} /><div><span className="studio-preview-level">{course.level} · {course.isFree ? 'Miễn phí' : 'Có phí'}</span><h2>{course.titleVi || course.title}</h2><p>{course.descriptionVi || course.description}</p><span><BookOpen size={16} /> {lessons.length} bài học · {course.estimatedMinutes || lessons.reduce((sum, lesson) => sum + Number(lesson.estimatedMinutes || 0), 0)} phút</span></div></article><section className="studio-panel"><h3>Bạn sẽ học được gì?</h3><p className="studio-outcomes">{course.learningOutcomes || 'Chưa thêm mục tiêu học tập.'}</p></section><section className="studio-panel"><h3>Nội dung khóa học</h3>{course.modules?.map((module, index) => <div className="studio-preview-module" key={module.id}><h4>{index + 1}. {module.titleVi || module.title}</h4>{module.lessons?.map(lesson => <button key={lesson.id} className={`secondary studio-preview-lesson ${lessonId === lesson.id ? 'is-selected' : ''}`} onClick={() => setLessonId(lesson.id)}><BookOpen size={17} /><span>{lesson.titleVi || lesson.title}</span><small>{statusNames[lesson.status] || lesson.status} · {lesson.estimatedMinutes || 0} phút</small><Eye size={16} /></button>)}</div>)}{!lessons.length && <p>Thêm bài học tại bước Cấu trúc để xem trước.</p>}</section>{lessonId && <section className="studio-panel"><div className="studio-section-heading"><h3>Nội dung bài học</h3><button className="secondary" onClick={() => setLessonId(null)}>Đóng xem trước</button></div><StudioLessonPreview lessonId={lessonId} /></section>}</section>;
}
function StudioLessonPreview({ lessonId }) {
  const resource = useAsyncResource(useCallback(signal => contentService.preview('lessons', lessonId, signal), [lessonId]));
  return <ResourceState resource={resource}>{lesson => <LessonActivities key={lesson.id} lessonId={lesson.id} previewLesson={lesson} fallback={<p>Bài học chưa có hoạt động.</p>} />}</ResourceState>;
}

function CourseDetailsForm({ course, canEdit, onSave, onDirty, onBusyChange, wizard = false, onCancel = () => {} }) {
  const [form, setForm] = useState(() => ({ title: course?.title || '', titleVi: course?.titleVi || '', description: course?.description || '', descriptionVi: course?.descriptionVi || '', code: course?.code || '', slug: course?.slug || '', level: course?.level || 'A1', estimatedMinutes: course?.estimatedMinutes ?? course?.estimatedDuration ?? 0, learningOutcomes: course?.learningOutcomes || '', isFree: course?.isFree ?? true, thumbnailUrl: course?.thumbnailUrl || '' }));
  const [manualSlug, setManualSlug] = useState(Boolean(course)), [manualCode, setManualCode] = useState(Boolean(course));
  const [file, setFile] = useState(null), [preview, setPreview] = useState(course?.thumbnailUrl || '');
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [dirty, setDirty] = useState(false);
  const [phase, setPhase] = useState(0);
  const fileInput = useRef(null);
  useEffect(() => {
    if (!file) { setPreview(form.thumbnailUrl); return; }
    const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url);
  }, [file, form.thumbnailUrl]);
  useEffect(() => {
    if (!dirty) return;
    const warn = e => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function changed() { setDirty(true); onDirty(true); }
  function update(key, value) {
    changed();
    if (key === 'slug') setManualSlug(Boolean(value));
    if (key === 'code') setManualCode(Boolean(value));
    setForm(current => {
      const next = { ...current, [key]: value };
      if (key === 'title' || key === 'titleVi') {
        const slug = slugify(next.titleVi || next.title);
        if (!manualSlug) next.slug = slug;
        if (!manualCode) next.code = slug.toUpperCase().slice(0, 80);
      }
      return next;
    });
  }
  function chooseFile(e) {
    const candidate = e.target.files?.[0]; if (!candidate) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(candidate.type) || candidate.size > 5 * 1024 * 1024) {
      setError('Chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.'); e.target.value = ''; return;
    }
    setFile(candidate); setError(''); changed();
  }
  function nextPhase() {
    if (phase === 0 && (!form.title.trim() || !form.description.trim())) {
      setError('Điền tên và phần giới thiệu tiếng Anh trước khi tiếp tục.');
      return;
    }
    setError('');
    setPhase(current => Math.min(current + 1, 2));
  }
  async function submit(e) {
    e.preventDefault(); if (!canEdit || busy) return;
    setBusy(true); onBusyChange(true); setError('');
    try {
      const payload = { ...form, title: form.title.trim(), titleVi: form.titleVi.trim(), description: form.description.trim(), code: form.code.trim(), slug: form.slug.trim(), estimatedMinutes: Number(form.estimatedMinutes) };
      if (!payload.title || !payload.description || !payload.code || !payload.slug) throw new Error('Điền tên tiếng Anh, mô tả, mã và đường dẫn khóa học.');
      if (file) {
        payload.thumbnailUrl = await contentService.uploadCourseCover(file);
        // Reuse the successful upload if saving the course fails afterwards.
        setForm(current => ({ ...current, thumbnailUrl: payload.thumbnailUrl })); setFile(null);
      }
      await onSave(payload); setDirty(false); onDirty(false);
    } catch (failure) { setError(failure.message || 'Không thể lưu khóa học.'); }
    finally { setBusy(false); onBusyChange(false); }
  }
  const field = (key, label, options = {}) => <label className={options.wide ? 'studio-full-width' : ''}><span>{label}{options.required && <span className="studio-required"> *</span>}</span>{options.area ? <textarea rows={options.rows || 4} required={options.required} maxLength={options.maxLength} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={options.placeholder} /> : <input type={options.type || 'text'} required={options.required} maxLength={options.maxLength} min={options.type === 'number' ? 0 : undefined} pattern={key === 'slug' ? '[a-z0-9]+(?:-[a-z0-9]+)*' : undefined} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={options.placeholder} />}{options.help && <small>{options.help}</small>}</label>;
  const phaseLabels = ['Giới thiệu', 'Ảnh bìa', 'Thiết lập'];
  return <form className={`studio-details-form${wizard ? ' studio-details-form--wizard' : ''}`} onSubmit={submit}>
    {wizard && <div className="studio-wizard-steps" aria-label="Các phần thông tin khóa học">{phaseLabels.map((label, index) => <button key={label} type="button" className={`${index === phase ? 'is-active ' : ''}${index < phase ? 'is-complete' : ''}`.trim()} aria-current={index === phase ? 'step' : undefined} onClick={() => index <= phase && setPhase(index)}><span>{index < phase ? <Check size={14} /> : index + 1}</span><strong>{label}</strong></button>)}</div>}
    <fieldset disabled={busy || !canEdit}>{(!wizard || phase === 0) && <section className="studio-panel"><div className="studio-section-heading"><div><p className="studio-eyebrow">ĐẶT NỀN TẢNG</p><h2>Giới thiệu khóa học</h2><p>Cho học viên biết họ sẽ học gì và khóa học dành cho ai.</p></div><FileText size={24} /></div><div className="studio-form-grid">{field('title', 'Tên khóa học · English', { required: true, maxLength: 200, placeholder: 'e.g. Vietnamese for everyday adventures' })}{field('titleVi', 'Tên khóa học · Tiếng Việt', { maxLength: 200, placeholder: 'VD: Tiếng Việt cho những chuyến đi' })}{field('description', 'Giới thiệu · English', { required: true, area: true, wide: true, placeholder: 'Who is this course for? What can learners do after completing it?' })}{field('descriptionVi', 'Giới thiệu · Tiếng Việt', { area: true, wide: true, placeholder: 'Đối tượng học, chủ đề và trải nghiệm nổi bật của khóa học…' })}</div></section>}
    {(!wizard || phase === 1) && <section className="studio-panel"><div className="studio-section-heading"><div><p className="studio-eyebrow">HÌNH ẢNH ĐẠI DIỆN</p><h2>Ảnh bìa khóa học</h2><p>Chọn hình đại diện cho chủ đề và tinh thần của khóa học.</p></div><ImagePlus size={24} /></div><div className="studio-cover-editor">{preview ? <img src={preview} alt="Xem trước ảnh bìa khóa học" /> : <div className="studio-cover-empty"><ImagePlus size={36} /><span>Xem trước ảnh bìa</span></div>}<div><label className="studio-file-label">Chọn ảnh từ thiết bị<input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label><p>JPG, PNG hoặc WebP · tối đa 5 MB.<br />Gợi ý tỉ lệ 16:9, ảnh rõ nét.</p><small>Ảnh được tải lên Cloudinary khi lưu. Bạn có thể lưu nháp trước và thêm ảnh sau.</small>{file && <button type="button" className="secondary" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ''; }}>Bỏ ảnh vừa chọn</button>}</div></div></section>}
    {(!wizard || phase === 2) && <section className="studio-panel"><div className="studio-section-heading"><div><p className="studio-eyebrow">HOÀN TẤT THIẾT LẬP</p><h2>Kết quả học tập & thiết lập</h2><p>Xác định mục tiêu, trình độ và thời lượng trước khi tạo cấu trúc bài học.</p></div><CheckCircle2 size={24} /></div><div className="studio-form-grid">{field('learningOutcomes', 'Sau khóa học, học viên có thể…', { area: true, wide: true, placeholder: 'Mỗi dòng một mục tiêu:\nGiới thiệu bản thân bằng tiếng Việt\nGọi món và thanh toán tại quán ăn', help: 'Mục tiêu rõ ràng giúp bạn thiết kế bài học và quiz phù hợp.' })}<label><span>Trình độ</span><select value={form.level} onChange={e => update('level', e.target.value)}>{['A0', 'A1', 'A2', 'B1', 'B2', 'C1'].map(level => <option key={level}>{level}</option>)}</select></label>{field('estimatedMinutes', 'Thời lượng dự kiến (phút)', { type: 'number' })}<label className="studio-checkbox studio-full-width"><input type="checkbox" checked={form.isFree} onChange={e => update('isFree', e.target.checked)} /><span>Khóa học miễn phí</span></label></div><details className="studio-advanced"><summary>Mã khóa học & đường dẫn tự động</summary><p>Mã và đường dẫn được tạo từ tên khóa học. Bạn có thể sửa nếu cần.</p><div className="studio-form-grid">{field('code', 'Mã khóa học', { required: true, maxLength: 80 })}{field('slug', 'Đường dẫn (slug)', { required: true, maxLength: 200, help: 'Ví dụ: tieng-viet-cho-nhung-chuyen-di' })}</div></details></section>}</fieldset>
    {error && <Notice kind="error">{error}</Notice>}
    {wizard ? <div className="studio-wizard-actions"><button type="button" className="secondary" disabled={busy} onClick={phase === 0 ? onCancel : () => { setError(''); setPhase(current => current - 1); }}><ArrowLeft size={16} /> {phase === 0 ? 'Đóng' : 'Quay lại'}</button><span>Bước {phase + 1} / {phaseLabels.length}</span>{phase < 2 ? <button type="button" disabled={busy} onClick={nextPhase}>Tiếp tục: {phaseLabels[phase + 1]} <ArrowRight size={16} /></button> : <button disabled={busy}><Save size={17} /> {busy ? 'Đang lưu…' : 'Lưu và sang Cấu trúc'}</button>}</div> : canEdit && <div className={`studio-form-save ${dirty ? 'has-changes' : ''}`}><span role="status">{dirty ? 'Bạn có thay đổi chưa lưu.' : 'Thông tin khóa học đã được lưu.'}</span><button disabled={busy || !dirty}><Save size={17} /> {busy ? 'Đang lưu…' : dirty ? 'Lưu thay đổi' : 'Đã lưu'}</button></div>}
  </form>;
}
