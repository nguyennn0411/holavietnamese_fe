import { useState, useEffect } from 'react';
import { adminService } from '@/services/adminService';

export function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', icon: '🌟', criteria: '', xpReward: 50 });
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
    setNewAch({ title: '', icon: '🌟', criteria: '', xpReward: 50 });
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
              <th>Mã / Icon</th>
              <th>Tên huy hiệu</th>
              <th>Điều kiện mở khóa</th>
              <th>Thưởng XP</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map(ach => (
              <tr key={ach.id}>
                <td>
                  <span style={{ fontSize: '1.4rem', marginRight: '8px' }}>{ach.icon}</span>
                  <strong>{ach.id}</strong>
                </td>
                <td><strong style={{ color: '#0f172a' }}>{ach.title}</strong></td>
                <td>{ach.criteria}</td>
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
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem' }}>Thêm huy hiệu mới</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Điều kiện mở khóa</label>
                <textarea
                  placeholder="Mô tả hành động cần đạt…"
                  value={newAch.criteria}
                  onChange={e => setNewAch({ ...newAch, criteria: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '60px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Thưởng XP</label>
                <input
                  type="number"
                  value={newAch.xpReward}
                  onChange={e => setNewAch({ ...newAch, xpReward: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
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
                  Lưu huy hiệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
