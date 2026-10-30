import axiosClient from '@/shared/api/axiosClient';

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
  getAvatarUploadSignature() {
    return axiosClient.post('/api/users/me/avatar/signature');
  },
  saveAvatarUrl(avatarUrl) {
    return axiosClient.put('/api/users/me/avatar', { avatarUrl });
  },
  async uploadAvatar(file) {
    const signatureResponse = await this.getAvatarUploadSignature();
    const signature = resultOf(signatureResponse);
    const requiredFields = ['uploadUrl', 'apiKey', 'timestamp', 'signature'];
    if (!requiredFields.every((field) => signature?.[field] !== undefined && signature[field] !== '')) {
      throw new Error(signatureResponse?.message || 'Không nhận được thông tin tải ảnh hợp lệ.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', String(signature.timestamp));
    formData.append('signature', signature.signature);
    if (signature.folder) formData.append('folder', signature.folder);
    if (signature.publicId) formData.append('public_id', signature.publicId);

    const cloudinaryResponse = await fetch(signature.uploadUrl, {
      method: 'POST',
      body: formData,
    });
    const uploaded = await cloudinaryResponse.json().catch(() => ({}));
    if (!cloudinaryResponse.ok) {
      throw new Error(uploaded?.error?.message || uploaded?.message || 'Upload ảnh thất bại.');
    }
    if (!uploaded?.secure_url) {
      throw new Error('Cloudinary không trả về đường dẫn ảnh.');
    }

    return this.saveAvatarUrl(uploaded.secure_url);
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
  async checkInToday() {
    return resultOf(await axiosClient.post('/api/users/checkin'));
  },
  async awardXp(amount, eventType = 'LESSON_COMPLETED', description = 'Hoàn thành bài học') {
    return resultOf(await axiosClient.post('/api/users/xp/award', { amount, eventType, description }));
  },
  async updateHearts(hearts) {
    return resultOf(await axiosClient.put('/api/users/hearts', { hearts }));
  },
  async getMyLearningOverview() {
    return resultOf(await axiosClient.get('/api/users/progress'));
  },
  async getAchievements() {
    return resultOf(await axiosClient.get('/api/users/achievements'));
  },
  async getNotifications(page = 1, size = 20) {
    try {
      const res = await axiosClient.get('/api/notifications', { params: { page, size } });
      const result = resultOf(res);
      return Array.isArray(result) ? result : (result?.content ?? []);
    } catch {
      // Fallback for QA test environment
      const res = await axiosClient.get('/api/users/notifications');
      const result = resultOf(res);
      return Array.isArray(result) ? result : (result?.content ?? []);
    }
  },
  async getUnreadCount() {
    try {
      const res = await axiosClient.get('/api/notifications/unread-count');
      const result = resultOf(res);
      if (typeof result === 'number') return result;
      if (typeof result?.unreadCount === 'number') return result.unreadCount;
      return 0;
    } catch {
      const list = await this.getNotifications();
      return list.filter((n) => !(n.isRead ?? n.read)).length;
    }
  },
  async markNotificationRead(id) {
    try {
      await axiosClient.put(`/api/notifications/${id}/read`);
    } catch {
      await axiosClient.put(`/api/users/notifications/${id}/read`);
    }
    return this.getNotifications();
  },
  async markAllNotificationsRead() {
    try {
      await axiosClient.put('/api/notifications/read-all');
    } catch {
      await axiosClient.put('/api/users/notifications/read-all');
    }
    return this.getNotifications();
  },
  async deleteNotification(id) {
    try {
      await axiosClient.delete(`/api/notifications/${id}`);
    } catch {
      await axiosClient.delete(`/api/users/notifications/${id}`);
    }
    return this.getNotifications();
  },
  async clearReadNotifications() {
    try {
      await axiosClient.delete('/api/notifications/clear-read');
    } catch {
      // Graceful fallback if endpoint is not implemented on server
    }
    return this.getNotifications();
  },
  async sendTestNotification() {
    return axiosClient.post('/api/notifications/test');
  },
};
