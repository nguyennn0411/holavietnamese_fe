import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'
import { useAsyncResource } from '@/hooks/useAsyncResource'
export function SessionNavigation() {
  const location = useLocation(), navigate = useNavigate()
  const [pending, setPending] = useState(false), [error, setError] = useState('')
  const resource = useAsyncResource(useCallback(async () => {
    try { return await sessionService.current() }
    catch (e) { if (e.status === 401) return null; throw e }
  }, [location.key]))
  async function logout() {
    setPending(true); setError('')
    try { await sessionService.logout(); navigate('/'); resource.reload() }
    catch (e) { setError(e.message) } finally { setPending(false) }
  }
  if (resource.loading) return <span className="sign-in-link muted">…</span>
  return <div className="session-navigation">{resource.data
    ? <button className="secondary" disabled={pending} onClick={logout}>{pending ? 'Signing out…' : 'Sign out'}</button>
    : <Link className="sign-in-link" to="/login" state={{ from: location.pathname === '/login' ? '/my-courses' : location.pathname }}>Sign in</Link>}
    {error && <p role="alert">{error}</p>}</div>
}
