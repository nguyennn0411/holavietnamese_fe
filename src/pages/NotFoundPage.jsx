import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="state">
      <h1>404</h1>
      <p>Không tìm thấy trang bạn đang tìm.</p>
      <Link className="button" to="/">Về trang chủ</Link>
    </section>
  )
}
