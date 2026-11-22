import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';

export const LEGACY_STORAGE_KEY = 'hola:onboarding:v1';

export const getStorageKey = (userId) => {
  if (userId) return `hola:onboarding:user:${userId}`;
  return 'hola:onboarding:guest';
};

// Deprecated alias for backwards compatibility
export const STORAGE_KEY = LEGACY_STORAGE_KEY;

export const initialOnboardingData = {
  version: 1,
  learningReasons: [],
  currentLevel: null,
  selectedLevel: null,
  assessedLevel: null,
  placementScore: null,
  tierScores: null,
  dailyGoalMinutes: 10,
  learningPath: null,
  firstLessonCompleted: false,
  placementTestCompleted: false,
  placementResult: null,
  firstLessonResult: null,
  recommendation: null,
  requestedDestination: null,
  guestExperienceCompleted: false,
  onboardingCompleted: false,
  updatedAt: null,
  placementQuestionIndex: 0,
  placementAnswers: [],
  placementQuestions: null,
  lessonQuestionIndex: 0,
  lessonAnswers: [],
};

const readStored = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return initialOnboardingData;
    const parsed = JSON.parse(raw);
    return parsed?.version === 1 ? { ...initialOnboardingData, ...parsed } : initialOnboardingData;
  } catch {
    return initialOnboardingData;
  }
};

const OnboardingContext = createContext(null);

export function OnboardingProvider({ children }) {
  const auth = useAuth();
  const userId = auth?.user?.userId || auth?.user?.id || null;
  const storageKey = useMemo(() => getStorageKey(userId), [userId]);

  const [data, setData] = useState(() => readStored(storageKey));
  const currentKeyRef = useRef(storageKey);

  // Sync in-memory state whenever active user / storageKey changes
  useEffect(() => {
    if (currentKeyRef.current !== storageKey) {
      currentKeyRef.current = storageKey;
      setData(readStored(storageKey));
    }
  }, [storageKey]);

  // Listen for global reset event (e.g., logout or new registration)
  useEffect(() => {
    const handleReset = () => {
      setData(initialOnboardingData);
    };
    window.addEventListener('hola:onboarding-reset', handleReset);
    return () => window.removeEventListener('hola:onboarding-reset', handleReset);
  }, []);

  const update = useCallback((changes) => {
    setData((previous) => {
      const next = { ...previous, ...changes, version: 1, updatedAt: new Date().toISOString() };
      try {
        localStorage.setItem(currentKeyRef.current, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to save onboarding to localStorage:', err);
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(currentKeyRef.current);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('hola:onboarding:guest');
    } catch {}
    setData(initialOnboardingData);
  }, []);

  const value = useMemo(() => ({ data, update, reset, storageKey }), [data, update, reset, storageKey]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return context;
}
