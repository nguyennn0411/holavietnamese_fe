import { Link } from 'react-router-dom'
import { CourseInfo, CourseThumbnail } from './CourseInfo'
export function CourseCard({ course, enrollment }) {
  return <article className="card course-card">
    <CourseThumbnail course={course} />
    <div className="card-body"><CourseInfo course={course} /><h2><Link to={`/courses/${course.id}`}>{course.title}</Link></h2>
    <p>{course.description}</p>
    {enrollment?.isEnrolled && <span className="badge">{enrollment.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang học'}</span>}
    <Link className="text-link" to={`/courses/${course.id}`}>Xem khóa học →</Link></div>
  </article>
}
