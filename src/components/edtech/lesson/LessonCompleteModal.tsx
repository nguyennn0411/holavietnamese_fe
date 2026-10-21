import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/edtech/ui/Button';
import { audioFeedback } from '@/utils/audioFeedback';

interface LessonCompleteModalProps {
  xpEarned: number;
  accuracy: number;
  streakDays: number;
  onFinish: () => void;
  onRetry: () => void;
  onGoHome?: () => void;
}

export const LessonCompleteModal: React.FC<LessonCompleteModalProps> = ({
  xpEarned,
  accuracy,
  streakDays,
  onFinish,
  onRetry,
  onGoHome,
}) => {
  useEffect(() => {
    audioFeedback.playSuccessChime();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border border-slate-100 flex flex-col items-center"
      >
        {/* Animated Trophy Icon */}
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-2">
          Bài học hoàn thành • Lesson Complete!
        </span>

        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          Tuyệt vời lắm!
        </h2>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Bạn đã tiến thêm một bước trên hành trình chinh phục tiếng Việt.
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          {/* Total XP */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl font-black text-amber-900">+{xpEarned}</span>
            <span className="text-[11px] font-semibold text-amber-700">Tổng XP</span>
          </div>

          {/* Accuracy */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl font-black text-emerald-900">{accuracy}%</span>
            <span className="text-[11px] font-semibold text-emerald-700">Độ chính xác</span>
          </div>

          {/* Streak */}
          <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-xl font-black text-orange-900">{streakDays} ngày</span>
            <span className="text-[11px] font-semibold text-orange-700">Streak</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onFinish}
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            is3D
          >
            Tiếp tục lộ trình • Continue
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onRetry}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Luyện tập lại bài này • Practice again
          </Button>

          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center"
            >
              Về Trang chủ • Back to Home
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
