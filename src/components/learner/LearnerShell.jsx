import { useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Bell, BookOpen, Bot, ChevronLeft, Compass, Flame,
  GraduationCap, Headphones, Home, Languages, Mic2,
  Newspaper, Palette, Zap,
} from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import { UserMenu } from '@/components/layout/UserMenu';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const learnerItems = [
  { to: '/', label: 'learn', icon: Home, end: true, mobile: true },
  { to: '/edtech/dashboard', label: 'learningPath', icon: Compass, mobile: true },
  { to: '/courses', label: 'courses', icon: BookOpen, mobile: true },
  { to: '/my-learning', label: 'myLearning', icon: GraduationCap },
  { to: '/vocabulary', label: 'vocabulary', icon: Languages, mobile: true },
  { to: '/explore', label: 'explore', icon: Compass },
  { to: '/culture', label: 'culture', icon: Palette },
  { to: '/blog', label: 'blog', icon: Newspaper },
  { to: '/alphabet', label: 'pronunciation', icon: Mic2, mobile: true },
  { label: 'listening', icon: Headphones, status: 'insideLessons' },
  { to: '/ai-scenarios', label: 'speaking', icon: GraduationCap },
  { to: '/ai-tutor', label: 'aiConversation', icon: Bot },
];

export function LearnerSidebar({ collapsed, onToggle }) {
  const { t } = useTranslation('navigation');
  return <aside className="learner-sidebar" aria-label="Learner navigation">
    <button
      type="button"
      className="sidebar-toggle-btn"
      onClick={onToggle}
      aria-label={collapsed ? t('expandSidebar', { defaultValue: 'Mở rộng thanh điều hướng' }) : t('collapseSidebar', { defaultValue: 'Thu gọn thanh điều hướng' })}
      aria-expanded={!collapsed}
      title={collapsed ? t('expandSidebar', { defaultValue: 'Mở rộng menu' }) : t('collapseSidebar', { defaultValue: 'Thu gọn menu' })}
    >
      <ChevronLeft className="sidebar-toggle-btn__icon" />
    </button>
    <div className="learner-sidebar__brand"><Brand compact collapsed={collapsed} /></div>
    <nav className="learner-sidebar__nav">
      {learnerItems.map(({ to, label, icon: Icon, status, end, mobile }) => to ? (
        <NavLink key={label} to={to} end={end} className={`learner-sidebar__link ${mobile ? 'is-mobile-primary' : ''}`} title={collapsed ? t(label) : undefined}>
          <span className="sidebar-link__icon"><Icon /></span>
          <b className="sidebar-link__label">{t(label)}</b>
        </NavLink>
      ) : (
        <div key={label} className="learner-sidebar__link is-disabled" title={`${t(label)} — ${t(status)}`} aria-disabled="true">
          <span className="sidebar-link__icon"><Icon /></span>
          <b className="sidebar-link__label">{t(label)}</b>
          <small className="learner-sidebar__status">{t(status)}</small>
        </div>
      ))}
    </nav>
    <div className="learner-sidebar__tip"><span>VI</span><div><strong>{t('keepRhythm', { defaultValue: 'Keep your rhythm' })}</strong><small>{t('dailyVietnamese', { defaultValue: 'A little Vietnamese every day.' })}</small></div></div>
  </aside>;
}

export function LearnerTopbar({ user, stats, onLogout }) {
  const { t, i18n } = useTranslation('navigation');
  const location = useLocation();
  const hour = new Date().getHours();
  const isVi = i18n.resolvedLanguage?.startsWith('vi');
  const greeting = isVi ? (hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối') : (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
  const displayName = user?.fullName || user?.username || 'Learner';
  const title = useMemo(() => learnerItems.find((item) => item.to && (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))?.label || 'learn', [location.pathname]);
  const level = user?.targetLevel || user?.level || '—';
  const hasEnergy = stats?.hearts != null || stats?.energy != null;
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN');

  return <header className="learner-topbar">
    <div className="learner-topbar__welcome"><span>HOLAVIETNAMESE</span><strong>{t(title)} <em className="learner-topbar__level">{isVi ? 'Sơ cấp · A1' : 'Beginner · A1'}</em></strong></div>
    <div className="learner-topbar__stats" aria-label="Learning statistics">
      <Link to="/progress" title={isVi ? 'Trình độ hiện tại' : 'Current learning level'}><GraduationCap /><span><small>{isVi ? 'TRÌNH ĐỘ' : 'LEVEL'}</small><b>{level}</b></span></Link>
      <Link to="/progress" title={isVi ? 'Chuỗi ngày học' : 'Daily streak'}><Flame className="is-flame" /><span><small>{isVi ? 'CHUỖI' : 'STREAK'}</small><b>{stats?.streak ?? 0}</b></span></Link>
      <Link to="/progress" title={isVi ? 'Tổng điểm kinh nghiệm' : 'Total experience'}><Zap /><span><small>{isVi ? 'TỔNG XP' : 'TOTAL XP'}</small><b>{stats?.xp ?? 0}</b></span></Link>
      {hasEnergy && <span className="learner-topbar__energy"><small>{isVi ? 'NĂNG LƯỢNG' : 'ENERGY'}</small><b>{stats.hearts ?? stats.energy}</b></span>}
    </div>
    <div className="learner-topbar__actions">
      <LanguageSwitcher compact />
      <NotificationDropdown fallbackIcon={<Bell />} />
      <UserMenu user={user} isAdmin={isAdmin} onLogout={onLogout} />
    </div>
  </header>;
}
