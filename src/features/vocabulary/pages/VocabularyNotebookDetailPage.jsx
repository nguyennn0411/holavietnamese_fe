import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useVocabularyEntry, useVocabularyOptions } from '@/features/vocabulary/hooks/useVocabulary'
import { ResourceState } from '@/shared/components/common/ResourceState'
import { VocabularyCard } from '@/features/vocabulary/components/VocabularyCard'
import { VocabularyForm } from '@/features/vocabulary/components/VocabularyForm'
import { VocabularyDeleteModal } from '@/features/vocabulary/components/VocabularyDeleteModal'
import { Modal } from '@/shared/components/common/Modal'
import { VocabularyNotebookPage } from '@/features/vocabulary/pages/VocabularyNotebookPage'
import '@/features/vocabulary/components/vocabulary.css'

export function VocabularyNotebookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const resource = useVocabularyEntry(id)
  const [savedId, setSavedId] = useState(null)

  return <><VocabularyNotebookPage /><section className="vocabulary-detail-page vocabulary-ui vocabulary-notebook-detail">
    <Modal title={bilingualLabel("Chi tiết từ vựng", "Vocabulary details")} onClose={() => navigate(ROUTES.VOCABULARY_NOTEBOOK)}>
    <p className="eyebrow"><BilingualText>{"Những từ bạn đã lưu"}</BilingualText></p>
    {savedId === id && <p className="success" role="status"><BilingualText>{"Đã lưu từ vựng."}</BilingualText></p>}
    <ResourceState resource={resource}>{entry => <NotebookEntryDetails key={entry.id} entry={entry} onSaved={() => { setSavedId(id); resource.reload() }} />}</ResourceState>
    <div className="vocabulary-detail-footer"><Link className="text-link" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{"← Về sổ tay"}</BilingualText></Link></div>
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
    {savedAt && !Number.isNaN(savedAt.getTime()) && <p className="muted"><BilingualText>{"Đã lưu"}</BilingualText><time dateTime={entry.createdAt}>{savedAt.toLocaleString()}</time></p>}
    {editing && <VocabularyForm entry={entry} lessons={options.data?.lessons || []} lessonOptions={options} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); onSaved() }} />}
    {deleting && <VocabularyDeleteModal entry={entry} onClose={() => setDeleting(false)} onDeleted={() => navigate(ROUTES.VOCABULARY_NOTEBOOK, { replace: true, state: { vocabularyMessage: 'Đã xóa từ vựng.' } })} />}
  </>
}
