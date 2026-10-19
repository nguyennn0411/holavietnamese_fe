import { useCallback, useEffect, useState } from 'react';
import { generatePath, Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, ArrowUpRight, SlidersHorizontal, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Pagination, EmptyState } from '@/components/common/Ui';
import { VocabularyOverview } from '@/components/vocabulary/VocabularyNavigation';
import { SaveVocabularyButton } from '@/components/vocabulary/SaveVocabularyButton';
import { DictionaryAudio, DictionaryAttribution } from '@/components/vocabulary/DictionaryElements';
import { ResourceState } from '@/components/common/ResourceState';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';
import { useVocabulary } from '@/hooks/useVocabulary';
import { dictionaryQuery, definitionOf, partOfSpeechLabel } from '@/models/Dictionary';
import '@/components/vocabulary/vocabulary.css';
import '@/components/vocabulary/dictionary.css';

export function VocabularyCatalogPage() {
  const [params, setParams] = useSearchParams();
  const query = dictionaryQuery(params);
  const [keyword, setKeyword] = useState(query.keyword), [overviewRevision, setOverviewRevision] = useState(0);
  useEffect(() => setKeyword(query.keyword), [query.keyword]);
  const resource = useAsyncResource(useCallback(signal => vocabularyCatalogService.search(query, { signal }),
    [query.keyword, query.cefrLevel, query.partOfSpeech, query.topicId, query.page]));
  const filters = useAsyncResource(useCallback(signal => vocabularyCatalogService.filters({ signal }), []));
  const notebook = useVocabulary({ search: '', courseId: '', lessonId: '' });
  const savedWords = new Map((notebook.data || []).filter(entry => entry.masterVocabularyId != null).map(entry => [entry.masterVocabularyId, entry]));
  function filter(key, value) { const next = new URLSearchParams(params); next.set(key, String(value)); if (key !== 'page') next.delete('page'); setParams(next); }
  function saved() { notebook.reload(); setOverviewRevision(value => value + 1); }
  return <section className="vocabulary-ui dictionary-page">
    <header className="dictionary-intro">
      <div><p className="eyebrow"><BookOpen size={15} /> TỪ ĐIỂN & HỌC TẬP · DICTIONARY & LEARNING</p>
        <h1>Mỗi từ, <em>một cách hiểu.</em></h1><p>Tra nghĩa tiếng Việt, khám phá cách dùng và lưu những từ bạn muốn ghi nhớ.</p>
        <div className="dictionary-shortcuts"><Link to={ROUTES.VOCABULARY_REVIEW}>Ôn flashcard <ArrowUpRight size={15} /></Link><Link to={ROUTES.REGIONAL_VIETNAMESE}><MapPin size={15} /> Tiếng Việt vùng miền</Link></div>
      </div><div className="dictionary-letter-art" aria-hidden="true"><span>ă â ê</span><strong>Tiếng<br />Việt.</strong><span>ô ơ ư đ</span></div>
    </header>
    <form className="dictionary-lookup" onSubmit={event => { event.preventDefault(); filter('keyword', keyword.trim()); }}>
      <label htmlFor="dictionary-search">Bạn muốn hiểu từ nào? <span>Look up a Vietnamese word</span></label>
      <div className="dictionary-search-box"><Search size={22} aria-hidden="true" /><input id="dictionary-search" type="search" maxLength={200} value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Nhập từ tiếng Việt hoặc nghĩa tiếng Anh…" /><button>Tìm từ <ArrowUpRight size={17} /></button></div>
      <p>Tìm cả từ nhiều tiếng và từ không dấu. Kết quả khớp chính xác được ưu tiên.</p>
    </form>
    <VocabularyOverview key={overviewRevision} active="catalog"><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Mở sổ tay</Link></VocabularyOverview>
    <div className="dictionary-filters"><span><SlidersHorizontal size={16} /> Bộ lọc</span>
      <label><span>Trình độ</span><select value={query.cefrLevel} disabled={filters.loading || !!filters.error} onChange={event => filter('cefrLevel', event.target.value)}><option value="">Tất cả trình độ</option>{(filters.data?.levels || []).map(level => <option key={level}>{level}</option>)}</select></label>
      <label><span>Từ loại</span><select value={query.partOfSpeech} disabled={filters.loading || !!filters.error} onChange={event => filter('partOfSpeech', event.target.value)}><option value="">Tất cả từ loại</option>{(filters.data?.partsOfSpeech || []).map(part => <option key={part} value={part}>{partOfSpeechLabel(part)}</option>)}</select></label>
      <label><span>Chủ đề</span><select value={query.topicId} disabled={filters.loading || !!filters.error} onChange={event => filter('topicId', event.target.value)}><option value="">Tất cả chủ đề</option>{(filters.data?.topics || []).map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>
      <button type="button" className="secondary" onClick={() => { setKeyword(''); setParams({}); }}>Đặt lại</button>
    </div>
    {filters.error && <p role="alert">{filters.error.message} <button className="secondary" onClick={filters.reload}>Thử lại bộ lọc</button></p>}
    {notebook.error && <p role="alert">{notebook.error.message} <button className="secondary" onClick={notebook.reload}>Thử lại sổ tay</button></p>}
    <ResourceState resource={resource}>{data => data.content.length ? <>
      <div className="dictionary-results-heading"><div><h2>{query.keyword ? 'Kết quả cho “' + query.keyword + '”' : 'Khám phá mục từ'}</h2><p>{data.totalElements.toLocaleString('vi-VN')} mục từ đã xuất bản · Trang {data.number + 1}/{data.totalPages}</p></div><span className="dictionary-results-mark" aria-hidden="true">VI / EN</span></div>
      <div className="dictionary-entry-grid">{data.content.map(item => {
        const meaning = item.meanings?.[0], href = generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(item.id) });
        return <article className="dictionary-entry" key={item.id}>
          <div className="dictionary-entry-top"><span className="dictionary-pos">{partOfSpeechLabel(item.partOfSpeech)}</span>{item.cefrLevel && <span className="dictionary-level">{item.cefrLevel}</span>}<SaveVocabularyButton entry={item} compact initialSavedEntry={savedWords.get(item.id) || null} checking={notebook.loading} checkError={notebook.error} onSaved={saved} onDeleted={saved} /></div>
          <h3 lang="vi"><Link to={href} state={{ dictionarySearch: params.toString() }}>{item.word}</Link></h3>{item.pronunciation && <p className="dictionary-ipa">{item.pronunciation}</p>}
          <p className="dictionary-definition-preview" lang={meaning?.definitionVi ? 'vi' : 'en'}>{definitionOf(meaning)}</p>
          {meaning?.definitionVi && meaning.translationEn && <p className="dictionary-english" lang="en">{meaning.translationEn}</p>}
          <DictionaryAudio entry={item} />
          <div className="dictionary-entry-bottom"><span>{item.meanings?.length || 0} nghĩa{item.topics?.length ? ' · ' + item.topics.map(topic => topic.name).join(', ') : ''}</span><Link to={href} state={{ dictionarySearch: params.toString() }}>Tra chi tiết <ArrowUpRight size={15} /></Link></div>
          <DictionaryAttribution source={item.source} compact />
        </article>;
      })}</div>
      <Pagination page={data.number} totalPages={data.totalPages} onChange={page => filter('page', page)} />
    </> : <EmptyState title="Chưa có mục từ phù hợp" description="Thử từ khóa hoặc bộ lọc khác. Mục từ chỉ xuất hiện sau khi được duyệt và xuất bản." />}</ResourceState>
  </section>;
}
