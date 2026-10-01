import { Link, NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { SessionNavigation } from '@/components/common/SessionNavigation'

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="brand" to="/"><span className="brand-mark">h.</span><span>Hola <span className="brand-light">Vietnamese</span></span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          {[[ROUTES.HOME, 'Home'], [ROUTES.COURSES, 'Courses'], [ROUTES.MY_COURSES, 'My Courses'], [ROUTES.PROGRESS, 'Progress'], [ROUTES.VOCABULARY, 'Vocabulary Notebook']].map(([path, label]) => <NavLink key={path} to={path} end={path === '/'}>{label}</NavLink>)}
        </nav>
        <SessionNavigation />
      </header>

      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">Hola Vietnamese <span>Small steps. Real conversations.</span></footer>
    </div>
  )
}
