import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;
const paramsOf = filters => Object.fromEntries(['keyword', 'status', 'partOfSpeech', 'page', 'size']
  .filter(key => filters[key] !== '' && filters[key] != null).map(key => [key, filters[key]]));

export const adminVocabularyService = {
  async search(filters = {}, options = {}) {
    return resultOf(await axiosClient.get('/api/admin/vocabulary/search', { ...options, params: paramsOf(filters) }));
  },
  async list(filters = {}, options = {}) {
    return resultOf(
      await axiosClient.get('/api/admin/vocabulary', {
        ...options,
        params: paramsOf(filters),
      })
    );
  },

  async get(id, options = {}) {
    return resultOf(
      await axiosClient.get(`/api/admin/vocabulary/${id}`, {
        ...options,
      })
    );
  },

  async create(data, options = {}) {
    return resultOf(
      await axiosClient.post('/api/admin/vocabulary', data, {
        ...options,
      })
    );
  },

  async update(id, data, options = {}) {
    return resultOf(
      await axiosClient.put(`/api/admin/vocabulary/${id}`, data, {
        ...options,
      })
    );
  },

};
