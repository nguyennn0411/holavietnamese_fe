import axiosClient from '@/infrastructure/api/axiosClient';

const resultOf = (response) => response?.result ?? response;

export const vocabularyCatalogService = {
  async search(filters = {}, options = {}) {
    return resultOf(await axiosClient.get('/api/vocabulary/search', { ...options, params: Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null)) }));
  },
  async filters(options = {}) { return resultOf(await axiosClient.get('/api/vocabulary/filters', options)); },
  async links(id, options = {}) { return resultOf(await axiosClient.get(`/api/vocabulary/${id}/links`, options)); },
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
