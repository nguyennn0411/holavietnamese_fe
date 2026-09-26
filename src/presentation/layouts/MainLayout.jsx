import { Outlet } from 'react-router-dom'

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>SEP490</strong>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
