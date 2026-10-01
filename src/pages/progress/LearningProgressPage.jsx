import { Link } from 'react-router-dom'
import { useMyCourses } from '@/hooks/useMyCourses'
import { ResourceState } from '@/components/common/ResourceState'
import { CourseProgressBar } from '@/components/my-courses/CourseProgressBar'
export function LearningProgressPage() {
  const resource = useMyCourses()
  return <section><p className="eyebrow">Every lesson counts</p><h1>Learning Progress</h1>
    <ResourceState resource={resource}>{courses => <><div className="stats-grid">
      <div className="card stat"><strong>{courses.length}</strong><span>Total enrolled courses</span></div>
      <div className="card stat"><strong>{courses.filter(c => c.status === 'ACTIVE').length}</strong><span>Courses in progress</span></div>
      <div className="card stat"><strong>{courses.filter(c => c.status === 'COMPLETED').length}</strong><span>Completed courses</span></div>
    </div>{courses.length ? <div className="progress-list">{courses.map(c => <article className="card" key={c.courseId}><div className="row"><h2>{c.title}</h2><span className="badge">{c.status === 'COMPLETED' ? 'Completed' : 'In progress'}</span></div><CourseProgressBar course={c} /><Link className="text-link" to={`/learn/${c.courseId}`}>Continue Learning →</Link></article>)}</div>
    : <div className="state"><p>Your learning journey starts with one course.</p><Link className="button" to="/courses">Explore Courses</Link></div>}</>}</ResourceState></section>
}
