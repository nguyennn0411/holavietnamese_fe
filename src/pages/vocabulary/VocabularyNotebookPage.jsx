import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/common/Ui'
import { useVocabulary, useVocabularyOptions } from '@/hooks/useVocabulary'
import { ResourceState } from '@/components/common/ResourceState'
import { VocabularyDeleteModal } from '@/components/vocabulary/VocabularyDeleteModal'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { VocabularyForm } from '@/components/vocabulary/VocabularyForm'
import { VocabularySearch } from '@/components/vocabulary/VocabularySearch'
import { VocabularyFilter } from '@/components/vocabulary/VocabularyFilter'
export function VocabularyNotebookPage() {
  const location = useLocation()
  const [search, setSearch] = useState(''), [courseId, setCourseId] = useState(''), [lessonId, setLessonId] = useState('')
  const [editing, setEditing] = useState(null), [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(location.state?.vocabularyMessage || '')
  const resource = useVocabulary({ search, courseId, lessonId })
  const options = useVocabularyOptions()
  return <section className="vocabulary-page"><PageHeader eyebrow="Những từ mở ra thế giới" title="Từ vựng tiếng Việt" description="Những từ nhỏ. Những kết nối đời thường. Biến chúng thành của bạn." actions={<><Link to="/vocabulary/review" className="button">Ôn từ vựng →</Link><button className="secondary" onClick={() => setEditing({})}>+ Thêm từ</button></>} />
    <div className="notebook-banner"><div><strong>Sổ tay tiếng Việt của bạn</strong><small>Lưu lại từ hay, ôn lại mỗi ngày.</small></div><Link className="button secondary" to="/my-learning">Góc học tập →</Link></div>
    <div className="filters"><VocabularySearch value={search} onChange={setSearch} />
      {options.data && <VocabularyFilter {...options.data} courseId={courseId} lessonId={lessonId} onCourseChange={id => { setCourseId(id); setLessonId('') }} onLessonChange={setLessonId} />}
    </div>
    {options.error && <p role="alert">Không thể tải bộ lọc khóa học. <button className="secondary" onClick={options.reload}>Thử lại</button></p>}
    {message && <p className="success" role="status">{message}</p>}
    <ResourceState resource={resource}>{entries => entries.length
      ? <div className="card-grid">{entries.map(entry => <VocabularyCard key={entry.id} entry={entry} onEdit={setEditing} onDelete={setDeleting} />)}</div>
      : <div className="state"><h2>{search || courseId || lessonId ? 'Không tìm thấy từ phù hợp' : 'Sổ tay của bạn đã sẵn sàng'}</h2><p>{search || courseId || lessonId ? 'Thử tìm từ khác hoặc bỏ bộ lọc.' : 'Lưu từ đầu tiên ở đây hoặc trong khi học bài.'}</p></div>}</ResourceState>
    {editing && <VocabularyForm entry={editing.id ? editing : null} lessons={options.data?.lessons || []} lessonOptions={options} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Đã lưu từ vựng.'); resource.reload() }} />}
    {deleting && <VocabularyDeleteModal entry={deleting} onClose={() => setDeleting(null)} onDeleted={() => { setDeleting(null); setMessage('Đã xóa từ vựng.'); resource.reload() }} />}
  </section>
}
