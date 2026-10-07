import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';

export function LearningProgressPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    learnerService.getProgressData().then(res => {
      setData(res);
    }).catch(() => setError('Không tải được tiến độ học tập. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tổng hợp tiến trình học…</div>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
      <p>Tiến độ khóa học lấy từ kết quả đã lưu. Thời gian học, XP và chuỗi ngày học chưa có dữ liệu.</p>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: '0 0 8px 0' }}>
          Tiến trình & Thống kê học tập
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Mỗi phút học tập đều giúp bạn tiến gần hơn đến mục tiêu nói tiếng Việt lưu loát.
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>⏱️</span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Thời gian học</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>{data.totalTimeMinutes} phút</h3>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>📚</span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Bài hoàn thành</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', margin: '4px 0 0 0' }}>{data.completedLessons} bài</h3>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>🔥</span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Chuỗi Streak</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ea580c', margin: '4px 0 0 0' }}>{data.currentStreak} ngày</h3>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>⭐</span>
          <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Điểm tích lũy XP</span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', margin: '4px 0 0 0' }}>{data.totalXp} XP</h3>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>Hoạt động tuần này</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Biểu đồ thời gian luyện tập mỗi ngày</p>
          </div>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
            Cấp độ: {data.level}
          </span>
        </div>

        {/* Visual Bars */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '180px', paddingTop: '20px', borderBottom: '1px solid #e5e7eb' }}>
          {data.weeklyActivity.map((day, idx) => {
            const heightPercent = Math.max((day.minutes / 35) * 100, 8);
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: day.minutes > 0 ? '#8B1A1A' : '#9ca3af' }}>
                  {day.minutes > 0 ? `${day.minutes}p` : ''}
                </span>
                <div style={{
                  width: '36px',
                  height: `${heightPercent}%`,
                  background: day.minutes > 0 ? 'linear-gradient(180deg, #8B1A1A 0%, #d4533b 100%)' : '#f3f4f6',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>Lịch sử hoạt động gần đây</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.recentActivities.map(act => (
            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#faf8f5', borderRadius: '10px', border: '1px solid #ded5cb' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#2d1810' }}>{act.title}</strong>
                <span style={{ fontSize: '0.8rem', color: '#796b61' }}>{act.time}</span>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700 }}>
                +{act.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
