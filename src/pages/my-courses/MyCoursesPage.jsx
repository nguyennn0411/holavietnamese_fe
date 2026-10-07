import { Link } from 'react-router-dom'
import { useMyCourses } from '@/hooks/useMyCourses'
import { MyCourseCard } from '@/components/my-courses/MyCourseCard'
import { ResourceState } from '@/components/common/ResourceState'
export function MyCoursesPage() {
  const resource = useMyCourses()
  return <section><p className="eyebrow">Keep your momentum</p><h1>My Courses</h1><p className="lead">Pick up where you left off.</p>
    <ResourceState resource={resource}>{courses => courses.length
      ? <div className="card-grid">{courses.map(course => <MyCourseCard key={course.enrollmentId} course={course} />)}</div>
      : <div className="state"><p>You haven't enrolled in any courses yet.</p><Link className="button" to="/courses">Explore Courses</Link></div>}</ResourceState></section>
}
