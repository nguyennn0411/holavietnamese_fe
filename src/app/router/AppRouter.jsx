import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/presentation/layouts/MainLayout'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'
import { LoginPage } from '@/presentation/pages/LoginPage'
import { AuthProvider } from '@/application/context/AuthContext'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
