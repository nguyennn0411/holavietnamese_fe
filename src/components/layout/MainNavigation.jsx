import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', icon: '⌂', end: true },
  { to: '/my-learning', label: 'Góc học tập', icon: '◫' },
  { to: '/courses', label: 'Khóa học', icon: '▤' },
  { to: '/ai-tutor', label: 'AI Tutor', icon: '🤖' },
  { to: '/ai-scenarios', label: 'Kịch bản Roleplay', icon: '🎭' },
  { to: '/culture', label: 'Văn hóa', icon: '🏮' },
  { to: '/vocabulary', label: 'Từ đã lưu', icon: '◇' },
];

export function MainNavigation({ onNavigate }) {
  return (
    <nav className="site-nav" aria-label="Điều hướng chính">
      {NAV_ITEMS.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className="site-nav__link" onClick={onNavigate}>
          <span className="site-nav__icon" aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
