import axiosClient from '@/api/axiosClient';

const resultOf = (response) => response?.result ?? response;
const paramsOf = filters => Object.fromEntries(['keyword', 'page', 'size', 'exact']
  .filter(key => filters[key] !== '' && filters[key] != null).map(key => [key, filters[key]]));

export const vocabularyCatalogService = {
  async search(filters = {}, options = {}) {
    return resultOf(await axiosClient.get('/api/vocabulary/search', { ...options, params: paramsOf(filters) }));
  },
  async links(id, options = {}) { return resultOf(await axiosClient.get(`/api/vocabulary/${id}/links`, options)); },
  async list(filters = {}, options = {}) {
    return resultOf(
      await axiosClient.get('/api/vocabulary', {
        ...options,
        params: paramsOf(filters),
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
