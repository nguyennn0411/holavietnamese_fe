import axiosClient from '@/api/axiosClient';

const resultOf = response => {
  if (response?.success === false || (response?.code != null && response.code !== 1000)) throw new Error(response.message || 'Không tải được nội dung điểm đến.');
  return response?.result ?? response;
};
const path = id => `/api/admin/destinations/${encodeURIComponent(String(id))}/explore-content`;
export const destinationExploreService = {
  async get(id, options = {}) { return resultOf(await axiosClient.get(`/api/destinations/${encodeURIComponent(String(id))}/content`, options)); },
  async management(id, options = {}) { return resultOf(await axiosClient.get(path(id), options)); },
  async save(id, { vocabularyIds, cultureIds, scenarioIds }) { return resultOf(await axiosClient.put(path(id), { vocabularyIds, cultureIds, scenarioIds })); },
  async vocabulary(keyword, options = {}) { return resultOf(await axiosClient.get('/api/vocabulary', { ...options, params: keyword ? { keyword } : {} })); },
  async scenarios(options = {}) { return resultOf(await axiosClient.get('/api/ai/scenarios', options)); },
};
