export const dictionaryMeaning = meaning => (meaning?.translationEn || meaning?.definitionVi || meaning?.definitionEn || '').trim().slice(0, 1000);
export const definitionOf = meaning => meaning?.definitionVi || meaning?.definitionEn || meaning?.translationEn || '';
export const partOfSpeechLabel = value => ({ noun: 'Danh từ', verb: 'Động từ', adj: 'Tính từ', adv: 'Phó từ', pron: 'Đại từ', num: 'Số từ', particle: 'Trợ từ', conj: 'Liên từ', prep: 'Giới từ', intj: 'Thán từ', phrase: 'Cụm từ', proverb: 'Tục ngữ', name: 'Tên riêng', abbrev: 'Viết tắt', det: 'Định từ', prefix: 'Tiền tố', suffix: 'Hậu tố', classifier: 'Loại từ' })[String(value).toLowerCase()] || value;

export function dictionaryQuery(params) {
  const rawPage = Number(params.get('page') || 0);
  return { keyword: params.get('keyword') || '', cefrLevel: params.get('cefrLevel') || '', partOfSpeech: params.get('partOfSpeech') || '',
    topicId: params.get('topicId') || '', page: Number.isSafeInteger(rawPage) && rawPage >= 0 ? rawPage : 0, size: 20 };
}

export function highlightedParts(text, word) {
  if (!text || !word) return [{ text: text || '', match: false }];
  const input = text.normalize('NFC'), target = word.normalize('NFC');
  const lower = input.toLocaleLowerCase('vi'), needle = target.toLocaleLowerCase('vi');
  const result = []; let cursor = 0, index;
  while ((index = lower.indexOf(needle, cursor)) >= 0) {
    if (index > cursor) result.push({ text: input.slice(cursor, index), match: false });
    result.push({ text: input.slice(index, index + target.length), match: true }); cursor = index + target.length;
  }
  if (cursor < input.length) result.push({ text: input.slice(cursor), match: false });
  return result;
}
