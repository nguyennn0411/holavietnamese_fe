import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen, Bot, ChevronLeft, ChevronRight, Compass, GraduationCap,
  Home, Languages, Map, Menu, Newspaper, Palette, Sparkles, X,
} from 'lucide-react';
import { Brand } from '@/components/layout/Brand';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';

const guestItems = [
  { to: '/', label: 'home', icon: Home, end: true },
  { to: ROUTES.EDTECH_DASHBOARD, label: 'learningPath', icon: Sparkles },
  { to: '/courses', label: 'courses', icon: GraduationCap },
  { to: '/alphabet', label: 'alphabet', icon: Languages },
  { to: '/vocabulary', label: 'vocabulary', icon: BookOpen },
  { to: '/explore-vietnam', label: 'explore', icon: Compass },
  { to: '/culture', label: 'culture', icon: Palette },
  { to: '/blog', label: 'blog', icon: Newspaper },
  { to: '/ai-tutor', label: 'aiTutor', icon: Bot },
];

function GuestNavigation({ collapsed = false, onNavigate }) {
  const { t } = useTranslation('navigation');
  const location = useLocation();
  return <nav className="guest-sidebar__nav" aria-label="Guest navigation">
    {guestItems.map(({ to, label, icon: Icon, end }) => {
      const [path, hash = ''] = to.split('#');
      const active = end
        ? location.pathname === path && !location.hash
        : hash
          ? location.pathname === path && location.hash === `#${hash}`
          : location.pathname === path || location.pathname.startsWith(`${path}/`);
      return <Link key={label} to={to} onClick={onNavigate} className={`guest-sidebar__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} title={collapsed ? t(label) : undefined}>
        <span className="sidebar-link__icon"><Icon /></span>
        <b className="sidebar-link__label">{t(label)}</b>
      </Link>;
    })}
  </nav>;
}

export function GuestSidebar({ collapsed, onToggle }) {
  const { t } = useTranslation('navigation');
  return <aside className="guest-sidebar" aria-label="Public site navigation">
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
    <div className="guest-sidebar__brand"><Brand compact collapsed={collapsed} /></div>
    <GuestNavigation collapsed={collapsed} />
  </aside>;
}

export function GuestTopbar({ onOpenMenu }) {
  const { t } = useTranslation('navigation');
  const location = useLocation();
  const title = useMemo(() => guestItems.find(({ to }) => {
    const path = to.split('#')[0];
    return path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);
  })?.label || 'home', [location.pathname]);

  return <header className="guest-topbar">
    <button type="button" className="guest-topbar__menu" onClick={onOpenMenu} aria-label="Open navigation"><Menu /></button>
    <div className="guest-topbar__title"><small>HolaVietnamese</small><strong>{t(title)}</strong></div>
    <div className="guest-topbar__actions">
      <LanguageSwitcher compact />
      <Link to="/login" className="guest-topbar__signin">{t('signIn')}</Link>
      <Link to="/welcome" className="guest-topbar__cta">{t('getStarted')}</Link>
    </div>
  </header>;
}

export function GuestMobileDrawer({ open, onClose }) {
  const { t } = useTranslation('navigation');
  const closeRef = useRef(null);
  const drawerRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = [...drawerRef.current.querySelectorAll('a[href], button:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  return <AnimatePresence>{open && <>
    <motion.button type="button" className="guest-drawer__backdrop" aria-label="Close navigation" onClick={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />
    <motion.aside ref={drawerRef} className="guest-drawer" role="dialog" aria-modal="true" aria-label="Guest navigation" initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} transition={{type:'spring',damping:28,stiffness:280}}>
      <div className="guest-drawer__head"><button ref={closeRef} type="button" onClick={onClose} aria-label="Close navigation"><X/></button></div>
      <GuestNavigation onNavigate={onClose}/>
      <div className="guest-drawer__actions"><Link to="/login" onClick={onClose}>{t('signIn')}</Link><Link to="/welcome" onClick={onClose}>{t('learnFree')}</Link></div>
    </motion.aside>
  </>}</AnimatePresence>;
}

export default GuestSidebar;
