import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BilingualTextProvider } from '@/shared/components/common/BilingualText';
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { SiteContentProvider } from '@/features/admin/context/SiteContentContext';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';

const AppToaster = lazy(() => import('@/shared/components/common/AppToaster'));

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <BilingualTextProvider>
        <Suspense fallback={null}>
          <AppToaster />
        </Suspense>
        <ErrorBoundary>
          <SiteContentProvider>
            <AuthProvider>
              <OnboardingProvider>{children}</OnboardingProvider>
            </AuthProvider>
          </SiteContentProvider>
        </ErrorBoundary>
      </BilingualTextProvider>
    </BrowserRouter>
  );
}
