import { Link } from 'react-router-dom';

export function AuthFooter() {
  return (
    <footer className="auth-page-footer">
      <span>© {new Date().getFullYear()} HolaVietnamese</span>
      <nav aria-label="Liên kết chính sách">
        <Link to="/">Trợ giúp</Link>
        <Link to="/">Quyền riêng tư</Link>
        <Link to="/">Điều khoản</Link>
      </nav>
    </footer>
  );
}
