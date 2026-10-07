import { useCallback } from 'react'
import { learningService } from '@/services/learningService'
import { useAsyncResource } from './useAsyncResource'
export function useCourseProgress(courseId) { return useAsyncResource(useCallback(() => learningService.progress(courseId), [courseId])) }
