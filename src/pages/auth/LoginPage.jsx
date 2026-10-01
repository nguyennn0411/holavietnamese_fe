import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sessionService } from '@/services/sessionService'
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event) {
    event.preventDefault(); setPending(true); setError('')
    const data = new FormData(event.currentTarget)
    try {
      await sessionService.login(data.get('email'), data.get('password'))
      const from = location.state?.from
      navigate(typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : '/my-courses', { replace: true })
    } catch (e) { setError(e.message) } finally { setPending(false) }
  }
  return <section className="card auth-card"><p className="eyebrow">Welcome back</p><h1>Continue your journey</h1>
    <form onSubmit={submit}><label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p role="alert">{error}</p>}<button disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button></form></section>
}
