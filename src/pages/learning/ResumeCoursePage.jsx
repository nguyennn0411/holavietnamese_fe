import { Link, Navigate, useParams } from 'react-router-dom'
import { useResumeCourse } from '@/hooks/useLearning'
import { ResourceState } from '@/components/common/ResourceState'
export function ResumeCoursePage() {
  const { courseId } = useParams()
  const resource = useResumeCourse(courseId)
  return <ResourceState resource={resource}>{id => id
    ? <Navigate replace to={`/learn/${courseId}/lesson/${id}`} />
    : <div className="state"><h1>Lessons are coming soon</h1><p>This course has no published lessons yet.</p><Link to="/my-courses">Back to My Courses</Link></div>}</ResourceState>
}
