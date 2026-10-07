import { useRef, useState } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import { Modal } from '@/components/common/Modal'

export function VocabularyDeleteModal({ entry, onClose, onDeleted }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const submitting = useRef(false)

  async function remove() {
    if (submitting.current) return
    submitting.current = true; setPending(true); setError('')
    try {
      await vocabularyService.delete(entry.id)
      onDeleted()
    } catch (e) { setError(e.message) }
    finally { submitting.current = false; setPending(false) }
  }

  return <Modal title="Xóa từ vựng?" busy={pending} onClose={onClose}>
    <p>Xóa “{entry.word}” khỏi sổ tay của bạn?</p>
    {error && <p role="alert">{error}</p>}
    <div className="actions">
      <button type="button" className="secondary" disabled={pending} onClick={onClose}>Hủy</button>
      <button type="button" className="danger" disabled={pending} onClick={remove}>{pending ? 'Đang xóa…' : 'Xóa'}</button>
    </div>
  </Modal>
}
