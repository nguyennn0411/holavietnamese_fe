import { bilingualLabel } from '@/components/common/BilingualText';
import { CheckCircle2 } from 'lucide-react';

const labels = {
  NOT_STARTED: 'Chưa bắt đầu',
  IN_PROGRESS: 'Đang học',
  COMPLETED: 'Đã hoàn thành',
};

export function LessonStatus({ status, isCurrent = false, showLabel = false }) {
  const isCompleted = status === 'COMPLETED';
  const isInProgress = status === 'IN_PROGRESS' || isCurrent;

  if (isCurrent) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF2D6] text-[#EA580C] border border-[#E8E5DF]/80 text-[10px] font-black uppercase tracking-wider shrink-0"
        title="Đang học bài này"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7A00]" />
        </span>
        {showLabel && <span>Đang học</span>}
      </span>
    );
  }

  return (
    <span
      className={`lesson-status inline-flex items-center justify-center shrink-0 ${status?.toLowerCase() || ''}`}
      title={bilingualLabel(labels[status] || status)}
      aria-label={labels[status] || status}
    >
      {isCompleted ? (
        <span className="inline-flex items-center gap-1">
          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-700" />
          </span>
          {showLabel && (
            <span className="text-[11px] font-bold text-emerald-700">Đã xong</span>
          )}
        </span>
      ) : isInProgress ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FFF2D6] text-[#EA580C] text-[10px] font-black">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF7A00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF7A00]" />
          </span>
          {showLabel && <span>Đang học</span>}
        </span>
      ) : (
        <span className="w-3.5 h-3.5 rounded-full border-2 border-stone-300" />
      )}
    </span>
  );
}
export default LessonStatus;
