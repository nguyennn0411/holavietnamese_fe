import axiosClient from '@/infrastructure/api/axiosClient';
import { VocabularyEntry } from '@/models/VocabularyEntry';

export const vocabularyReviewService = {
  async session(sessionId, options = {}) {
    const data = await axiosClient.get('/api/me/vocabulary/review', {
      ...options, params: sessionId ? { sessionId } : {},
    });
    return { ...data, entries: data.entries.map(entry => new VocabularyEntry(entry)) };
  },
  async rate(entryId, sessionId, rating) {
    if (!['AGAIN', 'HARD', 'GOOD', 'EASY'].includes(rating)) throw new Error('Invalid review rating.');
    return axiosClient.post(`/api/me/vocabulary/${entryId}/review`, { sessionId, rating });
  },
};
