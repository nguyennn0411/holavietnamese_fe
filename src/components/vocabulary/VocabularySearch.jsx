import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
export function VocabularySearch({ value, onChange }) {
  return <label className="search-label"><BilingualText>{"Tìm từ vựng"}</BilingualText><input type="search" value={value} onChange={e => onChange(e.target.value)} placeholder={bilingualLabel("Tìm từ hoặc nghĩa…")} maxLength={200} /></label>
}
