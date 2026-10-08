import { useRef, useState } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import { Modal } from '@/components/common/Modal'
export function VocabularyForm({ entry, lessonId = null, lessons = [], lessonOptions, onSaved, onClose }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const submitting = useRef(false)
  async function submit(event) {
    event.preventDefault()
    if (submitting.current) return
    const form = new FormData(event.currentTarget)
    const selectedLesson = form.get('lessonId')
    const data = { lessonId: lessonId ?? (selectedLesson ? Number(selectedLesson) : null),
      ...Object.fromEntries(['word', 'meaning', 'pronunciation', 'exampleSentence', 'note'].map(key => [key, form.get(key)])) }
    submitting.current = true; setPending(true); setError('')
    try {
      const saved = entry ? await vocabularyService.update(entry.id, data) : await vocabularyService.add(data)
      onSaved(saved)
    } catch (e) { setError(e.message) } finally { submitting.current = false; setPending(false) }
  }
  return <Modal title={entry ? 'Chỉnh sửa từ vựng' : 'Lưu từ vựng'} onClose={onClose} busy={pending}><form className="vocabulary-notebook-form" onSubmit={submit}>
    <label>Từ tiếng Việt<input name="word" defaultValue={entry?.word || ''} required maxLength={200} autoFocus lang="vi" disabled={pending} /></label>
    <label>Nghĩa<textarea name="meaning" defaultValue={entry?.meaning || ''} required maxLength={1000} rows={2} disabled={pending} /></label>
    <label>Phát âm<input name="pronunciation" defaultValue={entry?.pronunciation || ''} maxLength={200} disabled={pending} /></label>
    <label>Câu ví dụ<textarea name="exampleSentence" defaultValue={entry?.exampleSentence || ''} maxLength={2000} rows={2} lang="vi" disabled={pending} /></label>
    <label>Ghi chú<textarea name="note" defaultValue={entry?.note || ''} maxLength={2000} rows={2} disabled={pending} /></label>
    {lessonId == null && <label>Bài học (không bắt buộc)<select name="lessonId" defaultValue={entry?.lessonId || ''} disabled={pending}><option value="">Từ vựng cá nhân</option>
      {entry?.lessonId && !lessons.some(l => l.id === entry.lessonId) && <option value={entry.lessonId}>{entry.lessonTitle}</option>}
      {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}</select></label>}
    {lessonId == null && lessonOptions?.loading && <p className="muted" role="status">Đang tải danh sách bài học…</p>}
    {lessonId == null && lessonOptions?.error && <p role="alert">Không thể tải danh sách bài học. <button type="button" className="secondary" disabled={pending} onClick={lessonOptions.reload}>Thử lại</button></p>}
    {error && <p role="alert">{error}</p>}<div className="actions"><button type="button" className="secondary" onClick={onClose} disabled={pending}>Hủy</button><button disabled={pending}>{pending ? 'Đang lưu…' : 'Lưu từ vựng'}</button></div>
  </form></Modal>
}
