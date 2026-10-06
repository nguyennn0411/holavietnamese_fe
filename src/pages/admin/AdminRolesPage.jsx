import { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';

const empty = { name: '', description: '', permissions: '' };
export function AdminRolesPage() {
  const [items, setItems] = useState([]); const [draft, setDraft] = useState(empty); const [editing, setEditing] = useState(null);
  const [state, setState] = useState({ loading: true, error: '', message: '' });
  const load = useCallback(async () => { try { setItems(await adminService.getRoles()); setState(s => ({ ...s, loading: false, error: '' })); } catch (e) { setState(s => ({ ...s, loading: false, error: e.message })); } }, []);
  useEffect(() => { load(); }, [load]);
  const submit = async (e) => { e.preventDefault(); const payload = { ...draft, permissions: draft.permissions.split(',').map(v => v.trim()).filter(Boolean) }; try { const r = editing ? await adminService.updateRole(editing, payload) : await adminService.createRole(payload); setState(s => ({ ...s, message: r.message || 'Đã lưu vai trò.', error: '' })); setDraft(empty); setEditing(null); load(); } catch (err) { setState(s => ({ ...s, error: err.message })); } };
  const edit = (item) => { setEditing(item.id); setDraft({ name: item.name || '', description: item.description || item.desc || '', permissions: (item.permissions || []).join(', ') }); };
  const remove = async (id) => { if (!window.confirm('Xóa vai trò này?')) return; try { await adminService.deleteRole(id); load(); } catch (e) { setState(s => ({ ...s, error: e.message })); } };
  return <div><h1>Vai trò & Phân quyền</h1><p className="lead">Tạo và quản lý các nhóm quyền truy cập hệ thống.</p>
    {state.error && <div className="state" role="alert">{state.error}</div>}{state.message && <div className="success state">{state.message}</div>}
    <form className="admin-card" onSubmit={submit} style={{ display: 'grid', gap: 12, marginBottom: 20 }}><h2>{editing ? 'Cập nhật vai trò' : 'Thêm vai trò'}</h2><input placeholder="Tên vai trò" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required /><input placeholder="Mô tả" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /><input placeholder="Quyền, cách nhau bằng dấu phẩy" value={draft.permissions} onChange={e => setDraft({ ...draft, permissions: e.target.value })} /><div className="actions"><button type="submit">{editing ? 'Lưu thay đổi' : 'Thêm vai trò'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setDraft(empty); }}>Hủy</button>}</div></form>
    {state.loading ? <div className="state">Đang tải…</div> : items.length === 0 ? <div className="state">Chưa có vai trò.</div> : <div style={{ display: 'grid', gap: 14 }}>{items.map(item => <div className="admin-card" key={item.id}><div className="row"><div><h2>{item.name}</h2><p className="muted">{item.description || item.desc}</p></div><div className="actions"><button className="secondary" onClick={() => edit(item)}>Sửa</button><button className="danger" onClick={() => remove(item.id)}>Xóa</button></div></div><div className="actions">{(item.permissions || []).map(p => <span className="admin-badge admin-badge-info" key={p}>{typeof p === 'string' ? p : p.name}</span>)}</div></div>)}</div>}
  </div>;
}
