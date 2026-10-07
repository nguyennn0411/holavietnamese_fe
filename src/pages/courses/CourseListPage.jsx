import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from '@/components/course/CourseCard'
import { ResourceState } from '@/components/common/ResourceState'
export function CourseListPage() {
  const resource = useCourses()
  return <section><p className="eyebrow">A little every day</p><h1>Explore Vietnamese</h1><p className="lead">Find your next course and start learning at your own pace.</p>
    <ResourceState resource={resource}>{items => items.length
      ? <div className="card-grid">{items.map(({ course, enrollment }) => <CourseCard key={course.id} course={course} enrollment={enrollment} />)}</div>
      : <div className="state">New courses are on their way. Check back soon.</div>}</ResourceState>
  </section>
}
