import { useCallback, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Modal } from '@/components/common/Modal';
import { ResourceState } from '@/components/common/ResourceState';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';
import { regionalVocabularyService } from '@/services/regionalVocabularyService';
import { useVocabulary } from '@/hooks/useVocabulary';
import { SaveVocabularyButton } from '@/components/vocabulary/SaveVocabularyButton';
import { DictionaryAttribution, DictionaryAudio, DictionaryExample, DictionaryWordLink } from '@/components/vocabulary/DictionaryElements';
import { RegionalComparison } from '@/components/regional/RegionalComparison';
import { partOfSpeechLabel, dictionaryMeaning, definitionOf } from '@/models/Dictionary';
import { VocabularyCatalogPage } from './VocabularyCatalogPage';
import '@/components/vocabulary/dictionary.css';

export function VocabularyDetailPage() {
  const { id } = useParams(), navigate = useNavigate();
  const location = useLocation();
  const backHref = ROUTES.VOCABULARY + (location.state?.dictionarySearch ? `?${location.state.dictionarySearch}` : '');
  const [revision, setRevision] = useState(0);
  const resource = useAsyncResource(useCallback(async signal => {
    const [entry, links, regional] = await Promise.all([
      vocabularyCatalogService.get(id, { signal }), vocabularyCatalogService.links(id, { signal }),
      regionalVocabularyService.get(id, { signal }).catch(error => { if (error.status === 404) return null; throw error; }),
    ]);
    return { entry, links, regional };
  }, [id]));
  return <><VocabularyCatalogPage key={revision} /><section className="dictionary-detail">
    <Modal title="Tra cứu mục từ · Dictionary entry" onClose={() => navigate(backHref)}>
      <ResourceState resource={resource}>{data => <DictionaryEntry key={data.entry.id} {...data} onNotebookChanged={() => setRevision(value => value + 1)} />}</ResourceState>
      <Link className="dictionary-back" to={backHref}><ArrowLeft size={16} /> Về từ điển</Link>
    </Modal>
  </section></>;
}

function DictionaryEntry({ entry, links, regional, onNotebookChanged }) {
  const notebook = useVocabulary({ search: '', courseId: '', lessonId: '' });
  const [meaningIndex, setMeaningIndex] = useState(0);
  const meaning = entry.meanings?.[meaningIndex];
  const selected = { ...entry, meanings: meaning ? [meaning] : [] };
  const saved = notebook.data?.find(item => item.masterVocabularyId === entry.id) || null;
  function changed() { notebook.reload(); onNotebookChanged(); }
  return <article className="dictionary-entry-detail">
    <header className="dictionary-word-header"><p className="eyebrow"><BookOpen size={15} /> MỤC TỪ TIẾNG VIỆT</p>
      <div className="dictionary-word-title"><h1 lang="vi">{entry.word}</h1><span className="dictionary-pos">{partOfSpeechLabel(entry.partOfSpeech)}</span>{entry.cefrLevel && <span className="dictionary-level">{entry.cefrLevel}</span>}</div>
      {entry.pronunciation && <p className="dictionary-ipa">{entry.pronunciation}</p>}
      {entry.lexical?.pronunciations?.length > 0 && <details className="dictionary-pronunciations"><summary>Phát âm theo dữ liệu nguồn</summary><ul>{entry.lexical.pronunciations.map((item, index) => <li key={index}><span>{item.labels?.join(', ') || 'IPA'}</span><span>{item.ipa}</span></li>)}</ul></details>}
      <DictionaryAudio entry={entry} />
      {entry.topics?.length > 0 && <p className="dictionary-topics">{entry.topics.map(topic => <span key={topic.id}>{topic.name}</span>)}</p>}
    </header>
    <div className="dictionary-save-panel"><div><strong>Mang từ này vào sổ tay</strong><p>Một mục từ được lưu một lần. Bạn có thể chọn nghĩa trước khi lưu.</p>
      {!saved && entry.meanings?.length > 1 && <label>Nghĩa để ôn<select value={meaningIndex} onChange={event => setMeaningIndex(Number(event.target.value))}>{entry.meanings.map((item, index) => <option key={item.id ?? index} value={index}>{index + 1}. {dictionaryMeaning(item).slice(0, 100)}</option>)}</select></label>}
      {saved && <p className="muted">Nghĩa đang lưu: {saved.meaning}</p>}</div><SaveVocabularyButton entry={selected} initialSavedEntry={saved} checking={notebook.loading} checkError={notebook.error} onSaved={changed} onDeleted={changed} /></div>
    {notebook.error && <p role="alert">{notebook.error.message} <button className="secondary" onClick={notebook.reload}>Thử lại</button></p>}
    <section className="dictionary-senses"><div className="dictionary-section-heading"><h2>Nghĩa & cách dùng</h2><span>{entry.meanings?.length || 0} nghĩa</span></div>
      {(entry.meanings || []).map((item, index) => <section className="dictionary-sense" key={item.id ?? index}><span className="dictionary-sense-number">{String(index + 1).padStart(2, '0')}</span><div>
        {item.labels?.length > 0 && <p className="dictionary-sense-labels">{item.labels.map(label => <span key={label}>{label}</span>)}</p>}
        <h3 lang={item.definitionVi ? 'vi' : 'en'}>{definitionOf(item)}</h3>
        {item.definitionVi && item.translationEn && <p className="dictionary-english" lang="en"><span>EN</span> {item.translationEn}</p>}
        {item.definitionEn && item.definitionEn !== item.translationEn && <p lang="en">{item.definitionEn}</p>}
        {item.usageNote && <p className="dictionary-usage-note">{item.usageNote}</p>}
        {item.examples?.length > 0 && <div className="dictionary-examples"><h4>Trong câu</h4>{item.examples.map((example, exampleIndex) => <DictionaryExample key={example.id ?? exampleIndex} example={example} word={entry.word} />)}</div>}
      </div></section>)}
    </section>
    {links.otherPartsOfSpeech?.length > 0 && <section className="dictionary-related"><h2>Cùng cách viết, khác từ loại</h2><div>{links.otherPartsOfSpeech.map(item => <DictionaryWordLink key={item.id} item={item} />)}</div></section>}
    {links.relatedWords?.length > 0 && <section className="dictionary-related"><h2>Từ liên quan trong nguồn</h2>{['synonyms', 'antonyms', 'related', 'derived'].map(kind => {
      const items = links.relatedWords.filter(item => item.kind === kind);
      return items.length ? <div className="dictionary-relation-group" key={kind}><h3>{({ synonyms: 'Đồng nghĩa', antonyms: 'Trái nghĩa', related: 'Liên quan', derived: 'Từ phái sinh' })[kind]}</h3><div>{items.map((item, index) => <div key={index}><DictionaryWordLink item={item} />{item.sense && <small className="dictionary-relation-scope">{item.sense}</small>}</div>)}</div></div> : null;
    })}</section>}
    {regional?.variants?.length > 0 && <section className="dictionary-regional"><div className="dictionary-section-heading"><h2><MapPin size={18} /> Cách nói vùng miền</h2><Link to={ROUTES.REGIONAL_VIETNAMESE}>Khám phá thêm →</Link></div><RegionalComparison comparison={regional} /></section>}
    {entry.lexical?.etymologies?.length > 0 && <details className="dictionary-etymology"><summary>Nguồn gốc từ theo dữ liệu nguồn</summary>{entry.lexical.etymologies.map((text, index) => <p key={index}>{text}</p>)}</details>}
    {entry.lexical?.notes?.length > 0 && <section className="dictionary-usage-note"><h2>Ghi chú từ nguồn</h2>{entry.lexical.notes.map((note, index) => <p key={index}>{note}</p>)}</section>}
    <DictionaryAttribution source={entry.source} />
  </article>;
}
