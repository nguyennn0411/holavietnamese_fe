import axiosClient from '@/infrastructure/api/axiosClient';

function resultOf(response) {
  if (response?.success === false || (response?.code != null && response.code !== 1000)) {
    throw new Error(response.message || 'Không thể xử lý hành trình.');
  }
  return response?.result ?? response;
}
const idPath = id => encodeURIComponent(String(id));

export const journeyService = {
  async get(filters = {}, options = {}) {
    const params = Object.fromEntries(['keyword', 'region'].filter(key => filters[key] != null && filters[key] !== '').map(key => [key, filters[key]]));
    return resultOf(await axiosClient.get('/api/me/journey', { ...options, params }));
  },
  async content(id, options = {}) { return resultOf(await axiosClient.get(`/api/me/journey/destinations/${idPath(id)}/content`, options)); },
  async start(id, options = {}) { return resultOf(await axiosClient.post(`/api/me/journey/destinations/${idPath(id)}/start`, {}, options)); },
  async complete(id) { return resultOf(await axiosClient.post(`/api/me/journey/destinations/${idPath(id)}/complete`, {})); },
  async passport(options = {}) { return resultOf(await axiosClient.get('/api/me/journey/passport', options)); },
};
export const adminJourneyService = {
  async get(options = {}) { return resultOf(await axiosClient.get('/api/admin/journey', options)); },
  async save(stops) {
    return resultOf(await axiosClient.put('/api/admin/journey', { stops: stops.map(stop => ({ destinationId: stop.destination.id, status: stop.status })), unlockRule: 'PREVIOUS_COMPLETED', completionRule: 'ALL_LINKED_LESSONS' }));
  },
  async content(id, options = {}) { return resultOf(await axiosClient.get(`/api/admin/destinations/${idPath(id)}/content`, options)); },
  async link(id, lessonIds, vocabularyIds) {
    return resultOf(await axiosClient.put(`/api/admin/destinations/${idPath(id)}/content`, { lessonIds, vocabularyIds }));
  },
};
