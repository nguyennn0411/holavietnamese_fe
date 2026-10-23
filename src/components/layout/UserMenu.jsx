import { BilingualText, useBilingualLabel } from '@/components/common/BilingualText';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ContentImage } from '@/components/common/ContentImage';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, UserRound, Settings, Trophy, Shield, LogOut, Compass, GraduationCap } from 'lucide-react';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';

export function UserMenu({ user, isAdmin, isContentManager, onLogout }) {
  const label = useBilingualLabel();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const displayName = user?.fullName || user?.username || label('Học viên', 'Learner');
  const reduceMotion = useReducedMotion();
  const { confirm, confirmationDialog } = useConfirmDialog();

  const handleLogout = async () => {
    closeMenu();
    const confirmed = await confirm({
      title: <BilingualText vi="Đăng xuất khỏi HolaVietnamese?" en="Log out of HolaVietnamese?" />,
      description: <BilingualText vi="Bạn có chắc chắn muốn đăng xuất không?" en="Are you sure you want to log out?" />,
      confirmLabel: <BilingualText vi="Đăng xuất" en="Log Out" />,
      cancelLabel: <BilingualText vi="Hủy" en="Cancel" />,
      tone: 'danger',
    });
    if (confirmed) {
      onLogout();
    }
  };

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
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setOpen((value) => !value)}
        aria-label={label(`Menu tài khoản của ${displayName}`, `Account menu for ${displayName}`)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="user-menu__avatar">
          <ContentImage
            src={user?.avatarUrl}
            alt={label(`Ảnh đại diện của ${displayName}`, `Avatar of ${displayName}`)}
            className="user-menu__avatar-image"
            width={30}
            height={30}
            loading="eager"
            referrerPolicy="no-referrer"
            fallback={<span aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>}
          />
        </span>
        <span className="user-menu__name">{displayName}</span>
        <ChevronDown className="user-menu__chevron" size={16} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="user-menu__panel"
            role="menu"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <div className="user-menu__identity">
              <strong>{displayName}</strong>
              <span>
                {user?.email || `@${user?.username || 'learner'}`} ·{' '}
                <BilingualText
                  vi={isAdmin ? 'Quản trị viên' : isContentManager ? 'Quản lý nội dung' : 'Học viên'}
                  en={isAdmin ? 'Administrator' : isContentManager ? 'Content Manager' : 'Learner'}
                />
              </span>
            </div>
            <Link to={ROUTES.EDTECH_DASHBOARD} onClick={closeMenu} role="menuitem">
              <Compass size={16} />
              <BilingualText vi="Lộ trình học EdTech" en="EdTech Learning Path" />
            </Link>
            <Link to={ROUTES.MY_LEARNING} onClick={closeMenu} role="menuitem">
              <GraduationCap size={16} />
              <BilingualText vi="Góc học tập của tôi" en="My Learning" />
            </Link>
            <Link to="/profile" onClick={closeMenu} role="menuitem">
              <UserRound size={16} />
              <BilingualText vi="Hồ sơ cá nhân" en="My Profile" />
            </Link>
            <Link to="/settings" onClick={closeMenu} role="menuitem">
              <Settings size={16} />
              <BilingualText vi="Cài đặt học tập" en="Settings" />
            </Link>
            <Link to="/achievements" onClick={closeMenu} role="menuitem">
              <Trophy size={16} />
              <BilingualText vi="Thành tích" en="Achievements" />
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={closeMenu} role="menuitem" className="user-menu__admin">
                <Shield size={16} />
                <BilingualText vi="Trang quản trị" en="Admin Panel" />
              </Link>
            )}
            {isContentManager && !isAdmin && (
              <Link to="/admin/courses" onClick={closeMenu} role="menuitem" className="user-menu__admin">
                <Shield size={16} />
                <BilingualText vi="Quản lý khóa học" en="Course Management" />
              </Link>
            )}
            <button type="button" className="user-menu__logout" onClick={handleLogout} role="menuitem">
              <LogOut size={16} />
              <BilingualText vi="Đăng xuất" en="Log Out" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {confirmationDialog}
    </div>
  );
}
