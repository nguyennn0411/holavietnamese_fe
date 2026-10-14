import { BilingualText } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/application/context/AuthContext';
import { AppFooter, AppHeader, LayoutToast } from '@/components/layout';
import { learnerService } from '@/services/learnerService';
import { PageTransition } from '@/components/common/PageTransition';
import { AiTutorFloatingButton } from '@/components/common/AiTutorFloatingButton';

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const location = useLocation();
  const [learnerStats, setLearnerStats] = useState(() => {
    try {
      const saved = localStorage.getItem('learner_stats');
      if (saved) return JSON.parse(saved);
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return { streak: u.streakCount ?? 0, xp: u.totalXp ?? 0, hearts: u.hearts ?? 5 };
      }
    } catch {
      // ignore
    }
    return { streak: 0, xp: 0, hearts: 5 };
  });
  const [toastError, setToastError] = useState(location.state?.authError || null);

  useEffect(() => {
    if (!location.state?.authError) return undefined;
    setToastError(location.state.authError);
    const timer = setTimeout(() => setToastError(null), 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setLearnerStats((prev) => {
          const next = {
            streak: e.detail.streakCount ?? e.detail.streak ?? prev.streak,
            xp: e.detail.totalXp ?? e.detail.xp ?? prev.xp,
            hearts: e.detail.hearts ?? prev.hearts ?? 5,
          };
          localStorage.setItem('learner_stats', JSON.stringify(next));
          return next;
        });
      }
    };
    window.addEventListener('learner-stats-updated', handleUpdate);
    return () => window.removeEventListener('learner-stats-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLearnerStats({ streak: 0, xp: 0, hearts: 5 });
      return;
    }

    learnerService.getProgressData()
      .then((progress) => {
        const stats = {
          streak: progress.streakCount ?? 0,
          xp: progress.totalXp ?? 0,
          hearts: progress.hearts ?? 5,
        };
        setLearnerStats(stats);
        localStorage.setItem('learner_stats', JSON.stringify(stats));
      })
      .catch(() => {});
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
      <AiTutorFloatingButton />
    </div>
  );
}
