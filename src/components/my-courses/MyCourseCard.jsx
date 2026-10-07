import { Link } from 'react-router-dom'
import { CourseThumbnail } from '@/components/course/CourseInfo'
import { CourseProgressBar } from './CourseProgressBar'
export function MyCourseCard({ course }) {
  return <article className="card course-card"><CourseThumbnail course={course} />
    <div className="card-body"><span className="badge">{course.level}</span><h2>{course.title}</h2>
    <CourseProgressBar course={course} />
    {course.progressPercentage === 100 && <p className="success">✓ Đã hoàn thành</p>}
    <Link className="button" to={`/learn/${course.courseId}`}>Tiếp tục học →</Link></div></article>
}
