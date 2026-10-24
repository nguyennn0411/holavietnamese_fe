import { useCourseProgress } from '@/hooks/useCourseProgress'
import { ProgressBar } from '@/components/common/ProgressBar'
import { ResourceState } from '@/components/common/ResourceState'
import { bilingualLabel } from '@/components/common/BilingualText'

export function CourseProgress({ courseId }) {
  const resource = useCourseProgress(courseId)
  return <ResourceState resource={resource}>{progress => <ProgressBar value={progress.progressPercentage} label={bilingualLabel(`${progress.completedLessons} / ${progress.totalLessons} bài học đã hoàn thành`, `${progress.completedLessons} / ${progress.totalLessons} lessons completed`)} />}</ResourceState>
}
