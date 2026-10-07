import { httpClient } from '@/api/httpClient';

const resultOf = (response) => response?.result ?? response;

export const adminVocabularyService = {
  async list(filters = {}, options = {}) {
    const query = new URLSearchParams(Object.entries(filters)
      .filter(([, value]) => value !== '' && value != null));
    return resultOf(await httpClient(`/admin/vocabulary?${query}`, options));
  },
  async get(id, options = {}) {
    return resultOf(await httpClient(`/admin/vocabulary/${id}`, options));
  },
  create(data) {
    return httpClient('/admin/vocabulary', { method: 'POST', body: JSON.stringify(data) });
  },
  update(id, data) {
    return httpClient(`/admin/vocabulary/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async getTopics(options = {}) {
    return resultOf(await httpClient('/admin/vocabulary-topics', options));
  },
};
