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
      <div><h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 4px' }}>Quản lý từ vựng</h1><p style={{ color: '#64748b', margin: 0 }}>Quản lý từ vựng, chủ đề, nghĩa và ví dụ tiếng Việt.</p></div>
      <button type="button" onClick={() => setModal({ mode: 'create' })}>+ Thêm từ vựng</button>
    </div>
    {message && <div className="success state" role="status">{message}</div>}
    <form className="admin-card" style={{ padding: 16, marginBottom: 20 }} onSubmit={(event) => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <div className="actions">
        <label style={{ flex: '1 1 220px' }}>Tìm kiếm<input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Nhập từ khóa…" /></label>
        <label style={{ flex: '1 1 150px' }}>Trạng thái<select value={query.status} onChange={(event) => filter('status', event.target.value)}><option value="">Tất cả trạng thái</option>{VOCABULARY_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
        <label style={{ flex: '1 1 120px' }}>CEFR<input list="vocabulary-cefr-filter" value={query.cefrLevel} onChange={(event) => filter('cefrLevel', event.target.value)} placeholder="Tất cả trình độ" /></label>
        <label style={{ flex: '1 1 140px' }}>Từ loại<input value={query.partOfSpeech} onChange={(event) => filter('partOfSpeech', event.target.value)} placeholder="Ví dụ: phrase" /></label>
        <label style={{ flex: '1 1 180px' }}>Chủ đề<select value={query.topicId} disabled={topics.loading || Boolean(topics.error)} onChange={(event) => filter('topicId', event.target.value)}><option value="">{topics.loading ? 'Đang tải chủ đề…' : 'Tất cả chủ đề'}</option>{topics.data.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
      </div>
      <datalist id="vocabulary-cefr-filter">{CEFR_LEVELS.map((level) => <option key={level} value={level} />)}</datalist>
      <div className="actions"><button type="submit">Tìm kiếm</button><button type="button" className="secondary" onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}>Đặt lại bộ lọc</button></div>
      {topics.error && <div role="alert"><p>Không tải được chủ đề: {topics.error.message}</p><button type="button" className="secondary" onClick={reloadTopics}>Thử lại chủ đề</button></div>}
    </form>
    <ResourceState resource={{ ...resource, reload }}>{(items) => items.length === 0
      ? <div className="state">Không có từ vựng phù hợp.</div>
      : <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}><table className="admin-table">
        <thead><tr><th>Từ vựng</th><th>Từ loại</th><th>CEFR</th><th>Chủ đề</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}>
          <td><strong>{item.word}</strong>{item.pronunciation && <div className="muted">{item.pronunciation}</div>}</td>
          <td>{item.partOfSpeech}</td><td>{item.cefrLevel}</td><td>{(item.topics ?? []).map((topic) => topic.name).join(', ') || '—'}</td>
          <td><span className={`admin-badge ${item.status === 'PUBLISHED' ? 'admin-badge-success' : item.status === 'ARCHIVED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>{item.status}</span></td>
          <td><div className="actions"><button type="button" className="secondary" onClick={() => setModal({ mode: 'view', id: item.id })}>Chi tiết</button><button type="button" className="secondary" onClick={() => setModal({ mode: 'edit', id: item.id })}>Sửa</button></div></td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
    {modal && <AdminVocabularyModal key={`${modal.mode}-${modal.id ?? 'new'}`} {...modal} topics={topics} reloadTopics={reloadTopics} onClose={() => setModal(null)} onSaved={saved} onEdit={() => setModal({ mode: 'edit', id: modal.id })} />}
  </div>;
}
