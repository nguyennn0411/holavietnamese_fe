import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
import { useLessons } from '@/hooks/useLearning'
import { ResourceState } from '@/components/common/ResourceState'
export function CourseCurriculum({ courseId }) {
  const resource = useLessons(courseId)
  return <section className="card curriculum"><h2><BilingualText>{"Nội dung khóa học"}</BilingualText></h2><ResourceState resource={resource}>{lessons => lessons.length
    ? <ol>{lessons.map(l => <li key={l.id}><Link to={`/learn/${courseId}/lesson/${l.id}`}><BilingualText vi={l.titleVi || l.title} en={l.title} /></Link><span>{l.estimatedDuration}<BilingualText>{"phút"}</BilingualText></span></li>)}</ol>
    : <p><BilingualText>{"Chưa có bài học được xuất bản."}</BilingualText></p>}</ResourceState></section>
}
