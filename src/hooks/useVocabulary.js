import { useCallback, useEffect, useState } from 'react'
import { vocabularyService } from '@/services/vocabularyService'
import { courseService } from '@/features/shared/services'
import { useAsyncResource } from './useAsyncResource'
export function useVocabulary({ search, courseId, lessonId }) {
  const [debounced, setDebounced] = useState(search)
  useEffect(() => { const timer = setTimeout(() => setDebounced(search), 250); return () => clearTimeout(timer) }, [search])
  return useAsyncResource(useCallback(() => vocabularyService.list({ search: debounced, courseId, lessonId }), [debounced, courseId, lessonId]))
}
export function useVocabularyOptions() {
  return useAsyncResource(useCallback(async () => {
    const courses = await courseService.myCourses()
    const all = await Promise.all(courses.map(async course => {
      try { return await courseService.lessons(course.courseId) }
      catch (error) { if (error.status === 404 || error.status === 403) return []; throw error }
    }))
    return { courses, lessons: all.flat() }
  }, []))
}
