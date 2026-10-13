import { useCallback, useState } from 'react';
import { BilingualText } from '@/components/common/BilingualText';
import { ResourceState } from '@/components/common/ResourceState';
import { Notice, Pagination } from '@/components/common/Ui';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { adminJourneyService } from '@/services/journeyService';
import { contentService } from '@/services/contentService';
import { adminVocabularyService } from '@/services/adminVocabularyService';

export function DestinationContentEditor({ destinationId }) {
  const resource = useAsyncResource(useCallback(signal => adminJourneyService.content(destinationId, { signal }), [destinationId]));
  return <section className="admin-card" style={{ marginTop: 20 }}>
    <h2><BilingualText vi="Nội dung liên kết" en="Linked content" /></h2>
    <ResourceState resource={resource}>{data => <ContentEditor destinationId={destinationId} initial={data} />}</ResourceState>
  </section>;
}

function ContentEditor({ destinationId, initial }) {
  const [lessons, setLessons] = useState(initial.lessons);
  const [words, setWords] = useState(initial.vocabulary);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  async function save(event) {
    event.preventDefault(); if (pending) return;
    setPending(true); setError(null); setMessage('');
    try {
      const saved = await adminJourneyService.link(destinationId, lessons.map(l => l.id), words.map(w => w.id));
      setLessons(saved.lessons); setWords(saved.vocabulary); setMessage('Đã lưu nội dung liên kết.');
    } catch (failure) { setError(failure); }
    finally { setPending(false); }
  }
  return <form onSubmit={save}>
    <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
      <ContentSelector kind="LESSON" selected={lessons} onChange={setLessons} />
      <ContentSelector kind="VOCABULARY" selected={words} onChange={setWords} />
      <p className="muted"><BilingualText vi="Liên kết Culture và Practice sẽ được mở khi nội dung từ các module phụ trách sẵn sàng." en="Culture and Practice linking will be available when their modules are ready." /></p>
      <button type="submit"><BilingualText vi={pending ? 'Đang lưu…' : 'Lưu nội dung liên kết'} en={pending ? 'Saving…' : 'Save linked content'} /></button>
    </fieldset>
    {error && <Notice><BilingualText>{error.message}</BilingualText></Notice>}
    {message && <Notice kind="success"><BilingualText vi={message} en="Linked content saved." /></Notice>}
  </form>;
}

function ContentSelector({ kind, selected, onChange }) {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const lesson = kind === 'LESSON';
  const label = item => lesson ? item.titleVi || item.title || item.titleEn : item.word;
  const resource = useAsyncResource(useCallback(signal => lesson
    ? contentService.list('lessons', { q: query, page, size: 10 }, signal)
    : adminVocabularyService.list({ keyword: query }, { signal }), [lesson, query, page]));
  return <section>
    <h3><BilingualText vi={lesson ? 'Bài học' : 'Từ ngữ địa phương'} en={lesson ? 'Lessons' : 'Local language'} /></h3>
    <ul>{selected.map(item => <li key={item.id}>{label(item)} <button type="button" className="secondary" aria-label={`Bỏ liên kết ${label(item)}`} onClick={() => onChange(selected.filter(s => s.id !== item.id))}>×</button></li>)}</ul>
    <div className="actions"><input aria-label={lesson ? 'Tìm bài học để liên kết' : 'Tìm từ để liên kết'} value={search} onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); setQuery(search.trim()); setPage(0); } }} /><button type="button" className="secondary" onClick={() => { setQuery(search.trim()); setPage(0); }}><BilingualText>Tìm kiếm</BilingualText></button></div>
    <ResourceState resource={resource}>{data => {
      const items = Array.isArray(data) ? data : data.content ?? [];
      return <><ul>{items.filter(item => !selected.some(s => s.id === item.id)).map(item => <li key={item.id}><button type="button" className="secondary" onClick={() => onChange([...selected, item])}><BilingualText vi="Liên kết" en="Link" /></button> {label(item)}</li>)}</ul>{items.length === 0 && <p className="muted"><BilingualText vi="Không có nội dung phù hợp." en="No matching content." /></p>}{lesson && <Pagination page={page} totalPages={data.totalPages || 1} onChange={setPage} />}</>;
    }}</ResourceState>
  </section>;
}
