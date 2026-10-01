import { Link, useLocation } from 'react-router-dom'
export function ResourceState({ resource, children }) {
  const location = useLocation()
  if (resource.loading) return <p className="state" role="status">Loading…</p>
  if (resource.error) return <div className="state" role="alert">
    <p>{resource.error.message}</p>
    {resource.error.status === 401
      ? <Link className="button" to="/login" state={{ from: location.pathname + location.search }}>Sign in</Link>
      : <button onClick={resource.reload}>Try again</button>}
  </div>
  return children(resource.data)
}
