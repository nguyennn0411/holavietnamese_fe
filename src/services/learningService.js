import { Lesson } from '@/models/Lesson'
import { LearningProgress } from '@/models/LearningProgress'
import { httpClient } from '@/api/httpClient'
export const learningService = {
  async progress(id) { return new LearningProgress(await httpClient(`/me/courses/${id}/progress`)) },
  async lessons(id) { return (await httpClient(`/courses/${id}/lessons`)).map(l => new Lesson(l)) },
  async lesson(id) { return new Lesson(await httpClient(`/lessons/${id}`)) },
  async start(id) { return new Lesson(await httpClient(`/lessons/${id}/start`, { method: 'POST' })) },
  async complete(id) { return new Lesson(await httpClient(`/lessons/${id}/complete`, { method: 'POST' })) }
}
