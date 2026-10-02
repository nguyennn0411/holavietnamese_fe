import axiosClient from '@/infrastructure/api/axiosClient';

const ADMIN_STORAGE = 'hola_admin_';

export const adminService = {
  // 1. Dashboard (GET /api/admin/dashboard/stats)
  async getDashboardStats() {
    try {
      const res = await axiosClient.get('/api/admin/dashboard/stats');
      if (res?.result) return res.result;
    } catch {
      // Mock fallback
    }
    return {
      totalUsers: 1420,
      activeLearners: 890,
      totalCourses: 8,
      totalLessons: 124,
      totalXpGranted: 48500,
      aiSessionsToday: 350,
      completionRate: '68%',
      userGrowth: [
        { month: 'T5', users: 320 },
        { month: 'T6', users: 480 },
        { month: 'T7', users: 710 },
        { month: 'T8', users: 950 },
        { month: 'T9', users: 1220 },
        { month: 'T10', users: 1420 },
      ],
      recentActivities: [
        { id: 1, user: 'david2026', action: 'Hoàn thành bài thi VSL A1', time: '5 phút trước', status: 'success' },
        { id: 2, user: 'sarah_k', action: 'Đăng ký tài khoản mới từ Hàn Quốc', time: '18 phút trước', status: 'info' },
        { id: 3, user: 'john_smith', action: 'Đạt chuỗi streak 14 ngày', time: '1 giờ trước', status: 'success' },
        { id: 4, user: 'admin', action: 'Cập nhật quy tắc cộng điểm XP bài thi', time: '3 giờ trước', status: 'warning' },
      ],
    };
  },

  // 2. User Management (GET /api/admin/users, GET /api/admin/users/{id})
  async getUsers(params = {}) {
    try {
      const res = await axiosClient.get('/api/admin/users', { params });
      if (res?.result) return res.result;
    } catch {
      // Mock fallback
    }
    const saved = localStorage.getItem(`${ADMIN_STORAGE}users`);
    if (saved) return JSON.parse(saved);

    const initialUsers = [
      { id: 1, username: 'admin', fullName: 'Huy Nguyễn (Admin)', email: 'admin@holavietnamese.com', role: 'ADMIN', status: 'ACTIVE', joinDate: '01/09/2026', streak: 20, xp: 1250 },
      { id: 2, username: 'learner', fullName: 'John Smith', email: 'learner@holavietnamese.com', role: 'LEARNER', status: 'ACTIVE', joinDate: '15/09/2026', streak: 4, xp: 420 },
      { id: 3, username: 'sarah_k', fullName: 'Sarah Kim', email: 'sarah@gmail.com', role: 'LEARNER', status: 'ACTIVE', joinDate: '20/09/2026', streak: 9, xp: 680 },
      { id: 4, username: 'jean_dupont', fullName: 'Jean Dupont', email: 'jean@orange.fr', role: 'LEARNER', status: 'INACTIVE', joinDate: '12/09/2026', streak: 0, xp: 80 },
      { id: 5, username: 'kenji_s', fullName: 'Kenji Sato', email: 'kenji@yahoo.co.jp', role: 'INSTRUCTOR', status: 'ACTIVE', joinDate: '05/09/2026', streak: 12, xp: 950 },
    ];
    localStorage.setItem(`${ADMIN_STORAGE}users`, JSON.stringify(initialUsers));
    return initialUsers;
  },

  async getUserById(id) {
    try {
      const res = await axiosClient.get(`/api/admin/users/${id}`);
      if (res?.result) return res.result;
    } catch {
      // Mock fallback
    }
    const users = await this.getUsers();
    const user = users.find(u => u.id === Number(id)) || users[1];
    return {
      ...user,
      country: 'Hoa Kỳ',
      nativeLanguage: 'English',
      targetLevel: 'A1',
      learningGoal: 'Du lịch và giao tiếp hàng ngày',
      enrolledCourses: [
        { id: 'c1', name: 'Tiếng Việt Giao Tiếp Đời Sống A1', progress: 65, enrolledAt: '16/09/2026' },
        { id: 'c2', name: 'Ngữ Pháp Căn Bản & Thanh Điệu', progress: 30, enrolledAt: '22/09/2026' },
      ],
      auditHistory: [
        { date: '01/10/2026 14:20', action: 'Đăng nhập từ trình duyệt Chrome (Windows)' },
        { date: '29/09/2026 09:15', action: 'Hoàn thành bài học: Gọi món phở bò' },
        { date: '26/09/2026 20:00', action: 'Đạt danh hiệu "Chào Việt Nam"' },
      ],
    };
  },

  // Toggle user status (PATCH /api/admin/users/{id}/status?status=...)
  async toggleUserStatus(id) {
    const users = await this.getUsers();
    const target = users.find(u => u.id === Number(id));
    const nextStatus = target?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    try {
      await axiosClient.patch(`/api/admin/users/${id}/status?status=${nextStatus}`);
    } catch {
      // Local fallback
    }

    const updated = users.map(u => u.id === Number(id) ? { ...u, status: nextStatus } : u);
    localStorage.setItem(`${ADMIN_STORAGE}users`, JSON.stringify(updated));
    return { code: 1000, message: `Đã đổi trạng thái tài khoản thành ${nextStatus === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}.` };
  },

  // Update roles (PUT /api/admin/users/{id}/roles)
  async updateUserRole(id, newRole) {
    try {
      await axiosClient.put(`/api/admin/users/${id}/roles`, { roles: [newRole] });
    } catch {
      // Local fallback
    }
    const users = await this.getUsers();
    const updated = users.map(u => u.id === Number(id) ? { ...u, role: newRole } : u);
    localStorage.setItem(`${ADMIN_STORAGE}users`, JSON.stringify(updated));
    return { code: 1000, message: 'Đã cập nhật vai trò người dùng thành công.' };
  },

  // 3. Achievements (GET /api/admin/achievements, POST /api/admin/achievements)
  async getAchievements() {
    try {
      const res = await axiosClient.get('/api/admin/achievements');
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
    const saved = localStorage.getItem(`${ADMIN_STORAGE}achievements`);
    if (saved) return JSON.parse(saved);
    const initial = [
      { id: 'ACH-01', code: 'HELLO_VN', title: 'Chào Việt Nam', icon: '👋', iconUrl: '', criteria: 'Hoàn thành bài 1 khóa học bất kỳ', xpReward: 50, active: true },
      { id: 'ACH-02', code: 'COFFEE_LOVER', title: 'Mê Cà Phê', icon: '☕', iconUrl: '', criteria: 'Thuộc 10 từ vựng chủ đề ẩm thực', xpReward: 80, active: true },
      { id: 'ACH-03', code: 'STREAK_7', title: 'Chiến Binh Streak 7', icon: '🔥', iconUrl: '', criteria: 'Học liên tục 7 ngày', xpReward: 100, active: true },
      { id: 'ACH-04', code: 'HANOI_EXPLORER', title: 'Thám Tử Phố Cổ', icon: '🏮', iconUrl: '', criteria: 'Hoàn thành chặng Hà Nội trong Hành trình', xpReward: 150, active: true },
    ];
    localStorage.setItem(`${ADMIN_STORAGE}achievements`, JSON.stringify(initial));
    return initial;
  },

  async createAchievement(data) {
    try {
      const res = await axiosClient.post('/api/admin/achievements', data);
      if (res?.result) return res;
    } catch {
      // Fallback
    }
    const list = await this.getAchievements();
    const newItem = {
      id: `ACH-0${list.length + 1}`,
      active: true,
      code: data.code || `ACH_${Date.now()}`,
      ...data,
    };
    const updated = [...list, newItem];
    localStorage.setItem(`${ADMIN_STORAGE}achievements`, JSON.stringify(updated));
    return { code: 1000, message: 'Khởi tạo huy hiệu mới thành công!' };
  },

  // 4. Audit Logs (GET /api/admin/audit-logs)
  async getAuditLogs(params = {}) {
    try {
      const res = await axiosClient.get('/api/admin/audit-logs', { params });
      if (res?.result) return res.result;
    } catch {
      // Fallback
    }
    return [
      { id: 'LOG-109', actor: 'Huy Nguyễn (admin)', action: 'Cập nhật quyền vai trò INSTRUCTOR', target: 'Role: INSTRUCTOR', time: '02/10/2026 01:10', status: 'SUCCESS', details: 'Gán thêm quyền create_quiz' },
      { id: 'LOG-108', actor: 'Huy Nguyễn (admin)', action: 'Mở khóa tài khoản', target: 'User: jean_dupont', time: '01/10/2026 23:45', status: 'SUCCESS', details: 'status -> ACTIVE' },
      { id: 'LOG-107', actor: 'Hệ thống (Cron)', action: 'Cộng điểm thưởng Streak tuần', target: '142 Học viên', time: '01/10/2026 00:00', status: 'SUCCESS', details: 'Phát thưởng +100 XP' },
      { id: 'LOG-106', actor: 'sarah_k', action: 'Đổi mật khẩu tài khoản', target: 'Self', time: '30/09/2026 18:30', status: 'SUCCESS', details: 'Đổi mật khẩu qua OTP' },
      { id: 'LOG-105', actor: 'Huy Nguyễn (admin)', action: 'Bật cấu hình Google OAuth', target: 'System Settings', time: '29/09/2026 22:15', status: 'SUCCESS', details: 'googleAuthEnabled -> true' },
    ];
  },

  // 5. Roles & Permissions
  async getRoles() {
    return [
      { id: 'ADMIN', name: 'Quản trị viên (Admin)', desc: 'Toàn quyền kiểm soát hệ thống, người dùng, cấu hình và audit log', permissions: ['view_all', 'manage_users', 'manage_roles', 'publish_content', 'system_config'] },
      { id: 'INSTRUCTOR', name: 'Giảng viên / Content Creator', desc: 'Tạo, sửa khóa học, soạn bài tập, duyệt ngân hàng câu hỏi', permissions: ['view_courses', 'edit_courses', 'create_quiz', 'view_reports'] },
      { id: 'LEARNER', name: 'Học viên (Learner)', desc: 'Tham gia học tập, tra cứu từ vựng, làm quiz, nhận thành tích', permissions: ['learn', 'take_quiz', 'view_profile', 'save_vocab'] },
    ];
  },

  // 6. System Settings
  async getSystemSettings() {
    const saved = localStorage.getItem(`${ADMIN_STORAGE}settings`);
    if (saved) return JSON.parse(saved);
    const initial = {
      appName: 'Hola Vietnamese PWA',
      contactEmail: 'support@holavietnamese.com',
      defaultDailyGoalMinutes: 15,
      allowRegistration: true,
      maintenanceMode: false,
      googleAuthEnabled: true,
      aiTutorProvider: 'Google Gemini 2.0 Flash',
    };
    localStorage.setItem(`${ADMIN_STORAGE}settings`, JSON.stringify(initial));
    return initial;
  },

  async updateSystemSettings(data) {
    localStorage.setItem(`${ADMIN_STORAGE}settings`, JSON.stringify(data));
    return { code: 1000, message: 'Đã cập nhật cấu hình hệ thống thành công.' };
  },

  // 7. XP Rules
  async getXpRules() {
    return [
      { id: 'XP-01', event: 'Hoàn thành 1 bài học cơ bản', points: 30, limitPerDay: 'Không giới hạn', antiSpam: 'Chỉ tính lần đầu hoàn thành' },
      { id: 'XP-02', event: 'Ôn tập 10 thẻ từ vựng (Flashcard)', points: 15, limitPerDay: 'Tối đa 60 XP/ngày', antiSpam: 'Tối thiểu 30s giữa các lượt' },
      { id: 'XP-03', event: 'Hoàn thành hội thoại AI Roleplay', points: 40, limitPerDay: 'Tối đa 120 XP/ngày', antiSpam: 'Tối thiểu 3 lượt trao đổi' },
      { id: 'XP-04', event: 'Đạt điểm tối đa Quiz trắc nghiệm', points: 50, limitPerDay: '1 lần mỗi bài quiz', antiSpam: 'Khóa cộng lặp lại sau 24h' },
    ];
  },
};
