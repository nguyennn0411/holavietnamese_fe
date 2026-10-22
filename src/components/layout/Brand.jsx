import { Link } from 'react-router-dom';

export function Brand({ compact = false, collapsed = false, className = '' }) {
  return (
    <Link
      to="/"
      className={`site-brand${compact ? ' site-brand--compact' : ''}${collapsed ? ' site-brand--collapsed' : ''}${className ? ` ${className}` : ''}`}
      aria-label="HolaVietnamese - Trang chủ"
    >
      <img
        className="site-brand__logo"
        src="/design/hola-vietnamese-logo.png"
        alt="Hola Vietnamese"
      />
      <img
        className="site-brand__icon"
        src="/design/hola-vietnamese-icon.png"
        alt="Hola Vietnamese"
      />
    </Link>
  );
}
