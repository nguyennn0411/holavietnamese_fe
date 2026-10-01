const labels = { NOT_STARTED: 'Not started', IN_PROGRESS: 'In progress', COMPLETED: 'Completed' }
export function LessonStatus({ status }) {
  return <span className={`lesson-status ${status.toLowerCase()}`} title={labels[status]} aria-label={labels[status]}>{status === 'COMPLETED' ? '✓' : status === 'IN_PROGRESS' ? '●' : '○'}</span>
}
