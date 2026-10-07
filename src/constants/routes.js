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
  VOCABULARY_CATALOG_DETAIL: '/vocabulary/:id',
  ADMIN_VOCABULARY_TOPICS: '/admin/vocabulary-topics',
  VOCABULARY_NOTEBOOK: '/vocabulary/notebook',
  VOCABULARY_NOTEBOOK_DETAIL: '/vocabulary/notebook/:id',
  VOCABULARY_REVIEW: '/vocabulary/review',

  EXPLORE: '/explore',
  DESTINATION_DETAIL: '/explore/:id',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:id',
  QUIZ: '/quizzes/:quizId',
  QUIZ_ATTEMPT: '/quiz-attempts/:attemptId',
  QUIZ_RESULT: '/quiz-attempts/:attemptId/result',

  // Văn hóa & AI Tutor & Roleplay (Người 4)
  CULTURE: '/culture',
  CULTURE_DETAIL: '/culture/:id',
  AI_TUTOR: '/ai-tutor',
  AI_SCENARIOS: '/ai-scenarios',
  AI_SCENARIO_DETAIL: '/ai-scenarios/:id',
  AI_ROLEPLAY: '/ai-roleplay/:id',
  AI_SESSION_RESULT: '/ai-sessions/:id/result',

  // Admin (Người 1)
  ADMIN: '/admin',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_COURSE_BUILDER: '/admin/courses/:courseId',
  ADMIN_COURSE_PREVIEW: '/admin/courses/:courseId/preview',
  ADMIN_LESSONS: '/admin/lessons',
  ADMIN_LESSON_BUILDER: '/admin/lessons/:lessonId',
  ADMIN_LESSON_PREVIEW: '/admin/lessons/:lessonId/preview',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_QUIZZES: '/admin/quizzes',
  ADMIN_QUIZ_BUILDER: '/admin/quizzes/:quizId',
  ADMIN_QUIZ_PREVIEW: '/admin/quizzes/:quizId/preview',
  ADMIN_VOCABULARY: '/admin/vocabulary',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:id',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_ACHIEVEMENTS: '/admin/achievements',
  ADMIN_XP_RULES: '/admin/xp-rules',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',

  // Admin Văn hóa & AI Tutor & Roleplay (Người 4)
  ADMIN_CULTURE: '/admin/culture',
  ADMIN_CULTURE_EDIT: '/admin/culture/:id',
  ADMIN_CULTURE_NEW: '/admin/culture/new',
  ADMIN_CULTURE_CATEGORIES: '/admin/culture-categories',
  ADMIN_AI_SCENARIOS: '/admin/ai-scenarios',
  ADMIN_AI_SCENARIO_BUILDER: '/admin/ai-scenarios/:id',
  ADMIN_AI_SCENARIO_NEW: '/admin/ai-scenarios/new',
  ADMIN_AI_SETTINGS: '/admin/ai-settings',
  ADMIN_AI_USAGE: '/admin/ai-usage',
  ADMIN_AI_REVIEWS: '/admin/ai-reviews',
};
