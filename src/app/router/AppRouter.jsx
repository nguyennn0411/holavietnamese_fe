import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/presentation/layouts/MainLayout'
import { HomePage } from '@/presentation/pages/HomePage'
import { NotFoundPage } from '@/presentation/pages/NotFoundPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
