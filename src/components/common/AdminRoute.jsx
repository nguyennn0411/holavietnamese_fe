import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';

export function AdminRoute() {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f8fafc' }}>
        <p style={{ color: '#8B1A1A', fontWeight: 'bold' }}>Đang xác thực quyền Quản trị…</p>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || user?.username === 'admin';

  // If user is a LEARNER attempting to access /admin -> redirect to home with flash message
  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ authError: 'Bạn không có quyền truy cập trang quản trị.' }}
        replace
      />
    );
  }

  return <Outlet />;
}
