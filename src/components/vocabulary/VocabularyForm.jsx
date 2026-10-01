import { useState } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import { Modal } from '@/components/common/Modal'
export function VocabularyForm({ entry, lessonId = null, lessons = [], onSaved, onClose }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function submit(event) {
    event.preventDefault(); setPending(true); setError('')
    const form = new FormData(event.currentTarget)
    const selectedLesson = form.get('lessonId')
    const data = { lessonId: lessonId ?? (selectedLesson ? Number(selectedLesson) : null),
      ...Object.fromEntries(['word', 'meaning', 'pronunciation', 'exampleSentence', 'note'].map(key => [key, form.get(key)])) }
    try {
      if (entry) await vocabularyService.update(entry.id, data)
      else await vocabularyService.add(data)
      onSaved()
    } catch (e) { setError(e.message) } finally { setPending(false) }
  }
  return <Modal title={entry ? 'Edit vocabulary' : 'Save vocabulary'} onClose={onClose} busy={pending}><form onSubmit={submit}>
    <label>Word<input name="word" defaultValue={entry?.word || ''} required maxLength={200} autoFocus lang="vi" /></label>
    <label>Meaning<textarea name="meaning" defaultValue={entry?.meaning || ''} required maxLength={1000} rows={2} /></label>
    <label>Pronunciation<input name="pronunciation" defaultValue={entry?.pronunciation || ''} maxLength={200} /></label>
    <label>Example sentence<textarea name="exampleSentence" defaultValue={entry?.exampleSentence || ''} maxLength={2000} rows={2} lang="vi" /></label>
    <label>Note<textarea name="note" defaultValue={entry?.note || ''} maxLength={2000} rows={2} /></label>
    {lessonId == null && <label>Lesson (optional)<select name="lessonId" defaultValue={entry?.lessonId || ''}><option value="">Personal vocabulary</option>
      {entry?.lessonId && !lessons.some(l => l.id === entry.lessonId) && <option value={entry.lessonId}>{entry.lessonTitle}</option>}
      {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></label>}
    {error && <p role="alert">{error}</p>}<div className="actions"><button type="button" className="secondary" onClick={onClose} disabled={pending}>Cancel</button><button disabled={pending}>{pending ? 'Saving…' : 'Save vocabulary'}</button></div>
  </form></Modal>
}
