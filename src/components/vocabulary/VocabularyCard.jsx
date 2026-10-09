import { BilingualText } from '@/components/common/BilingualText';
import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { SpeakButton } from '@/components/common/Ui'
export function VocabularyCard({ entry, onEdit, onDelete, showDetails = true }) {
  return <article className="card vocabulary-card"><span className="vocabulary-saved-marker vocabulary-icon vocabulary-icon--bookmark" role="img" aria-label="Đã lưu vào sổ tay" /><p className="eyebrow"><BilingualText>{entry.courseTitle || 'Từ đã lưu'}</BilingualText></p><div className="row"><h2 lang="vi">{showDetails ? <Link className="vocabulary-word-link" to={generatePath(ROUTES.VOCABULARY_NOTEBOOK_DETAIL, { id: String(entry.id) })}>{entry.word}</Link> : entry.word}</h2></div><p className="meaning preserve-lines">{entry.meaning}</p>
    {entry.pronunciation && <p className="vocabulary-card-pronunciation"><span className="muted"><BilingualText>{"Phát âm"}</BilingualText></span><br />{entry.pronunciation}</p>}
    {entry.exampleSentence && <blockquote lang="vi" className="preserve-lines">{entry.exampleSentence}</blockquote>}
    {entry.note && <p className="preserve-lines vocabulary-card-note">{entry.note}</p>}{entry.lessonTitle && <p className="muted vocabulary-card-lesson"><BilingualText>{"Bài học:"}</BilingualText>{entry.lessonTitle}</p>}
    <div className="vocabulary-card-audio"><SpeakButton text={entry.word} audioUrl={entry.audioUrl} /></div>
    <div className="actions">{showDetails && <Link className="button secondary" to={generatePath(ROUTES.VOCABULARY_NOTEBOOK_DETAIL, { id: String(entry.id) })}><BilingualText>{"Xem chi tiết"}</BilingualText></Link>}<button className="secondary" onClick={() => onEdit(entry)}><BilingualText>{"Sửa"}</BilingualText></button><button className="danger secondary" onClick={() => onDelete(entry)}><BilingualText>{"Xóa"}</BilingualText></button></div></article>
}
