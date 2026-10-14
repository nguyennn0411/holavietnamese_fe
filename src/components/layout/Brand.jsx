import { Link } from 'react-router-dom';

export function Brand({ compact = false }) {
  return (
    <Link to="/" className={`site-brand${compact ? ' site-brand--compact' : ''}`} aria-label="HolaVietnamese - Trang chủ">
      <img
        className="site-brand__logo"
        src="/design/hola-vietnamese-logo.png"
        alt="Hola Vietnamese"
      />
    </Link>
  );
}
