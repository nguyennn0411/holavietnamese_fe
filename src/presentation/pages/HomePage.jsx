import { useAuth } from '@/application/context/AuthContext'

export function HomePage() {
  const { user } = useAuth();

  return (
    <section className="page">
      <h1 style={{ margin: '0 0 0.5rem 0' }}>
        🇻🇳 Welcome to HolaVietnamese!
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        Your personalized Vietnamese learning dashboard is ready.
      </p>

      {user && (
        <div style={{
          backgroundColor: '#fef9c3',
          border: '1px solid #fde68a',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>👤 {user.fullName || user.username}</strong>
            {user.roles && (
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                backgroundColor: '#8B1A1A',
                color: '#fff',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}>
                {user.roles.join(', ')}
              </span>
            )}
          </p>
          {user.email && (
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
              {user.email}
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '2rem' }}>📚</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1rem' }}>Lessons</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Start learning Vietnamese</p>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '2rem' }}>🎯</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1rem' }}>Practice</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Conversation exercises</p>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '2rem' }}>📝</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1rem' }}>Exams</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Test your proficiency</p>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '2rem' }}>📊</span>
          <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1rem' }}>Progress</h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Track your journey</p>
        </div>
      </div>
    </section>
  )
}

const cardStyle = {
  padding: '1.25rem',
  border: '1px solid #e5e7eb',
  borderRadius: '0.75rem',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  transition: 'box-shadow 0.2s',
};
