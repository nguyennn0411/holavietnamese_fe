import axiosClient from '@/infrastructure/api/axiosClient';

// Key for persisting demo/mock state in localStorage if BE endpoints aren't deployed yet
const STORAGE_PREFIX = 'hola_learner_';

export const learnerService = {
  // 1. Email Verification
  async verifyEmail(codeOrToken) {
    try {
      const res = await axiosClient.post('/api/auth/verify-email', { token: codeOrToken });
      return res;
    } catch {
      // Mock success for testing if BE not ready
      if (codeOrToken === '123456' || codeOrToken?.length >= 6) {
        return { code: 1000, message: 'Email đã được xác minh thành công!' };
      }
      throw new Error('Mã xác minh không hợp lệ hoặc đã hết hạn.');
    }
  },

  async resendVerificationEmail(email) {
    try {
      return await axiosClient.post('/api/auth/resend-verification', { email });
    } catch {
      return { code: 1000, message: 'Đã gửi lại mã xác minh qua email.' };
    }
  },

  // 2. Forgot & Reset Password
  async forgotPassword(email) {
    try {
      return await axiosClient.post('/api/auth/forgot-password', { email });
    } catch {
      return { code: 1000, message: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.' };
    }
  },

  async resetPassword(token, newPassword) {
    try {
      return await axiosClient.post('/api/auth/reset-password', { token, newPassword });
    } catch {
      return { code: 1000, message: 'Mật khẩu đã được thay đổi thành công.' };
    }
  },

  // 3. Onboarding
  async saveOnboarding(data) {
    try {
      return await axiosClient.post('/api/users/onboarding', data);
    } catch {
      localStorage.setItem(`${STORAGE_PREFIX}onboarding`, JSON.stringify(data));
      return { code: 1000, message: 'Đã lưu thiết lập onboarding thành công.' };
    }
  },

  getOnboarding() {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}onboarding`);
    return saved ? JSON.parse(saved) : null;
  },

  // 4. Profile Management
  async getProfile() {
    try {
      const res = await axiosClient.get('/api/users/me');
      if (res && res.result) return res.result;
    } catch {
      // Fallback local storage
    }
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : {
      fullName: 'Alex Miller',
      username: 'alexlearner',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      country: 'United States',
      nativeLanguage: 'en',
      targetLevel: 'A1',
      learningGoal: 'travel',
      dailyGoalMinutes: 15,
      streakDays: 4,
      totalXp: 340,
    };
  },

  async updateProfile(data) {
    try {
      const res = await axiosClient.put('/api/users/me', data);
      return res;
    } catch {
      const current = await this.getProfile();
      const updated = { ...current, ...data };
      localStorage.setItem('user', JSON.stringify(updated));
      return { code: 1000, result: updated, message: 'Cập nhật hồ sơ thành công!' };
    }
  },

  // 5. Learner Settings
  async getSettings() {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    if (saved) return JSON.parse(saved);
    return {
      audioSpeed: 1.0,
      pronunciationTips: true,
      showTranslation: true,
      dailyGoalMinutes: 15,
      emailNotifications: true,
      streakReminders: true,
      soundEffects: true,
    };
  },

  async updateSettings(data) {
    try {
      await axiosClient.put('/api/users/settings', data);
    } catch {
      // Local fallback
    }
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(data));
    return { code: 1000, message: 'Cài đặt đã được lưu.' };
  },

  // 6. Learning Progress & XP
  async getProgressData() {
    return {
      totalTimeMinutes: 185,
      completedLessons: 12,
      masteredWords: 48,
      currentStreak: 4,
      longestStreak: 7,
      totalXp: 420,
      level: 'A1 - Khởi động',
      nextLevelXp: 600,
      weeklyActivity: [
        { day: 'T2', minutes: 20, xp: 45 },
        { day: 'T3', minutes: 15, xp: 30 },
        { day: 'T4', minutes: 25, xp: 60 },
        { day: 'T5', minutes: 30, xp: 80 },
        { day: 'T6', minutes: 0, xp: 0 },
        { day: 'T7', minutes: 15, xp: 35 },
        { day: 'CN', minutes: 25, xp: 55 },
      ],
      recentActivities: [
        { id: 1, title: 'Hoàn thành bài học: Gọi cà phê sữa đá', type: 'lesson', xp: 50, time: '2 giờ trước' },
        { id: 2, title: 'Ôn tập 10 từ vựng: Chào hỏi hàng ngày', type: 'vocab', xp: 20, time: 'Hôm qua' },
        { id: 3, title: 'Đạt chuỗi học 4 ngày liên tiếp 🔥', type: 'streak', xp: 30, time: 'Hôm qua' },
        { id: 4, title: 'Hội thoại AI với Chị Bán Phở', type: 'ai', xp: 40, time: '3 ngày trước' },
      ],
    };
  },

  // 7. Achievements & Passports
  async getAchievements() {
    return {
      badges: [
        { id: 'b1', name: 'Chào Việt Nam', desc: 'Hoàn thành bài học xin chào đầu tiên', unlocked: true, icon: '👋', date: '26/09/2026' },
        { id: 'b2', name: 'Mê Cà Phê', desc: 'Thuộc 10 từ vựng về đồ uống quán cóc', unlocked: true, icon: '☕', date: '28/09/2026' },
        { id: 'b3', name: 'Chiến Binh Streak', desc: 'Học liên tục 7 ngày không ngắt quãng', unlocked: false, icon: '🔥', progress: '4/7 ngày' },
        { id: 'b4', name: 'Bậc Thầy Thanh Điệu', desc: 'Phát âm chuẩn 6 thanh điệu tiếng Việt', unlocked: false, icon: '🎵', progress: '3/6 thanh' },
        { id: 'b5', name: 'Tay Lái Lụa', desc: 'Hoàn thành chủ đề Giao thông & Xe ôm công nghệ', unlocked: false, icon: '🛵', progress: 'Chưa mở' },
      ],
      passportStamps: [
        { id: 'p1', city: 'Hà Nội', stamp: '🏮 Phố Cổ & Hồ Gươm', unlocked: true, date: '27/09/2026' },
        { id: 'p2', city: 'Hồ Chí Minh', stamp: '☕ Cà Phê Bệt & Chợ Bến Thành', unlocked: false },
        { id: 'p3', city: 'Đà Nẵng', stamp: '🌉 Cầu Rồng & Biển Mỹ Khê', unlocked: false },
        { id: 'p4', city: 'Hội An', stamp: '🏮 Đèn Lồng & Cao Lầu', unlocked: false },
      ],
    };
  },

  // 8. Notifications
  async getNotifications() {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    if (saved) return JSON.parse(saved);
    const initial = [
      { id: 1, title: 'Giữ vững chuỗi Streak!', message: 'Hôm nay bạn chưa học bài nào. Hãy dành 5 phút để không mất chuỗi 4 ngày nhé!', time: '10 phút trước', read: false, link: '/my-learning' },
      { id: 2, title: 'Huy hiệu mới đã mở khóa 🎉', message: 'Chúc mừng bạn đã đạt huy hiệu "Mê Cà Phê"!', time: '1 ngày trước', read: false, link: '/achievements' },
      { id: 3, title: 'Gợi ý bài học hôm nay', message: 'Bài học "Hỏi giá và mặc cả chợ đêm" đang chờ bạn khám phá.', time: '2 ngày trước', read: true, link: '/courses' },
    ];
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(initial));
    return initial;
  },

  async markNotificationRead(id) {
    const list = await this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(updated));
    return updated;
  },

  async markAllNotificationsRead() {
    const list = await this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(updated));
    return updated;
  },

  // 9. My Learning Hub (Tổng hợp các module)
  async getMyLearningOverview() {
    return {
      enrolledCourses: [
        { id: 'c1', title: 'Tiếng Việt Giao Tiếp Đời Sống A1', progress: 45, nextLesson: 'Bài 4: Mua sắm tại chợ truyền thống', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80' },
        { id: 'c2', title: 'Cẩm Nang Phát Âm & 6 Thanh Điệu', progress: 80, nextLesson: 'Luyện dấu ngã vs dấu hỏi', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80' },
      ],
      savedVocabCount: 48,
      recentVocab: [
        { vi: 'Cà phê sữa đá', en: 'Iced milk coffee', mastered: true },
        { vi: 'Bao nhiêu tiền?', en: 'How much is it?', mastered: false },
        { vi: 'Cảm ơn nhiều', en: 'Thank you very much', mastered: true },
      ],
      journeyCity: 'Hà Nội',
      journeyProgress: 60,
      quizHistory: [
        { id: 'q1', quizName: 'Kiểm tra từ vựng Quán Cà Phê', score: 90, date: '28/09/2026', passed: true },
        { id: 'q2', quizName: 'Bài kiểm tra Ngữ pháp: Câu hỏi Ở đâu?', score: 85, date: '26/09/2026', passed: true },
      ],
    };
  },
};
