import { useState, useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import '@/presentation/styles/layout.css';
import '@/presentation/styles/auth.css';

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.welcomeToast || null);

  useEffect(() => {
    if (location.state?.welcomeToast) {
      setToast(location.state.welcomeToast);
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="layout-loading">
        <span>Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-shell">
      {/* Toast Notification */}
      {toast && (
        <div className="auth-toast-notification">
          <span className="auth-toast-icon">🎉</span>
          <div className="auth-toast-content">
            <span className="auth-toast-title">Đăng ký thành công!</span>
            <span className="auth-toast-desc">{toast}</span>
          </div>
          <button className="auth-toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <header className="layout-header">
        <div className="layout-brand">
          <div className="layout-logo">H</div>
          <span className="layout-brand-name">HolaVietnamese</span>
          <span className="layout-badge">ĐỐNG SƠN POP</span>
        </div>

        <nav className="layout-nav">
          <Link to="/" className="layout-nav-link">Features</Link>
          <Link to="/" className="layout-nav-link">How it works</Link>
          <span className="layout-greeting">
            Xin chào, <strong>{user?.fullName || user?.username}</strong>
          </span>
        </nav>

        <div className="layout-user-section">
          <button className="layout-pause-btn">⏸ Pause motion</button>
          <button className="layout-logout-btn" onClick={logout}>Sign out</button>
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
