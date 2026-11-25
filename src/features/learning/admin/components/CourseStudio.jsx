import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, CheckCheck, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Clock, Download, ExternalLink, Eye, FileCheck, Files, FileSpreadsheet, FileText, Globe, ImagePlus, Layers, Plus, RefreshCw, Save, Send, ShieldCheck, Trash2, Upload, UploadCloud, X } from 'lucide-react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { contentService } from '@/features/learning/api/contentService';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { Notice } from '@/shared/components/common/Ui';
import { Modal } from '@/shared/components/common/Modal';
import { ContentForm } from '@/features/learning/admin/components/ContentForm';
import { LessonImageImportPanel } from '@/features/learning/admin/components/LessonImageImportPanel';
import { CourseThumbnail } from '@/features/learning/components/course/CourseInfo';
import { LessonActivities } from '@/features/learning/components/learning/LessonActivities';
import { moveItem } from '@/features/learning/components/learning/answerUtils';
import { BilingualText, useBilingualLabel, bilingualLabel } from '@/shared/components/common/BilingualText';
import { HolaSelect } from '@/shared/components/common/HolaSelect';
import { AdminStatusBadge } from '@/shared/components/common/AdminStatusBadge';
import '@/features/learning/admin/components/course-studio.css';

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
  const { isContentCreator, isAdmin } = useAuth();
  if (!isContentCreator || isAdmin) return <Notice><BilingualText vi="Bạn cần tài khoản Content Creator để tạo khóa học." en="You need a Content Creator account to create courses." /> <Link to={isAdmin ? "/admin/courses" : "/content/courses"}><BilingualText vi="Về danh sách" en="Back to list" /></Link></Notice>;
  return <CourseStudio />;
}

export function CourseStudio({ course, reload = () => {} }) {
  const label = useBilingualLabel();
  const { isAdmin, isContentCreator, user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedStep = params.get('step');
  const step = steps.some(s => s.id === selectedStep) && course ? selectedStep : 'info';
  const canEdit = isContentCreator && !isAdmin && (!course || ['DRAFT', 'REJECTED'].includes(course.status));
  const canReview = isAdmin && course?.status === 'REVIEW';
  const ownsCourse = Boolean(course && String(course.createdBy) === String(user?.userId ?? user?.id));
  const canRequestEdit = isContentCreator && !isAdmin && ownsCourse && course?.status === 'PUBLISHED' && course?.editRequestStatus !== 'PENDING';
  const canReviewEditRequest = isAdmin && course?.status === 'PUBLISHED' && course?.editRequestStatus === 'PENDING';
  const [modal, setModal] = useState(null), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [message, setMessage] = useState('');
  const [reviewNote, setReviewNote] = useState('');
  const [editRequestReason, setEditRequestReason] = useState('');
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [importedCourseId, setImportedCourseId] = useState(null);
  const [importedCourses, setImportedCourses] = useState([]);
  const [infoEditorOpen, setInfoEditorOpen] = useState(false);
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
    ? infoComplete ? label('Thông tin bắt buộc đã đầy đủ.') : `${metadataIssues.length || 1} ${label('mục thông tin cần bổ sung.')}`
    : step === 'curriculum' ? `${modules.length} ${label('học phần')} · ${lessons.length} ${label('bài học')} · ${readiness.data?.issues?.length || 0} ${label('mục cần hoàn thiện.')}`
      : step === 'preview' ? `${lessons.length} ${label('bài học đang sẵn sàng để xem trước.')}`
        : ready ? label('Khóa học đã đủ điều kiện gửi duyệt.') : `${issues.length} ${label('mục cần hoàn thiện trước khi gửi duyệt.')}`;

  function changeStep(next) {
    if (dirty.current && !window.confirm(label('Thông tin chưa được lưu. Rời bước này và bỏ thay đổi?'))) return;
    dirty.current = false;
    setHasUnsaved(false);
    setInfoEditorOpen(false);
    setParams({ step: next });
    setError('');
  }
  function closeInfoEditor() {
    if (dirty.current && !window.confirm(label('Đóng cửa sổ và bỏ những thay đổi chưa lưu?'))) return;
    dirty.current = false;
    setHasUnsaved(false);
    setInfoEditorOpen(false);
  }
  async function mutate(action, success = 'Đã lưu thay đổi.') {
    if (busy) return;
    setBusy(true); setError(''); setMessage('');
    try { await action(); setMessage(label(success)); reload(); readiness.reload(); }
    catch (failure) { setError(failure.message || label('Không thể lưu thay đổi.')); }
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
      setModal({ kind: 'linkFinalQuiz', quiz });
      await contentService.setFinalAssessment(course.id, quiz.id);
      setModal(null);
      navigate(`${isAdmin ? '/admin' : '/content'}/quizzes/${quiz.id}?newQuestion=1`);
      return;
    }
    setModal(null); reload(); readiness.reload(); setMessage(label('Đã lưu nội dung.'));
  }
  async function editLesson(lesson) {
    await mutate(async () => setModal({ kind: 'lesson', initial: await contentService.get('lessons', lesson.id) }), '');
  }
  function newLesson(module) {
    const suffix = crypto.randomUUID().slice(0, 8);
    setModal({ kind: 'lesson', module, initial: { code: `${course.code.slice(0, 65)}-L-${suffix}` } });
  }

  return <section className={`course-studio ${!course ? 'course-studio--create' : ''}`}>
    <Link className="studio-back" to={isAdmin ? "/admin/courses" : "/content/courses"} onClick={event => { if (dirty.current && !window.confirm(label('Bỏ những thay đổi chưa lưu?'))) event.preventDefault(); }}>
      <ArrowLeft size={15} />
      <BilingualText vi="Tất cả khóa học" en="All courses" />
    </Link>
    <header className="studio-header">
      <div>
        <p className="studio-eyebrow">
          <BilingualText
            vi={isAdmin ? "KHÔNG GIAN KIỂM DUYỆT KHÓA HỌC" : "KHÔNG GIAN BIÊN SOẠN KHÓA HỌC"}
            en={isAdmin ? "COURSE REVIEW WORKSPACE" : "COURSE AUTHORING STUDIO"}
          />
        </p>
        <h1>
          {!course ? (
            <BilingualText vi="Thêm khóa học bằng Excel" en="Import Courses from Excel" />
          ) : isAdmin ? (
            <BilingualText vi="Kiểm duyệt khóa học" en="Course Review & Approval" />
          ) : (
            <BilingualText vi="Chỉnh sửa khóa học" en="Course Authoring" />
          )}
        </h1>
        <div className="studio-subtitle-row">
          {course?.level && <span className="admin-badge admin-badge-info">{course.level}</span>}
          <p className="studio-course-title">
            {course ? (
              <BilingualText vi={course.titleVi || course.title} en={course.title} />
            ) : (
              <BilingualText
                vi="Tải file mẫu, điền nội dung rồi import để tạo khóa học nháp."
                en="Download the template, fill in content, then import to create a draft course."
              />
            )}
          </p>
          {course?.code && <span className="studio-code-pill">{course.code}</span>}
        </div>
      </div>
      <div className="studio-save-state">
        {course ? <>
          <AdminStatusBadge status={course.status} />
          <span className="studio-save-indicator">
            <CheckCircle2 size={13} style={{ color: hasUnsaved ? '#EA580C' : '#10B981' }} />
            <small role="status"><BilingualText>{hasUnsaved ? 'Có thay đổi chưa lưu' : 'Nội dung đã lưu trên hệ thống'}</BilingualText></small>
          </span>
        </> : <>
          <span className="studio-status studio-status--DRAFT"><span /><BilingualText>{"Import nhiều file Excel"}</BilingualText></span>
          <small role="status"><BilingualText>{importedCourses.length > 0 ? `Đã tạo ${importedCourses.length} khóa học nháp` : 'Chưa import file'}</BilingualText></small>
        </>}
      </div>
    </header>
    {course && <nav className="studio-steps" aria-label={label("Các bước chỉnh sửa khóa học")}>
      {steps.map((item, index) => {
        const isActive = step === item.id;
        const isComplete = Boolean(stepComplete[item.id]);
        return (
          <button
            key={item.id}
            type="button"
            className={`studio-step-btn ${isActive ? 'is-active ' : ''}${isComplete ? 'is-complete' : ''}`.trim()}
            aria-current={isActive ? 'step' : undefined}
            disabled={busy}
            onClick={() => changeStep(item.id)}
          >
            <span className="studio-step-number">{isComplete ? <Check size={16} strokeWidth={2.8} /> : index + 1}</span>
            <span className="studio-step-body">
              <strong className="studio-step-title"><BilingualText>{item.title}</BilingualText></strong>
              <small className="studio-step-desc"><BilingualText>{item.description}</BilingualText></small>
              <span className="studio-step-state"><BilingualText>{isComplete ? 'Hoàn tất' : isActive ? 'Đang thực hiện' : item.id === 'preview' ? 'Bước kiểm tra' : 'Chưa bắt đầu'}</BilingualText></span>
            </span>
          </button>
        );
      })}
    </nav>}
    {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}{message && <Notice kind="success"><BilingualText>{message}</BilingualText></Notice>}
    {course?.status === 'REJECTED' && <Notice kind="error"><strong><BilingualText vi="Yêu cầu chỉnh sửa: " en="Revision requested: " /></strong>{course.reviewNote || label('Vui lòng kiểm tra lại nội dung.')}</Notice>}
    {course?.editRequestStatus === 'PENDING' && <Notice><strong><BilingualText vi="Yêu cầu mở chỉnh sửa đang chờ Admin duyệt. " en="The edit request is awaiting Admin approval. " /></strong>{course.editRequestReason}</Notice>}
    {course?.editRequestStatus === 'REJECTED' && ownsCourse && <Notice kind="error"><strong><BilingualText vi="Yêu cầu mở chỉnh sửa đã bị từ chối: " en="The edit request was rejected: " /></strong>{course.editRequestReviewNote || label('Không có phản hồi.')}</Notice>}
    {canRequestEdit && <section className="studio-panel">
      <div className="studio-review">
        <h2><BilingualText vi="Yêu cầu chỉnh sửa khóa học đã xuất bản" en="Request changes to a published course" /></h2>
        <p><BilingualText vi="Nêu rõ lý do và phạm vi cần cập nhật. Khóa học vẫn hiển thị cho học viên cho đến khi Admin phê duyệt yêu cầu." en="Describe why and what you need to update. The course remains available to learners until Admin approves the request." /></p>
        <label><BilingualText vi="Lý do chỉnh sửa" en="Reason for editing" /><textarea rows={4} maxLength={2000} value={editRequestReason} onChange={event => setEditRequestReason(event.target.value)} placeholder={label('Ví dụ: cập nhật nội dung bài 3 và thay quiz cuối khóa…')} disabled={busy} /></label>
        <div className="studio-actions"><button disabled={busy || !editRequestReason.trim()} onClick={() => mutate(() => contentService.requestCourseEdit(course.id, editRequestReason), 'Đã gửi yêu cầu chỉnh sửa cho Admin.')}><Send size={16} /> <BilingualText vi="Gửi yêu cầu chỉnh sửa" en="Submit edit request" /></button></div>
      </div>
    </section>}
    {course && !canEdit && <Notice>{canReview ? <BilingualText vi="Xem nội dung và bản xem trước trước khi quyết định phê duyệt." en="Review content and preview before deciding on approval." /> : <BilingualText vi="Khóa học đang ở chế độ chỉ đọc. Bạn vẫn có thể xem cấu trúc và trải nghiệm học." en="Course is in read-only mode. You can still inspect structure and learning flow." />}</Notice>}
    {course && <section className="studio-step-intro">
      <div>
        <p className="studio-eyebrow"><BilingualText>{stepGuidance[step].eyebrow}</BilingualText></p>
        <h2><BilingualText>{stepGuidance[step].title}</BilingualText></h2>
        <p><BilingualText>{stepGuidance[step].description}</BilingualText></p>
      </div>
      <div className={`studio-step-summary ${stepComplete[step] ? 'is-complete' : ''}`}>
        {stepComplete[step] && <CheckCircle2 size={17} />}
        <span>{currentSummary}</span>
      </div>
    </section>}
    <div className={`studio-layout${course ? '' : ' studio-layout--import'}`}>
      <div className="studio-main">
        {!course && <CourseWorkbookPanel canImport={true} importedCourseId={importedCourseId} busy={busy} onBusyChange={setBusy} onImported={(id, meta) => {
          setImportedCourseId(id);
          setImportedCourses(prev => {
            if (prev.some(c => c.id === id)) return prev;
            return [...prev, { id, ...(meta || {}) }];
          });
        }} />}
        {course && step === 'info' && <>
          {canEdit && ownsCourse && <LessonImageImportPanel
            key={course.id}
            courseId={course.id}
            lessons={lessons}
            busy={busy}
            onBusyChange={setBusy}
            onImported={readiness.reload}
            onDownload={downloadWorkbook}
          />}
          {canEdit ? <section className="studio-panel studio-editor-launch">
            <div>
              <p className="studio-eyebrow"><BilingualText>{"CHỈNH SỬA THEO TỪNG BƯỚC"}</BilingualText></p>
              <h2><BilingualText>{"Thông tin khóa học"}</BilingualText></h2>
              <p><BilingualText vi="Mở cửa sổ chỉnh sửa để lần lượt hoàn thiện phần giới thiệu, ảnh bìa và thiết lập. Sau khi lưu, hệ thống tự chuyển sang cấu trúc bài học." en="Open the editor wizard to complete introduction, cover image, and settings. Once saved, you will proceed to course curriculum." /></p>
            </div>
            <button type="button" disabled={busy} onClick={() => setInfoEditorOpen(true)}><FileText size={17} /> <BilingualText>{"Mở cửa sổ chỉnh sửa"}</BilingualText></button>
          </section> : <CourseDetailsForm key={`${course.id}-${course.updatedAt}`} course={course} canEdit={false} onBusyChange={setBusy} onDirty={() => {}} onSave={() => {}} />}
          {canEdit && infoEditorOpen && <Modal title={label("Chỉnh sửa thông tin khóa học")} className="studio-wizard-modal" busy={busy} onClose={closeInfoEditor}>
            <CourseDetailsForm key={`${course.id}-${course.updatedAt}`} wizard course={course} canEdit onCancel={closeInfoEditor} onBusyChange={setBusy} onDirty={value => { dirty.current = value; setHasUnsaved(value); }} onSave={async body => {
              await contentService.update('courses', course.id, body);
              dirty.current = false;
              setHasUnsaved(false);
              setInfoEditorOpen(false);
              reload(); readiness.reload(); setMessage(label('Đã lưu thông tin. Tiếp tục hoàn thiện cấu trúc khóa học.'));
              setParams({ step: 'curriculum' });
            }} />
          </Modal>}
        </>}
        {step === 'curriculum' && <>
          <div className="studio-content-flow" aria-label={label("Luồng biên soạn nội dung")}>
            <div className="is-current"><span>1</span><strong><BilingualText vi="Khóa học" en="Course" /></strong><small><BilingualText vi="Thông tin và cấu trúc" en="Info & structure" /></small></div><ArrowRight size={16} />
            <div><span>2</span><strong><BilingualText vi="Bài học" en="Lessons" /></strong><small><BilingualText vi="Nội dung và media" en="Content & media" /></small></div><ArrowRight size={16} />
            <div><span>3</span><strong><BilingualText vi="Quiz" en="Quiz" /></strong><small><BilingualText vi="Đánh giá trong bài" en="Lesson quizzes" /></small></div><ArrowRight size={16} />
            <div><span>4</span><strong><BilingualText vi="Câu hỏi" en="Questions" /></strong><small><BilingualText vi="Câu hỏi và đáp án" en="Questions & keys" /></small></div>
          </div>
          <div className="studio-section-heading">
            <div>
              <p className="studio-eyebrow"><BilingualText>{"XÂY DỰNG LỘ TRÌNH"}</BilingualText></p>
              <h2><BilingualText>{"Cấu trúc khóa học"}</BilingualText></h2>
              <p><BilingualText>{"Chia nội dung thành học phần, rồi thêm bài học theo thứ tự."}</BilingualText></p>
            </div>
            {canEdit && <button disabled={busy} onClick={() => setModal({ kind: 'module' })}><Plus size={17} /> <BilingualText>{"Thêm học phần"}</BilingualText></button>}
          </div>
          {!modules.length && <div className="studio-empty"><Layers size={38} /><h3><BilingualText>{"Bắt đầu với học phần đầu tiên"}</BilingualText></h3><p><BilingualText vi="Ví dụ: Làm quen tiếng Việt, Giao tiếp ở quán ăn, Khám phá Hà Nội." en="e.g. Getting Started with Vietnamese, Ordering at a Restaurant, Exploring Hanoi." /></p>{canEdit && <button onClick={() => setModal({ kind: 'module' })}><Plus size={16} /> <BilingualText>{"Tạo học phần"}</BilingualText></button>}</div>}
          {modules.map((module, index) => <details className="studio-module" key={module.id} open>
            <summary>
              <span className="studio-module-icon"><Layers size={20} /></span>
              <span>
                <small><BilingualText vi={`HỌC PHẦN ${index + 1}`} en={`MODULE ${index + 1}`} /></small>
                <strong><BilingualText vi={module.titleVi || module.title} en={module.title} /></strong>
                <small>{module.lessons?.length || 0} <BilingualText>{"bài học"}</BilingualText></small>
              </span>
              <ChevronDown size={18} />
            </summary>
            {module.descriptionVi || module.description ? <p className="studio-module-description"><BilingualText vi={module.descriptionVi || module.description} en={module.description} /></p> : null}
            {canEdit && module.id !== 0 && <div className="studio-module-tools">
              <button className="secondary" disabled={busy} onClick={() => setModal({ kind: 'module', initial: module })}><BilingualText>{"Sửa học phần"}</BilingualText></button>
              <button className="secondary studio-icon-button" disabled={busy || index === 0 || modules.some(m => m.id === 0)} aria-label={label(`Đưa học phần ${index + 1} lên`)} onClick={() => mutate(() => contentService.reorder(`courses/${course.id}/modules`, moveItem(modules.map(m => m.id), index, -1)))}><ChevronUp size={17} /></button>
              <button className="secondary studio-icon-button" disabled={busy || index === modules.length - 1 || modules.some(m => m.id === 0)} aria-label={label(`Đưa học phần ${index + 1} xuống`)} onClick={() => mutate(() => contentService.reorder(`courses/${course.id}/modules`, moveItem(modules.map(m => m.id), index, 1)))}><ChevronDown size={17} /></button>
            </div>}
            <div className="studio-lessons">{(module.lessons || []).map((lesson, lessonIndex) => <div className="studio-lesson" key={lesson.id}>
              <span className="studio-lesson-number">{String(lessonIndex + 1).padStart(2, '0')}</span>
              <div className="studio-lesson-title">
                <Link to={canEdit ? `${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}` : `${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}/preview`}>
                  <BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} />
                </Link>
                <small><Clock size={12} /> {lesson.estimatedMinutes || 0} <BilingualText vi="phút" en="min" /> <span className={`studio-status studio-status--${lesson.status}`}><BilingualText>{statusNames[lesson.status] || lesson.status}</BilingualText></span></small>
              </div>
              <div className="studio-lesson-actions">
                <Link className="studio-icon-link" aria-label={label(`Xem trước ${lesson.titleVi || lesson.title}`)} to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}/preview`}><Eye size={17} /></Link>
                {canEdit && <>
                  <button className="secondary" disabled={busy} onClick={() => editLesson(lesson)}><BilingualText>{"Sửa"}</BilingualText></button>
                  <Link className="button secondary" to={`${isAdmin ? '/admin' : '/content'}/lessons/${lesson.id}`}><BilingualText>{"Nội dung"}</BilingualText> <ArrowRight size={14} /></Link>
                  {module.id !== 0 && <>
                    <button className="secondary studio-icon-button" aria-label={label(`Đưa bài ${lessonIndex + 1} lên`)} disabled={busy || lessonIndex === 0} onClick={() => mutate(() => contentService.reorder(`modules/${module.id}/lessons`, moveItem(module.lessons.map(l => l.id), lessonIndex, -1)))}><ChevronUp size={15} /></button>
                    <button className="secondary studio-icon-button" aria-label={label(`Đưa bài ${lessonIndex + 1} xuống`)} disabled={busy || lessonIndex === module.lessons.length - 1} onClick={() => mutate(() => contentService.reorder(`modules/${module.id}/lessons`, moveItem(module.lessons.map(l => l.id), lessonIndex, 1)))}><ChevronDown size={15} /></button>
                  </>}
                </>}
              </div>
            </div>)}</div>
            {canEdit && module.id !== 0 && <button className="secondary studio-add-lesson" disabled={busy} onClick={() => newLesson(module)}><Plus size={17} /> <BilingualText>{"Thêm bài học vào học phần"}</BilingualText></button>}
          </details>)}
          <section className="studio-panel studio-assessment">
            <div className="studio-section-heading">
              <div>
                <h3><ShieldCheck size={19} /> <BilingualText>{"Đánh giá cuối khóa"}</BilingualText></h3>
                <p><BilingualText>{"Quiz tổng kết để kiểm tra mục tiêu của toàn khóa học."}</BilingualText></p>
              </div>
              {canEdit && !course.finalAssessmentQuizId && <button className="secondary" disabled={busy || !lessons.length} onClick={() => setModal({ kind: 'finalQuiz' })}><Plus size={16} /> <BilingualText>{"Tạo quiz cuối khóa"}</BilingualText></button>}
            </div>
            {course.finalAssessmentQuizId ? <Link className="text-link" to={`${isAdmin ? '/admin' : '/content'}/quizzes/${course.finalAssessmentQuizId}`}><BilingualText>{"Quản lý câu hỏi và đáp án của quiz cuối khóa"}</BilingualText> <ArrowRight size={15} /></Link> : <small><BilingualText>{"Thêm ít nhất một bài học để tạo quiz tổng kết."}</BilingualText></small>}
          </section>
        </>}
        {step === 'preview' && <CoursePreview course={course} />}
        {step === 'publish' && <section className="studio-panel studio-publish">
          <p className="studio-eyebrow"><BilingualText>{"SẴN SÀNG CHO HỌC VIÊN"}</BilingualText></p>
          <h2><BilingualText>{"Kiểm tra trước khi xuất bản"}</BilingualText></h2>
          <p><BilingualText>{"Hoàn thiện nội dung, xem trước và gửi Admin kiểm duyệt."}</BilingualText></p>
          <div className="studio-publish-check">
            <CheckCircle2 size={20} />
            <div>
              <strong><BilingualText>{"Thông tin khóa học"}</BilingualText></strong>
              <span>{metadataIssues.length ? metadataIssues.map(i => label(i)).join(' ') : label('Đã có ảnh bìa và mục tiêu học tập.')}</span>
            </div>
            {metadataIssues.length ? <button className="secondary" onClick={() => changeStep('info')}><BilingualText>{"Bổ sung"}</BilingualText></button> : <Check size={18} />}
          </div>
          <ResourceState resource={readiness}>{data => <>
            {data?.issues?.length ? <ul className="studio-issue-list">{data.issues.map(issue => <li key={issue}><span className="studio-pending-dot" /><span>{label(issueNames[issue] || issue)}</span><button className="secondary" onClick={() => changeStep('curriculum')}><BilingualText vi="Hoàn thiện" en="Complete" /> <ArrowRight size={14} /></button></li>)}</ul> : <Notice kind="success"><BilingualText>{"Cấu trúc bài học, hoạt động và quiz đã đủ điều kiện."}</BilingualText></Notice>}
          </>}</ResourceState>
          <button className="secondary" disabled={busy || readiness.isValidating} onClick={readiness.reload}><BilingualText>{"Kiểm tra lại nội dung"}</BilingualText></button>
          {canEdit && <div className="studio-publish-action">
            <ShieldCheck size={25} />
            <div>
              <h3><BilingualText>{ready ? 'Khóa học đã sẵn sàng gửi duyệt' : 'Hoàn thiện các mục còn thiếu'}</BilingualText></h3>
              <p><BilingualText>{"Sau khi gửi, khóa học chuyển sang chỉ đọc. Admin phê duyệt sẽ xuất bản cho học viên."}</BilingualText></p>
            </div>
            <button disabled={busy || !ready} onClick={() => mutate(() => contentService.submitCourse(course.id), 'Đã gửi Admin kiểm duyệt.')}><Send size={16} />{busy ? label('Đang gửi…') : label('Gửi kiểm duyệt')}</button>
          </div>}
          {canReview && <div className="studio-review">
            <h3><BilingualText>{"Quyết định kiểm duyệt"}</BilingualText></h3>
            <label><BilingualText>{"Nhận xét cho người biên soạn"}</BilingualText><textarea rows={4} value={reviewNote} onChange={e => setReviewNote(e.target.value)} placeholder={label("Nêu nội dung cần chỉnh sửa nếu từ chối…")} disabled={busy} /></label>
            <div className="studio-actions">
              <button disabled={busy || !ready} onClick={() => mutate(() => contentService.reviewCourse(course.id, 'APPROVE', reviewNote), 'Khóa học đã được phê duyệt và xuất bản.')}><Globe size={17} /> <BilingualText>{"Phê duyệt & xuất bản"}</BilingualText></button>
              <button className="secondary" disabled={busy || !reviewNote.trim()} onClick={() => mutate(() => contentService.reviewCourse(course.id, 'REJECT', reviewNote), 'Đã gửi yêu cầu chỉnh sửa.')} ><BilingualText>{"Yêu cầu chỉnh sửa"}</BilingualText></button>
            </div>
          </div>}
          {canReviewEditRequest && <div className="studio-review">
            <h3><BilingualText vi="Duyệt yêu cầu chỉnh sửa khóa học" en="Review course edit request" /></h3>
            <p><strong><BilingualText vi="Lý do của Content Creator: " en="Content Creator's reason: " /></strong>{course.editRequestReason}</p>
            <label><BilingualText vi="Phản hồi của Admin" en="Admin response" /><textarea rows={4} value={reviewNote} onChange={event => setReviewNote(event.target.value)} placeholder={label('Ghi chú cho Content Creator…')} disabled={busy} /></label>
            <div className="studio-actions">
              <button disabled={busy} onClick={() => mutate(() => contentService.reviewCourseEditRequest(course.id, 'APPROVE', reviewNote), 'Đã duyệt. Khóa học được chuyển về bản nháp để chỉnh sửa.')}><CheckCircle2 size={17} /> <BilingualText vi="Duyệt & mở quyền chỉnh sửa" en="Approve & unlock editing" /></button>
              <button className="secondary" disabled={busy || !reviewNote.trim()} onClick={() => mutate(() => contentService.reviewCourseEditRequest(course.id, 'REJECT', reviewNote), 'Đã từ chối yêu cầu chỉnh sửa.')}><BilingualText vi="Từ chối yêu cầu" en="Reject request" /></button>
            </div>
          </div>}
          {course.status === 'PUBLISHED' && <Notice kind="success"><BilingualText>{"Khóa học đã xuất bản."}</BilingualText> <Link to={`/courses/${course.id}`}><BilingualText>{"Mở trang khóa học dành cho học viên →"}</BilingualText></Link></Notice>}
        </section>}
        {course && <footer className="studio-footer">
          {currentStepIndex > 0 ? <button className="secondary" disabled={busy} onClick={() => changeStep(steps[currentStepIndex - 1].id)}><ArrowLeft size={16} /> <BilingualText>{steps[currentStepIndex - 1].title}</BilingualText></button> : <span />}
          <span role="status"><BilingualText>{hasUnsaved ? 'Lưu thay đổi để tiếp tục.' : step === 'publish' ? 'Kiểm tra đầy đủ trước khi gửi duyệt.' : `Tiếp theo: ${label(steps[currentStepIndex + 1]?.title)}`}</BilingualText></span>
          {currentStepIndex < steps.length - 1 && <button disabled={busy || hasUnsaved} onClick={() => changeStep(steps[currentStepIndex + 1].id)}><BilingualText>{steps[currentStepIndex + 1].title}</BilingualText> <ArrowRight size={16} /></button>}
        </footer>}
      </div>
      {course && <aside className="studio-sidebar">
        <div className="studio-side-card">
          <span className="studio-eyebrow"><BilingualText>{"TỔNG QUAN KHÓA HỌC"}</BilingualText></span>
          <CourseThumbnail course={course} />
          <h3><BilingualText vi={course.titleVi || course.title} en={course.title} /></h3>
          <p>{course.level} · <BilingualText>{course.isFree ? 'Miễn phí' : 'Có phí'}</BilingualText></p>
          <div className="studio-stats">
            <div><Layers size={17} /><strong>{modules.length}</strong><span><BilingualText>{"học phần"}</BilingualText></span></div>
            <div><BookOpen size={17} /><strong>{lessons.length}</strong><span><BilingualText>{"bài học"}</BilingualText></span></div>
            <div><Clock size={17} /><strong>{lessons.reduce((sum, l) => sum + Number(l.estimatedMinutes || 0), 0)}</strong><span><BilingualText>{"phút nội dung"}</BilingualText></span></div>
          </div>
        </div>
        <section className="studio-progress-card">
          <div className="studio-progress-heading">
            <span className="studio-eyebrow">
              <BilingualText vi="TIẾN ĐỘ HOÀN THIỆN" en="COMPLETION PROGRESS" />
            </span>
            <div className="studio-progress-metric">
              <strong className="studio-progress-percent">{completionPercent}%</strong>
              <span className="studio-progress-ratio">
                {completionCount}/3 <BilingualText vi="nhóm yêu cầu" en="requirements" />
              </span>
            </div>
          </div>
          <div className="studio-progress-track">
            <span style={{ width: `${completionPercent}%` }} />
          </div>
          <div className="studio-progress-list">
            <button
              type="button"
              className={`studio-progress-item ${infoComplete ? 'is-complete' : ''}`}
              onClick={() => changeStep('info')}
            >
              <span className="studio-progress-badge">
                {infoComplete ? <Check size={14} strokeWidth={2.5} /> : '1'}
              </span>
              <div className="studio-progress-body">
                <strong className="studio-progress-name">
                  <BilingualText vi="Thông tin khóa học" en="Course Information" />
                </strong>
                <small className="studio-progress-status">
                  <BilingualText
                    vi={infoComplete ? 'Đã đầy đủ' : 'Cần bổ sung'}
                    en={infoComplete ? 'Complete' : 'Needs attention'}
                  />
                </small>
              </div>
              <ChevronRight size={15} className="studio-progress-arrow" />
            </button>

            <button
              type="button"
              className={`studio-progress-item ${structureComplete ? 'is-complete' : ''}`}
              onClick={() => changeStep('curriculum')}
            >
              <span className="studio-progress-badge">
                {structureComplete ? <Check size={14} strokeWidth={2.5} /> : '2'}
              </span>
              <div className="studio-progress-body">
                <strong className="studio-progress-name">
                  <BilingualText vi="Bài học & hoạt động" en="Lessons & Activities" />
                </strong>
                <small className="studio-progress-status">
                  <BilingualText
                    vi={structureComplete ? 'Đã đầy đủ' : structureStarted ? 'Đang hoàn thiện' : 'Chưa có nội dung'}
                    en={structureComplete ? 'Complete' : structureStarted ? 'In progress' : 'Empty'}
                  />
                </small>
              </div>
              <ChevronRight size={15} className="studio-progress-arrow" />
            </button>

            <button
              type="button"
              className={`studio-progress-item ${ready ? 'is-complete' : ''}`}
              onClick={() => changeStep('publish')}
            >
              <span className="studio-progress-badge">
                {ready ? <Check size={14} strokeWidth={2.5} /> : '3'}
              </span>
              <div className="studio-progress-body">
                <strong className="studio-progress-name">
                  <BilingualText vi="Gửi kiểm duyệt" en="Submit for Review" />
                </strong>
                <small className="studio-progress-status">
                  <BilingualText
                    vi={ready ? 'Đã sẵn sàng' : `${issues.length} mục còn thiếu`}
                    en={ready ? 'Ready to submit' : `${issues.length} item(s) pending`}
                  />
                </small>
              </div>
              <ChevronRight size={15} className="studio-progress-arrow" />
            </button>
          </div>
        </section>
        <div className="studio-side-tip">
          <ShieldCheck size={21} />
          <h3><BilingualText>{"Mẹo biên soạn"}</BilingualText></h3>
          <p><BilingualText>{"Lưu thông tin trước khi chuyển bước. Mở Xem trước để kiểm tra nội dung theo góc nhìn học viên."}</BilingualText></p>
          <button className="secondary studio-tip-btn" disabled={busy || hasUnsaved} onClick={() => changeStep('preview')}><BilingualText>{"Mở xem trước"}</BilingualText> <ArrowRight size={14} /></button>
        </div>
      </aside>}
    </div>
    {canEdit && modal && modal.kind !== 'linkFinalQuiz' && <Modal title={label(modal.kind === 'module' ? (modal.initial?.id ? 'Chỉnh sửa học phần' : 'Thêm học phần') : modal.kind === 'finalQuiz' ? 'Tạo quiz cuối khóa' : (modal.initial?.id ? 'Chỉnh sửa bài học' : 'Thêm bài học'))} busy={busy} onClose={() => setModal(null)}><ContentForm kind={modal.kind === 'module' ? 'modules' : modal.kind === 'finalQuiz' ? 'quizzes' : 'lessons'} initial={modal.kind === 'finalQuiz' ? { quizType: 'COURSE', courseId: course.id, lessonId: lessons.at(-1)?.id, passingScore: 70 } : modal.initial || {}} fixedFields={modal.kind === 'finalQuiz' ? ['quizType', 'courseId', 'lessonId'] : []} onCancel={() => setModal(null)} onSave={saveModal} onBusyChange={setBusy} /></Modal>}
    {modal?.kind === 'linkFinalQuiz' && <Modal title={label("Hoàn tất liên kết quiz")} busy={busy} onClose={() => { setModal(null); reload(); }}><p><BilingualText vi="Quiz đã được tạo. Nếu liên kết chưa hoàn tất, bạn có thể thử lại mà không tạo thêm quiz." en="Quiz has been created. If linking did not finish, you can retry without creating duplicates." /></p><button disabled={busy} onClick={() => mutate(async () => { await contentService.setFinalAssessment(course.id, modal.quiz.id); navigate(`/content/quizzes/${modal.quiz.id}?newQuestion=1`); })}><BilingualText vi="Liên kết và thêm câu hỏi" en="Link and add questions" /></button><Link to={`/content/quizzes/${modal.quiz.id}`}><BilingualText vi="Mở quiz đã tạo" en="Open created quiz" /></Link></Modal>}
  </section>;
}

function downloadWorkbook(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function CourseWorkbookPanel({ canImport, importedCourseId, busy, onBusyChange, onImported }) {
  const label = useBilingualLabel();
  const [fileItems, setFileItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [working, setWorking] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);
  const [error, setError] = useState('');
  const [expandedErrors, setExpandedErrors] = useState({});
  const [importedCourses, setImportedCourses] = useState([]);
  const fileInputRef = useRef(null);

  const locked = busy || working;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!locked) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (locked) return;
    if (e.dataTransfer?.files?.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const addFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const xlsxFiles = Array.from(selectedFiles).filter(f =>
      f.name.toLowerCase().endsWith('.xlsx')
    );
    if (xlsxFiles.length === 0) {
      setError(label('Vui lòng chọn file có định dạng Excel (.xlsx).'));
      return;
    }
    setError('');
    setFileItems(prev => {
      const existingSignatures = new Set(prev.map(item => `${item.name}-${item.size}`));
      const newItems = xlsxFiles
        .filter(f => !existingSignatures.has(`${f.name}-${f.size}`))
        .map(f => ({
          id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file: f,
          name: f.name,
          size: f.size,
          formattedSize: formatFileSize(f.size),
          status: 'pending',
          preview: null,
          errors: [],
          courseId: null,
          courseTitle: null,
          errorMessage: null,
        }));
      return [...prev, ...newItems];
    });
  };

  const removeFile = (id) => {
    if (locked) return;
    setFileItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAllFiles = () => {
    if (locked) return;
    setFileItems([]);
    setError('');
    setBatchProgress(null);
  };

  const validateItem = async (item) => {
    setFileItems(prev => prev.map(f => f.id === item.id ? { ...f, status: 'validating', errorMessage: null } : f));
    try {
      const result = await contentService.courseWorkbookValidate(item.file);
      const isValid = Boolean(result?.valid);
      const errors = result?.errors || [];
      const courseTitle = result?.counts?.COURSE_TITLE || item.name.replace(/\.xlsx$/i, '');
      setFileItems(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: isValid ? 'valid' : 'invalid',
        preview: result,
        errors,
        courseTitle: result?.courseTitle || courseTitle,
        errorMessage: isValid ? null : (errors[0] || label('File chưa đúng cấu trúc yêu cầu.')),
      } : f));
      return { success: true, valid: isValid };
    } catch (err) {
      const msg = err.message || label('Không thể kiểm tra file.');
      setFileItems(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: 'invalid',
        preview: null,
        errors: [msg],
        errorMessage: msg,
      } : f));
      return { success: false, valid: false };
    }
  };

  const validateAllFiles = async () => {
    const targets = fileItems.filter(f => ['pending', 'invalid', 'error'].includes(f.status));
    if (targets.length === 0) return;
    setWorking(true);
    onBusyChange(true);
    setError('');
    try {
      for (const target of targets) {
        await validateItem(target);
      }
    } finally {
      setWorking(false);
      onBusyChange(false);
    }
  };

  const importItem = async (item) => {
    setFileItems(prev => prev.map(f => f.id === item.id ? { ...f, status: 'importing', errorMessage: null } : f));
    try {
      const result = await contentService.courseWorkbookImport(item.file);
      const courseId = result?.courseId;
      const courseTitle = result?.courseTitle || item.name.replace(/\.xlsx$/i, '');
      setFileItems(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: 'imported',
        courseId,
        courseTitle,
      } : f));
      if (courseId) {
        setImportedCourses(prev => {
          if (prev.some(c => c.id === courseId)) return prev;
          return [...prev, { id: courseId, title: courseTitle, filename: item.name }];
        });
        onImported(courseId, { title: courseTitle, filename: item.name });
      }
      return { success: true, courseId };
    } catch (err) {
      const msg = err.message || label('Không thể nhập khóa học từ file này.');
      setFileItems(prev => prev.map(f => f.id === item.id ? {
        ...f,
        status: 'error',
        errorMessage: msg,
      } : f));
      return { success: false, error: msg };
    }
  };

  const importAllValidFiles = async () => {
    const validFiles = fileItems.filter(f => f.status === 'valid');
    if (validFiles.length === 0) return;
    setWorking(true);
    onBusyChange(true);
    setError('');
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const item = validFiles[i];
        setBatchProgress({ current: i + 1, total: validFiles.length, name: item.name });
        await importItem(item);
      }
    } finally {
      setBatchProgress(null);
      setWorking(false);
      onBusyChange(false);
    }
  };

  const validCount = fileItems.filter(f => f.status === 'valid').length;
  const importedCount = fileItems.filter(f => f.status === 'imported').length;
  const invalidCount = fileItems.filter(f => f.status === 'invalid').length;
  const pendingCount = fileItems.filter(f => f.status === 'pending').length;

  return (
    <section className="studio-panel studio-workbook" aria-label={label("Nhập khóa học từ Excel")}>
      <div className="studio-section-heading">
        <div>
          <span className="wb-badge-feature">
            <Files size={13} />
            <BilingualText vi="HỖ TRỢ IMPORT NHIỀU FILE CÙNG LÚC" en="BATCH MULTI-FILE IMPORT SUPPORTED" />
          </span>
          <h2>
            <FileSpreadsheet size={26} className="text-emerald-600" />
            <BilingualText vi="Thêm khóa học từ file Excel" en="Import Courses from Excel" />
          </h2>
          <p>
            <BilingualText
              vi="Tải file mẫu chuẩn, điền thông tin và tải lên một hoặc nhiều file Excel (.xlsx). Hệ thống sẽ tự động khởi tạo khóa học nháp cùng toàn bộ học phần, bài học, hoạt động và câu hỏi đánh giá."
              en="Download the standard template, fill in course details, and upload one or multiple Excel files (.xlsx). The system will automatically generate draft courses with all modules, lessons, activities, and quizzes."
            />
          </p>
        </div>
      </div>

      {/* 3 Step Workflow */}
      <div className="wb-steps-grid" aria-label={label("Quy trình import khóa học")}>
        <div className="wb-step-card">
          <span className="wb-step-num">01</span>
          <div className="wb-step-content">
            <strong><BilingualText vi="Tải file mẫu" en="Download Template" /></strong>
            <span><BilingualText vi="Tải file Excel mẫu (.xlsx) chuẩn hóa gồm đầy đủ 6 sheet cấu trúc." en="Get standard Excel template (.xlsx) with all 6 structure sheets." /></span>
          </div>
        </div>
        <div className="wb-step-card">
          <span className="wb-step-num">02</span>
          <div className="wb-step-content">
            <strong><BilingualText vi="Điền nội dung" en="Fill in Content" /></strong>
            <span><BilingualText vi="Nhập thông tin khóa học, học phần, bài học, quiz và câu hỏi/đáp án." en="Fill course info, modules, lessons, quizzes, and questions/keys." /></span>
          </div>
        </div>
        <div className="wb-step-card">
          <span className="wb-step-num">03</span>
          <div className="wb-step-content">
            <strong><BilingualText vi="Kiểm tra & Import" en="Verify & Import" /></strong>
            <span><BilingualText vi="Chọn một hoặc nhiều file, hệ thống kiểm tra và tạo khóa học nháp tự động." en="Select one or multiple files; system validates and imports in batch." /></span>
          </div>
        </div>
      </div>

      {/* Download Template Banner */}
      <div className="wb-template-card">
        <div className="wb-template-info">
          <div className="wb-template-icon">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <strong><BilingualText vi="File Excel mẫu chuẩn hóa (.xlsx)" en="Standard Course Workbook Template (.xlsx)" /></strong>
            <p><BilingualText vi="Chứa trọn vẹn mẫu cấu trúc: COURSE · MODULES · LESSONS · ACTIVITIES · QUIZZES · QUESTIONS" en="Complete schema template: COURSE · MODULES · LESSONS · ACTIVITIES · QUIZZES · QUESTIONS" /></p>
          </div>
        </div>
        <button
          className="wb-btn wb-btn-emerald"
          type="button"
          disabled={locked}
          onClick={async () => {
            try {
              const blob = await contentService.courseWorkbookTemplate();
              downloadWorkbook(blob, 'course-studio-template.xlsx');
            } catch (err) {
              setError(err.message || label('Không thể tải file mẫu.'));
            }
          }}
        >
          <Download size={15} />
          <BilingualText vi="Tải file Excel mẫu" en="Download Excel Template" />
        </button>
      </div>

      {/* Celebratory Success Banner */}
      {importedCourses.length > 0 && (
        <div className="wb-success-summary" role="status">
          <div className="wb-success-header">
            <div className="wb-success-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="wb-success-title">
              <strong>
                <BilingualText
                  vi={`Đã tạo thành công ${importedCourses.length} khóa học nháp!`}
                  en={`Successfully created ${importedCourses.length} draft course(s)!`}
                />
              </strong>
              <span>
                <BilingualText
                  vi="Các khóa học đã sẵn sàng trên hệ thống. Bạn có thể vào chỉnh sửa chi tiết, kiểm tra bài học và gửi Admin duyệt."
                  en="Draft courses are now available. You can review lessons, refine details, and submit for Admin review."
                />
              </span>
            </div>
          </div>
          <div className="wb-success-grid">
            {importedCourses.map(c => (
              <div key={c.id} className="wb-success-course-card">
                <div className="wb-success-course-meta">
                  <strong>{c.title || c.filename}</strong>
                  <small>ID: #{c.id}</small>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Link className="wb-btn wb-btn-sm wb-btn-primary" to={`/content/courses/${c.id}`}>
                    <BilingualText vi="Biên soạn" en="Edit" />
                    <ArrowRight size={13} />
                  </Link>
                  <Link className="wb-btn wb-btn-sm wb-btn-secondary" to={`/content/courses/${c.id}?step=preview`}>
                    <Eye size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="wb-success-footer">
            <Link className="wb-btn wb-btn-secondary" to="/content/courses">
              <BilingualText vi="Về danh sách tất cả khóa học" en="Back to courses list" />
            </Link>
          </div>
        </div>
      )}

      {/* Modern Multi-file Drag & Drop Zone */}
      <div
        className={`wb-dropzone ${isDragging ? 'wb-dropzone--dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !locked && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          disabled={locked}
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.length > 0) {
              addFiles(e.target.files);
              e.target.value = '';
            }
          }}
        />
        <div className="wb-dropzone-icon">
          <UploadCloud size={28} />
        </div>
        <div>
          <h3>
            <BilingualText vi="Kéo thả các file Excel vào đây hoặc click để duyệt file" en="Drag & drop Excel files here, or click to browse" />
          </h3>
          <p>
            <BilingualText
              vi="Hỗ trợ chọn nhiều file .xlsx cùng lúc · Dung lượng tối đa 10 MB mỗi file"
              en="Supports selecting multiple .xlsx files at once · Max 10 MB per file"
            />
          </p>
        </div>
        <span className="wb-dropzone-tags">
          <Files size={12} />
          <BilingualText vi="Chọn nhiều file Excel cùng lúc" en="Select multiple files at once" />
        </span>
      </div>

      {/* Files Queue Area */}
      {fileItems.length > 0 && (
        <div className="wb-queue">
          <div className="wb-queue-header">
            <div className="wb-queue-title">
              <h3><BilingualText vi="Danh sách file đã chọn" en="Selected files queue" /></h3>
              <span className="wb-queue-badge">
                {fileItems.length} file (
                {formatFileSize(fileItems.reduce((acc, curr) => acc + curr.size, 0))})
              </span>
            </div>
            <div className="wb-queue-actions">
              <button
                type="button"
                className="wb-btn wb-btn-sm wb-btn-secondary"
                disabled={locked}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={14} />
                <BilingualText vi="Thêm file" en="Add more" />
              </button>
              {pendingCount > 0 && (
                <button
                  type="button"
                  className="wb-btn wb-btn-sm wb-btn-secondary"
                  disabled={locked}
                  onClick={validateAllFiles}
                >
                  <Eye size={14} />
                  <BilingualText vi={`Kiểm tra tất cả (${pendingCount + invalidCount})`} en={`Verify all (${pendingCount + invalidCount})`} />
                </button>
              )}
              {validCount > 0 && (
                <button
                  type="button"
                  className="wb-btn wb-btn-sm wb-btn-primary"
                  disabled={locked}
                  onClick={importAllValidFiles}
                >
                  <Upload size={14} />
                  <BilingualText vi={`Nhập tất cả hợp lệ (${validCount})`} en={`Import all valid (${validCount})`} />
                </button>
              )}
              <button
                type="button"
                className="wb-btn wb-btn-sm wb-btn-danger-soft"
                disabled={locked}
                onClick={clearAllFiles}
                title={label("Xóa toàn bộ file trong danh sách")}
              >
                <Trash2 size={13} />
                <BilingualText vi="Xóa tất cả" en="Clear all" />
              </button>
            </div>
          </div>

          {/* Batch Progress */}
          {batchProgress && (
            <div className="wb-progress-card">
              <div className="wb-progress-text">
                <span>
                  <BilingualText
                    vi={`Đang nhập file ${batchProgress.current} / ${batchProgress.total}: ${batchProgress.name}`}
                    en={`Importing file ${batchProgress.current} of ${batchProgress.total}: ${batchProgress.name}`}
                  />
                </span>
                <span>{Math.round((batchProgress.current / batchProgress.total) * 100)}%</span>
              </div>
              <div className="wb-progress-track">
                <div
                  className="wb-progress-fill"
                  style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* File Items */}
          <div className="wb-file-list">
            {fileItems.map((item) => {
              const hasErrors = item.errors && item.errors.length > 0;
              const isErrorsExpanded = Boolean(expandedErrors[item.id]);

              return (
                <div
                  key={item.id}
                  className={`wb-file-item wb-file-item--${item.status}`}
                >
                  <div className="wb-file-row">
                    <div className="wb-file-meta">
                      <div className="wb-file-badge">XLSX</div>
                      <div className="wb-file-details">
                        <div className="wb-file-name" title={item.name}>
                          {item.name}
                        </div>
                        <div className="wb-file-size">{item.formattedSize}</div>
                      </div>
                    </div>

                    <div className="wb-file-status-wrap">
                      {item.status === 'pending' && (
                        <span className="wb-status-pill wb-status-pill--pending">
                          <Clock size={12} />
                          <BilingualText vi="Chờ kiểm tra" en="Pending check" />
                        </span>
                      )}
                      {item.status === 'validating' && (
                        <span className="wb-status-pill wb-status-pill--validating">
                          <RefreshCw size={12} className="animate-spin" />
                          <BilingualText vi="Đang kiểm tra..." en="Validating..." />
                        </span>
                      )}
                      {item.status === 'valid' && (
                        <>
                          <span className="wb-status-pill wb-status-pill--valid">
                            <Check size={12} strokeWidth={2.5} />
                            <BilingualText vi="Hợp lệ" en="Valid" />
                          </span>
                          {item.preview?.counts && (
                            <span className="wb-counts-pill">
                              {item.preview.counts.MODULES || 0} {label('học phần')} ·{' '}
                              {item.preview.counts.LESSONS || 0} {label('bài học')} ·{' '}
                              {item.preview.counts.QUIZZES || 0} quiz ·{' '}
                              {item.preview.counts.QUESTIONS || 0} {label('câu hỏi')}
                            </span>
                          )}
                        </>
                      )}
                      {item.status === 'invalid' && (
                        <span className="wb-status-pill wb-status-pill--invalid">
                          <AlertCircle size={12} />
                          <BilingualText vi="Cần sửa file" en="Fix required" />
                        </span>
                      )}
                      {item.status === 'importing' && (
                        <span className="wb-status-pill wb-status-pill--importing">
                          <RefreshCw size={12} className="animate-spin" />
                          <BilingualText vi="Đang import..." en="Importing..." />
                        </span>
                      )}
                      {item.status === 'imported' && (
                        <span className="wb-status-pill wb-status-pill--imported">
                          <CheckCircle2 size={12} />
                          <BilingualText vi="Đã tạo khóa học" en="Draft created" />
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="wb-status-pill wb-status-pill--error">
                          <AlertCircle size={12} />
                          <BilingualText vi="Lỗi khi nhập" en="Import failed" />
                        </span>
                      )}
                    </div>

                    <div className="wb-file-actions">
                      {(item.status === 'pending' || item.status === 'invalid') && (
                        <button
                          type="button"
                          className="wb-btn wb-btn-sm wb-btn-secondary"
                          disabled={locked}
                          onClick={() => validateItem(item)}
                        >
                          <Eye size={13} />
                          <BilingualText vi="Kiểm tra" en="Inspect" />
                        </button>
                      )}
                      {item.status === 'valid' && (
                        <button
                          type="button"
                          className="wb-btn wb-btn-sm wb-btn-primary"
                          disabled={locked}
                          onClick={() => importItem(item)}
                        >
                          <Upload size={13} />
                          <BilingualText vi="Nhập khóa học" en="Import" />
                        </button>
                      )}
                      {item.status === 'imported' && item.courseId && (
                        <Link
                          to={`/content/courses/${item.courseId}`}
                          className="wb-btn wb-btn-sm wb-btn-emerald"
                        >
                          <ExternalLink size={13} />
                          <BilingualText vi={`Mở khóa #${item.courseId}`} en={`Open #${item.courseId}`} />
                        </Link>
                      )}
                      {hasErrors && (
                        <button
                          type="button"
                          className="wb-btn wb-btn-sm wb-btn-danger-soft"
                          onClick={() =>
                            setExpandedErrors(prev => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                        >
                          <BilingualText
                            vi={isErrorsExpanded ? 'Ẩn lỗi' : `Xem lỗi (${item.errors.length})`}
                            en={isErrorsExpanded ? 'Hide errors' : `Errors (${item.errors.length})`}
                          />
                        </button>
                      )}
                      {item.status !== 'importing' && (
                        <button
                          type="button"
                          className="wb-btn wb-btn-icon wb-btn-danger-soft"
                          disabled={locked}
                          onClick={() => removeFile(item.id)}
                          title={label("Xóa file khỏi danh sách")}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Error List */}
                  {hasErrors && isErrorsExpanded && (
                    <div className="wb-errors-box" role="alert">
                      <strong>
                        <AlertCircle size={14} />
                        <BilingualText
                          vi={`Có ${item.errors.length} vấn đề cần chỉnh sửa trong file:`}
                          en={`${item.errors.length} issue(s) found in workbook:`}
                        />
                      </strong>
                      <ul>
                        {item.errors.map((errText, idx) => (
                          <li key={idx}>{errText}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Generic error message if present */}
                  {item.errorMessage && !hasErrors && (
                    <div className="wb-errors-box" role="alert">
                      <strong><AlertCircle size={14} />{item.errorMessage}</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '16px' }}>
          <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>
        </div>
      )}

      <p className="studio-workbook-hint" style={{ marginTop: '20px' }}>
        <BilingualText
          vi="Sau khi import, khóa học được lưu ở trạng thái nháp (DRAFT). Bạn có thể kiểm tra cấu trúc, thêm hình ảnh bìa và gửi Admin phê duyệt khi hoàn thiện."
          en="After import, courses are saved as drafts. You can inspect curriculum, add thumbnail images, and submit for Admin review when ready."
        />
      </p>
    </section>
  );
}

function CoursePreview({ course }) {
  const label = useBilingualLabel();
  const lessons = (course.modules || []).flatMap(m => m.lessons || []);
  const [lessonId, setLessonId] = useState(null);
  return <section className="studio-preview">
    <div className="studio-section-heading">
      <div>
        <p className="studio-eyebrow"><BilingualText vi="GÓC NHÌN HỌC VIÊN" en="LEARNER PERSPECTIVE" /></p>
        <h2><BilingualText vi="Xem trước khóa học" en="Course Preview" /></h2>
        <p><BilingualText vi="Kiểm tra cách trình bày trước khi gửi duyệt." en="Verify layout and content before submission." /></p>
      </div>
      <span className="studio-preview-label"><Eye size={15} /> <BilingualText vi="Bao gồm bản nháp" en="Includes draft" /></span>
    </div>
    <article className="studio-preview-hero">
      <CourseThumbnail course={course} />
      <div>
        <span className="studio-preview-level">{course.level} · <BilingualText>{course.isFree ? 'Miễn phí' : 'Có phí'}</BilingualText></span>
        <h2><BilingualText vi={course.titleVi || course.title} en={course.title} /></h2>
        <p><BilingualText vi={course.descriptionVi || course.description} en={course.description} /></p>
        <span><BookOpen size={16} /> {lessons.length} <BilingualText>{"bài học"}</BilingualText> · {course.estimatedMinutes || lessons.reduce((sum, lesson) => sum + Number(lesson.estimatedMinutes || 0), 0)} <BilingualText vi="phút" en="min" /></span>
      </div>
    </article>
    <section className="studio-panel">
      <h3><BilingualText vi="Bạn sẽ học được gì?" en="What will you learn?" /></h3>
      <p className="studio-outcomes">{course.learningOutcomes || label('Chưa thêm mục tiêu học tập.')}</p>
    </section>
    <section className="studio-panel">
      <h3><BilingualText vi="Nội dung khóa học" en="Course Curriculum" /></h3>
      {course.modules?.map((module, index) => <div className="studio-preview-module" key={module.id}>
        <h4>{index + 1}. <BilingualText vi={module.titleVi || module.title} en={module.title} /></h4>
        {module.lessons?.map(lesson => <div className="studio-preview-lesson-block" key={lesson.id}>
          <button
            className={`secondary studio-preview-lesson ${lessonId === lesson.id ? 'is-selected' : ''}`}
            aria-expanded={lessonId === lesson.id}
            onClick={() => setLessonId(current => current === lesson.id ? null : lesson.id)}
          >
            <BookOpen size={17} />
            <span><BilingualText vi={lesson.titleVi || lesson.title} en={lesson.title} /></span>
            <small><BilingualText>{statusNames[lesson.status] || lesson.status}</BilingualText> · {lesson.estimatedMinutes || 0} <BilingualText vi="phút" en="min" /></small>
            <Eye size={16} />
          </button>
          {lessonId === lesson.id && <section className="studio-lesson-preview-inline">
            <div className="studio-section-heading">
              <h3><BilingualText vi="Nội dung bài học" en="Lesson Content" /></h3>
              <button className="secondary" onClick={() => setLessonId(null)}><BilingualText vi="Đóng xem trước" en="Close preview" /></button>
            </div>
            <StudioLessonPreview lessonId={lesson.id} />
          </section>}
        </div>)}
      </div>)}
      {!lessons.length && <p><BilingualText vi="Thêm bài học tại bước Cấu trúc để xem trước." en="Add lessons in Curriculum step to preview." /></p>}
    </section>
  </section>;
}

function StudioLessonPreview({ lessonId }) {
  return <ResourceState resource={useAsyncResource(useCallback(signal => contentService.preview('lessons', lessonId, signal), [lessonId]))}>
    {lesson => <LessonActivities key={lesson.id} lessonId={lesson.id} previewLesson={lesson} previewAll fallback={<p><BilingualText vi="Bài học chưa có hoạt động." en="Lesson has no activities." /></p>} />}
  </ResourceState>;
}

function CourseDetailsForm({ course, canEdit, onSave, onDirty, onBusyChange, wizard = false, onCancel = () => {} }) {
  const label = useBilingualLabel();
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
      setError(label('Chọn ảnh JPG, PNG hoặc WebP không quá 5 MB.')); e.target.value = ''; return;
    }
    setFile(candidate); setError(''); changed();
  }
  function nextPhase() {
    if (phase === 0 && (!form.title.trim() || !form.description.trim())) {
      setError(label('Điền tên và phần giới thiệu tiếng Anh trước khi tiếp tục.'));
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
      if (!payload.title || !payload.description || !payload.code || !payload.slug) throw new Error(label('Điền tên tiếng Anh, mô tả, mã và đường dẫn khóa học.'));
      if (file) {
        payload.thumbnailUrl = await contentService.uploadCourseCover(file);
        setForm(current => ({ ...current, thumbnailUrl: payload.thumbnailUrl })); setFile(null);
      }
      await onSave(payload); setDirty(false); onDirty(false);
    } catch (failure) { setError(failure.message || label('Không thể lưu khóa học.')); }
    finally { setBusy(false); onBusyChange(false); }
  }

  const field = (key, fieldLabel, options = {}) => <label className={options.wide ? 'studio-full-width' : ''}>
    <span><BilingualText>{fieldLabel}</BilingualText>{options.required && <span className="studio-required"> *</span>}</span>
    {options.area ? <textarea rows={options.rows || 4} required={options.required} maxLength={options.maxLength} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={options.placeholder ? label(options.placeholder) : undefined} /> : <input type={options.type || 'text'} required={options.required} maxLength={options.maxLength} min={options.type === 'number' ? 0 : undefined} pattern={key === 'slug' ? '[a-z0-9]+(?:-[a-z0-9]+)*' : undefined} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={options.placeholder ? label(options.placeholder) : undefined} />}
    {options.help && <small><BilingualText>{options.help}</BilingualText></small>}
  </label>;

  const phaseLabels = ['Giới thiệu', 'Ảnh bìa', 'Thiết lập'];

  return <form className={`studio-details-form${wizard ? ' studio-details-form--wizard' : ''}`} onSubmit={submit}>
    {wizard && <div className="studio-wizard-steps" aria-label={label("Các phần thông tin khóa học")}>{phaseLabels.map((pLabel, index) => <button key={pLabel} type="button" className={`${index === phase ? 'is-active ' : ''}${index < phase ? 'is-complete' : ''}`.trim()} aria-current={index === phase ? 'step' : undefined} onClick={() => index <= phase && setPhase(index)}><span>{index < phase ? <Check size={14} /> : index + 1}</span><strong><BilingualText>{pLabel}</BilingualText></strong></button>)}</div>}
    <fieldset disabled={busy || !canEdit}>
      {(!wizard || phase === 0) && <section className="studio-panel">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow"><BilingualText vi="ĐẶT NỀN TẢNG" en="FOUNDATION" /></p>
            <h2><BilingualText vi="Giới thiệu khóa học" en="Course Introduction" /></h2>
            <p><BilingualText vi="Cho học viên biết họ sẽ học gì và khóa học dành cho ai." en="Let learners know what they will study and who the course is for." /></p>
          </div>
          <FileText size={24} />
        </div>
        <div className="studio-form-grid">
          {field('title', 'Tên khóa học · English', { required: true, maxLength: 200, placeholder: 'e.g. Vietnamese for everyday adventures' })}
          {field('titleVi', 'Tên khóa học · Tiếng Việt', { maxLength: 200, placeholder: 'VD: Tiếng Việt cho những chuyến đi' })}
          {field('description', 'Giới thiệu · English', { required: true, area: true, wide: true, placeholder: 'Who is this course for? What can learners do after completing it?' })}
          {field('descriptionVi', 'Giới thiệu · Tiếng Việt', { area: true, wide: true, placeholder: 'Đối tượng học, chủ đề và trải nghiệm nổi bật của khóa học…' })}
        </div>
      </section>}
      {(!wizard || phase === 1) && <section className="studio-panel">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow"><BilingualText vi="HÌNH ẢNH ĐẠI DIỆN" en="COVER MEDIA" /></p>
            <h2><BilingualText vi="Ảnh bìa khóa học" en="Course Cover Image" /></h2>
            <p><BilingualText vi="Chọn hình đại diện cho chủ đề và tinh thần của khóa học." en="Choose an image reflecting the theme and spirit of the course." /></p>
          </div>
          <ImagePlus size={24} />
        </div>
        <div className="studio-cover-editor">
          {preview ? <img src={preview} alt={label("Xem trước ảnh bìa khóa học")} /> : <div className="studio-cover-empty"><ImagePlus size={36} /><span><BilingualText vi="Xem trước ảnh bìa" en="Cover preview" /></span></div>}
          <div>
            <label className="studio-file-label"><BilingualText vi="Chọn ảnh từ thiết bị" en="Select image from device" /><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} /></label>
            <p><BilingualText vi="JPG, PNG hoặc WebP · tối đa 5 MB." en="JPG, PNG or WebP · max 5 MB." /><br /><BilingualText vi="Gợi ý tỉ lệ 16:9, ảnh rõ nét." en="Recommended 16:9 ratio, sharp image." /></p>
            <small><BilingualText vi="Ảnh được tải lên Cloudinary khi lưu. Bạn có thể lưu nháp trước và thêm ảnh sau." en="Images upload to Cloudinary upon save. You can save draft now and upload later." /></small>
            {file && <button type="button" className="secondary" onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ''; }}><BilingualText vi="Bỏ ảnh vừa chọn" en="Remove chosen image" /></button>}
          </div>
        </div>
      </section>}
      {(!wizard || phase === 2) && <section className="studio-panel">
        <div className="studio-section-heading">
          <div>
            <p className="studio-eyebrow"><BilingualText vi="HOÀN TẤT THIẾT LẬP" en="FINAL SETTINGS" /></p>
            <h2><BilingualText vi="Kết quả học tập & thiết lập" en="Learning Outcomes & Settings" /></h2>
            <p><BilingualText vi="Xác định mục tiêu, trình độ và thời lượng trước khi tạo cấu trúc bài học." en="Define outcomes, level, and estimated duration before structuring lessons." /></p>
          </div>
          <CheckCircle2 size={24} />
        </div>
        <div className="studio-form-grid">
          {field('learningOutcomes', 'Sau khóa học, học viên có thể…', { area: true, wide: true, placeholder: 'Mỗi dòng một mục tiêu:\nGiới thiệu bản thân bằng tiếng Việt\nGọi món và thanh toán tại quán ăn', help: 'Mục tiêu rõ ràng giúp bạn thiết kế bài học và quiz phù hợp.' })}
          <div className="flex flex-col gap-[7px] text-[12.5px] font-[650] text-[#334155]">
            <span><BilingualText vi="Trình độ" en="Level" /></span>
            <HolaSelect
              value={form.level}
              onChange={(val) => update('level', val)}
              options={['A0', 'A1', 'A2', 'B1', 'B2', 'C1'].map((level) => ({ value: level, label: level }))}
              fullWidth
              align="left"
              disabled={busy || !canEdit}
              ariaLabel={bilingualLabel("Trình độ", "Level")}
            />
          </div>
          {field('estimatedMinutes', 'Thời lượng dự kiến (phút)', { type: 'number' })}
          <label className="studio-checkbox studio-full-width"><input type="checkbox" checked={form.isFree} onChange={e => update('isFree', e.target.checked)} /><span><BilingualText vi="Khóa học miễn phí" en="Free course" /></span></label>
        </div>
        <details className="studio-advanced">
          <summary><BilingualText vi="Mã khóa học & đường dẫn tự động" en="Course code & automatic slug" /></summary>
          <p><BilingualText vi="Mã và đường dẫn được tạo từ tên khóa học. Bạn có thể sửa nếu cần." en="Code and slug are generated from title. You can edit if necessary." /></p>
          <div className="studio-form-grid">
            {field('code', 'Mã khóa học', { required: true, maxLength: 80 })}
            {field('slug', 'Đường dẫn (slug)', { required: true, maxLength: 200, help: 'Ví dụ: tieng-viet-cho-nhung-chuyen-di' })}
          </div>
        </details>
      </section>}
    </fieldset>
    {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}
    {wizard ? <div className="studio-wizard-actions">
      <button type="button" className="secondary" disabled={busy} onClick={phase === 0 ? onCancel : () => { setError(''); setPhase(current => current - 1); }}><ArrowLeft size={16} /> <BilingualText>{phase === 0 ? 'Đóng' : 'Quay lại'}</BilingualText></button>
      <span><BilingualText vi="Bước" en="Step" /> {phase + 1} / {phaseLabels.length}</span>
      {phase < 2 ? <button type="button" disabled={busy} onClick={nextPhase}><BilingualText vi="Tiếp tục" en="Continue" />: <BilingualText>{phaseLabels[phase + 1]}</BilingualText> <ArrowRight size={16} /></button> : <button disabled={busy}><Save size={17} /> {busy ? label('Đang lưu…') : label('Lưu và sang Cấu trúc')}</button>}
    </div> : canEdit && <div className={`studio-form-save ${dirty ? 'has-changes' : ''}`}>
      <span role="status"><BilingualText>{dirty ? 'Bạn có thay đổi chưa lưu.' : 'Thông tin khóa học đã được lưu.'}</BilingualText></span>
      <button disabled={busy || !dirty}><Save size={17} /> {busy ? label('Đang lưu…') : dirty ? label('Lưu thay đổi') : label('Đã lưu')}</button>
    </div>}
  </form>;
}
