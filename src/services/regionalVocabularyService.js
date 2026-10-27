import axiosClient from '@/infrastructure/api/axiosClient';

function resultOf(response) {
  if (response?.success === false || (response?.code != null && response.code !== 1000)) throw new Error(response.message || 'Không tải được từ ngữ vùng miền.');
  return response?.result ?? response;
}
const paramsOf = filters => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '' && value != null));
const pathId = id => {
  if (!/^\d+$/.test(String(id)) || Number(id) < 1) throw new Error('ID từ vựng không hợp lệ.');
  return encodeURIComponent(String(id));
};
export const regionalVocabularyService = {
  async list(filters = {}, options = {}) { return resultOf(await axiosClient.get('/api/regional-vietnamese', { ...options, params: paramsOf(filters) })); },
  async get(id, options = {}) { return resultOf(await axiosClient.get(`/api/regional-vietnamese/${pathId(id)}`, options)); },
};
export const adminRegionalVocabularyService = {
  async list(filters = {}, options = {}) { return resultOf(await axiosClient.get('/api/admin/regional-language', { ...options, params: paramsOf(filters) })); },
  async create(payload) { return resultOf(await axiosClient.post('/api/admin/regional-language', payload)); },
  async update(id, payload) { return resultOf(await axiosClient.put(`/api/admin/regional-language/${pathId(id)}`, payload)); },
};
