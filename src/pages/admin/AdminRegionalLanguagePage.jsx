import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BilingualText, vietnameseLabel } from '@/components/common/BilingualText';
import { PageHeader, Breadcrumb, EmptyState, Notice } from '@/components/common/Ui';
import { ResourceState } from '@/components/common/ResourceState';
import { Modal } from '@/components/common/Modal';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { adminRegionalVocabularyService } from '@/services/regionalVocabularyService';
import { adminVocabularyService } from '@/services/adminVocabularyService';
import { REGIONAL_REGIONS, REGIONAL_STATUSES, regionalDraft, regionalPayload } from '@/models/RegionalVocabulary';
import { ROUTES } from '@/constants/routes';
import '@/components/regional/regional.css';

export function AdminRegionalLanguagePage() {
  const [query, setQuery] = useState({ keyword: '', region: '', status: '', vocabularyId: '' });
  const [search, setSearch] = useState(''), [editing, setEditing] = useState(null), [message, setMessage] = useState(''), [error, setError] = useState(null), [busy, setBusy] = useState(false);
  const actionPending = useRef(false); const { confirm, confirmationDialog } = useConfirmDialog();
  const resource = useAsyncResource(useCallback(signal => adminRegionalVocabularyService.list(query, { signal }), [query]));
  const masters = useAsyncResource(useCallback(signal => adminVocabularyService.list({}, { signal }), []));
  const filter = (key, value) => setQuery(current => ({ ...current, [key]: value }));
  async function archive(entry) {
    if (actionPending.current || !await confirm({ title: 'Lưu trữ biến thể', description: `Lưu trữ “${entry.word}”? Nội dung sẽ ngừng hiển thị với học viên.`, confirmLabel: 'Lưu trữ', tone: 'warning' })) return;
    actionPending.current = true; setBusy(true); setError(null); setMessage('');
    try { await adminRegionalVocabularyService.update(entry.id, regionalPayload({ ...entry, status: 'ARCHIVED' })); setMessage('Đã lưu trữ biến thể.'); resource.reload(); }
    catch (failure) { setError(failure); } finally { actionPending.current = false; setBusy(false); }
  }
  return <section className="admin-regional-page">
    <Breadcrumb items={[{ label: 'Từ vựng', to: ROUTES.ADMIN_VOCABULARY }, { label: 'Từ ngữ vùng miền' }]} />
    <PageHeader eyebrow="Tiếng Việt vùng miền" title="Quản lý biến thể vùng miền" description="Liên kết cách nói Bắc, Trung và Nam với từ vựng chuẩn." actions={<><Link className="button secondary" to={ROUTES.REGIONAL_VIETNAMESE}>Xem trang học viên</Link><button disabled={busy} onClick={() => setEditing({})}>Thêm biến thể</button></>} />
    {message && <Notice kind="success">{message}</Notice>}{error && <Notice kind="error">{error.message}</Notice>}
    <form className="admin-card regional-filters" onSubmit={event => { event.preventDefault(); filter('keyword', search.trim()); }}>
      <label>Tìm kiếm<input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label>Vùng miền<select value={query.region} onChange={event => filter('region', event.target.value)}><option value="">Tất cả vùng miền</option>{REGIONAL_REGIONS.map(item => <option value={item.value} key={item.value}>{item.vi}</option>)}</select></label>
      <label>Trạng thái<select value={query.status} onChange={event => filter('status', event.target.value)}><option value="">Tất cả trạng thái</option>{REGIONAL_STATUSES.map(status => <option key={status} value={status}>{vietnameseLabel(status)}</option>)}</select></label>
      <label>Từ chuẩn<select value={query.vocabularyId} disabled={masters.loading || !!masters.error} onChange={event => filter('vocabularyId', event.target.value)}><option value="">Tất cả từ chuẩn</option>{(masters.data || []).map(master => <option value={master.id} key={master.id}>{master.word} · {master.partOfSpeech}</option>)}</select></label>
      <button>Tìm kiếm</button><button className="secondary" type="button" onClick={() => { setSearch(''); setQuery({ keyword: '', region: '', status: '', vocabularyId: '' }); }}>Đặt lại</button>
    </form>
    {masters.error && <Notice kind="error">{masters.error.message} <button className="secondary" onClick={masters.reload}>Thử lại từ chuẩn</button></Notice>}
    <ResourceState resource={resource}>{items => items.length ? <div className="admin-card regional-table"><table className="admin-table"><thead><tr><th>Từ chuẩn</th><th>Vùng miền</th><th>Biến thể</th><th>Nghĩa</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.masterWord}</td><td>{REGIONAL_REGIONS.find(region => region.value === item.region)?.vi}</td><td><strong>{item.word}</strong></td><td>{item.meaning}</td><td>{vietnameseLabel(item.status)}</td><td><div className="actions"><button className="secondary" disabled={busy} onClick={() => setEditing(item)}>Sửa</button><button className="secondary" disabled={busy || item.status === 'ARCHIVED'} onClick={() => archive(item)}>Lưu trữ</button></div></td></tr>)}</tbody></table></div> : <EmptyState title="Chưa có biến thể phù hợp" />}</ResourceState>
    {editing && <RegionalEditor entry={editing} masters={masters} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Đã lưu biến thể vùng miền.'); resource.reload(); }} />}
    {confirmationDialog}
  </section>;
}
function RegionalEditor({ entry, masters, onClose, onSaved }) {
  const [draft, setDraft] = useState(() => regionalDraft(entry)), [pending, setPending] = useState(false), [error, setError] = useState(null);
  const writing = useRef(false); const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  async function submit(event) {
    event.preventDefault(); if (writing.current) return;
    setError(null);
    try { const payload = regionalPayload(draft); writing.current = true; setPending(true); await (entry.id ? adminRegionalVocabularyService.update(entry.id, payload) : adminRegionalVocabularyService.create(payload)); onSaved(); }
    catch (failure) { setError(failure); } finally { writing.current = false; setPending(false); }
  }
  return <Modal title={entry.id ? 'Chỉnh sửa biến thể vùng miền' : 'Thêm biến thể vùng miền'} onClose={onClose} busy={pending}>
    <form className="regional-form" onSubmit={submit}><fieldset disabled={pending}>
      <label>Từ vựng chuẩn *<select required value={draft.vocabularyId} disabled={masters.loading || !!masters.error} onChange={event => change('vocabularyId', event.target.value)}><option value="">Chọn từ chuẩn</option>{(masters.data || []).map(master => <option key={master.id} value={master.id}>{master.word} · {master.partOfSpeech} · {vietnameseLabel(master.status)}</option>)}</select></label>
      <label>Vùng sử dụng *<select required value={draft.region} onChange={event => change('region', event.target.value)}><option value="">Chọn vùng miền</option>{REGIONAL_REGIONS.map(item => <option key={item.value} value={item.value}>{item.vi}</option>)}</select></label>
      <label>Biến thể *<input required maxLength={200} value={draft.word} onChange={event => change('word', event.target.value)} /></label>
      <label>Phiên âm<input maxLength={200} value={draft.pronunciation} onChange={event => change('pronunciation', event.target.value)} /></label>
      <label>Nghĩa hoặc giải thích *<textarea required maxLength={1000} value={draft.meaning} onChange={event => change('meaning', event.target.value)} /></label>
      <label>Câu ví dụ<textarea maxLength={2000} value={draft.exampleSentence} onChange={event => change('exampleSentence', event.target.value)} /></label>
      <label>Ghi chú cách dùng<textarea maxLength={2000} value={draft.usageNote} onChange={event => change('usageNote', event.target.value)} /></label>
      <label>Audio URL<input maxLength={2048} value={draft.audioUrl} onChange={event => change('audioUrl', event.target.value)} /></label>
      <label>Trạng thái<select value={draft.status} onChange={event => change('status', event.target.value)}>{REGIONAL_STATUSES.map(status => <option key={status} value={status}>{vietnameseLabel(status)}</option>)}</select></label>
    </fieldset>{error && <Notice kind="error">{error.message}</Notice>}
    <div className="actions"><button type="button" className="secondary" disabled={pending} onClick={onClose}>Hủy</button><button disabled={pending || masters.loading || !!masters.error}>{pending ? 'Đang lưu…' : 'Lưu biến thể'}</button></div></form>
  </Modal>;
}
