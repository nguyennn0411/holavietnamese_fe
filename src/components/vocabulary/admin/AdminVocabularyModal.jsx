import { useEffect, useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { adminVocabularyService } from '@/services/adminVocabularyService';
import { CEFR_LEVELS, VOCABULARY_STATUSES, newExample, newMeaning, vocabularyDraft, vocabularyPayload } from '@/models/AdminVocabulary';

const dateText = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—';

function VocabularyDetail({ entry, onEdit }) {
  return <div>
    <dl>
      <dt>ID</dt><dd>{entry.id}</dd><dt>Từ vựng</dt><dd>{entry.word}</dd>
      <dt>Phiên âm</dt><dd>{entry.pronunciation || '—'}</dd><dt>Từ loại</dt><dd>{entry.partOfSpeech}</dd>
      <dt>CEFR</dt><dd>{entry.cefrLevel}</dd><dt>Audio URL</dt><dd style={{ overflowWrap: 'anywhere' }}>{entry.audioUrl || '—'}</dd>
      <dt>Trạng thái</dt><dd>{entry.status}</dd><dt>Chủ đề</dt><dd>{(entry.topics ?? []).map((topic) => topic.name).join(', ') || '—'}</dd>
      <dt>Ngày xuất bản</dt><dd>{dateText(entry.publishedAt)}</dd><dt>Ngày lưu trữ</dt><dd>{dateText(entry.archivedAt)}</dd>
      <dt>Ngày tạo</dt><dd>{dateText(entry.createdAt)}</dd><dt>Cập nhật lần cuối</dt><dd>{dateText(entry.updatedAt)}</dd>
    </dl>
    {(entry.meanings ?? []).map((meaning, index) => <section className="admin-card" key={meaning.id ?? index} style={{ marginBottom: 14 }}>
      <h3>Nghĩa {index + 1}: {meaning.translationEn}</h3>
      <p>Định nghĩa: {meaning.definitionEn || '—'}</p><p>Ghi chú sử dụng: {meaning.usageNote || '—'}</p><p>Thứ tự: {meaning.displayOrder ?? 0}</p>
      {(meaning.examples ?? []).map((example, exampleIndex) => <div key={example.id ?? exampleIndex}>
        <h4>Ví dụ {exampleIndex + 1}</h4><p lang="vi">{example.exampleVi}</p><p>{example.translationEn}</p>
        <p style={{ overflowWrap: 'anywhere' }}>Audio URL: {example.audioUrl || '—'}</p><p>Thứ tự: {example.displayOrder ?? 0}</p>
      </div>)}
    </section>)}
    <div className="actions"><button type="button" onClick={onEdit}>Sửa từ vựng</button></div>
  </div>;
}

export function AdminVocabularyModal({ mode, id, topics, reloadTopics, onClose, onSaved, onEdit }) {
  const [entry, setEntry] = useState(null);
  const [draft, setDraft] = useState(() => vocabularyDraft());
  const [loading, setLoading] = useState(mode !== 'create');
  const [loadError, setLoadError] = useState('');
  const [revision, setRevision] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'create') return;
    const controller = new AbortController();
    setLoading(true); setLoadError('');
    adminVocabularyService.get(id, { signal: controller.signal }).then((value) => {
      if (!controller.signal.aborted) { setEntry(value); setDraft(vocabularyDraft(value)); setLoading(false); }
    }).catch((failure) => {
      if (!controller.signal.aborted) { setLoadError(failure.message); setLoading(false); }
    });
    return () => controller.abort();
  }, [id, mode, revision]);

  const change = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const changeMeaning = (index, field, value) => setDraft((current) => ({ ...current, meanings: current.meanings.map((meaning, i) => i === index ? { ...meaning, [field]: value } : meaning) }));
  const changeExample = (meaningIndex, index, field, value) => setDraft((current) => ({ ...current, meanings: current.meanings.map((meaning, i) => i === meaningIndex ? { ...meaning, examples: meaning.examples.map((example, j) => j === index ? { ...example, [field]: value } : example) } : meaning) }));
  const availableTopics = [...topics.data, ...(entry?.topics ?? []).filter((topic) => !topics.data.some((option) => option.id === topic.id))];

  async function submit(event) {
    event.preventDefault(); setError('');
    try {
      const payload = vocabularyPayload(draft);
      setPending(true);
      const response = mode === 'edit' ? await adminVocabularyService.update(id, payload) : await adminVocabularyService.create(payload);
      onSaved(response);
    } catch (failure) { setError(failure.message); } finally { setPending(false); }
  }

  const title = mode === 'view' ? 'Chi tiết từ vựng' : mode === 'edit' ? 'Cập nhật từ vựng' : 'Thêm từ vựng';
  return <Modal title={title} onClose={onClose} busy={pending}>
    {loading ? <div className="state" role="status">Đang tải từ vựng…</div> : loadError
      ? <div className="state" role="alert"><p>{loadError}</p><button type="button" onClick={() => setRevision((value) => value + 1)}>Thử lại</button></div>
      : mode === 'view' ? <VocabularyDetail entry={entry} onEdit={onEdit} />
      : <form onSubmit={submit}>
        <fieldset disabled={pending} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <label>Từ vựng<input value={draft.word} onChange={(event) => change('word', event.target.value)} required maxLength={200} lang="vi" /></label>
          <label>Phiên âm<input value={draft.pronunciation} onChange={(event) => change('pronunciation', event.target.value)} maxLength={200} /></label>
          <label>Từ loại<input value={draft.partOfSpeech} onChange={(event) => change('partOfSpeech', event.target.value)} required maxLength={40} placeholder="Ví dụ: phrase, noun, verb" /></label>
          <label>Trình độ CEFR<input list="vocabulary-cefr-form" value={draft.cefrLevel} onChange={(event) => change('cefrLevel', event.target.value)} required maxLength={10} /></label>
          <datalist id="vocabulary-cefr-form">{CEFR_LEVELS.map((level) => <option key={level} value={level} />)}</datalist>
          <label>Audio URL<input value={draft.audioUrl} onChange={(event) => change('audioUrl', event.target.value)} maxLength={2048} /></label>
          <label>Trạng thái<select value={draft.status} onChange={(event) => change('status', event.target.value)}>{VOCABULARY_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
          <fieldset style={{ margin: '0 0 14px', minWidth: 0 }}><legend>Chủ đề</legend>
            {topics.loading ? <p role="status">Đang tải chủ đề…</p> : topics.error ? <div role="alert"><p>{topics.error.message}</p><button type="button" className="secondary" onClick={reloadTopics}>Thử lại chủ đề</button></div> : availableTopics.length === 0 ? <p>Chưa có chủ đề.</p> : availableTopics.map((topic) => <label key={topic.id} style={{ flexDirection: 'row', alignItems: 'center' }}><input type="checkbox" style={{ width: 'auto' }} checked={draft.topicIds.includes(topic.id)} onChange={(event) => change('topicIds', event.target.checked ? [...draft.topicIds, topic.id] : draft.topicIds.filter((value) => value !== topic.id))} />{topic.name}</label>)}
          </fieldset>
          {draft.meanings.map((meaning, meaningIndex) => <section className="admin-card" key={meaningIndex} style={{ marginBottom: 14 }}>
            <div className="row"><h3>Nghĩa {meaningIndex + 1}</h3><button type="button" className="secondary" disabled={draft.meanings.length === 1} onClick={() => change('meanings', draft.meanings.filter((_, index) => index !== meaningIndex))}>Xóa nghĩa {meaningIndex + 1}</button></div>
            <label>Bản dịch tiếng Anh<input value={meaning.translationEn} onChange={(event) => changeMeaning(meaningIndex, 'translationEn', event.target.value)} required maxLength={500} /></label>
            <label>Định nghĩa tiếng Anh<textarea value={meaning.definitionEn} onChange={(event) => changeMeaning(meaningIndex, 'definitionEn', event.target.value)} rows={2} /></label>
            <label>Ghi chú sử dụng<textarea value={meaning.usageNote} onChange={(event) => changeMeaning(meaningIndex, 'usageNote', event.target.value)} rows={2} /></label>
            <label>Thứ tự nghĩa<input type="number" min={0} step={1} value={meaning.displayOrder} onChange={(event) => changeMeaning(meaningIndex, 'displayOrder', event.target.value)} /></label>
            {meaning.examples.map((example, exampleIndex) => <fieldset key={exampleIndex} style={{ margin: '0 0 14px', minWidth: 0 }}>
              <legend>Ví dụ {exampleIndex + 1}</legend>
              <label>Ví dụ tiếng Việt<textarea lang="vi" value={example.exampleVi} onChange={(event) => changeExample(meaningIndex, exampleIndex, 'exampleVi', event.target.value)} required rows={2} /></label>
              <label>Bản dịch ví dụ<textarea value={example.translationEn} onChange={(event) => changeExample(meaningIndex, exampleIndex, 'translationEn', event.target.value)} required rows={2} /></label>
              <label>Audio URL của ví dụ<input value={example.audioUrl} onChange={(event) => changeExample(meaningIndex, exampleIndex, 'audioUrl', event.target.value)} maxLength={2048} /></label>
              <label>Thứ tự ví dụ<input type="number" min={0} step={1} value={example.displayOrder} onChange={(event) => changeExample(meaningIndex, exampleIndex, 'displayOrder', event.target.value)} /></label>
              <button type="button" className="secondary" onClick={() => changeMeaning(meaningIndex, 'examples', meaning.examples.filter((_, index) => index !== exampleIndex))}>Xóa ví dụ {exampleIndex + 1}</button>
            </fieldset>)}
            <button type="button" className="secondary" onClick={() => changeMeaning(meaningIndex, 'examples', [...meaning.examples, newExample()])}>+ Thêm ví dụ</button>
          </section>)}
          <button type="button" className="secondary" onClick={() => change('meanings', [...draft.meanings, newMeaning()])}>+ Thêm nghĩa</button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        <div className="actions" style={{ marginTop: 20 }}><button type="button" className="secondary" disabled={pending} onClick={onClose}>Hủy</button><button type="submit" disabled={pending || topics.loading || Boolean(topics.error)}>{pending ? 'Đang lưu…' : 'Lưu từ vựng'}</button></div>
      </form>}
  </Modal>;
}
