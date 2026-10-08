export function ProgressBar({ value, label = 'Tiến độ khóa học' }) {
  const progress = Math.max(0, Math.min(100, Number(value) || 0))
  return <div className="progress-wrap"><div className="progress-label"><span>{label}</span><strong>{Math.round(progress)}%</strong></div>
    <div className="progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><div style={{ width: `${progress}%` }} /></div></div>
}
