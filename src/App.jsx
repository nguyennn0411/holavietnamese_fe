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
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { OnboardingPage } from '@/pages/auth/OnboardingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ForbiddenPage } from '@/pages/ForbiddenPage';

// Learner Pages (Người 1)
import { MyLearningPage } from '@/pages/learning/MyLearningPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { LearningProgressPage } from '@/pages/progress/LearningProgressPage';
import { AchievementsPage } from '@/pages/achievements/AchievementsPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';

// Courses & Vocabulary Pages (Người 2 & Người 3)
import { CourseListPage } from '@/pages/courses/CourseListPage';
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage';
import { MyCoursesPage } from '@/pages/my-courses/MyCoursesPage';
import { LessonLearningPage } from '@/pages/learning/LessonLearningPage';
import { ResumeCoursePage } from '@/pages/learning/ResumeCoursePage';
import { VocabularyNotebookPage } from '@/pages/vocabulary/VocabularyNotebookPage';
import { VocabularyNotebookDetailPage } from '@/pages/vocabulary/VocabularyNotebookDetailPage';

// Văn hóa, AI Tutor & Roleplay Pages (Người 4)
import { CultureExplorePage } from '@/pages/culture/CultureExplorePage';
import { CultureDetailPage } from '@/pages/culture/CultureDetailPage';
import { AiTutorPage } from '@/pages/ai-tutor/AiTutorPage';
import { ScenarioListPage } from '@/pages/roleplay/ScenarioListPage';
import { ScenarioDetailPage } from '@/pages/roleplay/ScenarioDetailPage';
import { RoleplaySessionPage } from '@/pages/roleplay/RoleplaySessionPage';
import { RoleplayResultPage } from '@/pages/roleplay/RoleplayResultPage';

// Admin Pages (Người 1)
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage';
import { AdminAchievementsPage } from '@/pages/admin/AdminAchievementsPage';
import { AdminXpRulesPage } from '@/pages/admin/AdminXpRulesPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminVocabularyPage } from '@/pages/admin/AdminVocabularyPage';

// Admin Pages (Người 4: Văn hóa & AI)
import { AdminCultureListPage } from '@/pages/admin/AdminCultureListPage';
import { AdminCultureEditPage } from '@/pages/admin/AdminCultureEditPage';
import { AdminCultureCategoriesPage } from '@/pages/admin/AdminCultureCategoriesPage';
import { AdminAiScenariosPage } from '@/pages/admin/AdminAiScenariosPage';
import { AdminScenarioBuilderPage } from '@/pages/admin/AdminScenarioBuilderPage';
import { AdminAiSettingsPage } from '@/pages/admin/AdminAiSettingsPage';
import { AdminAiUsagePage } from '@/pages/admin/AdminAiUsagePage';
import { AdminAiReviewsPage } from '@/pages/admin/AdminAiReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
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
              <Route path={ROUTES.VOCABULARY} element={<VocabularyNotebookPage />} />
              <Route path={ROUTES.VOCABULARY_NOTEBOOK_DETAIL} element={<VocabularyNotebookDetailPage />} />

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
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Area (Người 1) */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN_VOCABULARY} element={<AdminVocabularyPage />} />
                <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
                <Route path={ROUTES.ADMIN_USER_DETAIL} element={<AdminUserDetailPage />} />
                <Route path={ROUTES.ADMIN_ROLES} element={<AdminRolesPage />} />
                <Route path={ROUTES.ADMIN_ACHIEVEMENTS} element={<AdminAchievementsPage />} />
                <Route path={ROUTES.ADMIN_XP_RULES} element={<AdminXpRulesPage />} />
                <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminAuditLogsPage />} />
                <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />

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
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
