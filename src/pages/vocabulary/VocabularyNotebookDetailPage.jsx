import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useVocabularyEntry, useVocabularyOptions } from '@/hooks/useVocabulary'
import { ResourceState } from '@/components/common/ResourceState'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { VocabularyForm } from '@/components/vocabulary/VocabularyForm'
import { VocabularyDeleteModal } from '@/components/vocabulary/VocabularyDeleteModal'
import { Modal } from '@/components/common/Modal'
import { VocabularyNotebookPage } from './VocabularyNotebookPage'
import '@/components/vocabulary/vocabulary.css'

export function VocabularyNotebookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const resource = useVocabularyEntry(id)
  const [savedId, setSavedId] = useState(null)

  return <><VocabularyNotebookPage /><section className="vocabulary-detail-page vocabulary-ui vocabulary-notebook-detail">
    <Modal title="Chi tiết từ vựng" onClose={() => navigate(ROUTES.VOCABULARY_NOTEBOOK)}>
    <p className="eyebrow">Những từ bạn đã lưu</p>
    {savedId === id && <p className="success" role="status">Đã lưu từ vựng.</p>}
    <ResourceState resource={resource}>{entry => <NotebookEntryDetails key={entry.id} entry={entry} onSaved={() => { setSavedId(id); resource.reload() }} />}</ResourceState>
    <div className="vocabulary-detail-footer"><Link className="text-link" to={ROUTES.VOCABULARY_NOTEBOOK}>← Về sổ tay</Link></div>
    </Modal>
  </section></>
}

function NotebookEntryDetails({ entry, onSaved }) {
  const navigate = useNavigate()
  const options = useVocabularyOptions()
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const savedAt = entry.createdAt ? new Date(entry.createdAt) : null

  return <>
    <VocabularyCard entry={entry} showDetails={false} onEdit={() => setEditing(true)} onDelete={() => setDeleting(true)} />
    {savedAt && !Number.isNaN(savedAt.getTime()) && <p className="muted">Đã lưu <time dateTime={entry.createdAt}>{savedAt.toLocaleString()}</time></p>}
    {editing && <VocabularyForm entry={entry} lessons={options.data?.lessons || []} lessonOptions={options} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onSaved() }} />}
    {deleting && <VocabularyDeleteModal entry={entry} onClose={() => setDeleting(false)} onDeleted={() => navigate(ROUTES.VOCABULARY_NOTEBOOK, { replace: true, state: { vocabularyMessage: 'Đã xóa từ vựng.' } })} />}
  </>
}
