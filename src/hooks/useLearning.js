import { useCallback } from 'react'
import { courseService } from '@/services/courseService'
import { learningService } from '@/services/learningService'
import { useAsyncResource } from './useAsyncResource'
export function useLessons(courseId) { return useAsyncResource(useCallback(() => learningService.lessons(courseId), [courseId])) }
export function useLearning(courseId, lessonId) {
  return useAsyncResource(useCallback(async signal => {
    const [course, lessons] = await Promise.all([courseService.detail(courseId), learningService.lessons(courseId)])
    if (!lessons.some(l => String(l.id) === String(lessonId))) throw new Error('This lesson is not part of this course.')
    signal.throwIfAborted()
    const lesson = await learningService.start(lessonId)
    const progress = await learningService.progress(courseId)
    return { course, lesson, lessons: lessons.map(l => l.id === lesson.id ? lesson : l), progress }
  }, [courseId, lessonId]))
}
export function useResumeCourse(courseId) {
  return useAsyncResource(useCallback(async () => {
    const [courses, lessons] = await Promise.all([courseService.myCourses(), learningService.lessons(courseId)])
    const course = courses.find(c => String(c.courseId) === String(courseId))
    const target = lessons.find(l => l.id === course?.lastAccessedLessonId) || lessons.find(l => !l.isCompleted) || lessons[0]
    return target?.id || null
  }, [courseId]))
}
