import { BilingualText } from '@/components/common/BilingualText';
import { Link, useLocation } from 'react-router-dom'
export function ResourceState({ resource, children }) {
  const location = useLocation()
  if (resource.loading) return <div className="state loading-state" role="status"><span className="loading-spinner" aria-hidden="true"/><p><BilingualText>{"Đang tải nội dung…"}</BilingualText></p></div>
  if (resource.error) return <div className="state" role="alert">
    <p><BilingualText>{resource.error.message}</BilingualText></p>
    {resource.error.status === 401
      ? <Link className="button" to="/login" state={{ from: location.pathname + location.search }}><BilingualText>{"Đăng nhập"}</BilingualText></Link>
      : resource.reload && <button onClick={resource.reload}><BilingualText>{"Thử lại"}</BilingualText></button>}
  </div>
  return children(resource.data)
}
