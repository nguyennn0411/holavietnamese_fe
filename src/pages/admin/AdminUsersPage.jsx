import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusMsg, setStatusMsg] = useState('');

  // Role Assignment Modal state
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('LEARNER');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    adminService.getUsers().then(setUsers);
  };

  const handleToggleStatus = async (id) => {
    const res = await adminService.toggleUserStatus(id);
    setStatusMsg(res.message);
    loadUsers();
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleOpenRoleModal = (user) => {
    setRoleModalUser(user);
    setSelectedRole(user.role);
  };

  const handleSaveRole = async () => {
    if (!roleModalUser) return;
    const res = await adminService.updateUserRole(roleModalUser.id, selectedRole);
    setStatusMsg(res.message);
    setRoleModalUser(null);
    loadUsers();
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
                          u.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px 0' }}>Quản lý người dùng</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Xem danh sách, tìm kiếm, phân quyền vai trò và khóa/mở tài khoản.</p>
        </div>
      </div>

      {statusMsg && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
          ✓ {statusMsg}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="admin-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, username, email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="LEARNER">Học viên (LEARNER)</option>
          <option value="INSTRUCTOR">Giảng viên (INSTRUCTOR)</option>
          <option value="ADMIN">Quản trị (ADMIN)</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Học viên / Người dùng</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Streak / XP</th>
              <th>Trạng thái</th>
              <th>Ngày tham gia</th>
              <th style={{ textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <strong style={{ color: '#0f172a' }}>{user.fullName}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>@{user.username}</span>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`admin-badge ${user.role === 'ADMIN' ? 'admin-badge-danger' : user.role === 'INSTRUCTOR' ? 'admin-badge-info' : 'admin-badge-warning'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span style={{ color: '#ea580c', fontWeight: 600 }}>🔥 {user.streak}d</span> / <span style={{ color: '#0284c7', fontWeight: 600 }}>{user.xp} XP</span>
                </td>
                <td>
                  <span className={`admin-badge ${user.status === 'ACTIVE' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>{user.joinDate}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenRoleModal(user)}
                    style={{
                      marginRight: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#fff',
                      color: '#475569',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Phân vai trò
                  </button>
                  <Link
                    to={`/admin/users/${user.id}`}
                    style={{
                      marginRight: '6px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#0f172a',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    Chi tiết
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(user.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: user.status === 'ACTIVE' ? '#fee2e2' : '#dcfce7',
                      color: user.status === 'ACTIVE' ? '#991b1b' : '#166534',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {user.status === 'ACTIVE' ? 'Khóa' : 'Mở'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Assignment Modal */}
      {roleModalUser && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{ background: '#fff', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#0f172a' }}>Phân quyền vai trò</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#64748b' }}>
              Thay đổi vai trò cho tài khoản <strong>{roleModalUser.fullName}</strong> (@{roleModalUser.username}).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { role: 'LEARNER', title: 'Học viên (LEARNER)', desc: 'Quyền cơ bản: học bài, tra từ, làm quiz' },
                { role: 'INSTRUCTOR', title: 'Giảng viên (INSTRUCTOR)', desc: 'Quyền soạn bài, tạo quiz, duyệt nội dung' },
                { role: 'ADMIN', title: 'Quản trị viên (ADMIN)', desc: 'Toàn quyền kiểm soát hệ thống và người dùng' },
              ].map(r => (
                <label
                  key={r.role}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedRole === r.role ? '2px solid #8B1A1A' : '1px solid #cbd5e1',
                    background: selectedRole === r.role ? '#fffaf8' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.role}
                    checked={selectedRole === r.role}
                    onChange={() => setSelectedRole(r.role)}
                    style={{ marginTop: '2px', accentColor: '#8B1A1A' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>{r.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#8B1A1A', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Lưu vai trò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
