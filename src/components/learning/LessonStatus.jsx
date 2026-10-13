import { useBilingualLabel } from '@/components/common/BilingualText';
const labels = { NOT_STARTED: 'Chưa bắt đầu', IN_PROGRESS: 'Đang học', COMPLETED: 'Đã hoàn thành' }
export function LessonStatus({ status }) {
  const bilingualLabel = useBilingualLabel();
  return <span className={`lesson-status ${status.toLowerCase()}`} title={bilingualLabel(labels[status])} aria-label={labels[status]}>{status === 'COMPLETED' ? '✓' : status === 'IN_PROGRESS' ? '●' : '○'}</span>
}
