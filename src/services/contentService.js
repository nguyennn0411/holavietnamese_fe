import { httpClient } from '@/api/httpClient';
import axiosClient from '@/infrastructure/api/axiosClient';

// Reuse the project's existing JWT client and legacy session client as appropriate.
const request = (path, method = 'GET', body, signal) => localStorage.getItem('token')
  ? axiosClient.request({ url: `/api${path}`, method, data: body, signal })
  : httpClient(path, { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }), ...(signal ? { signal } : {}) });
export const contentService = {
  list(kind, filters = {}, signal) { const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== '' && value != null)); return request(`/admin/${kind}?${query}`, 'GET', undefined, signal); },
  get(kind, id, signal) { return request(`/admin/${kind}/${id}`, 'GET', undefined, signal); },
  create(kind, body) { return request(`/admin/${kind}`, 'POST', body); },
  update(kind, id, body) { return request(`/admin/${kind}/${id}`, 'PUT', body); },
  status(kind, id, status) { return request(`/admin/${kind}/${id}/status`, 'PATCH', { status }); },
  addModule(courseId, body) { return request(`/admin/courses/${courseId}/modules`, 'POST', body); },
  updateModule(id, body) { return request(`/admin/modules/${id}`, 'PUT', body); },
  addLesson(moduleId, body) { return request(`/admin/modules/${moduleId}/lessons`, 'POST', body); },
  addActivity(lessonId, body) { return request(`/admin/lessons/${lessonId}/activities`, 'POST', body); },
  updateActivity(id, body) { return request(`/admin/activities/${id}`, 'PUT', body); },
  reorder(path, ids) { return request(`/admin/${path}/reorder`, 'PUT', { ids }); },
  addQuestion(quizId, questionId, points) { return request(`/admin/quizzes/${quizId}/questions`, 'POST', { questionId, points }); },
  removeQuestion(quizId, questionId) { return request(`/admin/quizzes/${quizId}/questions/${questionId}`, 'DELETE'); },
  preview(kind, id, signal) { return request(`/admin/${kind}/${id}/preview`, 'GET', undefined, signal); },
  lesson(id, signal) { return request(`/lessons/${id}`, 'GET', undefined, signal); },
  completeActivity(id, answer) { return request(`/activities/${id}/complete`, 'POST', answer === undefined ? {} : { answer }); },
  quiz(id, signal) { return request(`/quizzes/${id}`, 'GET', undefined, signal); },
  startQuiz(id) { return request(`/quizzes/${id}/start`, 'POST'); },
  attempt(id, signal) { return request(`/quiz-attempts/${id}`, 'GET', undefined, signal); },
  answer(attemptId, questionId, answer) { return request(`/quiz-attempts/${attemptId}/answers/${questionId}`, 'PUT', { answer }); },
  submit(id) { return request(`/quiz-attempts/${id}/submit`, 'POST'); },
  result(id, signal) { return request(`/quiz-attempts/${id}/result`, 'GET', undefined, signal); },
};
