import { useState } from 'react';
import { Notice } from '@/components/common/Ui';
import { moveItem } from '@/components/learning/answerUtils';
import { ContentImage } from '@/components/common/ContentImage';

const types = ['MULTIPLE_CHOICE','MULTIPLE_SELECT','TRUE_FALSE','FILL_BLANK','MATCHING','LISTENING','TRANSLATION','REORDER_SENTENCE','IMAGE_SELECTION'];
const isText = type => ['FILL_BLANK','TRANSLATION'].includes(type);
export function QuestionForm({ initial = {}, onSave, onCancel }) {
  const snapshot = initial.versions?.[0] || initial;
  const [form,setForm] = useState({questionType:'MULTIPLE_CHOICE',prompt:'',explanation:'',difficulty:'EASY',topic:'',status:'DRAFT',imageUrl:'',audioUrl:'',...initial,...snapshot});
  const [options,setOptions] = useState((snapshot.options || [{id:'a',text:''},{id:'b',text:''},{id:'c',text:''},{id:'d',text:''}]).map(option=>({...option,id:String(option.id),...(option.side?{side:String(option.side).toLowerCase()}:{})})));
  const [correct,setCorrect] = useState(snapshot.correctAnswerJson || snapshot.correctAnswer || {optionIds:[]});
  const [busy,setBusy] = useState(false), [error,setError] = useState('');
  const choice = ['MULTIPLE_CHOICE','MULTIPLE_SELECT','TRUE_FALSE','IMAGE_SELECTION'].includes(form.questionType) || form.questionType==='LISTENING'&&options.length>0;
  const reorder = ['REORDER','REORDER_SENTENCE'].includes(form.questionType);
  const left = options.filter(option=>option.side==='left'), right = options.filter(option=>option.side==='right');
  function changeType(type) {
    setForm({...form,questionType:type});setCorrect({});
    if(isText(type))setOptions([]);
    else if(type==='TRUE_FALSE')setOptions([{id:'true',text:'Đúng'},{id:'false',text:'Sai'}]);
    else if(type==='MATCHING')setOptions([{id:'l1',text:'',side:'left'},{id:'l2',text:'',side:'left'},{id:'r1',text:'',side:'right'},{id:'r2',text:'',side:'right'}]);
    else if(options.length===0)setOptions([{id:'a',text:''},{id:'b',text:''}]);
  }
  function remove(index) {
    const id=options[index].id;setOptions(options.filter((_,i)=>i!==index));
    setCorrect({...correct,optionIds:correct.optionIds?.filter(value=>String(value)!==id),sequence:correct.sequence?.filter(value=>value!==id),pairs:Object.fromEntries(Object.entries(correct.pairs||{}).filter(([key,value])=>key!==id&&value!==id))});
  }
  async function submit(event) {
    event.preventDefault();setBusy(true);setError('');
    try {
      const body=Object.fromEntries(['questionType','prompt','promptVi','explanation','explanationVi','difficulty','topic','status','imageUrl','audioUrl'].map(key=>[key,form[key]||'']));
      body.options=options;body.correctAnswerJson=correct;await onSave(body);
    } catch(err){setError(err.message);}finally{setBusy(false);}
  }
  return <form onSubmit={submit}><div className="form-grid">
    <label>Loại câu hỏi<select value={form.questionType} onChange={event=>changeType(event.target.value)}>{types.map(type=><option key={type}>{type}</option>)}</select></label>
    <label>Độ khó<select value={form.difficulty} onChange={event=>setForm({...form,difficulty:event.target.value})}>{['EASY','MEDIUM','HARD'].map(type=><option key={type}>{type}</option>)}</select></label>
    <label className="full-width">Nội dung câu hỏi<textarea required rows={3} value={form.prompt} onChange={event=>setForm({...form,prompt:event.target.value})}/></label>
    <label className="full-width">Câu hỏi tiếng Việt<textarea rows={2} value={form.promptVi||''} onChange={event=>setForm({...form,promptVi:event.target.value})}/></label>
    <label>Chủ đề<input value={form.topic||''} onChange={event=>setForm({...form,topic:event.target.value})}/></label>
    <label>Trạng thái<select value={form.status} onChange={event=>setForm({...form,status:event.target.value})}>{['DRAFT','PUBLISHED','ARCHIVED'].map(type=><option key={type}>{type}</option>)}</select></label>
    <label>Đường dẫn âm thanh<input value={form.audioUrl||''} placeholder="/media/… hoặc https://…" onChange={event=>setForm({...form,audioUrl:event.target.value})}/></label>
    <label>Đường dẫn hình ảnh<input value={form.imageUrl||''} placeholder="/media/… hoặc https://…" onChange={event=>setForm({...form,imageUrl:event.target.value})}/></label>
  </div>
  {form.imageUrl && <ContentImage src={form.imageUrl} className="question-media" alt={form.promptVi || form.prompt || 'Ảnh câu hỏi'} />}
  {!isText(form.questionType) && <>
    <h3>{reorder?'Các từ cần sắp xếp':'Các lựa chọn'}</h3>
    {options.map((option,index)=><div className="question-editor-option" key={option.id}><span>{option.id.toUpperCase()}</span><input aria-label={`Lựa chọn ${index+1}`} required value={option.text||''} onChange={event=>setOptions(options.map((item,i)=>i===index?{...item,text:event.target.value}:item))}/>
      {form.questionType==='MATCHING' && <select aria-label={`Cột lựa chọn ${index+1}`} value={option.side||'left'} onChange={event=>setOptions(options.map((item,i)=>i===index?{...item,side:event.target.value}:item))}><option value="left">Trái</option><option value="right">Phải</option></select>}
      {choice&&<label className="checkbox-row"><input type={form.questionType==='MULTIPLE_SELECT'?'checkbox':'radio'} name="correct-options" aria-label={`Đáp án đúng ${index+1}`} checked={correct.optionIds?.map(String).includes(option.id)||false} onChange={event=>setCorrect({optionIds:form.questionType==='MULTIPLE_SELECT'?event.target.checked?[...(correct.optionIds||[]),option.id]:(correct.optionIds||[]).filter(id=>id!==option.id):[option.id]})}/>Đúng</label>}
      <button className="secondary" type="button" aria-label={`Xóa lựa chọn ${index+1}`} onClick={()=>remove(index)}>×</button>
      {!reorder && <details className="option-media-editor"><summary>Hình ảnh & âm thanh của lựa chọn {index+1}</summary>
        <label>URL hình ảnh<input value={option.imageUrl||''} placeholder="/media/… hoặc https://…" onChange={event=>setOptions(options.map((item,i)=>i===index?{...item,imageUrl:event.target.value}:item))}/></label>
        <label>URL âm thanh<input value={option.audioUrl||''} placeholder="/media/… hoặc https://…" onChange={event=>setOptions(options.map((item,i)=>i===index?{...item,audioUrl:event.target.value}:item))}/></label>
        {option.imageUrl && <ContentImage className="option-image" src={option.imageUrl} alt={option.text || `Lựa chọn ${index+1}`}/>}
      </details>}
    </div>)}
    <div className="actions"><button type="button" className="secondary" onClick={()=>setOptions([...options,{id:`option-${Date.now()}`,text:'',...(form.questionType==='MATCHING'?{side:'left'}:{})}])}>+ Thêm lựa chọn</button>{form.questionType==='LISTENING'&&<button type="button" className="secondary" onClick={()=>{setOptions([]);setCorrect({acceptedAnswers:[]});}}>Trả lời bằng văn bản</button>}</div>
  </>}
  {(isText(form.questionType)||form.questionType==='LISTENING'&&!options.length) && <label className="builder-status">Các đáp án chấp nhận (mỗi dòng một đáp án)<textarea required value={(correct.acceptedAnswers||[]).join('\n')} onChange={event=>setCorrect({...correct,acceptedAnswers:event.target.value.split('\n')})}/><span className="checkbox-row"><input type="checkbox" checked={!!correct.caseSensitive} onChange={event=>setCorrect({...correct,caseSensitive:event.target.checked})}/>Phân biệt chữ hoa, chữ thường</span></label>}
  {reorder && <div className="builder-status"><h3>Thứ tự đúng</h3><button type="button" className="secondary" onClick={()=>setCorrect({sequence:options.map(option=>option.id)})}>Dùng thứ tự lựa chọn hiện tại</button>{(correct.sequence||[]).map((id,index)=><div className="list-row" key={id}><span>{options.find(option=>String(option.id)===String(id))?.text||id}</span><div className="actions"><button type="button" className="secondary" disabled={index===0} aria-label={`Đưa từ ${index+1} lên`} onClick={()=>setCorrect({sequence:moveItem(correct.sequence,index,-1)})}>↑</button><button type="button" className="secondary" disabled={index===correct.sequence.length-1} aria-label={`Đưa từ ${index+1} xuống`} onClick={()=>setCorrect({sequence:moveItem(correct.sequence,index,1)})}>↓</button></div></div>)}</div>}
  {form.questionType==='MATCHING' && <div className="builder-status"><h3>Ghép đáp án đúng</h3>{left.map(option=><label key={option.id}>{option.text || option.id}<select required value={correct.pairs?.[option.id]||''} onChange={event=>setCorrect({pairs:{...correct.pairs,[option.id]:event.target.value}})}><option value="">Chọn đáp án</option>{right.map(item=><option key={item.id} value={item.id}>{item.text || item.id}</option>)}</select></label>)}</div>}
  <label className="builder-status">Giải thích đáp án<textarea rows={3} value={form.explanation||''} onChange={event=>setForm({...form,explanation:event.target.value})}/></label>
  <label>Giải thích tiếng Việt<textarea rows={2} value={form.explanationVi||''} onChange={event=>setForm({...form,explanationVi:event.target.value})}/></label>
  {initial.versions?.length>0&&<Notice>Phiên bản hiện tại v{initial.currentVersion}. Khi sửa, hệ thống tạo phiên bản mới; các lượt làm bài cũ giữ nguyên nội dung gốc.</Notice>}
  {error&&<Notice kind="error">{error}</Notice>}
  <div className="form-actions actions"><button className="secondary" type="button" disabled={busy} onClick={onCancel}>Hủy</button><button disabled={busy}>{busy?'Đang lưu…':'Lưu câu hỏi'}</button></div></form>;
}

