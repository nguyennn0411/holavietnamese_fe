import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <main className="state" style={{ maxWidth: 560, margin: '12vh auto', padding: 48 }}>
      <div style={{ fontSize: 48 }} aria-hidden="true">🔒</div>
      <h1>Không có quyền truy cập</h1>
      <p>Tài khoản của bạn không được cấp quyền xem nội dung này.</p>
      <Link className="button" to="/">Quay về trang chủ</Link>
    </main>
  );
}
