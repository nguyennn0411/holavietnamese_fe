import { BilingualText } from '@/components/common/BilingualText';
import { Link, Navigate, useParams } from 'react-router-dom'
import { useResumeCourse } from '@/hooks/useLearning'
import { ResourceState } from '@/components/common/ResourceState'
export function ResumeCoursePage() {
  const { courseId } = useParams()
  const resource = useResumeCourse(courseId)
  return <ResourceState resource={resource}>{id => id
    ? <Navigate replace to={`/learn/${courseId}/lesson/${id}`} />
    : <div className="state"><h1><BilingualText>{"Lessons are coming soon"}</BilingualText></h1><p><BilingualText>{"This course has no published lessons yet."}</BilingualText></p><Link to="/my-courses"><BilingualText>{"Back to My Courses"}</BilingualText></Link></div>}</ResourceState>
}
