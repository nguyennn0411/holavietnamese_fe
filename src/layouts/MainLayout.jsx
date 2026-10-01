import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { ROUTES } from '@/constants/routes';
import '@/presentation/styles/layout.css';

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const isAdmin = user?.roles?.includes('ADMIN') || user?.username === 'admin';

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <NavLink to="/" end className="layout-nav-link">Trang chủ</NavLink>
          <NavLink to="/my-learning" className="layout-nav-link">Góc học tập</NavLink>
          <NavLink to="/courses" className="layout-nav-link">Khóa học</NavLink>
          <NavLink to="/progress" className="layout-nav-link">Tiến độ</NavLink>
          <NavLink to="/achievements" className="layout-nav-link">Thành tích</NavLink>
          <NavLink to="/vocabulary" className="layout-nav-link">Sổ từ vựng</NavLink>
        </nav>

        <div className="layout-user-section">
          {loading ? (
            <span style={{ color: '#fff', fontSize: '0.85rem' }}>…</span>
          ) : isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Notifications */}
              <NotificationDropdown />

              {/* User Menu Dropdown */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    background: 'none',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#8B1A1A',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {user?.fullName || user?.username}
                  </span>
                  <span style={{ fontSize: '0.7rem' }}>▼</span>
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '115%',
                    width: '210px',
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
                    zIndex: 1000,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#faf8f5' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#111827', display: 'block' }}>
                        {user?.fullName}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        @{user?.username}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ padding: '10px 16px', color: '#374151', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      👤 Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ padding: '10px 16px', color: '#374151', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      ⚙️ Cài đặt học tập
                    </Link>
                    <Link
                      to="/my-learning"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ padding: '10px 16px', color: '#374151', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}
                    >
                      📚 My Learning
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          padding: '10px 16px',
                          color: '#8B1A1A',
                          textDecoration: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          backgroundColor: '#fef2f2',
                          borderTop: '1px solid #fee2e2',
                        }}
                      >
                        🛡️ Trang Quản trị (Admin)
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      style={{
                        padding: '10px 16px',
                        border: 'none',
                        borderTop: '1px solid #f3f4f6',
                        background: 'none',
                        color: '#dc2626',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="layout-nav-link" style={{ fontWeight: '600' }}>
                Sign in
              </Link>
              <Link to="/register" className="layout-cta-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Get started ↗
              </Link>
            </div>
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
          <Link to="/settings" className="layout-footer-link">Cài đặt</Link>
          <a href="#" className="layout-footer-link">Help</a>
          <a href="#" className="layout-footer-link">Privacy</a>
          <a href="#" className="layout-footer-link">Terms</a>
        </div>
      </footer>
    </div>
  );
}
