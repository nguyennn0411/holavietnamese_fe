import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { CourseListPage } from '@/pages/courses/CourseListPage'
import { CourseDetailPage } from '@/pages/courses/CourseDetailPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { MyCoursesPage } from '@/pages/my-courses/MyCoursesPage'
import { LessonLearningPage } from '@/pages/learning/LessonLearningPage'
import { ResumeCoursePage } from '@/pages/learning/ResumeCoursePage'
import { LearningProgressPage } from '@/pages/progress/LearningProgressPage'
import { VocabularyNotebookPage } from '@/pages/vocabulary/VocabularyNotebookPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/progress" element={<LearningProgressPage />} />
          <Route path="/vocabulary" element={<VocabularyNotebookPage />} />
          <Route path="/learn/:courseId" element={<ResumeCoursePage />} />
          <Route path="/learn/:courseId/lesson/:lessonId" element={<LessonLearningPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
