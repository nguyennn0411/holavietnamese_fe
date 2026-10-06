import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';

export function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminService.getUserById(id).then(u => {
      setUser(u);
      setSelectedRole(String(u.roles?.[0] || u.role || 'LEARNER').replace('ROLE_', ''));
      setSelectedStatus(u.status || 'ACTIVE');
    }).catch(error => setMsg(error.message));
  }, [id]);

  const handleRoleChange = async () => {
    const res = await adminService.updateUserRole(id, selectedRole);
    setMsg(res.message);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleStatusChange = async () => {
    try {
      const res = await adminService.updateUserStatus(id, selectedStatus);
      setUser((value) => ({ ...value, status: selectedStatus }));
      setMsg(res.message || 'Đã cập nhật trạng thái.');
    } catch (error) { setMsg(error.message); }
  };

  if (!user) return <div>Đang tải chi tiết người dùng…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/admin/users" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem' }}>
          ← Danh sách người dùng
        </Link>
        <span style={{ color: '#cbd5e1' }}>/</span>
        <strong style={{ fontSize: '0.9rem' }}>{user.fullName}</strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>{user.fullName}</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>@{user.username} • ID: #{user.id}</p>
        </div>
        <span className={`admin-badge ${user.status === 'ACTIVE' ? 'admin-badge-success' : 'admin-badge-danger'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
          {user.status === 'ACTIVE' ? 'Tài khoản Hoạt động' : 'Tài khoản Đã khóa'}
        </span>
      </div>

      {msg && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>
          ✓ {msg}
        </div>
      )}

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h3>Trạng thái tài khoản</h3>
        <div className="actions">
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {['ACTIVE', 'INACTIVE', 'LOCKED', 'DISABLED'].map((status) => <option key={status}>{status}</option>)}
          </select>
          <button type="button" onClick={handleStatusChange}>Cập nhật trạng thái</button>
        </div>
      </div>

      {/* Grid: Left user details, Right role changer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Thông tin hồ sơ học viên</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>EMAIL</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{user.email}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>QUỐC GIA</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{user.country || 'N/A'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>TRÌNH ĐỘ MỤC TIÊU</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>Cấp độ {user.targetLevel || 'A1'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>MỤC TIÊU HỌC</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{user.learningGoal || 'Giao tiếp'}</p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Phân vai trò (Role)</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>Thay đổi quyền hạn truy cập của người dùng này.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              <option value="LEARNER">LEARNER (Học viên)</option>
              <option value="INSTRUCTOR">INSTRUCTOR (Giảng viên)</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
            </select>
            <button
              type="button"
              onClick={handleRoleChange}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#8B1A1A',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & History */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Khóa học đã đăng ký</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {user.enrolledCourses?.map(c => (
              <div key={c.id} style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>{c.name}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đăng ký ngày {c.enrolledAt} • Tiến độ: {c.progress}%</span>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '6px' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: '#0284c7', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0' }}>Nhật ký hoạt động tài khoản</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {user.auditHistory?.map((h, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>{h.date}</span>
                <strong style={{ color: '#334155' }}>{h.action}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
