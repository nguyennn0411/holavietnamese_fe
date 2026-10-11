import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { adminVocabularyService } from '@/services/adminVocabularyService';
import { ResourceState } from '@/components/common/ResourceState';
import { AdminVocabularyModal } from '@/components/vocabulary/admin/AdminVocabularyModal';
import { CEFR_LEVELS, VOCABULARY_STATUSES } from '@/models/AdminVocabulary';

const emptyFilters = { keyword: '', status: '', cefrLevel: '', partOfSpeech: '', topicId: '' };

export function AdminVocabularyPage() {
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const [revision, setRevision] = useState(0);
  const [resource, setResource] = useState({ data: [], loading: true, error: null });
  const [topics, setTopics] = useState({ data: [], loading: true, error: null });
  const [topicRevision, setTopicRevision] = useState(0);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState('');
  const reload = () => setRevision((value) => value + 1);
  const reloadTopics = () => setTopicRevision((value) => value + 1);

  useEffect(() => {
    const controller = new AbortController();
    setResource((state) => ({ ...state, loading: true, error: null }));
    adminVocabularyService.list(query, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setResource({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResource({ data: [], loading: false, error });
      });
    return () => controller.abort();
  }, [query, revision]);

  useEffect(() => {
    const controller = new AbortController();
    setTopics((state) => ({ ...state, loading: true, error: null }));
    adminVocabularyService.getTopics({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setTopics({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setTopics({ data: [], loading: false, error });
      });
    return () => controller.abort();
  }, [topicRevision]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(''), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const filter = (field, value) => setQuery((current) => ({ ...current, [field]: value }));
  const saved = (response) => {
    setMessage(response?.message || 'Đã lưu từ vựng.');
    setModal(null);
    reload();
  };

  return <div>
    <div className="row" style={{ flexWrap: 'wrap', marginBottom: 24 }}>
      <div><h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px' }}><BilingualText>{"Quản lý từ vựng"}</BilingualText></h1><p style={{ color: 'var(--color-muted)', margin: 0 }}><BilingualText>{"Quản lý từ vựng, chủ đề, nghĩa và ví dụ tiếng Việt."}</BilingualText></p></div>
      <button type="button" onClick={() => setModal({ mode: 'create' })}><BilingualText>{"+ Thêm từ vựng"}</BilingualText></button>
    </div>
    {message && <div className="success state" role="status"><BilingualText>{message}</BilingualText></div>}
    <form className="admin-card" style={{ padding: 16, marginBottom: 20 }} onSubmit={(event) => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <div className="actions">
        <label style={{ flex: '1 1 220px' }}><BilingualText>{"Tìm kiếm"}</BilingualText><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={bilingualLabel("Nhập từ khóa…")} /></label>
        <label style={{ flex: '1 1 150px' }}><BilingualText>{"Trạng thái"}</BilingualText><select value={query.status} onChange={(event) => filter('status', event.target.value)}><option value="">{bilingualLabel("Tất cả trạng thái")}</option>{VOCABULARY_STATUSES.map((status) => <option key={status} value={status}>{bilingualLabel(status)}</option>)}</select></label>
        <label style={{ flex: '1 1 120px' }}>CEFR<input list="vocabulary-cefr-filter" value={query.cefrLevel} onChange={(event) => filter('cefrLevel', event.target.value)} placeholder={bilingualLabel("Tất cả trình độ")} /></label>
        <label style={{ flex: '1 1 140px' }}><BilingualText>{"Từ loại"}</BilingualText><input value={query.partOfSpeech} onChange={(event) => filter('partOfSpeech', event.target.value)} placeholder={bilingualLabel("Ví dụ: phrase")} /></label>
        <label style={{ flex: '1 1 180px' }}><BilingualText>{"Chủ đề"}</BilingualText><select value={query.topicId} disabled={topics.loading || Boolean(topics.error)} onChange={(event) => filter('topicId', event.target.value)}><option value="">{bilingualLabel(topics.loading ? 'Đang tải chủ đề…' : 'Tất cả chủ đề')}</option>{topics.data.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
      </div>
      <datalist id="vocabulary-cefr-filter">{CEFR_LEVELS.map((level) => <option key={level} value={level} />)}</datalist>
      <div className="actions"><button type="submit"><BilingualText>{"Tìm kiếm"}</BilingualText></button><button type="button" className="secondary" onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}><BilingualText>{"Đặt lại bộ lọc"}</BilingualText></button></div>
      {topics.error && <div role="alert"><p><BilingualText>{"Không tải được chủ đề:"}</BilingualText><BilingualText>{topics.error.message}</BilingualText></p><button type="button" className="secondary" onClick={reloadTopics}><BilingualText>{"Thử lại chủ đề"}</BilingualText></button></div>}
    </form>
    <ResourceState resource={{ ...resource, reload }}>{(items) => items.length === 0
      ? <div className="state"><BilingualText>{"Không có từ vựng phù hợp."}</BilingualText></div>
      : <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}><table className="admin-table">
        <thead><tr><th><BilingualText>{"Từ vựng"}</BilingualText></th><th><BilingualText>{"Từ loại"}</BilingualText></th><th>CEFR</th><th><BilingualText>{"Chủ đề"}</BilingualText></th><th><BilingualText>{"Trạng thái"}</BilingualText></th><th><BilingualText>{"Thao tác"}</BilingualText></th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}>
          <td><strong>{item.word}</strong>{item.pronunciation && <div className="muted">{item.pronunciation}</div>}</td>
          <td>{item.partOfSpeech}</td><td>{item.cefrLevel}</td><td>{(item.topics ?? []).map((topic) => topic.name).join(', ') || '—'}</td>
          <td><span className={`admin-badge ${item.status === 'PUBLISHED' ? 'admin-badge-success' : item.status === 'ARCHIVED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}><BilingualText>{item.status}</BilingualText></span></td>
          <td><div className="actions"><button type="button" className="secondary" onClick={() => setModal({ mode: 'view', id: item.id })}><BilingualText>{"Chi tiết"}</BilingualText></button><button type="button" className="secondary" onClick={() => setModal({ mode: 'edit', id: item.id })}><BilingualText>{"Sửa"}</BilingualText></button></div></td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
    {modal && <AdminVocabularyModal key={`${modal.mode}-${modal.id ?? 'new'}`} {...modal} topics={topics} reloadTopics={reloadTopics} onClose={() => setModal(null)} onSaved={saved} onEdit={() => setModal({ mode: 'edit', id: modal.id })} />}
  </div>;
}
