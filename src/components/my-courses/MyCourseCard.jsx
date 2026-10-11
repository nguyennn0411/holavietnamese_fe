import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
import { CourseThumbnail } from '@/components/course/CourseInfo'
import { CourseProgressBar } from './CourseProgressBar'
export function MyCourseCard({ course }) {
  return <article className="card course-card"><CourseThumbnail course={course} />
    <div className="card-body"><span className="badge">{course.level}</span><h2><BilingualText vi={course.titleVi || course.title} en={course.title} /></h2>
    <CourseProgressBar course={course} />
    {course.progressPercentage === 100 && <p className="success"><BilingualText>{"✓ Đã hoàn thành"}</BilingualText></p>}
    <Link className="button" to={`/learn/${course.courseId}`}><BilingualText>{"Tiếp tục học →"}</BilingualText></Link></div></article>
}
