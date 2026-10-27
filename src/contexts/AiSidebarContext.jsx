import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AiSidebarContext = createContext(null);

const STORAGE_WIDTH_KEY = 'hola:ai-sidebar-width';
const STORAGE_OPEN_KEY = 'hola:ai-sidebar-open';
const DEFAULT_WIDTH = 420;
const MIN_WIDTH = 320;

export function AiSidebarProvider({ children, isSidebarCollapsed, setIsSidebarCollapsed }) {
  const location = useLocation();

  // Width is preserved across reloads
  const [width, setWidthState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WIDTH_KEY);
      const parsed = Number.parseInt(saved, 10);
      if (Number.isFinite(parsed) && parsed >= MIN_WIDTH && parsed <= 900) {
        return parsed;
      }
    } catch {
      // Ignore localStorage error
    }
    return DEFAULT_WIDTH;
  });

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
    const maxWidth = typeof window !== 'undefined' ? Math.max(MIN_WIDTH, window.innerWidth - 160) : 780;
    const clamped = Math.max(MIN_WIDTH, Math.min(maxWidth, newWidth));
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
      localStorage.setItem(STORAGE_OPEN_KEY, 'true');
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
      width: DEFAULT_WIDTH,
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
