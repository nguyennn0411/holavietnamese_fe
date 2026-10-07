import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboardStats()
      .then(data => {
        setStats(data || {});
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', color: 'var(--color-muted)' }}>Đang tải bảng điều khiển quản trị…</div>;
  }
  if (error) return <div className="state" role="alert">{error}</div>;

  // Safe fallback for arrays if BE doesn't return them yet
  const userGrowth = Array.isArray(stats?.userGrowth) ? stats.userGrowth : [];

  const recentActivities = Array.isArray(stats?.recentActivities) ? stats.recentActivities : [];

  const totalUsers = stats?.totalUsers ?? 0;
  const activeLearners = stats?.activeLearners ?? 0;
  const totalCourses = stats?.totalCourses ?? 8;
  const totalLessons = stats?.totalLessons ?? 124;
  const totalXp = stats?.totalXpGranted ?? 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Bảng điều khiển Quản trị</h1>
        <p style={{ color: 'var(--color-muted)', margin: 0, fontSize: '0.9rem' }}>Tổng quan số liệu người dùng, học tập và hoạt động hệ thống.</p>
      </div>

      {/* KPI Cards: 5 cards exactly as specified */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 700 }}>TỔNG NGƯỜI DÙNG</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '8px 0 0 0' }}>{totalUsers}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Tài khoản trong hệ thống</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 700 }}>HỌC VIÊN HOẠT ĐỘNG</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '8px 0 0 0' }}>{activeLearners}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Đang hoạt động</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 700 }}>TỔNG KHÓA HỌC</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '8px 0 0 0' }}>{totalCourses}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Đang mở đăng ký</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 700 }}>TỔNG BÀI HỌC</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-ink)', margin: '8px 0 0 0' }}>{totalLessons}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Bài học tương tác</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', fontWeight: 700 }}>TỔNG XP ĐÃ CẤP</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-sage)', margin: '8px 0 0 0' }}>{Number(totalXp).toLocaleString()}</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-sage)', fontWeight: 600 }}>Điểm thưởng học tập</span>
        </div>
      </div>

      {/* Grid 2 Columns: Growth Chart & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* User Growth */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Tăng trưởng người dùng (6 tháng qua)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            {userGrowth.length === 0 && <div className="state" style={{ width: '100%' }}>Chưa có dữ liệu tăng trưởng.</div>}
            {userGrowth.map((g, idx) => {
              const maxUsers = Math.max(...userGrowth.map(item => Number(item.users) || 0), 1);
              const height = Math.min(Math.max(((Number(g.users) || 0) / maxUsers) * 100, 4), 100);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sage)' }}>{g.users}</span>
                  <div style={{ width: '100%', height: `${height * 1.2}px`, background: 'var(--color-sage)', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)' }}>{g.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Hoạt động thời gian thực</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.length === 0 && <div className="state">Chưa có hoạt động gần đây.</div>}
            {recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--color-ink)' }}>{act.user}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--color-muted)' }}>{act.action}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
