import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';

export function AchievementsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learnerService.getAchievements().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải danh hiệu & thành tích…</div>;

  const unlockedCount = data?.badges?.filter(b => b.unlocked).length || 0;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: '0 0 8px 0' }}>
          Huy hiệu & Thành tích
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Ghi nhận từng cột mốc nỗ lực trên hành trình khám phá ngôn ngữ và văn hóa Việt Nam.
        </p>
      </div>

      {/* Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #8B1A1A 0%, #c2410c 100%)',
        color: '#fff',
        borderRadius: '16px',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        boxShadow: '0 10px 25px rgba(139,26,26,0.2)',
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>Bộ sưu tập</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 0 0' }}>
            Đã mở {unlockedCount} / {data.badges.length} huy hiệu
          </h2>
        </div>
        <span style={{ fontSize: '3.5rem' }}>🏆</span>
      </div>

      {/* Badges Grid */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Huy hiệu học tập</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {data.badges.map(badge => (
          <div
            key={badge.id}
            style={{
              background: badge.unlocked ? '#fff' : '#f9fafb',
              border: badge.unlocked ? '1.5px solid #fde68a' : '1px dashed #d1d5db',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              boxShadow: badge.unlocked ? '0 4px 12px rgba(251,191,36,0.15)' : 'none',
              opacity: badge.unlocked ? 1 : 0.65,
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: badge.unlocked ? '#fef3c7' : '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              flexShrink: 0,
            }}>
              {badge.icon}
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '1rem', color: '#111827' }}>{badge.name}</strong>
              <p style={{ margin: '4px 0 6px 0', fontSize: '0.8rem', color: '#6b7280' }}>{badge.desc}</p>
              {badge.unlocked ? (
                <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
                  ✓ Đạt ngày {badge.date}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>
                  🔒 {badge.progress}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Passport Stamps Section */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '2rem' }}>🛂</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111827' }}>Hộ chiếu khám phá Việt Nam</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>
              Mỗi khi hoàn thành bài học gắn liền với địa danh, bạn sẽ nhận được một con tem hộ chiếu đặc trưng!
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginTop: '20px' }}>
          {data.passportStamps.map(stamp => (
            <div
              key={stamp.id}
              style={{
                border: stamp.unlocked ? '2px solid #8B1A1A' : '1.5px dashed #ded5cb',
                background: stamp.unlocked ? '#fffaf8' : '#faf8f5',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8B1A1A', textTransform: 'uppercase' }}>
                {stamp.city}
              </span>
              <p style={{ margin: '8px 0', fontSize: '0.95rem', fontWeight: 600, color: '#2d1810' }}>
                {stamp.stamp}
              </p>
              {stamp.unlocked ? (
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Đã đóng dấu ({stamp.date})
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Chưa mở khóa</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
