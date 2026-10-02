import { useState, useEffect } from 'react';
import { learnerService } from '@/services/learnerService';
import { useAuth } from '@/application/context/AuthContext';

export function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [status, setStatus] = useState({ loading: false, message: '', error: '' });

  useEffect(() => {
    learnerService.getProfile().then(data => {
      setProfile(data);
      setFormData(data);
    });
  }, [authUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', error: '' });
    try {
      const res = await learnerService.updateProfile(formData);
      setProfile(res.result || formData);
      setEditing(false);
      setStatus({ loading: false, message: 'Đã cập nhật hồ sơ thành công!', error: '' });
    } catch {
      setStatus({ loading: false, message: '', error: 'Không thể cập nhật hồ sơ.' });
    }
  };

  if (!profile) return <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải thông tin hồ sơ…</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: 0 }}>Hồ sơ học viên</h1>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            border: '1.5px solid #ded5cb',
            background: editing ? '#f3f4f6' : '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {editing ? '✕ Hủy chỉnh sửa' : '✏️ Chỉnh sửa hồ sơ'}
        </button>
      </div>

      {status.message && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '10px', marginBottom: '20px' }}>
          {status.message}
        </div>
      )}

      {/* Main Profile Card */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', borderBottom: '1px solid #f3f4f6', paddingBottom: '24px', marginBottom: '24px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: '#8B1A1A',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 800,
            boxShadow: '0 4px 10px rgba(139,26,26,0.3)',
          }}>
            {profile.fullName?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 4px 0', color: '#111827' }}>{profile.fullName}</h2>
            <p style={{ color: '#6b7280', margin: '0 0 10px 0', fontSize: '0.9rem' }}>@{profile.username} • {profile.email}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                🔥 Chuỗi Streak: {profile.streakDays || 4} ngày
              </span>
              <span style={{ padding: '4px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
                ⭐ {profile.totalXp || 420} XP
              </span>
            </div>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Họ và tên</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Quốc gia</label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Ngôn ngữ mẹ đẻ</label>
                <select
                  value={formData.nativeLanguage || 'en'}
                  onChange={e => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                >
                  <option value="en">English</option>
                  <option value="ko">한국어 (Korean)</option>
                  <option value="ja">日本語 (Japanese)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Trình độ mục tiêu</label>
                <select
                  value={formData.targetLevel || 'A1'}
                  onChange={e => setFormData({ ...formData, targetLevel: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                >
                  <option value="A1">A1 - Khởi đầu</option>
                  <option value="A2">A2 - Sơ cấp</option>
                  <option value="B1">B1 - Trung cấp</option>
                  <option value="B2">B2 - Cao cấp</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Mục tiêu học tập</label>
              <input
                type="text"
                value={formData.learningGoal || ''}
                onChange={e => setFormData({ ...formData, learningGoal: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              style={{
                marginTop: '12px',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: '#8B1A1A',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {status.loading ? 'Đang lưu…' : 'Lưu thay đổi'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '16px', background: '#fafafa', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Quốc gia</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{profile.country || 'Chưa cập nhật'}</p>
            </div>
            <div style={{ padding: '16px', background: '#fafafa', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Ngôn ngữ mẹ đẻ</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{profile.nativeLanguage?.toUpperCase() || 'EN'}</p>
            </div>
            <div style={{ padding: '16px', background: '#fafafa', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Trình độ hiện tại</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Cấp độ {profile.targetLevel || 'A1'}</p>
            </div>
            <div style={{ padding: '16px', background: '#fafafa', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Mục tiêu học</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>{profile.learningGoal || 'Du lịch & Giao tiếp'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
