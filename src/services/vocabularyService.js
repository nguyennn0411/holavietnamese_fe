import { VocabularyEntry } from '@/models/VocabularyEntry'
import { httpClient } from '@/api/httpClient'
export const vocabularyService = {
  async list(filters = {}) {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null))
    return (await httpClient(`/me/vocabulary?${query}`)).map(v => new VocabularyEntry(v))
  },
  async get(id) { return new VocabularyEntry(await httpClient(`/me/vocabulary/${id}`)) },
  async add(entry) { return new VocabularyEntry(await httpClient('/me/vocabulary', { method: 'POST', body: JSON.stringify(validate(entry)) })) },
  async update(id, entry) { return new VocabularyEntry(await httpClient(`/me/vocabulary/${id}`, { method: 'PUT', body: JSON.stringify(validate(entry)) })) },
  delete(id) { return httpClient(`/me/vocabulary/${id}`, { method: 'DELETE' }) }
}

function validate(data) {
  if (!data.word?.trim() || !data.meaning?.trim()) throw new Error("Word and meaning are required.")
  return { ...data, word: data.word.trim(), meaning: data.meaning.trim() }
}
