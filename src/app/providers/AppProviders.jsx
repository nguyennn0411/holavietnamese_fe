import { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BilingualTextProvider } from '@/components/common/BilingualText';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { SiteContentProvider } from '@/contexts/SiteContentContext';
import { OnboardingProvider } from '@/features/onboarding/context/OnboardingContext';

const AppToaster = lazy(() => import('@/components/common/AppToaster'));

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
