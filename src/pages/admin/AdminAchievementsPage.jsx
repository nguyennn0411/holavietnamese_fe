import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAch, setNewAch] = useState({
    code: '',
    title: '',
    desc: '',
    icon: '🌟',
    iconUrl: '',
    conditionType: 'LESSON_COUNT',
    criteria: '',
    xpReward: 50,
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    adminService.getAchievements().then(setAchievements);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await adminService.createAchievement(newAch);
    setMsg(res.message);
    setShowModal(false);
    setNewAch({
      code: '',
      title: '',
      desc: '',
      icon: '🌟',
      iconUrl: '',
      conditionType: 'LESSON_COUNT',
      criteria: '',
      xpReward: 50,
    });
    loadData();
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Quản lý Thành tích & Huy hiệu</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Tạo huy hiệu, cấu hình điều kiện mở khóa và điểm thưởng XP cho người học.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: '#8B1A1A',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Thêm huy hiệu mới
        </button>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>
          ✓ {msg}
        </div>
      )}

      {/* Achievements Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Code / Icon</th>
              <th>Tên huy hiệu</th>
              <th>Điều kiện mở khóa</th>
              <th>Loại điều kiện</th>
              <th>Thưởng XP</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map(ach => (
              <tr key={ach.id}>
                <td>
                  <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>{ach.icon}</span>
                  <strong>{ach.code || ach.id}</strong>
                </td>
                <td><strong style={{ color: '#0f172a' }}>{ach.title}</strong></td>
                <td>{ach.criteria}</td>
                <td>
                  <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {ach.conditionType || 'GENERAL'}
                  </span>
                </td>
                <td><span style={{ color: '#0284c7', fontWeight: 700 }}>+{ach.xpReward} XP</span></td>
                <td>
                  <span className={`admin-badge ${ach.active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    {ach.active ? 'Hoạt động' : 'Tạm ẩn'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Achievement */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#0f172a' }}>Khởi tạo Huy hiệu mới</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Icon (Emoji)</label>
                  <input
                    type="text"
                    value={newAch.icon}
                    onChange={e => setNewAch({ ...newAch, icon: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Mã Code duy nhất</label>
                  <input
                    type="text"
                    placeholder="VD: PHO_MASTER_01"
                    value={newAch.code}
                    onChange={e => setNewAch({ ...newAch, code: e.target.value.toUpperCase() })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Tên huy hiệu</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bậc Thầy Phở Bò"
                  value={newAch.title}
                  onChange={e => setNewAch({ ...newAch, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Mô tả huy hiệu</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàn thành chủ đề Gọi món Phở Hà Nội"
                  value={newAch.desc}
                  onChange={e => setNewAch({ ...newAch, desc: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Loại điều kiện</label>
                  <select
                    value={newAch.conditionType}
                    onChange={e => setNewAch({ ...newAch, conditionType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="LESSON_COUNT">Số bài học hoàn thành</option>
                    <option value="VOCAB_COUNT">Số từ vựng ghi nhớ</option>
                    <option value="STREAK_DAYS">Chuỗi ngày liên tiếp (Streak)</option>
                    <option value="JOURNEY_CITY">Hoàn thành chặng Hành trình</option>
                    <option value="QUIZ_SCORE">Điểm số bài kiểm tra</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Điểm XP thưởng</label>
                  <input
                    type="number"
                    value={newAch.xpReward}
                    onChange={e => setNewAch({ ...newAch, xpReward: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Chi tiết điều kiện mở khóa</label>
                <textarea
                  placeholder="Mô tả hành động cần đạt để mở khóa huy hiệu…"
                  value={newAch.criteria}
                  onChange={e => setNewAch({ ...newAch, criteria: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '60px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Link Icon SVG/PNG (Tùy chọn)</label>
                <input
                  type="text"
                  placeholder="https://... (để trống nếu dùng Emoji)"
                  value={newAch.iconUrl}
                  onChange={e => setNewAch({ ...newAch, iconUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#8B1A1A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Khởi tạo huy hiệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
