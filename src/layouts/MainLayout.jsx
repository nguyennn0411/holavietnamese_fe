import { BilingualText } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/application/context/AuthContext';
import { AppFooter, AppHeader, LayoutToast } from '@/components/layout';
import { learnerService } from '@/services/learnerService';
import { PageTransition } from '@/components/common/PageTransition';

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();
  const [learnerStats, setLearnerStats] = useState({ streak: 0, xp: 0 });
  const [toastError, setToastError] = useState(location.state?.authError || null);

  useEffect(() => {
    if (!location.state?.authError) return undefined;
    setToastError(location.state.authError);
    const timer = setTimeout(() => setToastError(null), 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLearnerStats({ streak: 0, xp: 0 });
      return;
    }

    learnerService.getProgressData()
      .then((progress) => setLearnerStats({ streak: progress.streakCount ?? 0, xp: progress.totalXp ?? 0 }))
      .catch(() => setLearnerStats({ streak: 0, xp: 0 }));
  }, [isAuthenticated]);

  const isGuestHome = (location.pathname === '/' || location.pathname === '') && !isAuthenticated;

  return (
    <div className="layout-shell">
      <a className="skip-link" href="#main-content"><BilingualText>{"Chuyển đến nội dung chính"}</BilingualText></a>
      <LayoutToast message={toastError} onClose={() => setToastError(null)} />
      <AppHeader isAuthenticated={isAuthenticated} user={user} loading={loading} stats={learnerStats} onLogout={logout} />
      <main className={`layout-main ${isGuestHome ? 'layout-main--full' : ''}`} id="main-content">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}><Outlet /></PageTransition>
        </AnimatePresence>
      </main>
      <AppFooter />
    </div>
  );
}
