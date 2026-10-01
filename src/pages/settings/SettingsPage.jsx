import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';

export function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    learnerService.getSettings().then(setSettings);
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    await learnerService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải cài đặt…</div>;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: '0 0 8px 0' }}>Cài đặt học tập</h1>
      <p style={{ color: '#6b7280', margin: '0 0 28px 0' }}>Tùy chỉnh trải nghiệm âm thanh, hiển thị bài học và thông báo.</p>

      {saved && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '10px', marginBottom: '20px' }}>
          ✓ Đã lưu cài đặt thành công!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Âm thanh & phát âm */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>🎧 Âm thanh & Phát âm</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Tốc độ giọng đọc mẫu</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Phát âm chậm hơn để dễ nghe thanh điệu tiếng Việt</span>
            </div>
            <select
              value={settings.audioSpeed}
              onChange={e => setSettings({ ...settings, audioSpeed: parseFloat(e.target.value) })}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            >
              <option value="0.75">0.75x (Chậm)</option>
              <option value="1.0">1.0x (Bình thường)</option>
              <option value="1.25">1.25x (Nhanh)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Gợi ý khẩu hình phát âm</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Hiển thị hướng dẫn đặt lưỡi và mở miệng cho các âm khó (ng, tr, r, kh)</span>
            </div>
            <input
              type="checkbox"
              checked={settings.pronunciationTips}
              onChange={() => handleToggle('pronunciationTips')}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Trợ giúp dịch & Mục tiêu */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>📖 Trợ giúp hiển thị</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Hiển thị bản dịch tiếng Anh song song</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Tắt đi nếu bạn muốn thử thách tư duy 100% bằng tiếng Việt</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={() => handleToggle('showTranslation')}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Mục tiêu học mỗi ngày</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Hệ thống sẽ nhắc nhở nếu chưa hoàn thành mục tiêu</span>
            </div>
            <select
              value={settings.dailyGoalMinutes}
              onChange={e => setSettings({ ...settings, dailyGoalMinutes: parseInt(e.target.value) })}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            >
              <option value="10">10 phút / ngày</option>
              <option value="15">15 phút / ngày</option>
              <option value="30">30 phút / ngày</option>
              <option value="45">45 phút / ngày</option>
            </select>
          </div>
        </div>

        {/* Thông báo & Nhắc nhở */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>🔔 Nhắc nhở & Thông báo</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Nhắc nhở chuỗi Streak rực lửa 🔥</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Nhắc trước 20:00 tối nếu bạn chưa học bài trong ngày</span>
            </div>
            <input
              type="checkbox"
              checked={settings.streakReminders}
              onChange={() => handleToggle('streakReminders')}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: '#374151' }}>Âm thanh hiệu ứng khi trả lời đúng</strong>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Phát âm thanh vui tươi khi hoàn thành xuất sắc thử thách</span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={() => handleToggle('soundEffects')}
              style={{ width: '20px', height: '20px', accentColor: '#8B1A1A', cursor: 'pointer' }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            alignSelf: 'flex-start',
            padding: '12px 28px',
            borderRadius: '999px',
            border: 'none',
            background: '#8B1A1A',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Lưu toàn bộ cài đặt
        </button>
      </div>
    </div>
  );
}
