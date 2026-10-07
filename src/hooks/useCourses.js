import { useCallback } from 'react'
import { courseService } from '@/services/courseService'
import { useAsyncResource } from './useAsyncResource'
export function useCourses() {
  return useAsyncResource(useCallback(async () => {
    const courses = await courseService.list()
    return Promise.all(courses.map(async course => {
      try { return { course, enrollment: await courseService.enrollmentStatus(course.id) } }
      catch (error) { if (error.status === 401) return { course, enrollment: null }; throw error }
    }))
  }, []))
}
export function useCourse(id) {
  return useAsyncResource(useCallback(async () => {
    const course = await courseService.detail(id)
    let enrollment = null
    try { enrollment = await courseService.enrollmentStatus(id) }
    catch (error) { if (error.status !== 401) throw error }
    return { course, enrollment }
  }, [id]))
}
