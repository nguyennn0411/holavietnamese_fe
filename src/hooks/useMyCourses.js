import { useCallback } from 'react'
import { courseService } from '@/services/courseService'
import { useAsyncResource } from './useAsyncResource'
export function useMyCourses() { return useAsyncResource(useCallback(() => courseService.myCourses(), [])) }
