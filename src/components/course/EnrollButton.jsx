import { BilingualText } from '@/components/common/BilingualText';
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
  if (enrollment?.isEnrolled) return <Link className="button" to={`/learn/${courseId}`}><BilingualText>{"Tiếp tục học →"}</BilingualText></Link>
  return <div><button disabled={pending} onClick={enroll}><BilingualText>{pending ? 'Đang đăng ký…' : 'Đăng ký học'}</BilingualText></button>
    {error && <p role="alert"><BilingualText>{error.message}</BilingualText> {error.status === 401 && <Link to="/login" state={{ from: location.pathname }}><BilingualText>{"Sign in"}</BilingualText></Link>}</p>}
  </div>
}
