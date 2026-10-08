import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
import { CourseInfo, CourseThumbnail } from './CourseInfo'
export function CourseCard({ course, enrollment }) {
  return <article className="card course-card">
    <CourseThumbnail course={course} />
    <div className="card-body"><CourseInfo course={course} /><h2><Link to={`/courses/${course.id}`}><BilingualText vi={course.titleVi || course.title} en={course.title} /></Link></h2>
    <p><BilingualText vi={course.descriptionVi || course.description} en={course.description} /></p>
    {enrollment?.isEnrolled && <span className="badge"><BilingualText>{enrollment.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang học'}</BilingualText></span>}
    <Link className="text-link" to={`/courses/${course.id}`}><BilingualText>{"Xem khóa học →"}</BilingualText></Link></div>
  </article>
}
