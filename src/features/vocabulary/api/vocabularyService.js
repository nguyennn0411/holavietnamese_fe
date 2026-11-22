import { VocabularyEntry } from '@/features/vocabulary/models/VocabularyEntry'
import axiosClient from '@/shared/api/axiosClient'
export const vocabularyService = {
  async list(filters = {}, options = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null))
    return (await axiosClient.get('/api/me/vocabulary', { ...options, params })).map(v => new VocabularyEntry(v))
  },
  async page(filters = {}, options = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null))
    const result = await axiosClient.get('/api/me/vocabulary/page', { ...options, params })
    return { ...result, content: (result.content ?? []).map(value => new VocabularyEntry(value)) }
  },
  async practice(limit = 20, options = {}) {
    return (await axiosClient.get('/api/me/vocabulary/practice', { ...options, params: { limit } }))
      .map(value => new VocabularyEntry(value))
  },
  async findByMaster(masterVocabularyId, options = {}) {
    try {
      return new VocabularyEntry(await axiosClient.get(`/api/me/vocabulary/by-master/${encodeURIComponent(String(masterVocabularyId))}`, options))
    } catch (error) {
      if (error.status === 404) return null
      throw error
    }
  },
  async get(id, options = {}) { return new VocabularyEntry(await axiosClient.get(`/api/me/vocabulary/${id}`, options)) },
  async add(entry) { return new VocabularyEntry(await axiosClient.post('/api/me/vocabulary', validate(entry))) },
  async update(id, entry) { return new VocabularyEntry(await axiosClient.put(`/api/me/vocabulary/${id}`, validate(entry))) },
  async delete(id) { await axiosClient.delete(`/api/me/vocabulary/${id}`); return null },
  async enrichWord({ word, context = '', lessonTitle = '' }) {
    const response = await axiosClient.post('/api/ai/vocabulary/enrich', { word, context, lessonTitle })
    return response?.result ?? response
  },
  saveWord(source, lessonId = null) {
    const meaning = source.meanings?.[0]
      const masterVocabularyId = source.masterVocabularyId ?? (lessonId == null && source.wordVi == null && Array.isArray(source.meanings) ? source.id : null)
      const isMaster = masterVocabularyId != null
    const exampleSentence = source.exampleVi ?? meaning?.examples?.[0]?.exampleVi ?? source.exampleSentence ?? ''
    const note = meaning?.usageNote ?? source.note ?? ''
    return vocabularyService.add({
      lessonId,
        ...(isMaster ? { masterVocabularyId } : {}),
      word: source.wordVi ?? source.word,
      meaning: source.meaningEn ?? (meaning ? (meaning.translationEn || meaning.definitionVi || meaning.definitionEn || '').trim().slice(0, 1000) : source.meaning),
      pronunciation: source.pronunciation ?? '',
      exampleSentence: isMaster ? exampleSentence.slice(0, 2000) : exampleSentence,
      note: isMaster ? note.slice(0, 2000) : note,
    })
  }
}

function validate(data) {
  if (!data.word?.trim() || !data.meaning?.trim()) {
    const isVi = typeof localStorage !== 'undefined' && (localStorage.getItem('hola:ui-language') || 'en').startsWith('vi')
    throw new Error(isVi ? 'Từ và nghĩa không được để trống.' : 'Word and meaning are required.')
  }
  return { ...data, word: data.word.trim(), meaning: data.meaning.trim() }
}
