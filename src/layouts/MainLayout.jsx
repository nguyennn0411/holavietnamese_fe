import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import '@/presentation/styles/layout.css';

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <div className="layout-shell">
      {/* ===== HEADER ===== */}
      <header className="layout-header">
        <div className="layout-brand">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="layout-logo">H</div>
            <span className="layout-brand-name">HolaVietnamese</span>
          </Link>
          <span className="layout-badge">ĐỐNG SƠN POP</span>
        </div>

        <nav className="layout-nav" aria-label="Main navigation">
          <NavLink to="/" end className="layout-nav-link">Features</NavLink>
          <NavLink to="/courses" className="layout-nav-link">Courses</NavLink>
          <NavLink to="/my-courses" className="layout-nav-link">My Courses</NavLink>
          <NavLink to="/progress" className="layout-nav-link">Progress</NavLink>
          <NavLink to="/vocabulary" className="layout-nav-link">Vocabulary</NavLink>
        </nav>

        <div className="layout-user-section">
          <button className="layout-pause-btn" type="button">⏸ Pause motion</button>
          
          {loading ? (
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>…</span>
          ) : isAuthenticated ? (
            <>
              <span className="layout-greeting">
                Xin chào, <strong>{user?.fullName || user?.username}</strong>
              </span>
              <button className="layout-logout-btn" onClick={logout} type="button">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="layout-nav-link" style={{ fontWeight: '600' }}>
                Sign in
              </Link>
              <Link to="/register" className="layout-cta-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Get started ↗
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="layout-footer">
        <div>
          <div className="layout-footer-brand">HolaVietnamese</div>
          <div className="layout-footer-tagline">Learn Vietnamese, Live Vietnam.</div>
        </div>
        <div className="layout-footer-links">
          <a href="#" className="layout-footer-link">Help</a>
          <a href="#" className="layout-footer-link">Privacy</a>
          <a href="#" className="layout-footer-link">Terms</a>
        </div>
      </footer>
    </div>
  );
}
