import { Link } from 'react-router-dom'
import { useMyCourses } from '@/hooks/useMyCourses'
import { MyCourseCard } from '@/components/my-courses/MyCourseCard'
import { ResourceState } from '@/components/common/ResourceState'
export function MyCoursesPage() {
  const resource = useMyCourses()
  return <section><p className="eyebrow">Tiếp nối hành trình</p><h1>Khóa học của tôi</h1><p className="lead">Tiếp tục từ nơi bạn đã dừng lại.</p>
    <ResourceState resource={resource}>{courses => courses.length
      ? <div className="card-grid">{courses.map(course => <MyCourseCard key={course.enrollmentId} course={course} />)}</div>
      : <div className="state"><p>Bạn chưa đăng ký khóa học nào.</p><Link className="button" to="/courses">Khám phá khóa học</Link></div>}</ResourceState></section>
}
