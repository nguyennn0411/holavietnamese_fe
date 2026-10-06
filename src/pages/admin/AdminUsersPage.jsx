import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';

const PAGE_SIZE = 10;

export function AdminUsersPage() {
  const [query, setQuery] = useState({ search: '', status: '', role: '', page: 0, size: PAGE_SIZE });
  const [input, setInput] = useState('');
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [state, setState] = useState({ loading: true, error: '', message: '' });
  const [roleUser, setRoleUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const result = await adminService.getUsers(query);
      setData(Array.isArray(result) ? { content: result, totalPages: 1, totalElements: result.length } : {
        content: result?.content ?? [], totalPages: result?.totalPages ?? 0, totalElements: result?.totalElements ?? 0,
      });
    } catch (error) {
      setState((s) => ({ ...s, error: error.message }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  }, [query]);

  useEffect(() => { load(); }, [load]);

  const notify = (message) => {
    setState((s) => ({ ...s, message }));
    window.setTimeout(() => setState((s) => ({ ...s, message: '' })), 3000);
  };

  const changeStatus = async (user) => {
    const next = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    try {
      const response = await adminService.updateUserStatus(user.id, next);
      notify(response.message || 'Đã cập nhật trạng thái tài khoản.');
      load();
    } catch (error) { setState((s) => ({ ...s, error: error.message })); }
  };

  const saveRoles = async () => {
    try {
      const response = await adminService.updateUserRole(roleUser.id, selectedRoles);
      notify(response.message || 'Đã cập nhật vai trò.');
      setRoleUser(null);
      load();
    } catch (error) { setState((s) => ({ ...s, error: error.message })); }
  };

  const users = data.content;
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px' }}>Quản lý người dùng</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Tìm kiếm, lọc, phân quyền và quản lý trạng thái tài khoản.</p>
      </div>

      {state.message && <div className="success state" style={{ padding: 12 }}>✓ {state.message}</div>}
      {state.error && <div className="state" role="alert"><p>{state.error}</p><button onClick={load}>Thử lại</button></div>}

      <form className="admin-card" onSubmit={(e) => { e.preventDefault(); setQuery((q) => ({ ...q, search: input.trim(), page: 0 })); }} style={{ padding: 16, marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input aria-label="Tìm người dùng" placeholder="Tìm tên, username hoặc email…" value={input} onChange={(e) => setInput(e.target.value)} style={{ flex: '1 1 260px' }} />
        <select aria-label="Trạng thái" value={query.status} onChange={(e) => setQuery((q) => ({ ...q, status: e.target.value, page: 0 }))}>
          <option value="">Tất cả trạng thái</option><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option><option value="LOCKED">LOCKED</option><option value="DISABLED">DISABLED</option>
        </select>
        <select aria-label="Vai trò" value={query.role} onChange={(e) => setQuery((q) => ({ ...q, role: e.target.value, page: 0 }))}>
          <option value="">Tất cả vai trò</option><option value="LEARNER">LEARNER</option><option value="INSTRUCTOR">INSTRUCTOR</option><option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Tìm kiếm</button>
      </form>

      <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}>
        {state.loading ? <div className="state">Đang tải người dùng…</div> : users.length === 0 ? <div className="state">Không tìm thấy người dùng phù hợp.</div> : (
          <table className="admin-table"><thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th style={{ textAlign: 'right' }}>Thao tác</th></tr></thead>
            <tbody>{users.map((user) => {
              const userRoles = user.roles ?? (user.role ? [user.role] : []);
              return <tr key={user.id ?? user.userId}>
                <td><strong>{user.fullName || user.username}</strong><small style={{ display: 'block', color: '#64748b' }}>@{user.username}</small></td>
                <td>{user.email || '—'}</td>
                <td>{userRoles.map((role) => <span key={role} className="admin-badge admin-badge-info" style={{ marginRight: 4 }}>{String(role).replace('ROLE_', '')}</span>)}</td>
                <td><span className={`admin-badge ${user.status === 'ACTIVE' ? 'admin-badge-success' : 'admin-badge-danger'}`}>{user.status}</span></td>
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button className="secondary" onClick={() => { setRoleUser(user); setSelectedRoles(userRoles.map((r) => String(r).replace('ROLE_', ''))); }}>Vai trò</button>{' '}
                  <Link className="button secondary" to={`/admin/users/${user.id ?? user.userId}`}>Chi tiết</Link>{' '}
                  <button className={user.status === 'ACTIVE' ? 'danger' : ''} onClick={() => changeStatus(user)}>{user.status === 'ACTIVE' ? 'Khóa' : 'Kích hoạt'}</button>
                </td>
              </tr>;
            })}</tbody>
          </table>
        )}
      </div>

      <div className="actions" style={{ justifyContent: 'space-between', marginTop: 16 }}>
        <span className="muted">Tổng cộng {data.totalElements} người dùng</span>
        <div className="actions"><button className="secondary" disabled={query.page === 0 || state.loading} onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}>← Trước</button><span>Trang {query.page + 1}/{Math.max(data.totalPages, 1)}</span><button className="secondary" disabled={query.page + 1 >= data.totalPages || state.loading} onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}>Sau →</button></div>
      </div>

      {roleUser && <div className="admin-modal-overlay"><div className="admin-card" style={{ width: 'min(420px, calc(100% - 32px))', padding: 28 }}>
        <h2>Cập nhật vai trò</h2><p className="muted">{roleUser.fullName || roleUser.username}</p>
        {['LEARNER', 'INSTRUCTOR', 'ADMIN'].map((role) => <label key={role} style={{ flexDirection: 'row' }}><input type="checkbox" style={{ width: 'auto' }} checked={selectedRoles.includes(role)} onChange={(e) => setSelectedRoles((values) => e.target.checked ? [...values, role] : values.filter((item) => item !== role))} />{role}</label>)}
        <div className="actions" style={{ justifyContent: 'flex-end' }}><button className="secondary" onClick={() => setRoleUser(null)}>Hủy</button><button disabled={!selectedRoles.length} onClick={saveRoles}>Lưu vai trò</button></div>
      </div></div>}
    </div>
  );
}
