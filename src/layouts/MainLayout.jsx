import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useAuth } from '@/contexts/AuthContext';
import { AppFooter, LayoutToast } from '@/components/layout';
import { learnerService } from '@/services/learnerService';
import { PageTransition } from '@/components/common/PageTransition';
import { LearnerSidebar, LearnerTopbar } from '@/components/learner/LearnerShell';
import { GuestMobileDrawer, GuestSidebar, GuestTopbar } from '@/components/guest/GuestShell';
import { AiSidebarProvider, useAiSidebar } from '@/contexts/AiSidebarContext';
import { CourseraAiSidebar } from '@/components/ai/CourseraAiSidebar';
import { CourseraAiDockTrigger } from '@/components/ai/CourseraAiDockTrigger';

function MainLayoutShell({
  isAuthenticated,
  user,
  logout,
  learnerStats,
  toastError,
  setToastError,
  isSidebarCollapsed,
  toggleSidebar,
  guestDrawerOpen,
  setGuestDrawerOpen,
  closeGuestDrawer,
}) {
  const location = useLocation();
  const isGuestHome = (location.pathname === '/' || location.pathname === '') && !isAuthenticated;
<<<<<<< HEAD

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
    document.getElementById('main-content')?.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.getElementById('main-content')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
=======
  const { isOpen: isAiOpen, width: aiWidth, setWidth: setAiWidth, closeAiSidebar } = useAiSidebar();
>>>>>>> 8d43116e8293d0a5196eba58e2247eab915417b2

  return (
    <div
      className={`layout-shell ${isAuthenticated ? 'learner-app' : 'guest-app'} ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''} ${isAiOpen ? 'has-ai-sidebar' : ''}`}
      style={isAiOpen ? { '--ai-sidebar-width': `${aiWidth}px` } : undefined}
    >
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
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}><Outlet /></PageTransition>
          </AnimatePresence>
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

      {/* Coursera Resizable Right AI Panel */}
      {isAiOpen && (
        <CourseraAiSidebar
          width={aiWidth}
          onResize={setAiWidth}
          onClose={closeAiSidebar}
        />
      )}

      {/* Right Edge Dock Trigger (shown when AI is closed) */}
      <CourseraAiDockTrigger />
    </div>
  );
}

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
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.getElementById('main-content')?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AiSidebarProvider isSidebarCollapsed={isSidebarCollapsed} setIsSidebarCollapsed={setIsSidebarCollapsed}>
      <MainLayoutShell
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        learnerStats={learnerStats}
        toastError={toastError}
        setToastError={setToastError}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        guestDrawerOpen={guestDrawerOpen}
        setGuestDrawerOpen={setGuestDrawerOpen}
        closeGuestDrawer={closeGuestDrawer}
      />
    </AiSidebarProvider>
  );
}
