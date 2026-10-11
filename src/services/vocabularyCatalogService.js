import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;

export const vocabularyCatalogService = {
  async list(filters = {}, options = {}) {
    return resultOf(
      await axiosClient.get('/api/vocabulary', {
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
      await axiosClient.get(`/api/vocabulary/${id}`, {
        ...options,
      })
    );
  },
};