import { ProgressBar } from '@/components/common/ProgressBar'
export function CourseProgressBar({ course }) {
  return <ProgressBar value={course.progressPercentage} label={`${course.completedLessons} / ${course.totalLessons} bài học đã hoàn thành`} />
}
