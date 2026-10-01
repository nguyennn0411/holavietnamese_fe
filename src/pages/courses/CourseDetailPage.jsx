import { Link, useParams } from 'react-router-dom'
import { useCourse } from '@/hooks/useCourses'
import { CourseInfo, CourseThumbnail } from '@/components/course/CourseInfo'
import { EnrollButton } from '@/components/course/EnrollButton'
import { ResourceState } from '@/components/common/ResourceState'
import { CourseCurriculum } from '@/components/course/CourseCurriculum'
import { CourseProgress } from '@/components/course/CourseProgress'
export function CourseDetailPage() {
  const { courseId } = useParams()
  const resource = useCourse(courseId)
  return <section><Link className="text-link" to="/courses">← All courses</Link>
    <ResourceState resource={resource}>{({ course, enrollment }) => <div className="detail-grid">
      <div><p className="eyebrow">Your next chapter</p><h1>{course.title}</h1><CourseInfo course={course} /><p className="lead preserve-lines">{course.description}</p>
      <EnrollButton courseId={courseId} enrollment={enrollment} onEnrolled={resource.reload} />
      {enrollment?.isEnrolled && <CourseProgress courseId={courseId} />}
      {enrollment?.isEnrolled && <CourseCurriculum courseId={courseId} />}</div>
      <CourseThumbnail course={course} />
    </div>}</ResourceState></section>
}
