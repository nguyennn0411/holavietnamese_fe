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

  return <Modal title="Delete vocabulary?" busy={pending} onClose={onClose}>
    <p>Delete “{entry.word}” from your notebook?</p>
    {error && <p role="alert">{error}</p>}
    <div className="actions">
      <button type="button" className="secondary" disabled={pending} onClick={onClose}>Cancel</button>
      <button type="button" className="danger" disabled={pending} onClick={remove}>{pending ? 'Deleting…' : 'Delete'}</button>
    </div>
  </Modal>
}
