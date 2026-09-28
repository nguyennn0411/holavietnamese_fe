import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/application/context/AuthContext'

export function MainLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <header className="app-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: '#8B1A1A', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '700', fontSize: '0.85rem',
          }}>H</div>
          <strong style={{ color: '#1f2937', fontSize: '1rem' }}>HolaVietnamese</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Xin chào, <strong style={{ color: '#1f2937' }}>{user.fullName || user.username}</strong>
            </span>
          )}
          <button
            onClick={logout}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid #d1d5db',
              backgroundColor: '#fff',
              color: '#374151',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main" style={{ padding: '1.5rem' }}>
        <Outlet />
      </main>
    </div>
  )
}
