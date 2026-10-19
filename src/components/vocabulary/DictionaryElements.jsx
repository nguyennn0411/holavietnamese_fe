import { Link, generatePath, useLocation } from 'react-router-dom';
import { BookOpen, ExternalLink } from 'lucide-react';
import { SpeakButton } from '@/components/common/Ui';
import { ROUTES } from '@/constants/routes';
import { highlightedParts, partOfSpeechLabel } from '@/models/Dictionary';

export function DictionaryAudio({ entry }) {
  return <div className="dictionary-audio">
    {entry.audioUrl && <span><SpeakButton text={entry.word} audioUrl={entry.audioUrl} /> Audio mục từ</span>}
    <span><SpeakButton text={entry.word} /> Giọng đọc tổng hợp <small>(trình duyệt)</small></span>
  </div>;
}
export function DictionaryAttribution({ source, compact = false }) {
  if (!source) return null;
  return <aside className={`dictionary-attribution${compact ? ' is-compact' : ''}`}>
    <div className="dictionary-source-heading"><BookOpen size={17} aria-hidden="true" /><strong>{source.name}</strong></div>
    <p><a href={source.sourceUrl} target="_blank" rel="noreferrer">Mục từ gốc <ExternalLink size={12} /></a><span aria-hidden="true"> · </span><a href={source.licenseUrl} target="_blank" rel="noreferrer">{source.license}</a></p>
    {!compact && <><p>{source.attribution}</p><p>Snapshot: {source.dumpDate} · Trích xuất: {source.extractedAt}</p>
      <p><a href={source.historyUrl} target="_blank" rel="noreferrer">Lịch sử và người đóng góp</a> · <a href={source.downloadUrl} target="_blank" rel="noreferrer">Dữ liệu trích xuất</a></p>
      <details><summary>Chuẩn hóa và thay đổi</summary><p>{source.modifications}</p><p>{source.edited ? 'Mục từ đã được biên tập trong HolaVietnamese; nội dung nguồn được giữ để đối chiếu.' : 'Nội dung nguồn đã được xử lý theo các bước ghi trên.'}</p></details></>}
  </aside>;
}
export function DictionaryExample({ example, word }) {
  return <div className="dictionary-example"><p lang="vi">{highlightedParts(example.exampleVi, word).map((part, index) => part.match ? <mark key={index}>{part.text}</mark> : part.text)}</p>
    {example.translationEn && <p lang="en" className="muted">{example.translationEn}</p>}
    <div className="dictionary-example-audio"><SpeakButton text={example.exampleVi} audioUrl={example.audioUrl} /><small>{example.audioUrl ? 'Audio ví dụ' : 'Giọng đọc tổng hợp'}</small></div>
  </div>;
}
export function DictionaryWordLink({ item }) {
  const location = useLocation();
  return item.id ? <Link className="dictionary-related-chip" state={location.state} to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(item.id) })}>{item.word}{item.partOfSpeech && <small>{partOfSpeechLabel(item.partOfSpeech)}</small>}</Link>
    : <span className="dictionary-related-chip is-text">{item.word}</span>;
}
