import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;

export const adminVocabularyService = {
  async list(filters = {}, options = {}) {
    return resultOf(
      await axiosClient.get('/api/admin/vocabulary', {
        ...options,
        params: Object.fromEntries(
          Object.entries(filters).filter(
            ([, value]) => value !== '' && value != null
          )
        ),
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

  async getTopics(options = {}) {
    return resultOf(
      await axiosClient.get('/api/admin/vocabulary-topics', {
        ...options,
      })
    );
  },

  async getTopic(id, options = {}) {
  return resultOf(
    await axiosClient.get(`/api/admin/vocabulary-topics/${id}`, {
      ...options,
    })
  );
},

async createTopic(data, options = {}) {
  return resultOf(
    await axiosClient.post('/api/admin/vocabulary-topics', data, {
      ...options,
    })
  );
},

async updateTopic(id, data, options = {}) {
  return resultOf(
    await axiosClient.put(`/api/admin/vocabulary-topics/${id}`, data, {
      ...options,
    })
  );
},
};