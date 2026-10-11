export const VOCABULARY_STATUSES = ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'];
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const newExample = () => ({ exampleVi: '', translationEn: '', audioUrl: '', displayOrder: 0 });
export const newMeaning = () => ({ translationEn: '', definitionEn: '', usageNote: '', displayOrder: 0, examples: [] });

export function vocabularyDraft(entry) {
  return {
    word: entry?.word ?? '',
    pronunciation: entry?.pronunciation ?? '',
    partOfSpeech: entry?.partOfSpeech ?? '',
    cefrLevel: entry?.cefrLevel ?? '',
    audioUrl: entry?.audioUrl ?? '',
    status: entry?.status ?? 'DRAFT',
    topicIds: (entry?.topics ?? []).map((topic) => topic.id),
    meanings: entry ? (entry.meanings ?? []).map((meaning) => ({
      translationEn: meaning.translationEn ?? '',
      definitionEn: meaning.definitionEn ?? '',
      usageNote: meaning.usageNote ?? '',
      displayOrder: meaning.displayOrder ?? 0,
      examples: (meaning.examples ?? []).map((example) => ({
        exampleVi: example.exampleVi ?? '',
        translationEn: example.translationEn ?? '',
        audioUrl: example.audioUrl ?? '',
        displayOrder: example.displayOrder ?? 0,
      })),
    })) : [newMeaning()],
  };
}

export function vocabularyPayload(draft) {
  const required = (value, label, maxLength) => {
    const text = value.trim();
    if (!text) throw new Error(`${label} không được để trống.`);
    if (maxLength && text.length > maxLength) throw new Error(`${label} tối đa ${maxLength} ký tự.`);
    return text;
  };
  const optional = (value) => value.trim() || null;
  const order = (value) => {
    if (value === '' || value == null) return null;
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) throw new Error('Thứ tự phải là số nguyên không âm.');
    return number;
  };
  if (!draft.meanings.length) throw new Error('Cần ít nhất một nghĩa.');
  return {
    word: required(draft.word, 'Từ vựng', 200),
    pronunciation: optional(draft.pronunciation),
    partOfSpeech: required(draft.partOfSpeech, 'Từ loại', 40),
    cefrLevel: required(draft.cefrLevel, 'Trình độ CEFR', 10),
    audioUrl: optional(draft.audioUrl),
    status: draft.status,
    topicIds: draft.topicIds,
    meanings: draft.meanings.map((meaning) => ({
      translationEn: required(meaning.translationEn, 'Bản dịch nghĩa', 500),
      definitionEn: optional(meaning.definitionEn),
      usageNote: optional(meaning.usageNote),
      displayOrder: order(meaning.displayOrder),
      examples: meaning.examples.map((example) => ({
        exampleVi: required(example.exampleVi, 'Ví dụ tiếng Việt'),
        translationEn: required(example.translationEn, 'Bản dịch ví dụ'),
        audioUrl: optional(example.audioUrl),
        displayOrder: order(example.displayOrder),
      })),
    })),
  };
}
