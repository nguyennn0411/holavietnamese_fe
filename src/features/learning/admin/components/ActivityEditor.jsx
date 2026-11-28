import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useEffect, useRef, useState } from 'react';
import { contentService } from '@/features/learning/api/contentService';
import { Notice } from '@/shared/components/common/Ui';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { HolaSelect } from '@/shared/components/common/HolaSelect';
import { appendInlineIllustration, canAppendIllustration, canIllustrateActivity, illustrationFileTypes, isIllustrationFile } from '../activityIllustrations';
import './activity-illustration-editor.css';

const types = ['TEXT','IMAGE','AUDIO','VIDEO','VOCABULARY','FLASHCARD','DIALOGUE','GRAMMAR','SOUND_PATTERN','MULTIPLE_CHOICE','FILL_BLANK','MATCHING','REORDER_SENTENCE','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE','LISTENING','TRANSLATION','PRACTICE','QUIZ','PRONUNCIATION','AI_CONVERSATION','AI_ROLEPLAY'];
const exercises = ['MULTIPLE_CHOICE','FILL_BLANK','MATCHING','REORDER_SENTENCE','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE','LISTENING','TRANSLATION','PRACTICE'];

export function ActivityEditor({ initial, lessonId, focusIllustration, onSaved, onBusyChange }) {
  useTextLanguage();
  const [form,setForm] = useState({activityType:'TEXT',title:'',instruction:'',isRequired:true,maxScore:0,status:'DRAFT',quizId:null,...initial,grammarTopicIds:initial.grammarTopicIds || initial.grammarTopics?.map(topic=>topic.id) || []});
  const [raw,setRaw] = useState(typeof initial.contentJson==='string' ? initial.contentJson : JSON.stringify(initial.contentJson || {body:''},null,2));
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  const [mediaFile,setMediaFile] = useState(null);
  const [mediaPreview,setMediaPreview] = useState('');
  const [illustrationFile, setIllustrationFile] = useState(null);
  const [illustrationPreview, setIllustrationPreview] = useState('');
  const illustrationInput = useRef(null);
  const illustrationUpload = useRef(null);
  let content; try {content=JSON.parse(raw);} catch {content=null;}
  const update = values => setRaw(JSON.stringify({...content,...values},null,2));
  const mediaType = form.activityType === 'IMAGE' ? 'image' : form.activityType === 'VIDEO' ? 'video' : form.activityType === 'AUDIO' ? 'audio' : null;
  const mediaKey = mediaType === 'image' ? 'imageUrl' : mediaType === 'audio' ? 'audioUrl' : 'videoUrl';
  const canAddIllustration = canIllustrateActivity(form);
  const currentIllustrations = Array.isArray(content?.illustrations)
    ? content.illustrations.filter(figure => figure?.placement === 'inline' && figure.imageUrl)
    : [];
  useEffect(() => {
    if (!mediaFile) { setMediaPreview(''); return undefined; }
    const url = URL.createObjectURL(mediaFile);
    setMediaPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [mediaFile]);
  useEffect(() => {
    if (!illustrationFile) { setIllustrationPreview(''); return undefined; }
    const url = URL.createObjectURL(illustrationFile);
    setIllustrationPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [illustrationFile]);
  useEffect(() => {
    if (!focusIllustration || !illustrationInput.current) return undefined;
    const frame = requestAnimationFrame(() => {
      illustrationInput.current?.focus({ preventScroll: true });
      illustrationInput.current?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusIllustration]);

  function chooseIllustration(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIllustrationFile(null);
    illustrationUpload.current = null;
    if (!isIllustrationFile(file)) {
      setError(bilingualLabel('Chọn ảnh JPG, PNG hoặc WebP tối đa 5 MB.', 'Choose a JPG, PNG, or WebP image up to 5 MB.'));
      event.target.value = '';
      return;
    }
    setError('');
    setIllustrationFile(file);
  }

  function clearIllustrationSelection() {
    setIllustrationFile(null);
    illustrationUpload.current = null;
    if (illustrationInput.current) illustrationInput.current.value = '';
  }

  function chooseMedia(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = mediaType === 'image' ? ['image/jpeg','image/png','image/webp'] : mediaType === 'audio' ? ['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/ogg','audio/mp4'] : ['video/mp4','video/webm'];
    const limit = mediaType === 'image' ? 5 : mediaType === 'audio' ? 20 : 100;
    if (!allowed.includes(file.type) || file.size > limit * 1024 * 1024) {
      setError(bilingualLabel(
        `Chọn ${mediaType === 'image' ? 'ảnh JPG, PNG, WebP (tối đa 5 MB)' : mediaType === 'audio' ? 'âm thanh MP3, WAV, OGG, M4A (tối đa 20 MB)' : 'video MP4, WebM (tối đa 100 MB)'}.`,
        `Choose ${mediaType === 'image' ? 'JPG, PNG, WebP image (max 5 MB)' : mediaType === 'audio' ? 'MP3, WAV, OGG, M4A audio (max 20 MB)' : 'MP4, WebM video (max 100 MB)'}.`
      ));
      setMediaFile(null);
      event.target.value = '';
      return;
    }
    setError('');
    setMediaFile(file);
  }
  const field = (key,label,multiline=false) => <label key={key}><BilingualText>{label}</BilingualText>{multiline ? <textarea rows={4} value={content?.[key]||''} onChange={event=>update({[key]:event.target.value})}/> : <input value={content?.[key]||''} onChange={event=>update({[key]:event.target.value})}/>}</label>;
  const rows = (key,fields,defaults) => <div className="activity-editor-rows">{(content?.[key]||[]).map((row,index)=><div className="activity-editor-row" key={index}><div className="builder-heading"><strong>{index+1}</strong><button type="button" className="admin-btn admin-btn-secondary admin-btn-sm admin-btn-icon" aria-label={bilingualLabel(`Xóa dòng ${index+1}`, `Delete line ${index+1}`)} onClick={()=>update({[key]:content[key].filter((_,i)=>i!==index)})}>×</button></div>{fields.map(([name,label])=><label key={name}><BilingualText>{label}</BilingualText><input value={row[name]||''} onChange={event=>update({[key]:content[key].map((item,i)=>i===index?{...item,[name]:event.target.value}:item)})}/></label>)}</div>)}<button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={()=>update({[key]:[...(content?.[key]||[]),{...defaults}]})}><BilingualText>{"+ Thêm dòng"}</BilingualText></button></div>;
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    onBusyChange?.(true);
    setError('');
    try {
      const payload = Object.fromEntries(['activityType','title','titleVi','instruction','instructionVi','isRequired','status'].map(key=>[key,form[key]]));
      let contentJson = JSON.parse(raw);
      if (illustrationFile) {
        if (!canAddIllustration || !canAppendIllustration(contentJson)) throw new Error(bilingualLabel(
          'Kiểm tra cấu hình của mục nội dung trước khi gắn ảnh.',
          'Check the activity content configuration before attaching the illustration.',
        ));
        let imageUrl = illustrationUpload.current?.url;
        if (!imageUrl) {
          imageUrl = await contentService.uploadLessonMedia(illustrationFile, 'image');
          illustrationUpload.current = { url: imageUrl };
        }
        contentJson = appendInlineIllustration(contentJson, imageUrl);
      }
      if (mediaType) {
        if (form.status === 'PUBLISHED' && !mediaFile && !contentJson[mediaKey]) throw new Error(bilingualLabel(
          `Chọn tệp hoặc nhập URL ${mediaType === 'image' ? 'ảnh' : mediaType === 'audio' ? 'âm thanh' : 'video'}.`,
          `Select a file or enter a ${mediaType === 'image' ? 'image' : mediaType === 'audio' ? 'audio' : 'video'} URL.`
        ));
        if (mediaFile) { contentJson[mediaKey] = await contentService.uploadLessonMedia(mediaFile, mediaType); delete contentJson.pendingFile; }
      }
      Object.assign(payload,{maxScore:Number(form.maxScore),quizId:form.quizId?Number(form.quizId):null,grammarTopicIds:form.grammarTopicIds,contentJson});
      if(initial.id) await contentService.updateActivity(initial.id,payload);else await contentService.addActivity(lessonId,payload);
      onSaved({ addedIllustration: Boolean(illustrationFile) });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }
  return <form className="activity-editor-form" onSubmit={save}>
    <div className="activity-editor-header">
      <h2><BilingualText>{initial.id?'Chỉnh sửa hoạt động':'Hoạt động mới'}</BilingualText></h2>
    </div>
    <div className="activity-editor-field">
      <span className="activity-editor-field-label"><BilingualText>{"Loại hoạt động"}</BilingualText></span>
      <HolaSelect
        disabled={busy}
        value={form.activityType}
        onChange={(val) => {
          setForm({ ...form, activityType: val });
          setMediaFile(null);
          setMediaPreview('');
          clearIllustrationSelection();
        }}
        options={types.map((type) => ({ value: type, label: bilingualLabel(type) }))}
        fullWidth
        align="left"
        ariaLabel={bilingualLabel('Loại hoạt động', 'Activity type')}
      />
    </div>
    <div className="activity-editor-grid-2">
      <label><BilingualText>{"Tiêu đề"}</BilingualText><input required value={form.title} onChange={event=>setForm({...form,title:event.target.value})}/></label>
      <label><BilingualText>{"Tiêu đề tiếng Việt"}</BilingualText><input value={form.titleVi||''} onChange={event=>setForm({...form,titleVi:event.target.value})}/></label>
    </div>
    <div className="activity-editor-grid-2">
      <label><BilingualText>{"Hướng dẫn"}</BilingualText><textarea rows={3} value={form.instruction||''} onChange={event=>setForm({...form,instruction:event.target.value})}/></label>
      <label><BilingualText>{"Hướng dẫn tiếng Việt"}</BilingualText><textarea rows={3} value={form.instructionVi||''} onChange={event=>setForm({...form,instructionVi:event.target.value})}/></label>
    </div>
    {content ? <>
      {form.activityType==='TEXT' && field('body', bilingualLabel('Nội dung bài học', 'Lesson content'), true)}
      {canAddIllustration && <fieldset className="activity-illustration-editor" disabled={busy}>
        <legend><BilingualText vi="Ảnh minh họa trong mục này" en="Illustrations in this activity" /></legend>
        {currentIllustrations.length > 0 && <div className="activity-illustration-editor-gallery">
          {currentIllustrations.map((image, index) => <ContentImage key={`${image.imageUrl}-${index}`} src={image.imageUrl}
            alt={bilingualLabel(image.captionVi || form.titleVi || 'Ảnh minh họa đã gắn', image.captionEn || form.title || 'Attached illustration')} />)}
        </div>}
        <label className="activity-illustration-file-label">
          <BilingualText vi="Chọn ảnh minh họa" en="Choose an illustration" />
          <input ref={illustrationInput} type="file" accept={illustrationFileTypes.join(',')} onChange={chooseIllustration} />
          <small><BilingualText vi="JPG, PNG hoặc WebP tối đa 5 MB. Ảnh sẽ hiện cùng nội dung sau khi lưu." en="JPG, PNG, or WebP up to 5 MB. The image appears alongside the content after you save." /></small>
        </label>
        {illustrationPreview && <div className="activity-illustration-editor-selection">
          <img src={illustrationPreview} alt={bilingualLabel('Xem trước ảnh vừa chọn', 'Selected illustration preview')} />
          <button className="admin-btn admin-btn-secondary admin-btn-sm" type="button" onClick={clearIllustrationSelection}>
            <BilingualText vi="Bỏ ảnh đã chọn" en="Clear selected image" />
          </button>
        </div>}
      </fieldset>}
      {mediaType && <>
        <label><BilingualText vi={mediaType === 'image' ? 'Tải ảnh lên' : mediaType === 'audio' ? 'Tải âm thanh lên' : 'Tải video lên'} en={mediaType === 'image' ? 'Upload image' : mediaType === 'audio' ? 'Upload audio' : 'Upload video'} />
          <input type="file" accept={mediaType === 'image' ? 'image/jpeg,image/png,image/webp' : mediaType === 'audio' ? 'audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/ogg,audio/mp4' : 'video/mp4,video/webm'} disabled={busy} onChange={chooseMedia}/>
          <small><BilingualText vi={`${mediaType === 'image' ? 'JPG, PNG, WebP · tối đa 5 MB' : mediaType === 'audio' ? 'MP3, WAV, OGG, M4A · tối đa 20 MB' : 'MP4, WebM · tối đa 100 MB'} · lưu trên Cloudinary khi lưu hoạt động.${content?.pendingFile ? ` File cần bổ sung: ${content.pendingFile}.` : ''}`} en={`${mediaType === 'image' ? 'JPG, PNG, WebP · max 5 MB' : mediaType === 'audio' ? 'MP3, WAV, OGG, M4A · max 20 MB' : 'MP4, WebM · max 100 MB'} · saved to Cloudinary on activity save.${content?.pendingFile ? ` Required file: ${content.pendingFile}.` : ''}`} /></small>
        </label>
        <label><BilingualText>{mediaType === 'image' ? 'Hoặc URL ảnh' : mediaType === 'audio' ? 'Hoặc URL âm thanh' : 'Hoặc URL video'}</BilingualText>
          <input disabled={busy} value={content?.[mediaKey] || ''} onChange={event=>update({[mediaKey]:event.target.value})}/>
        </label>
        {mediaPreview && (mediaType === 'image'
          ? <img className="lesson-media-upload-preview" src={mediaPreview} alt={bilingualLabel("Xem trước ảnh bài học", "Lesson image preview")}/>
          : mediaType === 'audio' ? <audio className="lesson-media-upload-preview" src={mediaPreview} controls preload="metadata"/> : <video className="lesson-media-upload-preview" src={mediaPreview} controls preload="metadata"/>)}
      </>}
      {['AUDIO','SOUND_PATTERN','LISTENING','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE'].includes(form.activityType) && <>{form.activityType !== 'AUDIO' && field('audioUrl','Đường dẫn âm thanh')}{field('transcriptVi','Lời thoại tiếng Việt',true)}</>}
      {['VOCABULARY','FLASHCARD'].includes(form.activityType) && rows('items',[['wordVi','Từ tiếng Việt'],['meaningEn','Nghĩa tiếng Anh'],['pronunciation','Phiên âm'],['exampleVi','Ví dụ'],['audioUrl','Âm thanh'],['imageUrl','Hình minh họa']],{wordVi:'',meaningEn:''})}
      {form.activityType==='DIALOGUE' && rows('lines',[['speaker','Người nói'],['textVi','Câu tiếng Việt'],['textEn','Bản dịch'],['audioUrl','Âm thanh']],{speaker:'',textVi:'',textEn:''})}
      {exercises.includes(form.activityType) && <>{field('prompt','Câu hỏi',true)}{field('promptVi','Câu hỏi tiếng Việt',true)}<p className="muted"><BilingualText>{"Lựa chọn và cấu hình đáp án nằm trong phần nâng cao bên dưới. Chấm điểm dùng kiểm tra hiện có của hệ thống."}</BilingualText></p></>}
      {form.activityType==='AI_ROLEPLAY' && field('scenarioId','Mã kịch bản nhập vai')}
    </> : <Notice kind="error"><BilingualText>{"Nội dung nâng cao chưa hợp lệ. Chỉnh lại JSON trước khi lưu."}</BilingualText></Notice>}
    <details className="activity-editor-advanced"><summary><BilingualText>{"Cấu hình nội dung nâng cao"}</BilingualText></summary><label><BilingualText>{"Nội dung theo cấu trúc hoạt động"}</BilingualText><textarea className="json-editor" rows={12} value={raw} onChange={event=>setRaw(event.target.value)} spellCheck={false}/></label></details>
    {form.activityType==='QUIZ' && <label><BilingualText>{"Quiz liên kết"}</BilingualText><input type="number" min="1" required value={form.quizId||''} onChange={event=>setForm({...form,quizId:event.target.value})}/><a className="text-link" href="/content/quizzes"><BilingualText>{"Mở danh sách quiz →"}</BilingualText></a></label>}
    {form.activityType==='GRAMMAR' && <label><BilingualText>{"ID chủ đề ngữ pháp (cách nhau bằng dấu phẩy)"}</BilingualText><input value={form.grammarTopicIds.join(',')} onChange={event=>setForm({...form,grammarTopicIds:event.target.value.split(',').map(value=>Number(value.trim())).filter(value=>value>0)})}/></label>}
    <div className="activity-editor-grid-2">
      <label><BilingualText>{"Điểm tối đa"}</BilingualText><input type="number" min="0" required value={form.maxScore} onChange={event=>setForm({...form,maxScore:event.target.value})}/></label>
      <div className="activity-editor-field">
        <span className="activity-editor-field-label"><BilingualText>{"Trạng thái"}</BilingualText></span>
        <HolaSelect
          disabled={busy}
          value={form.status}
          onChange={(val) => setForm({ ...form, status: val })}
          options={['DRAFT', 'PUBLISHED', 'ARCHIVED'].map((status) => ({ value: status, label: bilingualLabel(status) }))}
          fullWidth
          align="left"
          ariaLabel={bilingualLabel('Trạng thái', 'Status')}
        />
      </div>
    </div>
    <label className="checkbox-row"><input type="checkbox" checked={!!form.isRequired} onChange={event=>setForm({...form,isRequired:event.target.checked})}/><BilingualText>{"Bắt buộc"}</BilingualText></label>
    {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}
    <div className="activity-editor-actions">
      <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
        <BilingualText>{busy?'Đang lưu…':'Lưu hoạt động'}</BilingualText>
      </button>
    </div>
  </form>;
}
