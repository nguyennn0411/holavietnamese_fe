import { BilingualText } from '@/components/common/BilingualText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { Brand } from './Brand';
import { MainNavigation } from './MainNavigation';
import { UserMenu } from './UserMenu';
import { Menu, X, Flame, Zap } from 'lucide-react';

export function AppHeader({ isAuthenticated, user, loading, stats, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN');
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand compact />
        <button className="mobile-menu-button secondary" aria-label="Mở menu điều hướng" aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
        <div className={`site-header__navigation ${menuOpen ? 'is-open' : ''}`}><MainNavigation onNavigate={() => setMenuOpen(false)} /></div>
        <div className="site-header__actions">
          {loading ? <span className="site-header__loading" aria-label="Đang tải">•••</span> : isAuthenticated ? (
            <>
              <div className="learner-stats" aria-label="Thống kê học tập">
                <span title="Chuỗi ngày học liên tục"><Flame size={15} aria-hidden="true"/> <strong>{stats.streak}</strong></span>
                <span title="Tổng điểm kinh nghiệm"><Zap size={15} aria-hidden="true"/> <strong>{stats.xp}</strong> XP</span>
              </div>
              <NotificationDropdown />
              <UserMenu user={user} isAdmin={isAdmin} onLogout={onLogout} />
            </>
          ) : (
            <div className="site-header__guest-actions">
              <Link to="/login" className="site-header__login"><BilingualText>{"Đăng nhập"}</BilingualText></Link>
              <Link to="/register" className="site-header__cta"><BilingualText>{"Học miễn phí"}</BilingualText></Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
