import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;

export const learnerService = {
  verifyEmailByToken(token) {
    return axiosClient.get('/api/auth/verify-email', { params: { token } });
  },
  resendVerificationEmail(email) {
    return axiosClient.post('/api/auth/verify-email/resend', { email });
  },
  forgotPasswordInitiate(email) {
    return axiosClient.post('/api/auth/forgot-password/initiate', { email });
  },
  forgotPasswordVerifyOtp(email, otp) {
    return axiosClient.post('/api/auth/forgot-password/verify-otp', { email, otp });
  },
  forgotPasswordReset(email, otp, newPassword) {
    return axiosClient.post('/api/auth/forgot-password/reset-password', { email, otp, newPassword });
  },
  saveOnboarding(data) {
    return axiosClient.post('/api/users/onboarding', {
      nativeLanguage: data.nativeLanguage,
      learningGoal: data.learningGoal,
      targetLevel: data.targetLevel,
      dailyLearningGoalMinutes: data.dailyLearningGoalMinutes ?? data.dailyMinutes,
      country: data.country || '',
    });
  },
  async getProfile() {
    return resultOf(await axiosClient.get('/api/users/me'));
  },
  updateProfile(data) {
    const fields = ['fullName', 'phoneNumber', 'avatarUrl', 'country', 'nativeLanguage', 'learningGoal', 'targetLevel'];
    const payload = Object.fromEntries(fields.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]));
    return axiosClient.put('/api/users/me', payload);
  },
  async getSettings() {
    return resultOf(await axiosClient.get('/api/users/settings'));
  },
  updateSettings(data) {
    return axiosClient.put('/api/users/settings', {
      audioSpeed: Number(data.audioSpeed),
      pronunciationHintsEnabled: data.pronunciationHintsEnabled ?? data.pronunciationTips ?? false,
      autoTranslateEnabled: data.autoTranslateEnabled ?? data.showTranslation ?? false,
      notificationsEnabled: data.notificationsEnabled ?? data.emailNotifications ?? false,
      dailyLearningGoalMinutes: Number(data.dailyLearningGoalMinutes ?? data.dailyGoalMinutes),
    });
  },
  async getProgressData() {
    return resultOf(await axiosClient.get('/api/users/progress'));
  },
  async getMyLearningOverview() {
    return resultOf(await axiosClient.get('/api/users/progress'));
  },
  async getAchievements() {
    return resultOf(await axiosClient.get('/api/users/achievements'));
  },
  async getNotifications() {
    const result = resultOf(await axiosClient.get('/api/users/notifications'));
    return Array.isArray(result) ? result : (result?.content ?? []);
  },
  async markNotificationRead(id) {
    await axiosClient.put(`/api/users/notifications/${id}/read`);
    return this.getNotifications();
  },
  async markAllNotificationsRead() {
    await axiosClient.put('/api/users/notifications/read-all');
    return this.getNotifications();
  },
};
