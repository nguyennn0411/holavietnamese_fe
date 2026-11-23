import { BilingualText } from '@/shared/components/common/BilingualText';
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PageHeader } from '@/shared/components/common/Ui'
import { useVocabularyPage, useVocabularyOptions } from '@/features/vocabulary/hooks/useVocabulary'
import { ResourceState } from '@/shared/components/common/ResourceState'
import { VocabularyDeleteModal } from '@/features/vocabulary/components/VocabularyDeleteModal'
import { VocabularyCard } from '@/features/vocabulary/components/VocabularyCard'
import { VocabularyForm } from '@/features/vocabulary/components/VocabularyForm'
import { VocabularySearch } from '@/features/vocabulary/components/VocabularySearch'
import { VocabularyFilter } from '@/features/vocabulary/components/VocabularyFilter'
import { ROUTES } from '@/constants/routes'
import '@/features/vocabulary/components/vocabulary.css'
export function VocabularyNotebookPage() {
  const location = useLocation()
  const [search, setSearchValue] = useState(''), [courseId, setCourseIdValue] = useState(''), [lessonId, setLessonIdValue] = useState(''), [page, setPage] = useState(0)
  const [editing, setEditing] = useState(null), [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(location.state?.vocabularyMessage || '')
  const resource = useVocabularyPage({ search, courseId, lessonId, page, size: 20 })
  const setSearch = value => { setSearchValue(value); setPage(0) }
  const setCourseId = value => { setCourseIdValue(value); setPage(0) }
  const setLessonId = value => { setLessonIdValue(value); setPage(0) }
  const options = useVocabularyOptions()
  return <section className="vocabulary-page vocabulary-ui vocabulary-notebook-page"><PageHeader eyebrow={<BilingualText vi="Những từ mở ra thế giới" en="Words that open up the world" />} title={<BilingualText vi="Sổ tay từ vựng" en="Vocabulary notebook" />} description={<BilingualText vi="Những từ nhỏ. Những kết nối đời thường. Biến chúng thành của bạn." en="Small words. Everyday connections. Make them yours." />} actions={<><Link to={`${ROUTES.MY_LEARNING}?tab=vocabulary`} className="button secondary"><BilingualText vi="← Góc học tập" en="← My learning" /></Link><Link to={ROUTES.VOCABULARY_REVIEW} className="button"><BilingualText vi="Ôn từ vựng →" en="Review vocabulary →" /></Link><button className="secondary" onClick={() => setEditing({})}><BilingualText vi="+ Thêm từ" en="+ Add word" /></button></>} />
    <div className="filters"><VocabularySearch value={search} onChange={setSearch} />
      {options.data && <VocabularyFilter {...options.data} courseId={courseId} lessonId={lessonId} onCourseChange={id => { setCourseId(id); setLessonId('') }} onLessonChange={setLessonId} />}
    </div>
    {options.error && <p role="alert"><BilingualText vi="Không thể tải bộ lọc khóa học." en="Could not load course filters." /><button className="secondary" onClick={options.reload}><BilingualText>{"Thử lại"}</BilingualText></button></p>}
    {message && <p className="success" role="status"><BilingualText>{message}</BilingualText></p>}
    <ResourceState resource={resource}>{result => result.content.length
      ? <><div className="vocabulary-results-heading"><strong><BilingualText vi="Những từ bạn đã lưu" en="Your saved words" /></strong><span>{result.totalElements} <BilingualText vi="từ" en="words" /></span></div><div className="card-grid">{result.content.map(entry => <VocabularyCard key={entry.id} entry={entry} onEdit={setEditing} onDelete={setDeleting} />)}</div><div className="actions"><button className="secondary" disabled={result.first} onClick={() => setPage(value => value - 1)}><BilingualText vi="← Trang trước" en="← Previous" /></button><span>{result.number + 1} / {Math.max(result.totalPages, 1)}</span><button className="secondary" disabled={result.last} onClick={() => setPage(value => value + 1)}><BilingualText vi="Trang sau →" en="Next →" /></button></div></>
      : <div className="state"><h2><BilingualText>{search || courseId || lessonId ? 'Không tìm thấy từ phù hợp' : 'Sổ tay của bạn đã sẵn sàng'}</BilingualText></h2><p><BilingualText>{search || courseId || lessonId ? 'Thử tìm từ khác hoặc bỏ bộ lọc.' : 'Lưu từ đầu tiên ở đây hoặc trong khi học bài.'}</BilingualText></p></div>}</ResourceState>
    {editing && <VocabularyForm entry={editing.id ? editing : null} lessons={options.data?.lessons || []} lessonOptions={options} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Đã lưu từ vựng.'); resource.reload() }} />}
    {deleting && <VocabularyDeleteModal entry={deleting} onClose={() => setDeleting(null)} onDeleted={() => { setDeleting(null); setMessage('Đã xóa từ vựng.'); resource.reload() }} />}
  </section>
}
