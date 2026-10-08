export function VocabularySearch({ value, onChange }) {
  return <label className="search-label">Tìm từ vựng<input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder="Tìm từ hoặc nghĩa…" maxLength={200} /></label>
}
