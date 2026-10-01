import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';

export function AdminRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f0e8' }}>
        <p style={{ color: '#8B1A1A', fontWeight: 'bold' }}>Đang xác thực quyền Quản trị…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN') || user?.username === 'admin';

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', margin: 0, color: '#8B1A1A' }}>403</h1>
        <h2 style={{ color: '#1f2937', marginTop: '0.5rem' }}>Truy cập bị từ chối</h2>
        <p style={{ color: '#6b7280', maxWidth: '400px' }}>Tài khoản của bạn không có quyền Quản trị viên (ADMIN) để truy cập khu vực này.</p>
        <Link to="/" style={{ padding: '0.6rem 1.4rem', borderRadius: '999px', background: '#8B1A1A', color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
          Quay lại Trang chủ
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
