import { generatePath, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { SpeakButton } from '@/components/common/Ui'
export function VocabularyCard({ entry, onEdit, onDelete, showDetails = true }) {
  return <article className="card vocabulary-card"><span className="vocabulary-saved-marker vocabulary-icon vocabulary-icon--bookmark" role="img" aria-label="Đã lưu vào sổ tay" /><p className="eyebrow">{entry.courseTitle || 'Từ đã lưu'}</p><div className="row"><h2 lang="vi">{showDetails ? <Link className="vocabulary-word-link" to={generatePath(ROUTES.VOCABULARY_NOTEBOOK_DETAIL, { id: String(entry.id) })}>{entry.word}</Link> : entry.word}</h2></div><p className="meaning preserve-lines">{entry.meaning}</p>
    {entry.pronunciation && <p className="vocabulary-card-pronunciation"><span className="muted">Phát âm</span><br />{entry.pronunciation}</p>}
    {entry.exampleSentence && <blockquote lang="vi" className="preserve-lines">{entry.exampleSentence}</blockquote>}
    {entry.note && <p className="preserve-lines vocabulary-card-note">{entry.note}</p>}{entry.lessonTitle && <p className="muted vocabulary-card-lesson">Bài học: {entry.lessonTitle}</p>}
    <div className="vocabulary-card-audio"><SpeakButton text={entry.word} audioUrl={entry.audioUrl} /></div>
    <div className="actions">{showDetails && <Link className="button secondary" to={generatePath(ROUTES.VOCABULARY_NOTEBOOK_DETAIL, { id: String(entry.id) })}>Xem chi tiết</Link>}<button className="secondary" onClick={() => onEdit(entry)}>Sửa</button><button className="danger secondary" onClick={() => onDelete(entry)}>Xóa</button></div></article>
}
