import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AiSidebarContext = createContext(null);

const STORAGE_WIDTH_KEY = 'hola:ai-sidebar-width';
const STORAGE_OPEN_KEY = 'hola:ai-sidebar-open';

const getMinAllowedWidth = () => {
  if (typeof window === 'undefined') return 420;
  // Kích cỡ tối thiểu (min) là 22% màn hình
  return Math.round(window.innerWidth * 0.22);
};

const getMaxAllowedWidth = () => {
  if (typeof window === 'undefined') return 576;
  // Kích cỡ tối đa (max) là 30% màn hình
  return Math.round(window.innerWidth * 0.30);
};

const getDefaultWidth = () => {
  return getMinAllowedWidth();
};

export function AiSidebarProvider({ children, isSidebarCollapsed, setIsSidebarCollapsed }) {
  const location = useLocation();

  // Kích cỡ mặc định khi mở luôn là min (22% màn hình)
  const [width, setWidthState] = useState(() => {
    return getDefaultWidth();
  });

  // Đảm bảo độ rộng luôn nằm trong khoảng [22%, 30%] khi resize cửa sổ
  useEffect(() => {
    const handleWindowResize = () => {
      const minW = getMinAllowedWidth();
      const maxW = getMaxAllowedWidth();
      setWidthState((prev) => {
        if (prev < minW) return minW;
        if (prev > maxW) return maxW;
        return prev;
      });
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Open state
  const [isOpen, setIsOpenState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_OPEN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Current learning context (e.g. lesson title, course title)
  const [learningContext, setLearningContext] = useState(null);

  // Initial prompt queued from another page (e.g. Lesson "Ask AI")
  const [pendingPrompt, setPendingPrompt] = useState(null);

  // Safety: never show sidebar during quizzes or on the full standalone /ai-tutor page
  const isQuizRoute = location.pathname.startsWith('/quizzes/') || location.pathname.startsWith('/quiz-attempts/');
  const isStandaloneAiTutor = location.pathname === '/ai-tutor';
  const isEligible = !isQuizRoute && !isStandaloneAiTutor;

  const setWidth = useCallback((newWidth) => {
    const minW = getMinAllowedWidth();
    const maxW = getMaxAllowedWidth();
    // Giới hạn trong khoảng min 22% đến max 30% màn hình
    const clamped = Math.max(minW, Math.min(maxW, newWidth));
    setWidthState(clamped);
    try {
      localStorage.setItem(STORAGE_WIDTH_KEY, String(clamped));
    } catch {
      // Ignore localStorage error
    }
  }, []);

  const openAiSidebar = useCallback((prompt = null) => {
    if (!isEligible) return;
    setIsOpenState(true);
    try {
      const defaultW = getDefaultWidth();
      localStorage.setItem(STORAGE_WIDTH_KEY, String(defaultW));
      localStorage.setItem(STORAGE_OPEN_KEY, 'true');
      setWidthState(defaultW);
    } catch {
      // Ignore
    }

    // Requirement: When AI is opened, automatically collapse the left sidebar!
    if (setIsSidebarCollapsed) {
      setIsSidebarCollapsed(true);
      try {
        localStorage.setItem('hola:sidebar-collapsed', 'true');
        localStorage.setItem('hola:learner-sidebar', 'collapsed');
        localStorage.setItem('hola:guest-sidebar', 'collapsed');
      } catch {
        // Ignore
      }
    }

    if (prompt) {
      setPendingPrompt(prompt);
    }
  }, [isEligible, setIsSidebarCollapsed]);

  const closeAiSidebar = useCallback(() => {
    setIsOpenState(false);
    try {
      localStorage.setItem(STORAGE_OPEN_KEY, 'false');
    } catch {
      // Ignore
    }
  }, []);

  const toggleAiSidebar = useCallback(() => {
    if (isOpen) {
      closeAiSidebar();
    } else {
      openAiSidebar();
    }
  }, [isOpen, closeAiSidebar, openAiSidebar]);

  const clearPendingPrompt = useCallback(() => {
    setPendingPrompt(null);
  }, []);

  const value = useMemo(() => ({
    isOpen: isOpen && isEligible,
    rawIsOpen: isOpen,
    isEligible,
    width,
    setWidth,
    learningContext,
    setLearningContext,
    pendingPrompt,
    clearPendingPrompt,
    openAiSidebar,
    closeAiSidebar,
    toggleAiSidebar,
  }), [
    isOpen,
    isEligible,
    width,
    setWidth,
    learningContext,
    pendingPrompt,
    clearPendingPrompt,
    openAiSidebar,
    closeAiSidebar,
    toggleAiSidebar,
  ]);

  return (
    <AiSidebarContext.Provider value={value}>
      {children}
    </AiSidebarContext.Provider>
  );
}

export function useAiSidebar() {
  const context = useContext(AiSidebarContext);
  if (!context) {
    return {
      isOpen: false,
      isEligible: false,
      width: 345,
      setWidth: () => {},
      learningContext: null,
      setLearningContext: () => {},
      pendingPrompt: null,
      clearPendingPrompt: () => {},
      openAiSidebar: () => {},
      closeAiSidebar: () => {},
      toggleAiSidebar: () => {},
    };
  }
  return context;
}
