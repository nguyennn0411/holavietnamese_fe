import { Course } from '@/models/Course'
import { Enrollment } from '@/models/Enrollment'
import { httpClient } from '@/api/httpClient'
import axiosClient from '@/infrastructure/api/axiosClient'
export const courseService = {
  myCourses() { return axiosClient.get('/api/me/courses') },
  async list() { return (await httpClient('/courses')).map(c => new Course(c)) },
  async detail(id) { return new Course(await httpClient(`/courses/${id}`)) },
  async enrollmentStatus(id) {
    const data = await httpClient(`/courses/${id}/enrollment-status`)
    return data ? new Enrollment(data) : null
  },
  async enroll(id) { return new Enrollment(await httpClient(`/courses/${id}/enroll`, { method: 'POST' })) }
}
