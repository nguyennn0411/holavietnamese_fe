import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="state">
      <h1>404</h1>
      <p><BilingualText>{"Không tìm thấy trang bạn đang tìm."}</BilingualText></p>
      <Link className="button" to="/"><BilingualText>{"Về trang chủ"}</BilingualText></Link>
    </section>
  )
}
