export const dictionaryMeaning = meaning => (meaning?.translationEn || meaning?.definitionVi || meaning?.definitionEn || '').trim().slice(0, 1000);

export const definitionOf = (meaning, language = 'vi') => {
  const isVi = String(language).toLowerCase().startsWith('vi');
  return isVi
    ? meaning?.definitionVi || meaning?.translationEn || meaning?.definitionEn || ''
    : meaning?.definitionEn || meaning?.translationEn || meaning?.definitionVi || '';
};

const normalizedSearchText = value => String(value || '').normalize('NFC').trim().toLocaleLowerCase('en');

export function matchingMeaning(entry, keyword) {
  const meanings = entry?.meanings || [];
  const needle = normalizedSearchText(keyword);
  if (!needle || meanings.length === 0) return meanings[0];

  return meanings
    .map((meaning, index) => {
      const translation = normalizedSearchText(meaning?.translationEn);
      const score = translation === needle ? 0 : translation.startsWith(needle) ? 1 : translation.includes(needle) ? 2 : 3;
      return { meaning, index, score };
    })
    .sort((left, right) => left.score - right.score || left.index - right.index)[0]?.meaning;
}

const PARTS_OF_SPEECH = {
  noun: { vi: 'Danh từ', en: 'Noun' }, verb: { vi: 'Động từ', en: 'Verb' }, adj: { vi: 'Tính từ', en: 'Adjective' },
  adv: { vi: 'Phó từ', en: 'Adverb' }, pron: { vi: 'Đại từ', en: 'Pronoun' }, num: { vi: 'Số từ', en: 'Numeral' },
  particle: { vi: 'Trợ từ', en: 'Particle' }, conj: { vi: 'Liên từ', en: 'Conjunction' }, prep: { vi: 'Giới từ', en: 'Preposition' },
  intj: { vi: 'Thán từ', en: 'Interjection' }, phrase: { vi: 'Cụm từ', en: 'Phrase' }, proverb: { vi: 'Tục ngữ', en: 'Proverb' },
  name: { vi: 'Tên riêng', en: 'Proper noun' }, abbrev: { vi: 'Viết tắt', en: 'Abbreviation' }, det: { vi: 'Định từ', en: 'Determiner' },
  prefix: { vi: 'Tiền tố', en: 'Prefix' }, suffix: { vi: 'Hậu tố', en: 'Suffix' }, classifier: { vi: 'Loại từ', en: 'Classifier' },
};

export const partOfSpeechLabel = (value, language = 'vi') => {
  const labels = PARTS_OF_SPEECH[String(value).toLowerCase()];
  if (!labels) return value;
  return String(language).toLowerCase().startsWith('vi') ? labels.vi : labels.en;
};

export function dictionaryQuery(params) {
  const rawPage = Number(params.get('page') || 0);
  return { keyword: params.get('keyword') || '', page: Number.isSafeInteger(rawPage) && rawPage >= 0 ? rawPage : 0, size: 20 };
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
