import { BilingualText } from '@/components/common/BilingualText';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', icon: '⌂', end: true },
  { to: '/courses', label: 'Học tiếng Việt' },
  { to: '/explore', label: 'Khám phá Việt Nam' },
  { to: ROUTES.VOCABULARY, label: 'Từ vựng' },
  { to: '/culture', label: 'Văn hóa' },
  { to: '/blog', label: 'Blog' },
  { to: '/ai-tutor', label: 'AI Tutor ✣' },
  { to: '/my-learning', label: 'Góc học tập' },
];

export function MainNavigation({ onNavigate }) {
  return (
    <nav className="site-nav" aria-label="Điều hướng chính">
      {NAV_ITEMS.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className="site-nav__link" onClick={onNavigate}>
          <span className="site-nav__icon" aria-hidden="true">{icon}</span>
          <span><BilingualText>{label}</BilingualText></span>
        </NavLink>
      ))}
    </nav>
  );
}
