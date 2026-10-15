import { BilingualText } from '@/components/common/BilingualText';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ContentImage } from '@/components/common/ContentImage';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, UserRound, Settings, Trophy, Shield, LogOut, Sparkles } from 'lucide-react';

export function UserMenu({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = user?.fullName || user?.username || 'Học viên';
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <div className="user-menu" ref={menuRef}>
      <button type="button" className="user-menu__trigger" onClick={() => setOpen((value) => !value)} aria-label={`Menu tài khoản của ${displayName}`} aria-expanded={open} aria-haspopup="menu">
        <span className="user-menu__avatar">
          <ContentImage src={user?.avatarUrl} alt={`Ảnh đại diện của ${displayName}`} className="user-menu__avatar-image"
            width={30} height={30} loading="eager" referrerPolicy="no-referrer"
            fallback={<span aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>} />
        </span>
        <span className="user-menu__name">{displayName}</span>
        <ChevronDown className="user-menu__chevron" size={16} aria-hidden="true" />
      </button>
      <AnimatePresence>
      {open && (
        <motion.div className="user-menu__panel" role="menu" initial={reduceMotion ? false : { opacity: 0, y: -8, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: .98 }} transition={{ duration: reduceMotion ? 0 : .18 }}>
          <div className="user-menu__identity"><strong>{displayName}</strong><span>@{user?.username || 'learner'} · <BilingualText>{isAdmin ? 'Quản trị viên' : 'Học viên'}</BilingualText></span></div>
          <Link to={ROUTES.EDTECH_DASHBOARD} onClick={closeMenu} role="menuitem"><Sparkles size={16}/><BilingualText>{"Lộ trình học EdTech"}</BilingualText></Link>
          <Link to="/profile" onClick={closeMenu} role="menuitem"><UserRound size={16}/><BilingualText>{"Hồ sơ cá nhân"}</BilingualText></Link>
          <Link to="/settings" onClick={closeMenu} role="menuitem"><Settings size={16}/><BilingualText>{"Cài đặt học tập"}</BilingualText></Link>
          <Link to="/achievements" onClick={closeMenu} role="menuitem"><Trophy size={16}/><BilingualText>{"Thành tích"}</BilingualText></Link>
          {isAdmin && <Link to="/admin" onClick={closeMenu} role="menuitem" className="user-menu__admin"><Shield size={16}/><BilingualText>{"Trang quản trị"}</BilingualText></Link>}
          <button type="button" className="user-menu__logout" onClick={() => { closeMenu(); onLogout(); }} role="menuitem"><LogOut size={16}/><BilingualText>{"Đăng xuất"}</BilingualText></button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
