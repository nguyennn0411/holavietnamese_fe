import { useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AuthRequiredPage } from '@/features/auth/pages/auth/AuthRequiredPage';
import { BilingualText } from '@/shared/components/common/BilingualText';

export function RequireAuth({ fallbackFeature }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="loading-spinner" aria-hidden="true" />
        <p className="text-sm font-semibold text-[#C2410C]">
          <BilingualText vi="Đang kiểm tra trạng thái đăng nhập…" en="Checking authentication status…" />
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthRequiredPage
        forcedFeature={fallbackFeature}
        targetPath={location.pathname + location.search}
      />
    );
  }

  return <Outlet />;
}

export default RequireAuth;
