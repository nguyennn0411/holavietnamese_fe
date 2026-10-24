import { learnerService } from '@/services/learnerService';
import { learningPathService } from '@/services/learningPathService';
import { STORAGE_KEY } from '../context/OnboardingContext';
import { buildOnboardingRecommendation } from './recommendationEngine';

export const onboardingService = {
  readGuestProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  },
  hasCompletedExperience() {
    const data = this.readGuestProgress();
    return Boolean(data?.guestExperienceCompleted || data?.firstLessonCompleted || data?.placementTestCompleted);
  },
  async syncGuestProgress() {
    const data = this.readGuestProgress();
    if (!this.hasCompletedExperience()) return { skipped: true };
    const recommendation = buildOnboardingRecommendation(data);
    await learnerService.saveOnboarding({
      nativeLanguage: 'en',
      learningGoal: recommendation.goalId,
      targetLevel: recommendation.targetLevel,
      dailyLearningGoalMinutes: data.dailyGoalMinutes,
      country: '',
    });
    await learningPathService.updatePreferences({
      level: recommendation.targetLevel,
      levelSource: data.placementResult?.targetLevel ? 'PLACEMENT' : 'ONBOARDING',
      learningGoals: [...new Set([
        recommendation.goalId,
        ...(recommendation.secondaryGoalIds || []),
      ].filter(Boolean))],
      dailyStudyMinutes: data.dailyGoalMinutes || 15,
      placementTakenAt: data.placementResult?.completedAt || null,
    });
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { success: true, profileSynced: true, activityResultSynced: true };
  },
};
