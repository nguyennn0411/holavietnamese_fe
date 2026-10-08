const labels = { NOT_STARTED: 'Chưa bắt đầu', IN_PROGRESS: 'Đang học', COMPLETED: 'Đã hoàn thành' }
export function LessonStatus({ status }) {
  return <span className={`lesson-status ${status.toLowerCase()}`} title={labels[status]} aria-label={labels[status]}>{status === 'COMPLETED' ? '✓' : status === 'IN_PROGRESS' ? '●' : '○'}</span>
}
