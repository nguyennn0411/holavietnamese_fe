import { Link } from 'react-router-dom';

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Link to="/" className="auth-brand" aria-label="HolaVietnamese - Trang chủ">
        <span className="auth-brand-logo" aria-hidden="true">
          <span className="auth-logo-text">H</span>
          <span className="auth-logo-star">★</span>
        </span>
        <span className="auth-brand-name">HolaVietnamese</span>
      </Link>
      <span className="auth-brand-badge">ĐÔNG SƠN POP</span>
    </header>
  );
}
