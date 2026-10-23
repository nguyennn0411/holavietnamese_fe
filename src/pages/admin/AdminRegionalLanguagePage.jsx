import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BilingualText, useBilingualLabel, bilingualLabel } from '@/components/common/BilingualText';
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
  const label = useBilingualLabel();
  const [query, setQuery] = useState({ keyword: '', region: '', status: '', vocabularyId: '' });
  const [search, setSearch] = useState(''), [editing, setEditing] = useState(null), [message, setMessage] = useState(''), [error, setError] = useState(null), [busy, setBusy] = useState(false);
  const actionPending = useRef(false); const { confirm, confirmationDialog } = useConfirmDialog();
  const resource = useAsyncResource(useCallback(signal => adminRegionalVocabularyService.list(query, { signal }), [query]));
  const masters = useAsyncResource(useCallback(signal => adminVocabularyService.list({}, { signal }), []));
  const filter = (key, value) => setQuery(current => ({ ...current, [key]: value }));
  async function archive(entry) {
    if (actionPending.current || !await confirm({
      title: label('Lưu trữ biến thể', 'Archive Variant'),
      description: label(
        `Lưu trữ “${entry.word}”? Nội dung sẽ ngừng hiển thị với học viên.`,
        `Archive "${entry.word}"? This content will no longer be visible to learners.`
      ),
      confirmLabel: label('Lưu trữ', 'Archive'),
      tone: 'warning'
    })) return;
    actionPending.current = true; setBusy(true); setError(null); setMessage('');
    try {
      await adminRegionalVocabularyService.update(entry.id, regionalPayload({ ...entry, status: 'ARCHIVED' }));
      setMessage(label('Đã lưu trữ biến thể.', 'Variant archived.'));
      resource.reload();
    } catch (failure) {
      setError(failure);
    } finally {
      actionPending.current = false;
      setBusy(false);
    }
  }
  return <section className="admin-regional-page">
    <Breadcrumb items={[{ label: label('Từ vựng', 'Vocabulary'), to: ROUTES.ADMIN_VOCABULARY }, { label: label('Từ ngữ vùng miền', 'Regional Expressions') }]} />
    <PageHeader
      eyebrow={<BilingualText vi="Tiếng Việt vùng miền" en="Regional Vietnamese" />}
      title={<BilingualText vi="Quản lý biến thể vùng miền" en="Manage regional variants" />}
      description={<BilingualText vi="Liên kết cách nói Bắc, Trung và Nam với từ vựng chuẩn." en="Link Northern, Central, and Southern expressions with standard vocabulary." />}
      actions={<>
        <Link className="button secondary" to={ROUTES.REGIONAL_VIETNAMESE}><BilingualText>{"Xem trang học viên"}</BilingualText></Link>
        <button disabled={busy} onClick={() => setEditing({})}><BilingualText>{"+ Thêm biến thể"}</BilingualText></button>
      </>}
    />
    {message && <Notice kind="success">{message}</Notice>}{error && <Notice kind="error">{error.message}</Notice>}
    <form className="admin-card regional-filters" onSubmit={event => { event.preventDefault(); filter('keyword', search.trim()); }}>
      <label><BilingualText>{"Tìm kiếm"}</BilingualText><input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label><BilingualText>{"Vùng miền"}</BilingualText><select value={query.region} onChange={event => filter('region', event.target.value)}><option value="">{label("Tất cả vùng miền")}</option>{REGIONAL_REGIONS.map(item => <option value={item.value} key={item.value}>{label(item.vi)}</option>)}</select></label>
      <label><BilingualText>{"Trạng thái"}</BilingualText><select value={query.status} onChange={event => filter('status', event.target.value)}><option value="">{label("Tất cả trạng thái")}</option>{REGIONAL_STATUSES.map(status => <option key={status} value={status}>{label(status)}</option>)}</select></label>
      <label><BilingualText>{"Từ chuẩn"}</BilingualText><select value={query.vocabularyId} disabled={masters.loading || !!masters.error} onChange={event => filter('vocabularyId', event.target.value)}><option value="">{label("Tất cả từ chuẩn")}</option>{(masters.data || []).map(master => <option value={master.id} key={master.id}>{master.word} · {label(master.partOfSpeech)}</option>)}</select></label>
      <button><BilingualText>{"Tìm kiếm"}</BilingualText></button><button className="secondary" type="button" onClick={() => { setSearch(''); setQuery({ keyword: '', region: '', status: '', vocabularyId: '' }); }}><BilingualText>{"Đặt lại"}</BilingualText></button>
    </form>
    {masters.error && <Notice kind="error">{masters.error.message} <button className="secondary" onClick={masters.reload}><BilingualText>{"Thử lại từ chuẩn"}</BilingualText></button></Notice>}
    <ResourceState resource={resource}>{items => items.length ? <div className="admin-card regional-table"><table className="admin-table"><thead><tr><th><BilingualText>{"Từ chuẩn"}</BilingualText></th><th><BilingualText>{"Vùng miền"}</BilingualText></th><th><BilingualText>{"Biến thể"}</BilingualText></th><th><BilingualText>{"Nghĩa"}</BilingualText></th><th><BilingualText>{"Trạng thái"}</BilingualText></th><th><BilingualText>{"Thao tác"}</BilingualText></th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td>{item.masterWord}</td><td>{label(REGIONAL_REGIONS.find(region => region.value === item.region)?.vi || item.region)}</td><td><strong>{item.word}</strong></td><td>{item.meaning}</td><td>{label(item.status)}</td><td><div className="actions"><button className="secondary" disabled={busy} onClick={() => setEditing(item)}><BilingualText>{"Sửa"}</BilingualText></button><button className="secondary" disabled={busy || item.status === 'ARCHIVED'} onClick={() => archive(item)}><BilingualText>{"Lưu trữ"}</BilingualText></button></div></td></tr>)}</tbody></table></div> : <EmptyState title={<BilingualText vi="Chưa có biến thể phù hợp" en="No matching variants" />} />}</ResourceState>
    {editing && <RegionalEditor entry={editing} masters={masters} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage(label('Đã lưu biến thể vùng miền.', 'Regional variant saved.')); resource.reload(); }} />}
    {confirmationDialog}
  </section>;
}

function RegionalEditor({ entry, masters, onClose, onSaved }) {
  const label = useBilingualLabel();
  const [draft, setDraft] = useState(() => regionalDraft(entry)), [pending, setPending] = useState(false), [error, setError] = useState(null);
  const writing = useRef(false); const change = (key, value) => setDraft(current => ({ ...current, [key]: value }));
  async function submit(event) {
    event.preventDefault(); if (writing.current) return;
    setError(null);
    try {
      const payload = regionalPayload(draft);
      writing.current = true;
      setPending(true);
      await (entry.id ? adminRegionalVocabularyService.update(entry.id, payload) : adminRegionalVocabularyService.create(payload));
      onSaved();
    } catch (failure) {
      setError(failure);
    } finally {
      writing.current = false;
      setPending(false);
    }
  }
  return <Modal title={entry.id ? label('Chỉnh sửa biến thể vùng miền', 'Edit Regional Variant') : label('Thêm biến thể vùng miền', 'Add Regional Variant')} onClose={onClose} busy={pending}>
    <form className="regional-form" onSubmit={submit}><fieldset disabled={pending}>
      <label><BilingualText>{"Từ vựng chuẩn *"}</BilingualText><select required value={draft.vocabularyId} disabled={masters.loading || !!masters.error} onChange={event => change('vocabularyId', event.target.value)}><option value="">{label("Chọn từ chuẩn", "Select standard word")}</option>{(masters.data || []).map(master => <option key={master.id} value={master.id}>{master.word} · {label(master.partOfSpeech)} · {label(master.status)}</option>)}</select></label>
      <label><BilingualText>{"Vùng sử dụng *"}</BilingualText><select required value={draft.region} onChange={event => change('region', event.target.value)}><option value="">{label("Chọn vùng miền", "Select region")}</option>{REGIONAL_REGIONS.map(item => <option key={item.value} value={item.value}>{label(item.vi)}</option>)}</select></label>
      <label><BilingualText>{"Biến thể *"}</BilingualText><input required maxLength={200} value={draft.word} onChange={event => change('word', event.target.value)} /></label>
      <label><BilingualText>{"Phiên âm"}</BilingualText><input maxLength={200} value={draft.pronunciation} onChange={event => change('pronunciation', event.target.value)} /></label>
      <label><BilingualText>{"Nghĩa hoặc giải thích *"}</BilingualText><textarea required maxLength={1000} value={draft.meaning} onChange={event => change('meaning', event.target.value)} /></label>
      <label><BilingualText>{"Câu ví dụ"}</BilingualText><textarea maxLength={2000} value={draft.exampleSentence} onChange={event => change('exampleSentence', event.target.value)} /></label>
      <label><BilingualText>{"Ghi chú cách dùng"}</BilingualText><textarea maxLength={2000} value={draft.usageNote} onChange={event => change('usageNote', event.target.value)} /></label>
      <label><BilingualText>{"Audio URL"}</BilingualText><input maxLength={2048} value={draft.audioUrl} onChange={event => change('audioUrl', event.target.value)} /></label>
      <label><BilingualText>{"Trạng thái"}</BilingualText><select value={draft.status} onChange={event => change('status', event.target.value)}>{REGIONAL_STATUSES.map(status => <option key={status} value={status}>{label(status)}</option>)}</select></label>
    </fieldset>{error && <Notice kind="error">{error.message}</Notice>}
    <div className="actions"><button type="button" className="secondary" disabled={pending} onClick={onClose}><BilingualText>{"Hủy"}</BilingualText></button><button disabled={pending || masters.loading || !!masters.error}><BilingualText>{pending ? 'Đang lưu…' : 'Lưu biến thể'}</BilingualText></button></div></form>
  </Modal>;
}
