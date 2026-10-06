import { Link } from 'react-router-dom';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { Brand } from './Brand';
import { MainNavigation } from './MainNavigation';
import { UserMenu } from './UserMenu';

export function AppHeader({ isAuthenticated, user, loading, stats, onLogout }) {
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('ROLE_ADMIN');
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand compact />
        <MainNavigation />
        <div className="site-header__actions">
          {loading ? <span className="site-header__loading" aria-label="Đang tải">•••</span> : isAuthenticated ? (
            <>
              <div className="learner-stats" aria-label="Thống kê học tập">
                <span title="Chuỗi ngày học liên tục">🔥 <strong>{stats.streak}</strong></span>
                <span title="Tổng điểm kinh nghiệm">⚡ <strong>{stats.xp}</strong> XP</span>
              </div>
              <NotificationDropdown />
              <UserMenu user={user} isAdmin={isAdmin} onLogout={onLogout} />
            </>
          ) : (
            <div className="site-header__guest-actions">
              <Link to="/login" className="site-header__login">Đăng nhập</Link>
              <Link to="/register" className="site-header__cta">Học miễn phí</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
