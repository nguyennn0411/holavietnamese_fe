import { learnerService } from '@/services/learnerService';
import { STORAGE_KEY } from '../context/OnboardingContext';

const levelMap = { new: 'A1', words: 'A1', simple: 'A2', everyday: 'B1', fluent: 'B2' };

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
    await learnerService.saveOnboarding({
      nativeLanguage: 'en',
      learningGoal: data.learningReasons?.[0] || 'other',
      targetLevel: levelMap[data.currentLevel] || 'A1',
      dailyLearningGoalMinutes: data.dailyGoalMinutes,
      country: '',
    });
    const next = {
      ...data,
      onboardingCompleted: true,
      syncStatus: {
        profile: 'synced',
        activityResult: 'pending-backend-endpoint',
        syncedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return { success: true, profileSynced: true, activityResultSynced: false };
  },
};
