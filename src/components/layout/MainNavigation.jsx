import { BilingualText } from '@/components/common/BilingualText';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Home, BookOpen, Map, Languages, Landmark, Newspaper, Compass, GraduationCap, Type } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', en: 'Home', icon: Home, end: true },
  { to: ROUTES.EDTECH_DASHBOARD, label: 'Lộ trình học', en: 'Learning path', icon: Compass, badge: 'EdTech' },
  { to: '/courses', label: 'Khóa học', en: 'Courses', icon: BookOpen },
  { to: ROUTES.ALPHABET, label: 'Bảng chữ cái', en: 'Alphabet', icon: Type },
  { to: '/explore', label: 'Khám phá Việt Nam', en: 'Explore Vietnam', icon: Map },
  { to: ROUTES.VOCABULARY, label: 'Từ vựng', en: 'Vocabulary', icon: Languages },
  { to: '/culture', label: 'Văn hóa', en: 'Culture', icon: Landmark },
  { to: '/blog', label: 'Blog', en: 'Stories', icon: Newspaper },
  { to: '/my-learning', label: 'Góc học tập', en: 'My learning', icon: GraduationCap },
];

export function MainNavigation({ onNavigate }) {
  return (
    <nav id="primary-navigation" className="site-nav" aria-label="Điều hướng chính">
      {NAV_ITEMS.map(({ to, label, en, icon: Icon, end, badge }) => (
        <NavLink key={to} to={to} end={end} className="site-nav__link" onClick={onNavigate}>
          <span className="site-nav__icon" aria-hidden="true"><Icon size={17} strokeWidth={1.8}/></span>
          <span className="site-nav__text-group">
            <span className="bilingual-text">
              <span className="bilingual-text__vi-wrap">
                <span className="bilingual-text__vi" lang="vi">{label}</span>
                {badge && (
                  <span className="site-nav__badge">
                    {badge}
                  </span>
                )}
              </span>
              <span className="bilingual-text__en" lang="en">{en}</span>
            </span>
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
