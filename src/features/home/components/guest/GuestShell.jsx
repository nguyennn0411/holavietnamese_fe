import { useEffect, useMemo, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { Brand } from '@/shared/components/layout/Brand';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { localizedSiteField, safeInternalPath, useSiteContent } from '@/features/admin/context/SiteContentContext';
import { siteContentIcon } from '@/shared/components/common/siteContentIcons';
import { MENU_PLACEMENTS } from '@/config/siteContentDefaults';

function useGuestItems() {
  const { i18n } = useTranslation();
  const { getMenuItems } = useSiteContent();
  const language = i18n.resolvedLanguage || i18n.language || 'en';
  return useMemo(() => getMenuItems(MENU_PLACEMENTS.GUEST).map((item) => ({
    ...item,
    to: safeInternalPath(item.path),
    label: localizedSiteField(item, 'label', language),
    icon: siteContentIcon(item.iconKey),
    end: item.path === '/',
  })), [getMenuItems, language]);
}

function GuestNavigation({ collapsed = false, onNavigate }) {
  const location = useLocation();
  const guestItems = useGuestItems();
  return <nav className="guest-sidebar__nav" aria-label="Guest navigation">
    {guestItems.map(({ id, code, to, label, icon: Icon, end }) => {
      if (!to) return <div key={id ?? code} className="guest-sidebar__link is-disabled" aria-disabled="true" title={label}>
        <span className="sidebar-link__icon"><Icon /></span>
        <b className="sidebar-link__label">{label}</b>
      </div>;
      const [path, hash = ''] = to.split('#');
      const active = end
        ? location.pathname === path && !location.hash
        : hash
          ? location.pathname === path && location.hash === `#${hash}`
          : location.pathname === path || location.pathname.startsWith(`${path}/`);
      return <Link key={id ?? code} to={to} onClick={onNavigate} className={`guest-sidebar__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} title={collapsed ? label : undefined}>
        <span className="sidebar-link__icon"><Icon /></span>
        <b className="sidebar-link__label">{label}</b>
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
  const guestItems = useGuestItems();
  const title = useMemo(() => guestItems.find(({ to }) => {
    if (!to) return false;
    const path = to.split('#')[0];
    return path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);
  })?.label || t('home'), [guestItems, location.pathname, t]);

  return <header className="guest-topbar">
    <button type="button" className="guest-topbar__menu" onClick={onOpenMenu} aria-label="Open navigation"><Menu /></button>
    <div className="guest-topbar__title"><small>HolaVietnamese</small><strong>{title}</strong></div>
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
