export function VocabularySearch({ value, onChange }) {
  return <label className="search-label">Search vocabulary<input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder="Search a word or meaning…" maxLength={200} /></label>
}
