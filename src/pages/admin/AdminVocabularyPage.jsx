import { BilingualText, vietnameseLabel } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { adminVocabularyService } from '@/services/adminVocabularyService';
import { ResourceState } from '@/components/common/ResourceState';
import { AdminVocabularyModal } from '@/components/vocabulary/admin/AdminVocabularyModal';
import { CEFR_LEVELS, VOCABULARY_STATUSES } from '@/models/AdminVocabulary';
import { Breadcrumb, PageHeader, Pagination } from '@/components/common/Ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Plus, Tags } from 'lucide-react';
import '@/components/vocabulary/admin/admin-vocabulary.css';

const emptyFilters = { keyword: '', status: '', cefrLevel: '', partOfSpeech: '', topicId: '' };

export function AdminVocabularyPage() {
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0), [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 });
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
    adminVocabularyService.search({ ...query, page, size: 20 }, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) { setPageInfo(data); setResource({ data: data.content, loading: false, error: null }); }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResource({ data: [], loading: false, error });
      });
    return () => controller.abort();
  }, [query, revision, page]);

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

  const filter = (field, value) => { setPage(0); setQuery((current) => ({ ...current, [field]: value })); };
  const saved = (response) => {
    setMessage(response?.message || 'Đã lưu từ vựng.');
    setModal(null);
    reload();
  };

  return <div className="admin-vocabulary-page">
    <Breadcrumb items={[{ label: 'Quản trị', to: ROUTES.ADMIN }, { label: 'Từ vựng' }]} />
    <PageHeader eyebrow="Từ vựng tiếng Việt" title="Quản lý từ vựng" description="Quản lý từ vựng, chủ đề, nghĩa và ví dụ tiếng Việt." actions={<>
      <Link className="button secondary" to={ROUTES.ADMIN_VOCABULARY_TOPICS}><Tags size={16} aria-hidden="true" /><BilingualText>Chủ đề từ vựng</BilingualText></Link>
      <Link className="button secondary" to={ROUTES.ADMIN_REGIONAL_LANGUAGE}>Từ ngữ vùng miền</Link>
      <Link className="button secondary" to={ROUTES.ADMIN_IMPORT}>Nhập dữ liệu</Link>
      <button type="button" onClick={() => setModal({ mode: 'create' })}><Plus size={16} aria-hidden="true" /><BilingualText vi="Thêm từ vựng" en="Add vocabulary" /></button>
    </>} />
    {message && <div className="success state" role="status"><BilingualText>{message}</BilingualText></div>}
    <form className="admin-card admin-vocabulary-filters" onSubmit={(event) => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <div className="actions">
        <label style={{ flex: '1 1 220px' }}><BilingualText>{"Tìm kiếm"}</BilingualText><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder={vietnameseLabel("Nhập từ khóa…")} /></label>
        <label style={{ flex: '1 1 150px' }}><BilingualText>{"Trạng thái"}</BilingualText><select value={query.status} onChange={(event) => filter('status', event.target.value)}><option value="">{vietnameseLabel("Tất cả trạng thái")}</option>{VOCABULARY_STATUSES.map((status) => <option key={status} value={status}>{vietnameseLabel(status)}</option>)}</select></label>
        <label style={{ flex: '1 1 120px' }}>CEFR<input list="vocabulary-cefr-filter" value={query.cefrLevel} onChange={(event) => filter('cefrLevel', event.target.value)} placeholder={vietnameseLabel("Tất cả trình độ")} /></label>
        <label style={{ flex: '1 1 140px' }}><BilingualText>{"Từ loại"}</BilingualText><input value={query.partOfSpeech} onChange={(event) => filter('partOfSpeech', event.target.value)} placeholder={vietnameseLabel("Ví dụ: phrase")} /></label>
        <label style={{ flex: '1 1 180px' }}><BilingualText>{"Chủ đề"}</BilingualText><select value={query.topicId} disabled={topics.loading || Boolean(topics.error)} onChange={(event) => filter('topicId', event.target.value)}><option value="">{vietnameseLabel(topics.loading ? 'Đang tải chủ đề…' : 'Tất cả chủ đề')}</option>{topics.data.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
      </div>
      <datalist id="vocabulary-cefr-filter">{CEFR_LEVELS.map((level) => <option key={level} value={level} />)}</datalist>
      <div className="actions"><button type="submit"><BilingualText>{"Tìm kiếm"}</BilingualText></button><button type="button" className="secondary" onClick={() => { setPage(0); setKeyword(''); setQuery({ ...emptyFilters }); }}><BilingualText>{"Đặt lại bộ lọc"}</BilingualText></button></div>
      {topics.error && <div role="alert"><p><BilingualText>{"Không tải được chủ đề:"}</BilingualText><BilingualText>{topics.error.message}</BilingualText></p><button type="button" className="secondary" onClick={reloadTopics}><BilingualText>{"Thử lại chủ đề"}</BilingualText></button></div>}
    </form>
    <ResourceState resource={{ ...resource, reload }}>{(items) => items.length === 0
      ? <div className="state"><BilingualText>{"Không có từ vựng phù hợp."}</BilingualText></div>
      : <div className="admin-card" style={{ padding: 0, overflowX: 'auto' }}><table className="admin-table">
        <thead><tr><th><BilingualText>{"Từ vựng"}</BilingualText></th><th><BilingualText>{"Từ loại"}</BilingualText></th><th>CEFR</th><th><BilingualText>{"Chủ đề"}</BilingualText></th><th><BilingualText>{"Trạng thái"}</BilingualText></th><th><BilingualText>{"Thao tác"}</BilingualText></th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.id}>
          <td><strong>{item.word}</strong>{item.pronunciation && <div className="muted">{item.pronunciation}</div>}</td>
          <td>{item.partOfSpeech}</td><td>{item.cefrLevel || 'Chưa phân loại'}</td><td>{(item.topics ?? []).map((topic) => topic.name).join(', ') || '—'}</td>
          <td><span className={`admin-badge ${item.status === 'PUBLISHED' ? 'admin-badge-success' : item.status === 'ARCHIVED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}><BilingualText>{item.status}</BilingualText></span></td>
          <td><div className="actions"><button type="button" className="secondary" onClick={() => setModal({ mode: 'view', id: item.id })}><BilingualText>{"Chi tiết"}</BilingualText></button><button type="button" className="secondary" onClick={() => setModal({ mode: 'edit', id: item.id })}><BilingualText>{"Sửa"}</BilingualText></button></div></td>
        </tr>)}</tbody>
      </table></div>}
    </ResourceState>
    {!resource.loading && !resource.error && pageInfo.totalPages > 0 && <><p className="muted">{pageInfo.totalElements} mục từ</p><Pagination page={page} totalPages={pageInfo.totalPages} onChange={setPage} /></>}
    {modal && <AdminVocabularyModal key={`${modal.mode}-${modal.id ?? 'new'}`} {...modal} topics={topics} reloadTopics={reloadTopics} onClose={() => setModal(null)} onSaved={saved} onEdit={() => setModal({ mode: 'edit', id: modal.id })} />}
  </div>;
}
