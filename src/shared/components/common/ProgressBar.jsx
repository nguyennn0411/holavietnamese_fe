import { BilingualText, useBilingualLabel } from '@/shared/components/common/BilingualText';

export function ProgressBar({ value, label = null, className = '' }) {
  const getLabel = useBilingualLabel();
  const progress = Math.max(0, Math.min(100, Number(value) || 0));
  const renderedLabel = label ?? <BilingualText vi="Tiến độ khóa học" en="Course progress" />;
  const accessibleLabel = typeof label === 'string' ? label : getLabel('Tiến độ khóa học', 'Course progress');

  return (
    <div className={`progress-wrap space-y-1.5 ${className}`}>
      <div className="progress-label flex items-center justify-between text-xs font-semibold text-[#64748B]">
        <span>
          {typeof renderedLabel === 'string' ? <BilingualText>{renderedLabel}</BilingualText> : renderedLabel}
        </span>
        <strong className="font-black text-[#253044]">{Math.round(progress)}%</strong>
      </div>
      <div
        className="progress-track w-full h-2 rounded-full bg-stone-200/70 overflow-hidden"
        role="progressbar"
        aria-label={accessibleLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-[#FF7A00] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
