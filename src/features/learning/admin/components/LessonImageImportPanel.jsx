import { useEffect, useId, useRef, useState } from 'react';
import { AlertCircle, Check, CheckCircle2, Download, FileArchive, ImagePlus, RefreshCw, Upload, UploadCloud } from 'lucide-react';
import { contentService } from '@/features/learning/api/contentService';
import { BilingualText, useBilingualLabel } from '@/shared/components/common/BilingualText';
import { Notice } from '@/shared/components/common/Ui';
import { ASSET_LABELS, makeLessonImageTemplate, MAX_ZIP_SIZE, readLessonImageZip } from '../lessonImageZip';

const actionLabels = {
  ADD: ['Gắn vào nội dung', 'Attach to content'],
  MOVE: ['Dùng lại ảnh đã tải lên', 'Reuse uploaded image'],
  SKIP: ['Đã gắn trong nội dung', 'Already attached to content'],
  UNKNOWN_LESSON: ['Mã bài không thuộc khóa này', 'Lesson code is outside this course'],
  CHOOSE_ACTIVITY: ['Chọn mục nội dung để gắn ảnh', 'Choose a content activity for this image'],
  AMBIGUOUS: ['Có nhiều ảnh đã nhập trùng tên', 'Multiple uploaded images share this name'],
  SAVED: ['Đã gắn ảnh', 'Image attached'],
};
const packageStatuses = {
  validating: { icon: RefreshCw, vi: 'Đang kiểm tra', en: 'Checking package' },
  importing: { icon: RefreshCw, vi: 'Đang nhập ảnh', en: 'Importing images' },
  invalid: { icon: AlertCircle, vi: 'Có ảnh cần kiểm tra', en: 'Review required' },
  error: { icon: AlertCircle, vi: 'Không thể xử lý', en: 'Could not process' },
  valid: { icon: Check, vi: 'Sẵn sàng nhập', en: 'Ready to import' },
  imported: { icon: CheckCircle2, vi: 'Đã gắn ảnh', en: 'Images attached' },
};
const targetActions = new Set(['ADD', 'MOVE', 'CHOOSE_ACTIVITY']);
const canImport = row => !row.issue && Boolean(row.activityId) && targetActions.has(row.action);
const targetItem = ({ lessonKey, fileName, assetType, activityId }) => ({ lessonKey, fileName, assetType, activityId });

function rowTitles(row) {
  if (Object.hasOwn(ASSET_LABELS, row.assetType)) return ASSET_LABELS[row.assetType];
  const title = row.assetType.slice(0, 200);
  return title ? [title, title] : ['Hình ảnh bài học', 'Lesson image'];
}

function ImagePreview({ blob }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!blob) return undefined;
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url ? <img src={url} alt="" loading="lazy" /> : null;
}

async function samplePng() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Không thể tạo ảnh mẫu.');
  context.fillStyle = '#fff0d6';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#512e12';
  context.textAlign = 'center';
  context.font = 'bold 34px sans-serif';
  context.fillText('Ảnh học liệu mẫu', 320, 166);
  context.font = '19px sans-serif';
  context.fillText('Replace with your lesson image', 320, 206);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Không thể tạo ảnh mẫu.');
  return new Uint8Array(await blob.arrayBuffer());
}

function groupRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.lessonKey;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups];
}

function packageStatus(operation, error, rows) {
  if (operation === 'preview') return 'validating';
  if (operation === 'import') return 'importing';
  if (error) return 'error';
  if (rows.some(row => row.issue || row.failure || ['UNKNOWN_LESSON', 'AMBIGUOUS'].includes(row.action)
      || (targetActions.has(row.action) && !row.activityId))) return 'invalid';
  return rows.some(canImport) ? 'valid' : 'imported';
}

export function LessonImageImportPanel({ courseId, lessons, busy, onBusyChange, onImported, onDownload }) {
  const label = useBilingualLabel();
  const uploadHintId = useId();
  const importHintId = useId();
  const [batch, setBatch] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [operation, setOperation] = useState('');
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);
  const active = useRef(false);
  const sampleLesson = lessons.find(lesson => lesson.code);
  const rows = batch?.rows || [];
  const ready = rows.filter(canImport);
  const groups = groupRows(rows);
  const status = packageStatus(operation, !batch && error, rows);
  const { icon: StatusIcon, vi: statusVi, en: statusEn } = packageStatuses[status];
  const progressPercent = progress ? Math.round(100 * progress.done / progress.total) : 0;

  async function run(name, task) {
    if (busy || active.current) return;
    active.current = true;
    onBusyChange(true);
    setOperation(name);
    setError('');
    try { await task(); }
    catch (failure) { setError(failure.message || 'Không thể xử lý gói ảnh.'); }
    finally {
      setOperation('');
      active.current = false;
      onBusyChange(false);
    }
  }

  function chooseZip(files) {
    if (!sampleLesson || busy || active.current || !files?.length) return;
    if (files.length > 1) {
      setError(label('Chọn một gói ZIP mỗi lần.', 'Choose one ZIP package at a time.'));
      return;
    }
    const file = files[0];
    void run('preview', async () => {
      setFileName(file.name);
      setBatch(null);
      setReport(null);
      if (!file.name.toLowerCase().endsWith('.zip') || file.size > MAX_ZIP_SIZE) {
        throw new Error('Chọn file .zip tối đa 50 MB.');
      }
      const parsed = readLessonImageZip(new Uint8Array(await file.arrayBuffer()));
      const candidates = parsed.rows.filter(row => !row.issue);
      if (candidates.length) {
        const targets = await contentService.previewLessonImages(courseId, candidates.map(targetItem));
        candidates.forEach((row, index) => Object.assign(row, targets[index]));
      }
      setBatch(parsed);
    });
  }

  function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = busy ? 'none' : 'copy';
    setIsDragging(!busy);
  }

  function dropZip(event) {
    event.preventDefault();
    setIsDragging(false);
    chooseZip(event.dataTransfer.files);
  }

  function downloadTemplate() {
    void run('template', async () => {
      const zip = makeLessonImageTemplate(sampleLesson, await samplePng());
      onDownload(new Blob([zip], { type: 'application/zip' }), 'lesson-images-template.zip');
    });
  }

  function updateRow(id, changes) {
    setBatch(current => ({
      ...current,
      rows: current.rows.map(row => row.id === id ? { ...row, ...changes } : row),
    }));
  }

  function importImages() {
    void run('import', async () => {
      setReport(null);
      setProgress({ done: 0, total: ready.length });
      try {
        const stats = { attached: 0, skipped: 0, failed: 0 };
        const latest = await contentService.previewLessonImages(courseId, ready.map(targetItem));
        for (const [index, row] of ready.entries()) {
          const target = latest[index];
          if (!canImport(target)) {
            updateRow(row.id, { ...target, failure: '' });
            stats[target.action === 'SKIP' ? 'skipped' : 'failed']++;
          } else {
            let imageUrl = row.imageUrl;
            try {
              const [titleVi, title] = rowTitles(row);
              if (target.action === 'ADD' && !imageUrl) {
                imageUrl = await contentService.uploadLessonMedia(
                  new File([row.blob], row.fileName, { type: row.blob.type }), 'image');
              }
              const result = await contentService.attachLessonImage(courseId, {
                lessonKey: row.lessonKey, fileName: row.fileName,
                activityId: target.activityId, title, titleVi, imageUrl,
              });
              const skipped = result.action === 'SKIP';
              updateRow(row.id, { action: skipped ? 'SKIP' : 'SAVED', imageUrl, failure: '' });
              stats[skipped ? 'skipped' : 'attached']++;
            } catch (failure) {
              updateRow(row.id, { imageUrl, failure: failure.message });
              stats.failed++;
            }
          }
          setProgress({ done: index + 1, total: ready.length });
        }
        setReport(stats);
        if (stats.attached) onImported();
      } finally {
        setProgress(null);
      }
    });
  }

  return (
    <section className="studio-panel lesson-image-import" aria-labelledby="lesson-image-import-title">
      <div className="studio-section-heading">
        <div>
          <h2 id="lesson-image-import-title"><ImagePlus size={23} aria-hidden="true" /> <BilingualText vi="Nhập ảnh bài học từ ZIP" en="Import lesson images from ZIP" /></h2>
          <p><BilingualText vi="Chọn mục nội dung có sẵn để hiển thị chữ và ảnh minh họa cùng nhau." en="Choose an existing activity to display its content alongside the image." /></p>
        </div>
      </div>
      <div className="wb-template-card">
        <div className="wb-template-info">
          <span className="wb-template-icon"><FileArchive size={22} aria-hidden="true" /></span>
          <div>
            <strong><BilingualText vi="Gói ảnh mẫu (.zip)" en="Lesson image template (.zip)" /></strong>
            <p><BilingualText vi="Gồm ảnh mẫu, hướng dẫn và manifest.csv điền sẵn mã bài của khóa." en="Includes sample images, instructions, and a manifest.csv prefilled with a lesson code from this course." /></p>
          </div>
        </div>
        <button type="button" className="wb-btn wb-btn-emerald" disabled={busy || !sampleLesson} onClick={downloadTemplate}>
          <Download size={16} aria-hidden="true" /> <BilingualText vi="Tải ZIP mẫu" en="Download ZIP template" />
        </button>
      </div>
      {sampleLesson ? <label
        className={`wb-dropzone lesson-image-dropzone${isDragging ? ' wb-dropzone--dragging' : ''}${busy ? ' is-disabled' : ''}`}
        onDragOver={dragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={dropZip}
      >
        <input
          className="sr-only"
          type="file"
          accept=".zip,application/zip"
          aria-label={label('Chọn gói ảnh (.zip)', 'Choose an image package (.zip)')}
          aria-describedby={uploadHintId}
          disabled={busy}
          onChange={event => {
            chooseZip(event.target.files);
            event.target.value = '';
          }}
        />
        <span className="wb-dropzone-icon"><UploadCloud size={28} aria-hidden="true" /></span>
        <strong><BilingualText vi="Kéo thả gói ảnh ZIP vào đây hoặc bấm để chọn tệp" en="Drag and drop a ZIP package here, or click to browse" /></strong>
        <small id={uploadHintId}><BilingualText vi="Một tệp ZIP tối đa 50 MB · Tối đa 100 ảnh PNG, JPG hoặc WebP, mỗi ảnh tối đa 5 MB." en="One ZIP file up to 50 MB · Up to 100 PNG, JPG, or WebP images, 5 MB per image." /></small>
      </label> : <Notice><BilingualText vi="Tạo ít nhất một bài học để tải mẫu và nhập ảnh." en="Create a lesson to download the template and import images." /></Notice>}
      {error && <Notice kind="error">{error}</Notice>}
      {fileName && <div className="wb-queue">
        <div className="wb-queue-header">
          <div className="wb-queue-title">
            <h3><BilingualText vi="Tệp đã chọn" en="Selected file" /></h3>
          </div>
          {batch && <button className="wb-btn wb-btn-primary" type="button"
            disabled={busy || !ready.length} aria-describedby={!ready.length && !busy ? importHintId : undefined}
            onClick={importImages}>
            <Upload size={16} aria-hidden="true" />
            {ready.length
              ? <BilingualText vi={`Nhập ${ready.length} ảnh`} en={`Import ${ready.length} images`} />
              : <BilingualText vi="Nhập ảnh" en="Import images" />}
          </button>}
        </div>
        <div className={`wb-file-item wb-file-item--${status}`}>
          <div className="wb-file-row">
            <div className="wb-file-meta">
              <span className="wb-file-badge">ZIP</span>
              <strong className="wb-file-name" title={fileName}>{fileName}</strong>
            </div>
            <div className="wb-file-status-wrap" role="status">
              <span className={`wb-status-pill wb-status-pill--${status}`}>
                <StatusIcon size={12} aria-hidden="true" className={status === 'validating' || status === 'importing' ? 'animate-spin' : undefined} />
                <BilingualText vi={statusVi} en={statusEn} />
              </span>
              {batch && <span className="wb-counts-pill"><BilingualText vi={`${groups.length} nhóm bài · ${rows.length} ảnh · ${ready.length} sẵn sàng`} en={`${groups.length} lesson groups · ${rows.length} images · ${ready.length} ready`} /></span>}
            </div>
          </div>
        </div>
        {batch && !ready.length && !busy && <p id={importHintId}>
          {status === 'imported'
            ? <BilingualText vi="Tất cả ảnh trong gói đã có trong khóa học này." en="All images in this package are already attached to this course." />
            : <BilingualText vi="Chưa có ảnh sẵn sàng nhập. Kiểm tra các dòng được báo lỗi bên dưới." en="No images are ready to import. Check the flagged rows below." />}
        </p>}
        {batch?.unused.length > 0 && <p><BilingualText vi={`${batch.unused.length} ảnh không có trong manifest.csv sẽ được bỏ qua.`} en={`${batch.unused.length} images not listed in manifest.csv will be skipped.`} /></p>}
        {progress && <div className="wb-progress-card lesson-image-progress">
          <div className="wb-progress-text">
            <span><BilingualText vi={`Đã xử lý ${progress.done}/${progress.total} ảnh`} en={`Processed ${progress.done}/${progress.total} images`} /></span>
            <span>{progressPercent}%</span>
          </div>
          <div className="wb-progress-track" role="progressbar" aria-label={label('Tiến độ nhập ảnh', 'Image import progress')}
            aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
            <div className="wb-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>}
        {report && <div role="status"><Notice kind={report.failed ? 'error' : undefined}><BilingualText
          vi={`Đã gắn ${report.attached} ảnh, bỏ qua ${report.skipped} ảnh, ${report.failed} ảnh gặp lỗi.`}
          en={`Attached ${report.attached} images, skipped ${report.skipped}, ${report.failed} failed.`}
        /></Notice></div>}
        {batch && <div className="lesson-image-groups">
          {groups.map(([key, group]) => {
            const lesson = group.find(row => row.lessonTitle || row.lessonTitleVi) || group[0];
            return <details key={key} open>
              <summary><strong>{key || '—'}</strong> · <BilingualText vi={lesson.lessonTitleVi || lesson.lessonTitle || key} en={lesson.lessonTitle || lesson.lessonTitleVi || key} /> · {group.length}</summary>
              <ul>
                {group.map(row => {
                  const [titleVi, titleEn] = rowTitles(row);
                  const chosen = row.activityOptions?.find(option => option.id === row.activityId);
                  const editableTarget = !row.issue && row.activityOptions?.length > 0 && targetActions.has(row.action);
                  const displayAction = targetActions.has(row.action) && !chosen ? 'CHOOSE_ACTIVITY'
                    : row.action === 'CHOOSE_ACTIVITY' ? 'ADD' : row.action;
                  const [actionVi, actionEn] = actionLabels[displayAction] || [];
                  const needsReview = ['UNKNOWN_LESSON', 'AMBIGUOUS'].includes(row.action)
                    || displayAction === 'CHOOSE_ACTIVITY';
                  const completed = ['SKIP', 'SAVED'].includes(row.action);
                  return <li key={row.id}>
                    <div className="lesson-image-thumb"><ImagePreview blob={row.blob} /></div>
                    <div>
                      <strong><BilingualText vi={titleVi} en={titleEn} /></strong>
                      <small>{row.path || '—'}</small>
                      {editableTarget ? <label className="lesson-image-target">
                        <span><BilingualText vi="Gắn vào mục" en="Attach to activity" /></span>
                        <select value={row.activityId || ''} disabled={busy}
                          onChange={event => updateRow(row.id, { activityId: Number(event.target.value) || null, failure: '' })}>
                          <option value="">{label('Chọn mục nội dung', 'Choose an activity')}</option>
                          {row.activityOptions.map(option => <option key={option.id} value={option.id}>
                            {label(option.titleVi || option.title, option.title)}
                          </option>)}
                        </select>
                      </label> : chosen && <small><BilingualText vi={chosen.titleVi || chosen.title} en={chosen.title} /></small>}
                      {row.issue || row.failure ? <span className="lesson-image-row-error">{row.issue || row.failure}</span>
                        : <span className={`wb-status-pill wb-status-pill--${needsReview ? 'invalid' : completed ? 'imported' : 'valid'}`}>
                          <BilingualText vi={actionVi} en={actionEn} />
                        </span>}
                    </div>
                  </li>;
                })}
              </ul>
            </details>;
          })}
        </div>}
      </div>}
    </section>
  );
}
