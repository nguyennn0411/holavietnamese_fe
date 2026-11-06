import axiosClient from '@/shared/api/axiosClient';

const resultOf = response => response?.result ?? response;

export const learningPathService = {
  async me(options = {}) {
    return resultOf(await axiosClient.get('/api/learning-path/me', options));
  },
  async recommendation(options = {}) {
    return resultOf(await axiosClient.get('/api/learning-path/recommendation', options));
  },
  async apply(courseId) {
    return resultOf(await axiosClient.post('/api/learning-path/apply', { courseId }));
  },
  async applyPath(courseIds) {
    return resultOf(await axiosClient.post('/api/learning-path/apply', { courseIds }));
  },
  async updatePreferences(preferences) {
    return resultOf(await axiosClient.patch('/api/learning-path/preferences', preferences));
  },
};
