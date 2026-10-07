import { moveItem } from './answerUtils';
import { ContentImage } from '@/components/common/ContentImage';
import { MediaPlayer } from './MediaPlayer';

export function QuestionInput({ question, answer = {}, onChange, disabled = false }) {
  const type = question.questionType || 'FILL_BLANK', options = question.options || [];
  const choice = ['MULTIPLE_CHOICE','MULTIPLE_SELECT','TRUE_FALSE','IMAGE_SELECTION'].includes(type) || (type === 'LISTENING' && options.length > 0);
  if (choice) return <div className="question-options">{options.map((option, index) => {
    const selected = (answer?.optionIds || []).map(String).includes(String(option.id));
    return <label className={`question-option ${selected ? 'selected' : ''}`} key={option.id}><input type={type === 'MULTIPLE_SELECT' ? 'checkbox' : 'radio'} name={`question-${question.questionId || question.id || 'activity'}`} disabled={disabled} checked={selected} onChange={() => onChange({ optionIds: type === 'MULTIPLE_SELECT' ? selected ? answer.optionIds.filter(id => String(id) !== String(option.id)) : [...(answer?.optionIds || []), option.id] : [option.id] })} /><span className="option-letter">{String.fromCharCode(65 + index)}</span><span className="question-option-content">{option.imageUrl && <ContentImage className="option-image" src={option.imageUrl} alt={option.textVi || option.text || option.textEn || `Lựa chọn ${index + 1}`} />}{option.textVi || option.text || option.textEn}{option.audioUrl && <MediaPlayer audioUrl={option.audioUrl} />}</span></label>;
  })}</div>;
  if (['REORDER','REORDER_SENTENCE'].includes(type)) {
    const sequence = answer?.sequence || [];
    return <div className="reorder-question"><div className="reorder-answer">{sequence.length ? sequence.map((id, index) => <button className="secondary" disabled={disabled} key={id} onClick={() => onChange({ sequence: sequence.filter(value => value !== id) })}>{options.find(option => String(option.id) === String(id))?.textVi || options.find(option => String(option.id) === String(id))?.text || id} <span aria-hidden="true">×</span></button>) : <p className="muted">Chọn các từ theo thứ tự.</p>}</div><div className="actions">{options.filter(option => !sequence.map(String).includes(String(option.id))).map(option => <button className="secondary" key={option.id} disabled={disabled} onClick={() => onChange({ sequence: [...sequence, option.id] })}>{option.textVi || option.text || option.textEn}</button>)}</div>{sequence.length>1 && <div className="reorder-controls">{sequence.map((id,index)=><div key={id}><span>{index+1}</span><button className="secondary" disabled={disabled||index===0} aria-label={`Đưa từ ${index+1} lên`} onClick={()=>onChange({sequence:moveItem(sequence,index,-1)})}>↑</button><button className="secondary" disabled={disabled||index===sequence.length-1} aria-label={`Đưa từ ${index+1} xuống`} onClick={()=>onChange({sequence:moveItem(sequence,index,1)})}>↓</button></div>)}</div>}</div>;
  }
  if (type === 'MATCHING') {
    const left = options.filter(option => String(option.side).toUpperCase() === 'LEFT'), right = options.filter(option => String(option.side).toUpperCase() === 'RIGHT');
    const targets = right.length ? right : options;
    return <div className="matching-question">
      {targets.some(option => option.imageUrl || option.audioUrl) && <div className="matching-media-options">{targets.map((option,index) => <div className="card" key={option.id}><strong>{option.textVi || option.text || option.textEn || `Lựa chọn ${index+1}`}</strong><OptionMedia option={option} index={index}/></div>)}</div>}
      {(left.length ? left : options).map((option,index) => <label key={option.id}><span>{option.textVi || option.text || option.textEn || `Mục ${index+1}`}</span><OptionMedia option={option} index={index}/><select disabled={disabled} value={answer?.pairs?.[option.id] || ''} onChange={event => onChange({ pairs: { ...(answer?.pairs || {}), [option.id]: event.target.value } })}><option value="">Chọn cặp tương ứng</option>{targets.filter(item=>item.id!==option.id).map((item,i) => <option key={item.id} value={item.id}>{item.textVi || item.text || item.textEn || `Lựa chọn ${i+1}`}</option>)}</select></label>)}
    </div>;
  }
  return <label className="text-answer">Câu trả lời của bạn<textarea rows={3} disabled={disabled} value={typeof answer === 'string' ? answer : answer?.text || ''} onChange={event => onChange({ text: event.target.value })} placeholder="Nhập câu trả lời…" /></label>;
}

function OptionMedia({ option, index }) {
  return <>{option.imageUrl && <ContentImage className="option-image" src={option.imageUrl} alt={option.textVi || option.text || option.textEn || `Lựa chọn ${index+1}`} />}{option.audioUrl && <MediaPlayer audioUrl={option.audioUrl} />}</>;
}
