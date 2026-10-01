import { useState } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import { useVocabulary, useVocabularyOptions } from '@/hooks/useVocabulary'
import { ResourceState } from '@/components/common/ResourceState'
import { Modal } from '@/components/common/Modal'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { VocabularyForm } from '@/components/vocabulary/VocabularyForm'
import { VocabularySearch } from '@/components/vocabulary/VocabularySearch'
import { VocabularyFilter } from '@/components/vocabulary/VocabularyFilter'
export function VocabularyNotebookPage() {
  const [search, setSearch] = useState(''), [courseId, setCourseId] = useState(''), [lessonId, setLessonId] = useState('')
  const [editing, setEditing] = useState(null), [deleting, setDeleting] = useState(null)
  const [pending, setPending] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('')
  const resource = useVocabulary({ search, courseId, lessonId })
  const options = useVocabularyOptions()
  async function remove() {
    setPending(true); setError('')
    try { await vocabularyService.delete(deleting.id); setDeleting(null); setMessage('Vocabulary deleted.'); resource.reload() }
    catch (e) { setError(e.message) } finally { setPending(false) }
  }
  return <section><div className="row"><div><p className="eyebrow">Words worth keeping</p><h1>Vocabulary Notebook</h1></div><button onClick={() => setEditing({})}>+ Add vocabulary</button></div>
    <p className="lead">Collect useful words. Make them part of your everyday Vietnamese.</p>
    <div className="filters"><VocabularySearch value={search} onChange={setSearch} />
      {options.data && <VocabularyFilter {...options.data} courseId={courseId} lessonId={lessonId} onCourseChange={id => { setCourseId(id); setLessonId('') }} onLessonChange={setLessonId} />}
    </div>
    {options.error && <p role="alert">Course filters could not be loaded. <button className="secondary" onClick={options.reload}>Retry filters</button></p>}
    {message && <p className="success" role="status">{message}</p>}
    <ResourceState resource={resource}>{entries => entries.length
      ? <div className="card-grid">{entries.map(entry => <VocabularyCard key={entry.id} entry={entry} onEdit={setEditing} onDelete={entry => { setError(''); setDeleting(entry) }} />)}</div>
      : <div className="state"><h2>{search || courseId || lessonId ? 'No matching vocabulary' : 'Your notebook is ready'}</h2><p>{search || courseId || lessonId ? 'Try another search or clear your filters.' : 'Save your first word here or while studying a lesson.'}</p></div>}</ResourceState>
    {editing && <VocabularyForm entry={editing.id ? editing : null} lessons={options.data?.lessons || []} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Vocabulary saved.'); resource.reload() }} />}
    {deleting && <Modal title="Delete vocabulary?" busy={pending} onClose={() => setDeleting(null)}><p>Delete “{deleting.word}” from your notebook?</p>{error && <p role="alert">{error}</p>}<div className="actions"><button className="secondary" disabled={pending} onClick={() => setDeleting(null)}>Cancel</button><button className="danger" disabled={pending} onClick={remove}>{pending ? 'Deleting…' : 'Delete'}</button></div></Modal>}
  </section>
}
