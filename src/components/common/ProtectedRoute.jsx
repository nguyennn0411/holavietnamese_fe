import { BilingualText } from '@/components/common/BilingualText';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { AuthRequiredPage } from '@/pages/auth/AuthRequiredPage';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--color-red-hover)', fontWeight: '600' }}><BilingualText>{"Đang tải Hola Vietnamese…"}</BilingualText></p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthRequiredPage targetPath={location.pathname + location.search} />;
  }

  return <Outlet />;
}
