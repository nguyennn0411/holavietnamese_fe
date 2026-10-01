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

// Admin Pages (Người 1)
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminRolesPage } from '@/pages/admin/AdminRolesPage';
import { AdminAchievementsPage } from '@/pages/admin/AdminAchievementsPage';
import { AdminXpRulesPage } from '@/pages/admin/AdminXpRulesPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';

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
            <Route path={ROUTES.ONBOARDING} element={<OnboardingPage />} />

            {/* Learner Main Layout */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.MY_LEARNING} element={<MyLearningPage />} />
              <Route path={ROUTES.COURSES} element={<CourseListPage />} />
              <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
              <Route path={ROUTES.MY_COURSES} element={<MyCoursesPage />} />
              <Route path={ROUTES.PROGRESS} element={<LearningProgressPage />} />
              <Route path={ROUTES.ACHIEVEMENTS} element={<AchievementsPage />} />
              <Route path={ROUTES.VOCABULARY} element={<VocabularyNotebookPage />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<NotificationsPage />} />

              {/* Protected Learner Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                <Route path={ROUTES.LEARN_RESUME} element={<ResumeCoursePage />} />
                <Route path={ROUTES.LEARN_LESSON} element={<LessonLearningPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Area (Người 1) */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
                <Route path={ROUTES.ADMIN_USER_DETAIL} element={<AdminUserDetailPage />} />
                <Route path={ROUTES.ADMIN_ROLES} element={<AdminRolesPage />} />
                <Route path={ROUTES.ADMIN_ACHIEVEMENTS} element={<AdminAchievementsPage />} />
                <Route path={ROUTES.ADMIN_XP_RULES} element={<AdminXpRulesPage />} />
                <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminAuditLogsPage />} />
                <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
