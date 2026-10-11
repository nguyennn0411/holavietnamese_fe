import { BilingualText } from '@/components/common/BilingualText';
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
import { VocabularyOverview } from '@/components/vocabulary/VocabularyNavigation'
import { ROUTES } from '@/constants/routes'
import '@/components/vocabulary/vocabulary.css'
export function VocabularyNotebookPage() {
  const location = useLocation()
  const [search, setSearch] = useState(''), [courseId, setCourseId] = useState(''), [lessonId, setLessonId] = useState('')
  const [editing, setEditing] = useState(null), [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(location.state?.vocabularyMessage || '')
  const resource = useVocabulary({ search, courseId, lessonId })
  const options = useVocabularyOptions()
  return <section className="vocabulary-page vocabulary-ui vocabulary-notebook-page"><PageHeader eyebrow="Những từ mở ra thế giới" title="Sổ tay từ vựng" description="Những từ nhỏ. Những kết nối đời thường. Biến chúng thành của bạn." actions={<><Link to="/vocabulary/review" className="button"><BilingualText>{"Ôn từ vựng →"}</BilingualText></Link><button className="secondary" onClick={() => setEditing({})}><BilingualText>{"+ Thêm từ"}</BilingualText></button></>} />
    <VocabularyOverview key={resource.data?.length} active="notebook"><div className="actions"><Link className="button secondary" to={ROUTES.VOCABULARY}><BilingualText>{"Khám phá thêm từ"}</BilingualText></Link><Link className="text-link" to="/my-learning"><BilingualText>{"Góc học tập →"}</BilingualText></Link></div></VocabularyOverview>
    <div className="filters"><VocabularySearch value={search} onChange={setSearch} />
      {options.data && <VocabularyFilter {...options.data} courseId={courseId} lessonId={lessonId} onCourseChange={id => { setCourseId(id); setLessonId('') }} onLessonChange={setLessonId} />}
    </div>
    {options.error && <p role="alert"><BilingualText>{"Không thể tải bộ lọc khóa học."}</BilingualText><button className="secondary" onClick={options.reload}><BilingualText>{"Thử lại"}</BilingualText></button></p>}
    {message && <p className="success" role="status"><BilingualText>{message}</BilingualText></p>}
    <ResourceState resource={resource}>{entries => entries.length
      ? <><div className="vocabulary-results-heading"><strong><BilingualText>{"Những từ bạn đã lưu"}</BilingualText></strong><span>{entries.length}<BilingualText>{"từ"}</BilingualText></span></div><div className="card-grid">{entries.map(entry => <VocabularyCard key={entry.id} entry={entry} onEdit={setEditing} onDelete={setDeleting} />)}</div></>
      : <div className="state"><h2><BilingualText>{search || courseId || lessonId ? 'Không tìm thấy từ phù hợp' : 'Sổ tay của bạn đã sẵn sàng'}</BilingualText></h2><p><BilingualText>{search || courseId || lessonId ? 'Thử tìm từ khác hoặc bỏ bộ lọc.' : 'Lưu từ đầu tiên ở đây hoặc trong khi học bài.'}</BilingualText></p></div>}</ResourceState>
    {editing && <VocabularyForm entry={editing.id ? editing : null} lessons={options.data?.lessons || []} lessonOptions={options} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Đã lưu từ vựng.'); resource.reload() }} />}
    {deleting && <VocabularyDeleteModal entry={deleting} onClose={() => setDeleting(null)} onDeleted={() => { setDeleting(null); setMessage('Đã xóa từ vựng.'); resource.reload() }} />}
  </section>
}
