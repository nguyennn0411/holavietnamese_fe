import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <main className="state" style={{ maxWidth: 560, margin: '12vh auto', padding: 48 }}>
      <div style={{ fontSize: 48 }} aria-hidden="true">🔒</div>
      <h1><BilingualText>{"Không có quyền truy cập"}</BilingualText></h1>
      <p><BilingualText>{"Tài khoản của bạn không được cấp quyền xem nội dung này."}</BilingualText></p>
      <Link className="button" to="/"><BilingualText>{"Quay về trang chủ"}</BilingualText></Link>
    </main>
  );
}
