import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import '@/presentation/styles/admin.css';

export function AdminLayout() {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: ROUTES.ADMIN, label: 'Dashboard', icon: '📊' },
    { to: ROUTES.ADMIN_USERS, label: 'Quản lý người dùng', icon: '👥' },
    { to: ROUTES.ADMIN_ROLES, label: 'Vai trò & Phân quyền', icon: '🛡️' },
    { to: ROUTES.ADMIN_ACHIEVEMENTS, label: 'Quản lý thành tích', icon: '🏆' },
    { to: ROUTES.ADMIN_XP_RULES, label: 'Quy tắc XP', icon: '⚡' },
    { to: ROUTES.ADMIN_AUDIT_LOGS, label: 'Nhật ký quản trị', icon: '📜' },
    { to: ROUTES.ADMIN_SETTINGS, label: 'Cấu hình hệ thống', icon: '⚙️' },
  ];

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-circle">H</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="admin-brand-title">HolaAdmin</span>
              <span className="admin-brand-tag">PORTAL</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hệ thống & Tiến độ</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === ROUTES.ADMIN}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            ← Về giao diện Học viên
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-area">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#64748b' }}>
            <span>Quản trị hệ thống</span>
            <span>/</span>
            <strong style={{ color: '#1e293b' }}>Hola Vietnamese</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1e293b' }}>
                {user?.fullName || 'Huy Nguyễn'}
              </strong>
              <span style={{ fontSize: '0.75rem', color: '#8B1A1A', fontWeight: 700 }}>ADMINISTRATOR</span>
            </div>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
