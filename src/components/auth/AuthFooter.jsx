import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';

export function AuthFooter() {
  return (
    <footer className="auth-page-footer">
      <span>© {new Date().getFullYear()} HolaVietnamese</span>
      <nav aria-label="Liên kết chính sách">
        <Link to="/"><BilingualText>{"Trợ giúp"}</BilingualText></Link>
        <Link to="/"><BilingualText>{"Quyền riêng tư"}</BilingualText></Link>
        <Link to="/"><BilingualText>{"Điều khoản"}</BilingualText></Link>
      </nav>
    </footer>
  );
}
