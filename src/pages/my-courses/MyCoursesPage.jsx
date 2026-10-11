import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'
import { useMyCourses } from '@/hooks/useMyCourses'
import { MyCourseCard } from '@/components/my-courses/MyCourseCard'
import { ResourceState } from '@/components/common/ResourceState'
export function MyCoursesPage() {
  const resource = useMyCourses()
  return <section><p className="eyebrow"><BilingualText>{"Tiếp nối hành trình"}</BilingualText></p><h1><BilingualText>{"Khóa học của tôi"}</BilingualText></h1><p className="lead"><BilingualText>{"Tiếp tục từ nơi bạn đã dừng lại."}</BilingualText></p>
    <ResourceState resource={resource}>{courses => courses.length
      ? <div className="card-grid">{courses.map(course => <MyCourseCard key={course.enrollmentId} course={course} />)}</div>
      : <div className="state"><p><BilingualText>{"Bạn chưa đăng ký khóa học nào."}</BilingualText></p><Link className="button" to="/courses"><BilingualText>{"Khám phá khóa học"}</BilingualText></Link></div>}</ResourceState></section>
}
