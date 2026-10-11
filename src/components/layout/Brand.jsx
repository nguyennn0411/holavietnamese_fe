import { Link } from 'react-router-dom';

export function Brand({ compact = false }) {
  return (
    <Link to="/" className={`site-brand${compact ? ' site-brand--compact' : ''}`} aria-label="HolaVietnamese - Trang chủ">
      <span className="site-brand__mark" aria-hidden="true">h</span>
      <span className="site-brand__copy">
        <strong>hola</strong>
        <small>VIETNAMESE</small>
      </span>
    </Link>
  );
}
