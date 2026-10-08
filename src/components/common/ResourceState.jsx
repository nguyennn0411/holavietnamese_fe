import { Link, useLocation } from 'react-router-dom'
export function ResourceState({ resource, children }) {
  const location = useLocation()
  if (resource.loading) return <div className="state loading-state" role="status"><span className="loading-spinner" aria-hidden="true"/><p>Đang tải nội dung…</p></div>
  if (resource.error) return <div className="state" role="alert">
    <p>{resource.error.message}</p>
    {resource.error.status === 401
      ? <Link className="button" to="/login" state={{ from: location.pathname + location.search }}>Đăng nhập</Link>
      : resource.reload && <button onClick={resource.reload}>Thử lại</button>}
  </div>
  return children(resource.data)
}
