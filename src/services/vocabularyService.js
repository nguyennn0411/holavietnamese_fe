import { VocabularyEntry } from '@/models/VocabularyEntry'
import axiosClient from '@/infrastructure/api/axiosClient'
export const vocabularyService = {
  async list(filters = {}, options = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null))
    return (await axiosClient.get('/api/me/vocabulary', { ...options, params })).map(v => new VocabularyEntry(v))
  },
  async get(id, options = {}) { return new VocabularyEntry(await axiosClient.get(`/api/me/vocabulary/${id}`, options)) },
  async add(entry) { return new VocabularyEntry(await axiosClient.post('/api/me/vocabulary', validate(entry))) },
  async update(id, entry) { return new VocabularyEntry(await axiosClient.put(`/api/me/vocabulary/${id}`, validate(entry))) },
  async delete(id) { await axiosClient.delete(`/api/me/vocabulary/${id}`); return null },
  saveWord(source, lessonId = null) {
    const meaning = source.meanings?.[0]
    return vocabularyService.add({
      lessonId,
      word: source.wordVi ?? source.word,
      meaning: source.meaningEn ?? meaning?.translationEn ?? source.meaning,
      pronunciation: source.pronunciation ?? '',
      exampleSentence: source.exampleVi ?? meaning?.examples?.[0]?.exampleVi ?? source.exampleSentence ?? '',
      note: meaning?.usageNote ?? source.note ?? '',
    })
  }
}

function validate(data) {
  if (!data.word?.trim() || !data.meaning?.trim()) throw new Error("Word and meaning are required.")
  return { ...data, word: data.word.trim(), meaning: data.meaning.trim() }
}
