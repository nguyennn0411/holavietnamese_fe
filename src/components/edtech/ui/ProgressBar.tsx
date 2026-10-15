import React from 'react';
import { motion } from 'motion/react';

export interface ProgressBarProps {
  current: number;
  total: number;
  height?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'amber' | 'blue' | 'rose' | 'red';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  height = 'md',
  color = 'red',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (total || 1)) * 100)));

  const heightClasses = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-6',
  }[height];

  const colorClasses = {
    red: 'bg-[#A62A24] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]',
    emerald: 'bg-[#24382B] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]',
    amber: 'bg-[#E1B65B] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]',
    blue: 'bg-sky-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]',
    rose: 'bg-[#EF4444] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]',
  }[color];

  return (
    <div className={`w-full flex items-center gap-3 ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`flex-1 ${heightClasses} bg-slate-200/80 rounded-full overflow-hidden p-0.5 shadow-inner relative`}
      >
        <motion.div
          className={`h-full rounded-full ${colorClasses} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        >
          {/* Subtle glossy gleam along top half */}
          <div className="absolute inset-x-2 top-0.5 h-[35%] bg-white/40 rounded-full pointer-events-none" />
        </motion.div>
      </div>

      {showLabel && (
        <span className="text-xs font-bold text-slate-500 font-mono shrink-0">
          {percentage}%
        </span>
      )}
    </div>
  );
};
