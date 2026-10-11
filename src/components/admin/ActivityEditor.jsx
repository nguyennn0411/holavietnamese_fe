import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState } from 'react';
import { contentService } from '@/services/contentService';
import { Notice } from '@/components/common/Ui';

const types = ['TEXT','IMAGE','AUDIO','VIDEO','VOCABULARY','FLASHCARD','DIALOGUE','GRAMMAR','SOUND_PATTERN','MULTIPLE_CHOICE','FILL_BLANK','MATCHING','REORDER_SENTENCE','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE','LISTENING','TRANSLATION','PRACTICE','QUIZ','PRONUNCIATION','AI_CONVERSATION','AI_ROLEPLAY'];
const exercises = ['MULTIPLE_CHOICE','FILL_BLANK','MATCHING','REORDER_SENTENCE','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE','LISTENING','TRANSLATION','PRACTICE'];

export function ActivityEditor({ initial, lessonId, onSaved }) {
  const [form,setForm] = useState({activityType:'TEXT',title:'',instruction:'',isRequired:true,maxScore:0,status:'DRAFT',quizId:null,...initial,grammarTopicIds:initial.grammarTopicIds || initial.grammarTopics?.map(topic=>topic.id) || []});
  const [raw,setRaw] = useState(typeof initial.contentJson==='string' ? initial.contentJson : JSON.stringify(initial.contentJson || {body:''},null,2));
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  let content; try {content=JSON.parse(raw);} catch {content=null;}
  const update = values => setRaw(JSON.stringify({...content,...values},null,2));
  const field = (key,label,multiline=false) => <label key={key}><BilingualText>{label}</BilingualText>{multiline ? <textarea rows={4} value={content?.[key]||''} onChange={event=>update({[key]:event.target.value})}/> : <input value={content?.[key]||''} onChange={event=>update({[key]:event.target.value})}/>}</label>;
  const rows = (key,fields,defaults) => <div className="activity-editor-rows">{(content?.[key]||[]).map((row,index)=><div className="activity-editor-row" key={index}><div className="builder-heading"><strong>{index+1}</strong><button type="button" className="secondary" aria-label={`Xóa dòng ${index+1}`} onClick={()=>update({[key]:content[key].filter((_,i)=>i!==index)})}>×</button></div>{fields.map(([name,label])=><label key={name}><BilingualText>{label}</BilingualText><input value={row[name]||''} onChange={event=>update({[key]:content[key].map((item,i)=>i===index?{...item,[name]:event.target.value}:item)})}/></label>)}</div>)}<button type="button" className="secondary" onClick={()=>update({[key]:[...(content?.[key]||[]),{...defaults}]})}><BilingualText>{"+ Thêm dòng"}</BilingualText></button></div>;
  async function save(event) {
    event.preventDefault();setBusy(true);setError('');
    try {
      const payload = Object.fromEntries(['activityType','title','titleVi','instruction','instructionVi','isRequired','status'].map(key=>[key,form[key]]));
      Object.assign(payload,{maxScore:Number(form.maxScore),quizId:form.quizId?Number(form.quizId):null,grammarTopicIds:form.grammarTopicIds,contentJson:JSON.parse(raw)});
      if(initial.id) await contentService.updateActivity(initial.id,payload);else await contentService.addActivity(lessonId,payload);
      onSaved();
    } catch(err){setError(err.message);}finally{setBusy(false);}
  }
  return <form onSubmit={save}><h2><BilingualText>{initial.id?'Chỉnh sửa hoạt động':'Hoạt động mới'}</BilingualText></h2>
    <label><BilingualText>{"Loại hoạt động"}</BilingualText><select value={form.activityType} onChange={event=>setForm({...form,activityType:event.target.value})}>{types.map(type=><option key={type} value={type}>{bilingualLabel(type)}</option>)}</select></label>
    <label><BilingualText>{"Tiêu đề"}</BilingualText><input required value={form.title} onChange={event=>setForm({...form,title:event.target.value})}/></label>
    <label><BilingualText>{"Tiêu đề tiếng Việt"}</BilingualText><input value={form.titleVi||''} onChange={event=>setForm({...form,titleVi:event.target.value})}/></label>
    <label><BilingualText>{"Hướng dẫn"}</BilingualText><textarea value={form.instruction||''} onChange={event=>setForm({...form,instruction:event.target.value})}/></label>
    <label><BilingualText>{"Hướng dẫn tiếng Việt"}</BilingualText><textarea value={form.instructionVi||''} onChange={event=>setForm({...form,instructionVi:event.target.value})}/></label>
    {content ? <>
      {form.activityType==='TEXT' && field('body','Nội dung bài học',true)}
      {['IMAGE','VIDEO'].includes(form.activityType) && field(form.activityType==='IMAGE'?'imageUrl':'videoUrl','Đường dẫn nội dung')}
      {['AUDIO','SOUND_PATTERN','LISTENING','LISTEN_AND_CHOOSE','LISTEN_AND_TYPE'].includes(form.activityType) && <>{field('audioUrl','Đường dẫn âm thanh')}{field('transcriptVi','Lời thoại tiếng Việt',true)}</>}
      {['VOCABULARY','FLASHCARD'].includes(form.activityType) && rows('items',[['wordVi','Từ tiếng Việt'],['meaningEn','Nghĩa tiếng Anh'],['pronunciation','Phiên âm'],['exampleVi','Ví dụ'],['audioUrl','Âm thanh'],['imageUrl','Hình minh họa']],{wordVi:'',meaningEn:''})}
      {form.activityType==='DIALOGUE' && rows('lines',[['speaker','Người nói'],['textVi','Câu tiếng Việt'],['textEn','Bản dịch'],['audioUrl','Âm thanh']],{speaker:'',textVi:'',textEn:''})}
      {exercises.includes(form.activityType) && <>{field('prompt','Câu hỏi',true)}{field('promptVi','Câu hỏi tiếng Việt',true)}<p className="muted"><BilingualText>{"Lựa chọn và cấu hình đáp án nằm trong phần nâng cao bên dưới. Chấm điểm dùng kiểm tra hiện có của hệ thống."}</BilingualText></p></>}
      {form.activityType==='AI_ROLEPLAY' && field('scenarioId','Mã kịch bản nhập vai')}
    </> : <Notice kind="error"><BilingualText>{"Nội dung nâng cao chưa hợp lệ. Chỉnh lại JSON trước khi lưu."}</BilingualText></Notice>}
    <details className="activity-editor-advanced"><summary><BilingualText>{"Cấu hình nội dung nâng cao"}</BilingualText></summary><label><BilingualText>{"Nội dung theo cấu trúc hoạt động"}</BilingualText><textarea className="json-editor" rows={12} value={raw} onChange={event=>setRaw(event.target.value)} spellCheck={false}/></label></details>
    {form.activityType==='QUIZ' && <label><BilingualText>{"Quiz liên kết"}</BilingualText><input type="number" min="1" required value={form.quizId||''} onChange={event=>setForm({...form,quizId:event.target.value})}/><a className="text-link" href="/admin/quizzes"><BilingualText>{"Mở danh sách quiz →"}</BilingualText></a></label>}
    {form.activityType==='GRAMMAR' && <label><BilingualText>{"ID chủ đề ngữ pháp (cách nhau bằng dấu phẩy)"}</BilingualText><input value={form.grammarTopicIds.join(',')} onChange={event=>setForm({...form,grammarTopicIds:event.target.value.split(',').map(value=>Number(value.trim())).filter(value=>value>0)})}/></label>}
    <label><BilingualText>{"Điểm tối đa"}</BilingualText><input type="number" min="0" required value={form.maxScore} onChange={event=>setForm({...form,maxScore:event.target.value})}/></label>
    <label><BilingualText>{"Trạng thái"}</BilingualText><select value={form.status} onChange={event=>setForm({...form,status:event.target.value})}>{['DRAFT','PUBLISHED','ARCHIVED'].map(status=><option key={status} value={status}>{bilingualLabel(status)}</option>)}</select></label>
    <label className="checkbox-row"><input type="checkbox" checked={!!form.isRequired} onChange={event=>setForm({...form,isRequired:event.target.checked})}/><BilingualText>{"Bắt buộc"}</BilingualText></label>
    {error && <Notice kind="error"><BilingualText>{error}</BilingualText></Notice>}<button disabled={busy}><BilingualText>{busy?'Đang lưu…':'Lưu hoạt động'}</BilingualText></button>
  </form>;
}
