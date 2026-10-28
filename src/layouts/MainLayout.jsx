import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/application/context/AuthContext';
import { AppFooter, LayoutToast } from '@/components/layout';
import { learnerService } from '@/services/learnerService';

import { LearnerSidebar, LearnerTopbar } from '@/components/learner/LearnerShell';
import { GuestMobileDrawer, GuestSidebar, GuestTopbar } from '@/components/guest/GuestShell';
import { AiTutorFloatingButton } from '@/components/common/AiTutorFloatingButton';

export function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [learnerStats, setLearnerStats] = useState({ streak: 0, xp: 0 });
  const [toastError, setToastError] = useState(location.state?.authError || null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('hola:sidebar-collapsed');
    if (saved !== null) return saved === 'true';
    const legacyKey = isAuthenticated ? 'hola:learner-sidebar' : 'hola:guest-sidebar';
    return localStorage.getItem(legacyKey) === 'collapsed';
  });
  const [guestDrawerOpen, setGuestDrawerOpen] = useState(false);

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

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((previous) => {
      const next = !previous;
      localStorage.setItem('hola:sidebar-collapsed', String(next));
      localStorage.setItem('hola:guest-sidebar', next ? 'collapsed' : 'expanded');
      localStorage.setItem('hola:learner-sidebar', next ? 'collapsed' : 'expanded');
      return next;
    });
  }, []);

  const closeGuestDrawer = useCallback(() => setGuestDrawerOpen(false), []);

  useEffect(() => closeGuestDrawer(), [location.pathname, closeGuestDrawer]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const main = document.getElementById('main-content');
    if (main) main.scrollTop = 0;

  }, [location.pathname]);

  return (
    <div className={`layout-shell ${isAuthenticated ? 'learner-app' : 'guest-app'} ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <a className="skip-link" href="#main-content"><BilingualText>{"Chuyển đến nội dung chính"}</BilingualText></a>
      <LayoutToast message={toastError} onClose={() => setToastError(null)} />
      {isAuthenticated ? (
        <LearnerSidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      ) : (
        <>
          <GuestSidebar collapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
          <GuestMobileDrawer open={guestDrawerOpen} onClose={closeGuestDrawer} />
        </>
      )}
      <div className="layout-shell__body">
        {isAuthenticated ? (
          <LearnerTopbar user={user} stats={learnerStats} onLogout={logout} />
        ) : (
          <GuestTopbar onOpenMenu={() => setGuestDrawerOpen(true)} />
        )}
        <main
          className={`layout-main ${isGuestHome ? 'layout-main--full' : ''} ${isAuthenticated ? 'learner-app__main' : 'guest-app__main'}`}
          id="main-content"
        >

          <Outlet />

        </main>
        {isAuthenticated ? (
          <div className="learner-app__footer">
            <AppFooter />
          </div>
        ) : (
          <div className="guest-app__footer">
            <AppFooter />
          </div>
        )}
      </div>
      {isAuthenticated && <AiTutorFloatingButton />}
    </div>
  );
}
