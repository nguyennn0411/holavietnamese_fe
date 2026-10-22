import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { AuthRequiredPage } from '@/pages/auth/AuthRequiredPage';
import { BilingualText } from '@/components/common/BilingualText';

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
