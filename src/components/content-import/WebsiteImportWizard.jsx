import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ExternalLink, FileCode2, Globe2, GitMerge, Scissors, ShieldCheck } from 'lucide-react';
import { Notice } from '@/components/common/Ui';
import { SafeImportedHtml } from '@/components/common/SafeImportedHtml';
import { contentService } from '@/services/contentService';
import { websiteImportService } from '@/services/websiteImportService';

const STEP_LABELS = ['Nguồn import', 'Phân tích', 'Cấu trúc khóa học', 'Nội dung & media', 'Lưu bản nháp'];
const SAMPLE_URL = 'https://openbooks.lib.msu.edu/vietnamese/chapter/section-1-vietnamese-alphabet/';

const clone = (value) => JSON.parse(JSON.stringify(value));

export function WebsiteImportWizard() {
  const [step, setStep] = useState(1);
  const [sourceKind, setSourceKind] = useState('url');
  const [mode, setMode] = useState('SINGLE_LESSON');
  const [sourceUrl, setSourceUrl] = useState(SAMPLE_URL);
  const [file, setFile] = useState(null);
  const [targetCourseId, setTargetCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [active, setActive] = useState({ module: 0, lesson: 0, block: 0 });
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [license, setLicense] = useState('');
  const [attribution, setAttribution] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    contentService.list('courses', { size: 100, sort: 'title,asc' }, controller.signal)
      .then((response) => setCourses(response?.content || response?.items || []))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  async function analyze(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = sourceKind === 'file'
        ? await websiteImportService.analyzeFile(file, targetCourseId)
        : await websiteImportService.analyze({ sourceUrl, mode, targetCourseId });
      setProject(result); setModules(clone(result.modules || [])); setLicense(result.license || '');
      setAttribution(result.attribution || ''); setStep(2); setActive({ module: 0, lesson: 0, block: 0 });
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  async function persist(nextStep = 5) {
    setBusy(true); setError('');
    try {
      const result = await websiteImportService.update(project.id, modules);
      setProject(result); setModules(clone(result.modules || modules)); setStep(nextStep);
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  async function retryMedia() {
    setBusy(true); setError('');
    try {
      const result = await websiteImportService.retryMedia(project.id);
      setProject(result); setModules(clone(result.modules || []));
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  async function save() {
    if (!rightsConfirmed) { setError('Bạn cần xác nhận quyền sử dụng trước khi lưu.'); return; }
    setBusy(true); setError('');
    try {
      const result = await websiteImportService.save(project.id, { rightsConfirmed, license, attribution });
      setProject(result);
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  const selectedLessons = useMemo(() => modules.reduce((sum, module) => sum + (module.selected ? module.lessons.filter((lesson) => lesson.selected).length : 0), 0), [modules]);

  function updateModule(moduleIndex, patch) {
    setModules((current) => current.map((module, index) => index === moduleIndex ? { ...module, ...patch } : module));
  }
  function updateLesson(moduleIndex, lessonIndex, patch) {
    setModules((current) => current.map((module, index) => index !== moduleIndex ? module : {
      ...module, lessons: module.lessons.map((lesson, i) => i === lessonIndex ? { ...lesson, ...patch } : lesson),
    }));
  }
  function moveLesson(moduleIndex, lessonIndex, direction) {
    const destination = lessonIndex + direction;
    if (destination < 0 || destination >= modules[moduleIndex].lessons.length) return;
    setModules((current) => current.map((module, index) => {
      if (index !== moduleIndex) return module;
      const lessons = [...module.lessons]; [lessons[lessonIndex], lessons[destination]] = [lessons[destination], lessons[lessonIndex]];
      return { ...module, lessons };
    }));
  }
  function mergePrevious(moduleIndex, lessonIndex) {
    if (lessonIndex < 1) return;
    setModules((current) => current.map((module, index) => {
      if (index !== moduleIndex) return module;
      const lessons = [...module.lessons], previous = lessons[lessonIndex - 1], currentLesson = lessons[lessonIndex];
      const appended = currentLesson.blocks.map((block) => ({ ...block, key: `${currentLesson.key}-${block.key}` }));
      lessons.splice(lessonIndex - 1, 2, { ...previous, title: `${previous.title} + ${currentLesson.title}`, blocks: [...previous.blocks, ...appended].map((block, i) => ({ ...block, orderIndex: i + 1 })) });
      return { ...module, lessons };
    }));
  }
  function updateBlock(moduleIndex, lessonIndex, blockIndex, patch) {
    setModules((current) => current.map((module, mi) => mi !== moduleIndex ? module : ({ ...module,
      lessons: module.lessons.map((lesson, li) => li !== lessonIndex ? lesson : ({ ...lesson,
        blocks: lesson.blocks.map((block, bi) => bi === blockIndex ? { ...block, ...patch } : block),
      })),
    })));
  }
  function splitLesson(moduleIndex, lessonIndex, blockIndex) {
    if (blockIndex < 1) return;
    setModules((current) => current.map((module, mi) => {
      if (mi !== moduleIndex) return module;
      const lessons = [...module.lessons], lesson = lessons[lessonIndex];
      const first = lesson.blocks.slice(0, blockIndex).map((block, i) => ({ ...block, orderIndex: i + 1 }));
      const second = lesson.blocks.slice(blockIndex).map((block, i) => ({ ...block, orderIndex: i + 1 }));
      const newLesson = { ...lesson, key: `${lesson.key}-split-${Date.now()}`, title: `${lesson.title} (phần 2)`, blocks: second };
      lessons.splice(lessonIndex, 1, { ...lesson, blocks: first }, newLesson);
      return { ...module, lessons };
    }));
    setActive({ module: moduleIndex, lesson: lessonIndex + 1, block: 0 });
  }

  return <section className="website-import-wizard admin-card">
    <WizardSteps step={step} onStep={setStep} />
    {step === 1 && <SourceStep {...{ sourceKind, setSourceKind, mode, setMode, sourceUrl, setSourceUrl, file, setFile, targetCourseId, setTargetCourseId, courses, busy, analyze }} />}
    {step === 2 && <AnalysisStep project={project} busy={busy} onRetryMedia={retryMedia} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
    {step === 3 && <StructureStep modules={modules} selectedLessons={selectedLessons} onModule={updateModule} onLesson={updateLesson} onMove={moveLesson} onMerge={mergePrevious} onBack={() => setStep(2)} onNext={() => setStep(4)} />}
    {step === 4 && <ContentStep modules={modules} active={active} setActive={setActive} onBlock={updateBlock} onSplit={splitLesson} busy={busy} onBack={() => setStep(3)} onNext={() => persist(5)} />}
    {step === 5 && <SaveStep project={project} selectedLessons={selectedLessons} rightsConfirmed={rightsConfirmed} setRightsConfirmed={setRightsConfirmed} license={license} setLicense={setLicense} attribution={attribution} setAttribution={setAttribution} busy={busy} onBack={() => setStep(4)} onSave={save} />}
    {error && <Notice kind="error">{error}</Notice>}
  </section>;
}

function WizardSteps({ step, onStep }) {
  return <ol className="website-import-steps" aria-label="Tiến trình import website">{STEP_LABELS.map((label, index) => {
    const number = index + 1; return <li key={label} className={number === step ? 'is-active' : number < step ? 'is-complete' : ''}>
      <button type="button" disabled={number > step} onClick={() => onStep(number)}><span>{number < step ? <Check size={14} /> : number}</span><strong>{label}</strong></button>
    </li>;
  })}</ol>;
}

function SourceStep({ sourceKind, setSourceKind, mode, setMode, sourceUrl, setSourceUrl, file, setFile, targetCourseId, setTargetCourseId, courses, busy, analyze }) {
  return <form className="website-source-step" onSubmit={analyze}>
    <header><p className="studio-eyebrow">BƯỚC 1 · IMPORT SOURCE</p><h2>Chọn nguồn giáo trình</h2><p>Hệ thống chỉ trích xuất nội dung tồn tại trong nguồn, không dịch, tóm tắt hay tự tạo câu hỏi.</p></header>
    <div className="website-source-kinds">
      <button type="button" className={sourceKind === 'url' ? 'is-active' : ''} onClick={() => setSourceKind('url')}><Globe2 size={20} /><strong>URL website</strong><small>Một bài hoặc toàn bộ mục lục</small></button>
      <button type="button" className={sourceKind === 'file' ? 'is-active' : ''} onClick={() => setSourceKind('file')}><FileCode2 size={20} /><strong>File Pressbooks</strong><small>XHTML, HTML hoặc XML · tối đa 10 MiB</small></button>
    </div>
    {sourceKind === 'url' ? <>
      <label>URL nguồn<input type="url" required value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder={SAMPLE_URL} /></label>
      <div className="website-mode-options">
        <label><input type="radio" checked={mode === 'SINGLE_LESSON'} onChange={() => setMode('SINGLE_LESSON')} /> <span><strong>Import một Lesson</strong><small>Chỉ phân tích đúng trang URL đã nhập.</small></span></label>
        <label><input type="radio" checked={mode === 'FULL_COURSE'} onChange={() => setMode('FULL_COURSE')} /> <span><strong>Import Full Course</strong><small>Đọc mục lục và tải tối đa 100 trang nội dung.</small></span></label>
      </div>
    </> : <label>File export chính thức<input type="file" required accept=".xhtml,.html,.xml,application/xhtml+xml,application/xml,text/html" onChange={(event) => setFile(event.target.files?.[0] || null)} />{file && <small>{file.name} · {(file.size / 1024).toFixed(1)} KiB</small>}</label>}
    <label>Khóa học đích (không bắt buộc)<select value={targetCourseId} onChange={(event) => setTargetCourseId(event.target.value)}><option value="">Tạo khóa học nháp mới</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.titleVi || course.title}</option>)}</select><small>Chỉ khóa học đang biên soạn mới có thể nhận thêm module.</small></label>
    <Notice><ShieldCheck size={18} /> Backend chặn localhost, IP nội bộ, cổng lạ và redirect không an toàn. Website chặn truy cập sẽ không bị vượt bảo vệ; hãy dùng export XHTML/XML.</Notice>
    <div className="wizard-actions"><span /><button disabled={busy || (sourceKind === 'file' && !file)}>{busy ? 'Đang tải và phân tích…' : 'Phân tích nội dung'} <ArrowRight size={16} /></button></div>
  </form>;
}

function AnalysisStep({ project, busy, onRetryMedia, onBack, onNext }) {
  const stats = project?.stats || {};
  const cards = [['Module', stats.modules], ['Lesson', stats.lessons], ['Content block', stats.blocks], ['Heading', stats.headings], ['Đoạn văn', stats.paragraphs], ['Hình ảnh', stats.images], ['Audio', stats.audio], ['Video/embed', stats.video], ['Bảng', stats.tables], ['Cần kiểm tra', stats.needsReview]];
  return <section><header><p className="studio-eyebrow">BƯỚC 2 · ANALYZE CONTENT</p><h2>Kết quả phân tích nguồn</h2><p><strong>{project?.title}</strong>{project?.author ? ` · ${project.author}` : ''}</p></header>
    <dl className="website-analysis-grid">{cards.map(([label, value]) => <div key={label} className={label === 'Cần kiểm tra' && value ? 'has-warning' : ''}><dt>{label}</dt><dd>{value || 0}</dd></div>)}</dl>
    <div className="source-metadata"><p><strong>License nhận diện:</strong> {project?.license || 'Không tìm thấy — cần nhập thủ công'}</p><p><strong>Nguồn:</strong> {project?.sourceUrl || project?.sourceFilename}</p><p><strong>Trạng thái media:</strong> Media ngoài nguồn chỉ được giữ URL và đánh dấu chờ xác minh quyền; không tự tải lại hoặc thay bằng ảnh AI.</p></div>
    {!!project?.diagnostics?.length && <Notice kind="warning"><AlertTriangle size={18} /><div><strong>Nội dung cần xử lý</strong><ul>{project.diagnostics.map((item, index) => <li key={index}>{item.message} {item.sourcePageUrl && <a href={item.sourcePageUrl} target="_blank" rel="noreferrer">Mở nguồn</a>}</li>)}</ul></div></Notice>}
    <div className="wizard-actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button><span><button className="secondary" disabled={busy || !(stats.images || stats.audio || stats.video)} onClick={onRetryMedia}>{busy ? 'Đang kiểm tra…' : 'Retry kiểm tra media'}</button> <button onClick={onNext}>Kiểm tra cấu trúc <ArrowRight size={16} /></button></span></div>
  </section>;
}

function StructureStep({ modules, selectedLessons, onModule, onLesson, onMove, onMerge, onBack, onNext }) {
  return <section><header><p className="studio-eyebrow">BƯỚC 3 · COURSE STRUCTURE</p><h2>Chọn và sắp xếp Module → Lesson</h2><p>{selectedLessons} bài được chọn. Bạn có thể đổi tên, bỏ chọn, đổi thứ tự hoặc gộp bài liền kề.</p></header>
    <div className="website-structure-tree">{modules.map((module, moduleIndex) => <article key={module.key}>
      <div className="structure-row structure-module"><input aria-label="Chọn module" type="checkbox" checked={module.selected} onChange={(event) => onModule(moduleIndex, { selected: event.target.checked })} /><input value={module.title} onChange={(event) => onModule(moduleIndex, { title: event.target.value })} /></div>
      <div>{module.lessons.map((lesson, lessonIndex) => <div className="structure-row structure-lesson" key={lesson.key}>
        <input aria-label="Chọn lesson" type="checkbox" disabled={!module.selected} checked={lesson.selected} onChange={(event) => onLesson(moduleIndex, lessonIndex, { selected: event.target.checked })} />
        <input value={lesson.title} onChange={(event) => onLesson(moduleIndex, lessonIndex, { title: event.target.value })} />
        <span>{lesson.blocks.length} blocks</span>
        <button type="button" className="icon-button" disabled={lessonIndex === 0} onClick={() => onMove(moduleIndex, lessonIndex, -1)} title="Đưa lên"><ArrowUp size={15} /></button>
        <button type="button" className="icon-button" disabled={lessonIndex + 1 === module.lessons.length} onClick={() => onMove(moduleIndex, lessonIndex, 1)} title="Đưa xuống"><ArrowDown size={15} /></button>
        <button type="button" className="icon-button" disabled={lessonIndex === 0} onClick={() => onMerge(moduleIndex, lessonIndex)} title="Gộp với bài trước"><GitMerge size={15} /></button>
      </div>)}</div>
    </article>)}</div>
    <div className="wizard-actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button><button disabled={!selectedLessons} onClick={onNext}>Xem từng content block <ArrowRight size={16} /></button></div>
  </section>;
}

function ContentStep({ modules, active, setActive, onBlock, onSplit, busy, onBack, onNext }) {
  const module = modules[active.module], lesson = module?.lessons?.[active.lesson], block = lesson?.blocks?.[active.block];
  return <section><header><p className="studio-eyebrow">BƯỚC 4 · CONTENT PREVIEW</p><h2>So sánh nguồn và kết quả import</h2><p>Chọn bài ở cột trái, kiểm tra từng block theo đúng orderIndex rồi chỉnh metadata khi cần.</p></header>
    <div className="website-content-review">
      <aside>{modules.map((item, mi) => <div key={item.key}><strong>{item.title}</strong>{item.lessons.map((entry, li) => <button type="button" className={mi === active.module && li === active.lesson ? 'is-active' : ''} key={entry.key} onClick={() => setActive({ module: mi, lesson: li, block: 0 })}>{entry.title}<small>{entry.blocks.length} blocks</small></button>)}</div>)}</aside>
      <main>{lesson && <><div className="block-tabs">{lesson.blocks.map((item, bi) => <button type="button" className={bi === active.block ? 'is-active' : ''} key={item.key} onClick={() => setActive({ ...active, block: bi })}>{item.orderIndex}. {item.type}{item.reviewRequired ? ' ⚠' : ''}</button>)}</div>
        {block && <div className="block-compare">
          <section><h3>Nguồn gốc</h3><p><strong>Trang:</strong> {block.sourcePageUrl ? <a href={block.sourcePageUrl} target="_blank" rel="noreferrer">Mở trang nguồn <ExternalLink size={13} /></a> : 'File đã upload'}</p><p><strong>URL media gốc:</strong> {block.originalUrl || '—'}</p><p><strong>Trạng thái:</strong> <span className={`import-status ${block.reviewRequired ? 'has-warning' : ''}`}>{block.importStatus}</span></p><pre>{block.text || block.caption || block.altText || block.mediaUrl || 'Khối không có text.'}</pre></section>
          <section><h3>Lesson Preview</h3><BlockPreview block={block} /></section>
        </div>}
        {block && <div className="block-editor"><label>Loại block<select value={block.type} onChange={(event) => onBlock(active.module, active.lesson, active.block, { type: event.target.value })}>{['HEADING','PARAGRAPH','RICH_TEXT','TABLE','IMAGE','AUDIO','VIDEO'].map((type) => <option key={type}>{type}</option>)}</select></label>
          {block.html != null && <label className="wide">HTML đã làm sạch<textarea rows="7" value={block.html || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { html: event.target.value, text: event.target.value.replace(/<[^>]*>/g, ' ') })} /></label>}
          {['IMAGE','AUDIO','VIDEO'].includes(block.type) && <><label className="wide">Media URL<input value={block.mediaUrl || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { mediaUrl: event.target.value, reviewRequired: true, importStatus: 'ADMIN_EDITED' })} /></label><label>Alt text<input value={block.altText || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { altText: event.target.value })} /></label><label>Caption<input value={block.caption || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { caption: event.target.value })} /></label></>}
          <label>Attribution<input value={block.attribution || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { attribution: event.target.value })} /></label><label>License<input value={block.license || ''} onChange={(event) => onBlock(active.module, active.lesson, active.block, { license: event.target.value })} /></label>
          <button type="button" className="secondary split-action" disabled={active.block < 1} onClick={() => onSplit(active.module, active.lesson, active.block)}><Scissors size={15} /> Tách thành lesson mới từ block này</button>
        </div>}
      </>}</main>
    </div>
    <div className="wizard-actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button><button disabled={busy} onClick={onNext}>{busy ? 'Đang lưu bản rà soát…' : 'Kiểm tra bản quyền'} <ArrowRight size={16} /></button></div>
  </section>;
}

function BlockPreview({ block }) {
  if (block.type === 'IMAGE') return block.mediaUrl ? <figure><img src={block.mediaUrl} alt={block.altText || ''} />{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : <Notice kind="warning">Ảnh thiếu URL; block được giữ để Admin xử lý.</Notice>;
  if (block.type === 'AUDIO') return block.mediaUrl ? <audio controls src={block.mediaUrl} /> : <Notice kind="warning">Audio thiếu URL.</Notice>;
  if (block.type === 'VIDEO') return block.mediaUrl ? <p><a href={block.mediaUrl} target="_blank" rel="noreferrer">Mở video / nội dung nhúng <ExternalLink size={13} /></a></p> : <Notice kind="warning">Video/embed thiếu URL.</Notice>;
  return <SafeImportedHtml html={block.html || `<p>${block.text || ''}</p>`} />;
}

function SaveStep({ project, selectedLessons, rightsConfirmed, setRightsConfirmed, license, setLicense, attribution, setAttribution, busy, onBack, onSave }) {
  if (project?.status === 'SAVED') return <section className="import-saved"><ShieldCheck size={44} /><h2>Đã lưu khóa học ở trạng thái nháp</h2><p>{selectedLessons} lesson và toàn bộ content block đã được ghi vào database. Không có nội dung nào được tự động publish.</p><Link className="button" to={`/admin/courses/${project.resultCourseId}`}>Mở Course Builder</Link></section>;
  return <section><header><p className="studio-eyebrow">BƯỚC 5 · SAVE DRAFT</p><h2>Xác nhận nguồn và quyền sử dụng</h2><p>Import không thay thế việc rà soát giấy phép. CC BY-NC 4.0 không mặc nhiên bao phủ media bên thứ ba.</p></header>
    <div className="rights-panel"><label>Giấy phép<input value={license} onChange={(event) => setLicense(event.target.value)} placeholder="Ví dụ: CC BY-NC 4.0" /></label><label>Nguồn / attribution<textarea rows="4" value={attribution} onChange={(event) => setAttribution(event.target.value)} /></label>
      <label className="rights-confirm"><input type="checkbox" checked={rightsConfirmed} onChange={(event) => setRightsConfirmed(event.target.checked)} /><span><strong>Tôi xác nhận có quyền sử dụng nội dung đã chọn.</strong><small>Tôi đã kiểm tra ngoại lệ bản quyền và sẽ tiếp tục rà soát từng media đang ở trạng thái PENDING_RIGHTS / NEEDS_REVIEW trước khi publish.</small></span></label>
    </div>
    <Notice kind="warning"><AlertTriangle size={18} /> Khóa học, module, lesson và activity đều được lưu dưới dạng DRAFT. Hệ thống không tải lại media chưa xác minh quyền và không tự động publish.</Notice>
    <div className="wizard-actions"><button className="secondary" onClick={onBack}><ArrowLeft size={16} /> Quay lại</button><button disabled={busy || !rightsConfirmed} onClick={onSave}>{busy ? 'Đang lưu transaction…' : `Lưu ${selectedLessons} lesson dạng nháp`}</button></div>
  </section>;
}
