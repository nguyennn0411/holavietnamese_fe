import { useCourseProgress } from '@/hooks/useCourseProgress'
import { ProgressBar } from '@/components/common/ProgressBar'
import { ResourceState } from '@/components/common/ResourceState'
export function CourseProgress({ courseId }) {
  const resource = useCourseProgress(courseId)
  return <ResourceState resource={resource}>{progress => <ProgressBar value={progress.progressPercentage} label={`${progress.completedLessons} / ${progress.totalLessons} bài học đã hoàn thành`} />}</ResourceState>
}
