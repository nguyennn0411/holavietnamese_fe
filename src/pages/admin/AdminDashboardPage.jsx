import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Đang tải bảng điều khiển quản trị…</div>;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Bảng điều khiển Quản trị</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Tổng quan số liệu người dùng, học tập và hoạt động hệ thống.</p>
      </div>

      {/* KPI Cards: 5 cards exactly as specified */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG NGƯỜI DÙNG</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>{stats.totalUsers}</h2>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>↑ +14% tháng này</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>HỌC VIÊN HOẠT ĐỘNG</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>{stats.activeLearners}</h2>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>62.6% tỷ lệ kích hoạt</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG KHÓA HỌC</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>{stats.totalCourses}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đang mở đăng ký</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG BÀI HỌC</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0 0' }}>{stats.totalLessons}</h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bài học tương tác</span>
        </div>

        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TỔNG XP ĐÃ CẤP</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', margin: '8px 0 0 0' }}>{stats.totalXpGranted?.toLocaleString() || '48,500'}</h2>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>Điểm thưởng học tập</span>
        </div>
      </div>

      {/* Grid 2 Columns: Growth Chart & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* User Growth */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Tăng trưởng người dùng (6 tháng qua)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
            {stats.userGrowth.map((g, idx) => {
              const height = (g.users / 1500) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{g.users}</span>
                  <div style={{ width: '100%', height: `${height}%`, background: '#38bdf8', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{g.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Hoạt động thời gian thực</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentActivities.map(act => (
              <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{act.user}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>{act.action}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
