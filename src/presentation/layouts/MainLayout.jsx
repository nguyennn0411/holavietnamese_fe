import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/application/context/AuthContext'

export function MainLayout() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app-shell">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <strong>SEP490</strong>
        <button onClick={handleLogout} style={{ padding: '4px 8px' }}>Logout</button>
      </header>

      <main className="app-main" style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
