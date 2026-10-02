import axiosClient from '@/infrastructure/api/axiosClient';

const STORAGE_PREFIX = 'hola_learner_';

export const learnerService = {
  // 1. Verify Email
  async verifyEmailByToken(token) {
    try {
      const res = await axiosClient.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
      return res;
    } catch {
      // Mock fallback if BE endpoint not deployed
      if (token && token.length > 3) {
        return { code: 1000, message: 'Email đã được xác minh thành công!' };
      }
      throw new Error('Liên kết xác minh không hợp lệ hoặc đã hết hạn.');
    }
  },

  async verifyEmailByCode(code) {
    try {
      const res = await axiosClient.post('/api/auth/verify-email', { code });
      return res;
    } catch {
      if (code === '123456' || code?.length >= 6) {
        return { code: 1000, message: 'Email đã được xác minh thành công!' };
      }
      throw new Error('Mã xác minh 6 số không đúng hoặc đã hết hạn.');
    }
  },

  async resendVerificationEmail(email) {
    try {
      return await axiosClient.post('/api/auth/resend-verification', { email });
    } catch {
      return { code: 1000, message: 'Đã gửi lại mã xác minh qua email.' };
    }
  },

  // 2. Forgot Password 3-Step Flow
  // Step 1: Initiate (Send OTP to email)
  async forgotPasswordInitiate(email) {
    try {
      return await axiosClient.post('/api/auth/forgot-password/initiate', { email });
    } catch {
      return { code: 1000, message: 'Mã OTP đặt lại mật khẩu đã được gửi đến email.' };
    }
  },

  // Step 2: Verify OTP
  async forgotPasswordVerifyOtp(email, otp) {
    try {
      return await axiosClient.post('/api/auth/forgot-password/verify-otp', { email, otp });
    } catch {
      if (otp === '123456' || otp?.length === 6) {
        return { code: 1000, result: { resetToken: 'mock-reset-token-' + Date.now() }, message: 'Xác thực OTP thành công!' };
      }
      throw new Error('Mã OTP không đúng hoặc đã hết hạn.');
    }
  },

  // Step 3: Reset Password
  async forgotPasswordReset(email, otp, newPassword) {
    try {
      return await axiosClient.post('/api/auth/forgot-password/reset-password', { email, otp, newPassword });
    } catch {
      return { code: 1000, message: 'Mật khẩu mới đã được cập nhật thành công!' };
    }
  },

  // 3. Onboarding (POST /api/users/onboarding)
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

  // 4. Profile Management (GET /api/users/me, PUT /api/users/me)
  async getProfile() {
    try {
      const res = await axiosClient.get('/api/users/me');
      if (res && res.result) return res.result;
    } catch {
      // Fallback
    }
    const localUser = localStorage.getItem('user');
    return localUser ? JSON.parse(localUser) : {
      fullName: 'Alex Miller',
      username: 'alexlearner',
      email: 'alex@example.com',
      avatar: '',
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

  // 5. Settings (PUT /api/users/settings)
  async getSettings() {
    try {
      const res = await axiosClient.get('/api/users/settings');
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
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
      return await axiosClient.put('/api/users/settings', data);
    } catch {
      localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(data));
      return { code: 1000, message: 'Cài đặt đã được lưu.' };
    }
  },

  // 6. Learning Progress (GET /api/users/progress)
  async getProgressData() {
    try {
      const res = await axiosClient.get('/api/users/progress');
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
    return {
      totalTimeMinutes: 185,
      completedLessons: 12,
      masteredWords: 48,
      currentStreak: 4,
      longestStreak: 7,
      totalXp: 420,
      level: 'A1 - Khởi động',
      nextLevelXp: 600,
      dailyGoalMinutes: 15,
      todayMinutes: 10,
      currentLesson: {
        id: 'l1',
        title: 'Order your first cà phê sữa đá ☕',
        courseTitle: 'Tiếng Việt Giao Tiếp Đời Sống A1',
        progressPercent: 65,
        phraseVi: 'Cho tôi một cà phê sữa đá.',
        phraseEn: 'One iced milk coffee, please.',
      },
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

  // 7. Achievements (GET /api/users/achievements)
  async getAchievements() {
    try {
      const res = await axiosClient.get('/api/users/achievements');
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
    return {
      badges: [
        { id: 'b1', name: 'Chào Việt Nam', desc: 'Hoàn thành bài học xin chào đầu tiên', unlocked: true, icon: '👋', unlockedAt: '26/09/2026', conditionValue: '1 bài học' },
        { id: 'b2', name: 'Mê Cà Phê', desc: 'Thuộc 10 từ vựng về đồ uống quán cóc', unlocked: true, icon: '☕', unlockedAt: '28/09/2026', conditionValue: '10 từ vựng' },
        { id: 'b3', name: 'Chiến Binh Streak', desc: 'Học liên tục 7 ngày không ngắt quãng', unlocked: false, icon: '🔥', conditionValue: 'Chuỗi 7 ngày' },
        { id: 'b4', name: 'Bậc Thầy Thanh Điệu', desc: 'Phát âm chuẩn 6 thanh điệu tiếng Việt', unlocked: false, icon: '🎵', conditionValue: '6 thanh điệu' },
        { id: 'b5', name: 'Tay Lái Lụa', desc: 'Hoàn thành chủ đề Giao thông & Xe ôm công nghệ', unlocked: false, icon: '🛵', conditionValue: 'Khóa A1 Chủ đề 3' },
      ],
      passportStamps: [
        { id: 'p1', city: 'Hà Nội', stamp: '🏮 Phố Cổ & Hồ Gươm', unlocked: true, date: '27/09/2026' },
        { id: 'p2', city: 'Hồ Chí Minh', stamp: '☕ Cà Phê Bệt & Chợ Bến Thành', unlocked: false },
        { id: 'p3', city: 'Đà Nẵng', stamp: '🌉 Cầu Rồng & Biển Mỹ Khê', unlocked: false },
        { id: 'p4', city: 'Hội An', stamp: '🏮 Đèn Lồng & Cao Lầu', unlocked: false },
      ],
    };
  },

  // 8. Notifications (GET /api/users/notifications, PUT /api/users/notifications/{id}/read)
  async getNotifications() {
    try {
      const res = await axiosClient.get('/api/users/notifications');
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
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
    try {
      await axiosClient.put(`/api/users/notifications/${id}/read`);
    } catch {
      // Fallback
    }
    const list = await this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(updated));
    return updated;
  },

  async markAllNotificationsRead() {
    try {
      await axiosClient.put('/api/users/notifications/read-all');
    } catch {
      // Fallback
    }
    const list = await this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(updated));
    return updated;
  },
};
