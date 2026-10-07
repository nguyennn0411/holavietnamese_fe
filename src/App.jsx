import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/application/context/AuthContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminRoute } from '@/components/common/AdminRoute';
import { ROUTES } from '@/constants/routes';

// Layouts
import { MainLayout } from '@/layouts/MainLayout';
import { AdminLayout } from '@/layouts/AdminLayout';

// Public & Auth Pages (Người 1)
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then(module => ({ default: module.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const OnboardingPage = lazy(() => import('@/pages/auth/OnboardingPage').then(module => ({ default: module.OnboardingPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage').then(module => ({ default: module.ForbiddenPage })));

// Learner Pages (Người 1)
const MyLearningPage = lazy(() => import('@/pages/learning/MyLearningPage').then(module => ({ default: module.MyLearningPage })));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const LearningProgressPage = lazy(() => import('@/pages/progress/LearningProgressPage').then(module => ({ default: module.LearningProgressPage })));
const AchievementsPage = lazy(() => import('@/pages/achievements/AchievementsPage').then(module => ({ default: module.AchievementsPage })));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage').then(module => ({ default: module.NotificationsPage })));

// Courses & Vocabulary Pages (Người 2 & Người 3)
const CourseListPage = lazy(() => import('@/pages/courses/CourseListPage').then(module => ({ default: module.CourseListPage })));
const CourseDetailPage = lazy(() => import('@/pages/courses/CourseDetailPage').then(module => ({ default: module.CourseDetailPage })));
const MyCoursesPage = lazy(() => import('@/pages/my-courses/MyCoursesPage').then(module => ({ default: module.MyCoursesPage })));
const LessonLearningPage = lazy(() => import('@/pages/learning/LessonLearningPage').then(module => ({ default: module.LessonLearningPage })));
const ResumeCoursePage = lazy(() => import('@/pages/learning/ResumeCoursePage').then(module => ({ default: module.ResumeCoursePage })));
const VocabularyNotebookPage = lazy(() => import('@/pages/vocabulary/VocabularyNotebookPage').then(module => ({ default: module.VocabularyNotebookPage })));
const VocabularyNotebookDetailPage = lazy(() => import('@/pages/vocabulary/VocabularyNotebookDetailPage').then(module => ({ default: module.VocabularyNotebookDetailPage })));
const VocabularyCatalogPage = lazy(() => import('@/pages/vocabulary/VocabularyCatalogPage').then(module => ({ default: module.VocabularyCatalogPage })));
const VocabularyDetailPage = lazy(() => import('@/pages/vocabulary/VocabularyDetailPage').then(module => ({ default: module.VocabularyDetailPage })));
// Văn hóa, AI Tutor & Roleplay Pages (Người 4)
const CultureExplorePage = lazy(() => import('@/pages/culture/CultureExplorePage').then(module => ({ default: module.CultureExplorePage })));
const CultureDetailPage = lazy(() => import('@/pages/culture/CultureDetailPage').then(module => ({ default: module.CultureDetailPage })));
const AiTutorPage = lazy(() => import('@/pages/ai-tutor/AiTutorPage').then(module => ({ default: module.AiTutorPage })));
const ScenarioListPage = lazy(() => import('@/pages/roleplay/ScenarioListPage').then(module => ({ default: module.ScenarioListPage })));
const ScenarioDetailPage = lazy(() => import('@/pages/roleplay/ScenarioDetailPage').then(module => ({ default: module.ScenarioDetailPage })));
const RoleplaySessionPage = lazy(() => import('@/pages/roleplay/RoleplaySessionPage').then(module => ({ default: module.RoleplaySessionPage })));
const RoleplayResultPage = lazy(() => import('@/pages/roleplay/RoleplayResultPage').then(module => ({ default: module.RoleplayResultPage })));

// Admin Pages (Người 1)
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(module => ({ default: module.AdminUsersPage })));
const AdminUserDetailPage = lazy(() => import('@/pages/admin/AdminUserDetailPage').then(module => ({ default: module.AdminUserDetailPage })));
const AdminRolesPage = lazy(() => import('@/pages/admin/AdminRolesPage').then(module => ({ default: module.AdminRolesPage })));
const AdminAchievementsPage = lazy(() => import('@/pages/admin/AdminAchievementsPage').then(module => ({ default: module.AdminAchievementsPage })));
const AdminXpRulesPage = lazy(() => import('@/pages/admin/AdminXpRulesPage').then(module => ({ default: module.AdminXpRulesPage })));
const AdminAuditLogsPage = lazy(() => import('@/pages/admin/AdminAuditLogsPage').then(module => ({ default: module.AdminAuditLogsPage })));
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(module => ({ default: module.AdminSettingsPage })));
const AdminVocabularyPage = lazy(() => import('@/pages/admin/AdminVocabularyPage').then(module => ({ default: module.AdminVocabularyPage })));
const AdminVocabularyTopicsPage = lazy(() =>
  import('@/pages/admin/AdminVocabularyTopicsPage')
    .then((module) => ({ default: module.AdminVocabularyTopicsPage }))
);
// Admin Pages (Người 4: Văn hóa & AI)
const AdminCultureListPage = lazy(() => import('@/pages/admin/AdminCultureListPage').then(module => ({ default: module.AdminCultureListPage })));
const AdminCultureEditPage = lazy(() => import('@/pages/admin/AdminCultureEditPage').then(module => ({ default: module.AdminCultureEditPage })));
const AdminCultureCategoriesPage = lazy(() => import('@/pages/admin/AdminCultureCategoriesPage').then(module => ({ default: module.AdminCultureCategoriesPage })));
const AdminAiScenariosPage = lazy(() => import('@/pages/admin/AdminAiScenariosPage').then(module => ({ default: module.AdminAiScenariosPage })));
const AdminScenarioBuilderPage = lazy(() => import('@/pages/admin/AdminScenarioBuilderPage').then(module => ({ default: module.AdminScenarioBuilderPage })));
const AdminAiSettingsPage = lazy(() => import('@/pages/admin/AdminAiSettingsPage').then(module => ({ default: module.AdminAiSettingsPage })));
const AdminAiUsagePage = lazy(() => import('@/pages/admin/AdminAiUsagePage').then(module => ({ default: module.AdminAiUsagePage })));
const AdminAiReviewsPage = lazy(() => import('@/pages/admin/AdminAiReviewsPage').then(module => ({ default: module.AdminAiReviewsPage })));
const VocabularyReviewPage = lazy(() => import('@/pages/vocabulary/VocabularyReviewPage').then(module => ({ default: module.VocabularyReviewPage })));
const ExploreVietnamPage = lazy(() => import('@/pages/explore/ExplorePages').then(module => ({ default: module.ExploreVietnamPage })));
const DestinationDetailPage = lazy(() => import('@/pages/explore/ExplorePages').then(module => ({ default: module.DestinationDetailPage })));
const BlogHomePage = lazy(() => import('@/pages/blog/BlogPages').then(module => ({ default: module.BlogHomePage })));
const BlogDetailPage = lazy(() => import('@/pages/blog/BlogPages').then(module => ({ default: module.BlogDetailPage })));
const QuizPage = lazy(() => import('@/pages/quiz/QuizPages').then(module => ({ default: module.QuizPage })));
const QuizAttemptPage = lazy(() => import('@/pages/quiz/QuizPages').then(module => ({ default: module.QuizAttemptPage })));
const QuizResultPage = lazy(() => import('@/pages/quiz/QuizPages').then(module => ({ default: module.QuizResultPage })));
const AdminContentListPage = lazy(() => import('@/pages/admin/AdminContentPages').then(module => ({ default: module.AdminContentListPage })));
const AdminCourseBuilderPage = lazy(() => import('@/pages/admin/AdminContentPages').then(module => ({ default: module.AdminCourseBuilderPage })));
const AdminLessonBuilderPage = lazy(() => import('@/pages/admin/AdminContentPages').then(module => ({ default: module.AdminLessonBuilderPage })));
const AdminCoursePreviewPage = lazy(() => import('@/pages/admin/AdminContentPages').then(module => ({ default: module.AdminCoursePreviewPage })));
const AdminLessonPreviewPage = lazy(() => import('@/pages/admin/AdminContentPages').then(module => ({ default: module.AdminLessonPreviewPage })));
const AdminQuestionBankPage = lazy(() => import('@/pages/admin/AdminQuizPages').then(module => ({ default: module.AdminQuestionBankPage })));
const AdminQuizBuilderPage = lazy(() => import('@/pages/admin/AdminQuizPages').then(module => ({ default: module.AdminQuizBuilderPage })));
const AdminQuizPreviewPage = lazy(() => import('@/pages/admin/AdminQuizPages').then(module => ({ default: module.AdminQuizPreviewPage })));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={<div className="state loading-state" role="status"><span className="loading-spinner" aria-hidden="true"/>Đang tải trang…</div>}><Routes>
            {/* Standalone Fullscreen Auth Routes (Người 1) */}
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />
            </Route>
            <Route path="/forbidden" element={<ForbiddenPage />} />

            {/* Learner Main Layout */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.MY_LEARNING} element={<MyLearningPage />} />
              <Route path={ROUTES.COURSES} element={<CourseListPage />} />
              <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
              <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
              <Route path={ROUTES.VOCABULARY} element={<VocabularyCatalogPage />} />
              <Route path={ROUTES.VOCABULARY_CATALOG_DETAIL} element={<VocabularyDetailPage />} />
              <Route path={ROUTES.VOCABULARY_NOTEBOOK} element={<VocabularyNotebookPage />} />
              <Route path={ROUTES.VOCABULARY_NOTEBOOK_DETAIL} element={<VocabularyNotebookDetailPage />} />
              <Route path={ROUTES.VOCABULARY_REVIEW} element={<VocabularyReviewPage />} />
              <Route path={ROUTES.EXPLORE} element={<ExploreVietnamPage />} />
              <Route path={ROUTES.DESTINATION_DETAIL} element={<DestinationDetailPage />} />
              <Route path={ROUTES.BLOG} element={<BlogHomePage />} />
              <Route path={ROUTES.BLOG_DETAIL} element={<BlogDetailPage />} />

              {/* Văn hóa & AI Tutor & Roleplay (Người 4) */}
              <Route path={ROUTES.CULTURE} element={<CultureExplorePage />} />
              <Route path={ROUTES.CULTURE_DETAIL} element={<CultureDetailPage />} />
              <Route path={ROUTES.AI_TUTOR} element={<AiTutorPage />} />
              <Route path={ROUTES.AI_SCENARIOS} element={<ScenarioListPage />} />
              <Route path={ROUTES.AI_SCENARIO_DETAIL} element={<ScenarioDetailPage />} />
              <Route path={ROUTES.AI_ROLEPLAY} element={<RoleplaySessionPage />} />
              <Route path={ROUTES.AI_SESSION_RESULT} element={<RoleplayResultPage />} />

              {/* Protected Learner Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.PROGRESS} element={<LearningProgressPage />} />
                <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
                <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />
                <Route path={ROUTES.LEARN_RESUME} element={<ResumeCoursePage />} />
                <Route path={ROUTES.LEARN_LESSON} element={<LessonLearningPage />} />
                <Route path={ROUTES.QUIZ} element={<QuizPage />} />
                <Route path={ROUTES.QUIZ_ATTEMPT} element={<QuizAttemptPage />} />
                <Route path={ROUTES.QUIZ_RESULT} element={<QuizResultPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Area (Người 1) */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN_COURSES} element={<AdminContentListPage kind="courses" />} />
                <Route path={ROUTES.ADMIN_COURSE_BUILDER} element={<AdminCourseBuilderPage />} />
                <Route path={ROUTES.ADMIN_COURSE_PREVIEW} element={<AdminCoursePreviewPage />} />
                <Route path={ROUTES.ADMIN_LESSONS} element={<AdminContentListPage kind="lessons" />} />
                <Route path={ROUTES.ADMIN_LESSON_BUILDER} element={<AdminLessonBuilderPage />} />
                <Route path={ROUTES.ADMIN_LESSON_PREVIEW} element={<AdminLessonPreviewPage />} />
                <Route path={ROUTES.ADMIN_QUESTIONS} element={<AdminQuestionBankPage />} />
                <Route path={ROUTES.ADMIN_QUIZZES} element={<AdminContentListPage kind="quizzes" />} />
                <Route path={ROUTES.ADMIN_QUIZ_BUILDER} element={<AdminQuizBuilderPage />} />
                <Route path={ROUTES.ADMIN_QUIZ_PREVIEW} element={<AdminQuizPreviewPage />} />
                <Route path={ROUTES.ADMIN_VOCABULARY} element={<AdminVocabularyPage />} />
                <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
                <Route path={ROUTES.ADMIN_USER_DETAIL} element={<AdminUserDetailPage />} />
                <Route path={ROUTES.ADMIN_ROLES} element={<AdminRolesPage />} />
                <Route path={ROUTES.ADMIN_ACHIEVEMENTS} element={<AdminAchievementsPage />} />
                <Route path={ROUTES.ADMIN_XP_RULES} element={<AdminXpRulesPage />} />
                <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminAuditLogsPage />} />
                <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
                <Route path={ROUTES.ADMIN_VOCABULARY_TOPICS} element={<AdminVocabularyTopicsPage />} />

                {/* Admin Văn hóa & AI (Người 4) */}
                <Route path={ROUTES.ADMIN_CULTURE} element={<AdminCultureListPage />} />
                <Route path={ROUTES.ADMIN_CULTURE_NEW} element={<AdminCultureEditPage />} />
                <Route path={ROUTES.ADMIN_CULTURE_EDIT} element={<AdminCultureEditPage />} />
                <Route path={ROUTES.ADMIN_CULTURE_CATEGORIES} element={<AdminCultureCategoriesPage />} />
                <Route path={ROUTES.ADMIN_AI_SCENARIOS} element={<AdminAiScenariosPage />} />
                <Route path={ROUTES.ADMIN_AI_SCENARIO_NEW} element={<AdminScenarioBuilderPage />} />
                <Route path={ROUTES.ADMIN_AI_SCENARIO_BUILDER} element={<AdminScenarioBuilderPage />} />
                <Route path={ROUTES.ADMIN_AI_SETTINGS} element={<AdminAiSettingsPage />} />
                <Route path={ROUTES.ADMIN_AI_USAGE} element={<AdminAiUsagePage />} />
                <Route path={ROUTES.ADMIN_AI_REVIEWS} element={<AdminAiReviewsPage />} />
              </Route>
            </Route>
          </Routes></Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
