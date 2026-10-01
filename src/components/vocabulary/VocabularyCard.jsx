export function VocabularyCard({ entry, onEdit, onDelete }) {
  return <article className="card vocabulary-card"><p className="eyebrow">{entry.courseTitle || 'Personal vocabulary'}</p><h2 lang="vi">{entry.word}</h2><p className="meaning preserve-lines">{entry.meaning}</p>
    {entry.pronunciation && <p><span className="muted">Pronunciation</span><br />{entry.pronunciation}</p>}
    {entry.exampleSentence && <blockquote lang="vi" className="preserve-lines">{entry.exampleSentence}</blockquote>}
    {entry.note && <p className="preserve-lines">{entry.note}</p>}{entry.lessonTitle && <p className="muted">Lesson: {entry.lessonTitle}</p>}
    <div className="actions"><button className="secondary" onClick={() => onEdit(entry)}>Edit</button><button className="danger secondary" onClick={() => onDelete(entry)}>Delete</button></div></article>
}
