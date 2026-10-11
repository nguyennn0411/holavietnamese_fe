import { BilingualText } from '@/components/common/BilingualText';
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
    <p><BilingualText>{"Xóa “"}</BilingualText>{entry.word}<BilingualText>{"” khỏi sổ tay của bạn?"}</BilingualText></p>
    {error && <p role="alert"><BilingualText>{error}</BilingualText></p>}
    <div className="actions">
      <button type="button" className="secondary" disabled={pending} onClick={onClose}><BilingualText>{"Hủy"}</BilingualText></button>
      <button type="button" className="danger" disabled={pending} onClick={remove}><BilingualText>{pending ? 'Đang xóa…' : 'Xóa'}</BilingualText></button>
    </div>
  </Modal>
}
