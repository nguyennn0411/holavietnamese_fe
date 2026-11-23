import axiosClient from '@/shared/api/axiosClient';
import { managementApiPath } from '@/shared/api/managementApiPath';

const resultOf = (response) => response?.result ?? response;
const paramsOf = filters => Object.fromEntries(['keyword', 'status', 'partOfSpeech', 'page', 'size']
  .filter(key => filters[key] !== '' && filters[key] != null).map(key => [key, filters[key]]));
const vocabularyPath = (suffix = '') => managementApiPath(`/vocabulary${suffix}`);

export const adminVocabularyService = {
  async search(filters = {}, options = {}) {
    return resultOf(await axiosClient.get(vocabularyPath('/search'), { ...options, params: paramsOf(filters) }));
  },
  async list(filters = {}, options = {}) {
    return resultOf(
      await axiosClient.get(vocabularyPath(), {
        ...options,
        params: paramsOf(filters),
      })
    );
  },

  async get(id, options = {}) {
    return resultOf(
      await axiosClient.get(vocabularyPath(`/${id}`), {
        ...options,
      })
    );
  },

  async create(data, options = {}) {
    return resultOf(
      await axiosClient.post(vocabularyPath(), data, {
        ...options,
      })
    );
  },

  async update(id, data, options = {}) {
    return resultOf(
      await axiosClient.put(vocabularyPath(`/${id}`), data, {
        ...options,
      })
    );
  },

  async submitReview(id, options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath(`/${id}/submit-review`), null, options));
  },

  async review(id, decision, options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath(`/${id}/review`), { decision }, options));
  },
  async approveAllPending(options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath('/review/approve-all'), null, options));
  },
  async archive(id, options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath(`/${id}/archive`), null, options));
  },
  async restore(id, options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath(`/${id}/restore`), null, options));
  },
  async revise(id, options = {}) {
    return resultOf(await axiosClient.post(vocabularyPath(`/${id}/revise`), null, options));
  },

};
