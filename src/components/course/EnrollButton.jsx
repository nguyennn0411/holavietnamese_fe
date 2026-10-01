import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { courseService } from '@/services/courseService'
export function EnrollButton({ courseId, enrollment, onEnrolled }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const location = useLocation()
  async function enroll() {
    setPending(true); setError(null)
    try { await courseService.enroll(courseId); onEnrolled() }
    catch (e) { setError(e) }
    finally { setPending(false) }
  }
  if (enrollment?.isEnrolled) return <Link className="button" to={`/learn/${courseId}`}>Continue Learning →</Link>
  return <div><button disabled={pending} onClick={enroll}>{pending ? 'Enrolling…' : 'Enroll Now'}</button>
    {error && <p role="alert">{error.message} {error.status === 401 && <Link to="/login" state={{ from: location.pathname }}>Sign in</Link>}</p>}
  </div>
}
