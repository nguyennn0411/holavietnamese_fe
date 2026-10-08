import { Link } from 'react-router-dom'
import { useLessons } from '@/hooks/useLearning'
import { ResourceState } from '@/components/common/ResourceState'
export function CourseCurriculum({ courseId }) {
  const resource = useLessons(courseId)
  return <section className="card curriculum"><h2>Nội dung khóa học</h2><ResourceState resource={resource}>{lessons => lessons.length
    ? <ol>{lessons.map(l => <li key={l.id}><Link to={`/learn/${courseId}/lesson/${l.id}`}>{l.title}</Link><span>{l.estimatedDuration} phút</span></li>)}</ol>
    : <p>Chưa có bài học được xuất bản.</p>}</ResourceState></section>
}
