export const ROUTES = {
  // Public & Auth
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ONBOARDING: '/onboarding',

  // Learner
  MY_LEARNING: '/my-learning',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  PROGRESS: '/progress',
  ACHIEVEMENTS: '/achievements',
  NOTIFICATIONS: '/notifications',

  // Courses & Learning (Người 2)
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:courseId',
  MY_COURSES: '/my-courses',
  LEARN_RESUME: '/learn/:courseId',
  LEARN_LESSON: '/learn/:courseId/lesson/:lessonId',

  // Vocabulary (Người 3)
  VOCABULARY: '/vocabulary',
  VOCABULARY_NOTEBOOK_DETAIL: '/vocabulary/notebook/:id',

  // Admin (Người 1)
  ADMIN: '/admin',
  ADMIN_VOCABULARY: '/admin/vocabulary',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ACHIEVEMENTS: '/admin/achievements',
  ADMIN_XP_RULES: '/admin/xp-rules',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
};
