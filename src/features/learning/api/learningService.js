import { Lesson } from '@/features/learning/models/Lesson'
import { LearningProgress } from '@/features/learning/models/LearningProgress'
import { httpClient } from '@/shared/api/httpClient'
import axiosClient from '@/shared/api/axiosClient'
export const learningService = {
  async progress(id) { return new LearningProgress(await axiosClient.get(`/api/me/courses/${id}/progress`)) },
  async lessons(id) { return (await axiosClient.get(`/api/courses/${id}/lessons`)).map(l => new Lesson(l)) },
  async lesson(id) { return new Lesson(await httpClient(`/lessons/${id}`)) },
  async start(id) { return new Lesson(await httpClient(`/lessons/${id}/start`, { method: 'POST' })) },
  async complete(id) { return new Lesson(await httpClient(`/lessons/${id}/complete`, { method: 'POST' })) }
}
