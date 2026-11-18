import { learnerService } from '@/features/learning/api/learnerService';
import { learningPathService } from '@/features/learning/api/learningPathService';
import { getStorageKey, LEGACY_STORAGE_KEY } from '../context/OnboardingContext';
import { buildOnboardingRecommendation } from './recommendationEngine';

export const onboardingService = {
  readGuestProgress(userId) {
    try {
      const activeId = userId || localStorage.getItem('userId');
      const key = getStorageKey(activeId);
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
      const fallback = localStorage.getItem(LEGACY_STORAGE_KEY) || localStorage.getItem('hola:onboarding:guest');
      return fallback ? JSON.parse(fallback) : null;
    } catch {
      return null;
    }
  },
  hasCompletedExperience(userId) {
    const data = this.readGuestProgress(userId);
    return Boolean(data?.guestExperienceCompleted || data?.firstLessonCompleted || data?.placementTestCompleted);
  },
  async syncProgress(explicitData, userId) {
    const data = explicitData || this.readGuestProgress(userId);
    if (!data) return { skipped: true };
    if (data.onboardingCompleted && data.syncStatus?.profile === 'synced' && data.syncStatus?.activityResult === 'learning-path-synced') {
      return { success: true, alreadySynced: true };
    }
    const token = localStorage.getItem('token');
    const recommendation = buildOnboardingRecommendation(data);

    if (token) {
      // Run both API updates in parallel with Promise.all to cut network latency in half
      await Promise.all([
        learnerService.saveOnboarding({
          nativeLanguage: 'en',
          learningGoal: recommendation.goalId,
          targetLevel: recommendation.targetLevel,
          dailyLearningGoalMinutes: data.dailyGoalMinutes,
          country: '',
        }),
        learningPathService.updatePreferences({
          level: recommendation.targetLevel,
          levelSource: data.placementResult?.targetLevel ? 'PLACEMENT' : 'ONBOARDING',
          learningGoals: [...new Set([
            recommendation.goalId,
            ...(recommendation.secondaryGoalIds || []),
          ].filter(Boolean))],
          dailyStudyMinutes: data.dailyGoalMinutes || 15,
          placementTakenAt: data.placementResult?.completedAt || null,
        }),
      ]);
    }

    const next = {
      ...data,
      onboardingCompleted: true,
      recommendation,
      syncStatus: {
        profile: 'synced',
        activityResult: 'learning-path-synced',
        syncedAt: new Date().toISOString(),
      },
    };
    const activeId = userId || localStorage.getItem('userId');
    const key = getStorageKey(activeId);
    try {
      localStorage.setItem(key, JSON.stringify(next));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem('hola:onboarding:guest');
    } catch {}
    return { success: true, profileSynced: true, activityResultSynced: true };
  },
};
