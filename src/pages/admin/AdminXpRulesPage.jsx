import { useCallback, useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';

const empty = { event: '', points: 0, limitPerDay: '', antiSpam: '' };
export function AdminXpRulesPage() {
  const [items, setItems] = useState([]); const [draft, setDraft] = useState(empty); const [editing, setEditing] = useState(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { try { setItems(await adminService.getXpRules()); setError(''); } catch (e) { setError(e.message); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const submit = async (e) => { e.preventDefault(); try { editing ? await adminService.updateXpRule(editing, draft) : await adminService.createXpRule(draft); setEditing(null); setDraft(empty); load(); } catch (err) { setError(err.message); } };
  const edit = item => { setEditing(item.id); setDraft({ event: item.event || item.eventType || '', points: item.points ?? item.xpAmount ?? 0, limitPerDay: item.limitPerDay || '', antiSpam: item.antiSpam || '' }); };
  const remove = async id => { if (!window.confirm('Xóa quy tắc XP này?')) return; try { await adminService.deleteXpRule(id); load(); } catch (e) { setError(e.message); } };
  return <div><h1>Quy tắc cộng điểm XP</h1><p className="lead">Quản lý điểm thưởng cho từng hoạt động học tập.</p>{error && <div className="state" role="alert">{error}</div>}
    <form className="admin-card" onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 20 }}><input placeholder="Sự kiện" value={draft.event} onChange={e => setDraft({ ...draft, event: e.target.value })} required /><input type="number" placeholder="XP" value={draft.points} onChange={e => setDraft({ ...draft, points: Number(e.target.value) })} required /><input placeholder="Giới hạn/ngày" value={draft.limitPerDay} onChange={e => setDraft({ ...draft, limitPerDay: e.target.value })} /><input style={{ gridColumn: '1 / -1' }} placeholder="Cơ chế chống spam" value={draft.antiSpam} onChange={e => setDraft({ ...draft, antiSpam: e.target.value })} /><div className="actions"><button>{editing ? 'Lưu thay đổi' : 'Thêm quy tắc'}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setDraft(empty); }}>Hủy</button>}</div></form>
    {loading ? <div className="state">Đang tải…</div> : items.length === 0 ? <div className="state">Chưa có quy tắc XP.</div> : <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}><table className="admin-table"><thead><tr><th>Sự kiện</th><th>Điểm XP</th><th>Giới hạn</th><th>Chống spam</th><th>Thao tác</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.event || item.eventType}</td><td>+{item.points ?? item.xpAmount} XP</td><td>{item.limitPerDay || '—'}</td><td>{item.antiSpam || '—'}</td><td><button className="secondary" onClick={() => edit(item)}>Sửa</button>{' '}<button className="danger" onClick={() => remove(item.id)}>Xóa</button></td></tr>)}</tbody></table></div>}
  </div>;
}
