import { useCallback } from 'react'
import { courseService } from '@/features/shared/services'
import { useAsyncResource } from './useAsyncResource'
export function useMyCourses() { return useAsyncResource(useCallback(() => courseService.myCourses(), [])) }
