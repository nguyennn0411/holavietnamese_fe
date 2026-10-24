import { BilingualText } from '@/components/common/BilingualText';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="state">
      <h1>404</h1>
      <p><BilingualText vi="Không tìm thấy trang bạn đang tìm." en="The page you are looking for could not be found." /></p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
        <Link className="button" to="/"><BilingualText vi="Về trang chủ" en="Back to Home" /></Link>
        <LanguageSwitcher compact />
      </div>
    </section>
  );
}
