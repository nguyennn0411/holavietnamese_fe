import { BilingualText } from '@/components/common/BilingualText';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Link } from 'react-router-dom';

export function ForbiddenPage() {
  return (
    <main className="state" style={{ maxWidth: 560, margin: '12vh auto', padding: 48 }}>
      <div style={{ fontSize: 48 }} aria-hidden="true">🔒</div>
      <h1><BilingualText vi="Không có quyền truy cập" en="Access Denied" /></h1>
      <p><BilingualText vi="Tài khoản của bạn không được cấp quyền xem nội dung này." en="Your account does not have permission to view this content." /></p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <Link className="button" to="/"><BilingualText vi="Quay về trang chủ" en="Back to Home" /></Link>
        <LanguageSwitcher compact />
      </div>
    </main>
  );
}
