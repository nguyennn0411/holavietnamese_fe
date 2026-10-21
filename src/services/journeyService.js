import axiosClient from '@/infrastructure/api/axiosClient';

function resultOf(response) {
  if (response?.success === false || (response?.code != null && response.code !== 1000)) {
    throw new Error(response.message || 'Không thể xử lý hành trình.');
  }
  return response?.result ?? response;
}
// Compatibility read for the shared Achievements page. Explore uses destinationExploreService.
export const journeyService = {
  async passport(options = {}) { return resultOf(await axiosClient.get('/api/me/journey/passport', options)); },
};
