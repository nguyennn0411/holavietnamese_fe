import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Zap, HeartCrack } from 'lucide-react';
import { Button } from '@/components/edtech/ui/Button';

export interface FeedbackState {
  status: 'correct' | 'incorrect';
  messageVi: string;
  messageEn: string;
  correctAnswerText?: string;
  explanation?: string;
  xpGained?: number;
}

interface BottomActionBarProps {
  canCheck: boolean;
  isChecked: boolean;
  feedback: FeedbackState | null;
  onCheck: () => void;
  onContinue: () => void;
  className?: string;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  canCheck,
  isChecked,
  feedback,
  onCheck,
  onContinue,
  className = '',
}) => {
  // Support Enter key press to Check or Continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isChecked && canCheck) {
          e.preventDefault();
          onCheck();
        } else if (isChecked) {
          e.preventDefault();
          onContinue();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChecked, canCheck, onCheck, onContinue]);

  return (
    <footer
      className={`fixed bottom-0 inset-x-0 z-40 transition-colors duration-300 ${
        isChecked && feedback?.status === 'correct'
          ? 'bg-emerald-50 border-t-2 border-emerald-200'
          : isChecked && feedback?.status === 'incorrect'
          ? 'bg-rose-50 border-t-2 border-rose-200'
          : 'bg-white/95 backdrop-blur-md border-t border-slate-200'
      } ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dynamic Feedback Area when checked */}
        <div className="w-full md:flex-1">
          <AnimatePresence mode="wait">
            {isChecked && feedback ? (
              <motion.div
                key={feedback.status}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3.5"
              >
                {/* Result Icon */}
                <div className="shrink-0 mt-0.5">
                  {feedback.status === 'correct' ? (
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
                      <XCircle className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                {/* Feedback Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-lg md:text-xl font-black ${
                        feedback.status === 'correct'
                          ? 'text-emerald-800'
                          : 'text-rose-800'
                      }`}
                    >
                      {feedback.messageVi}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      • {feedback.messageEn}
                    </span>

                    {/* XP or Heart indicator */}
                    {feedback.status === 'correct' && feedback.xpGained && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 ml-auto shadow-sm">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        +{feedback.xpGained} XP
                      </span>
                    )}
                    {feedback.status === 'incorrect' && (
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-800 ml-auto">
                        <HeartCrack className="w-3.5 h-3.5" />
                        -1 Tim
                      </span>
                    )}
                  </div>

                  {/* Correct Answer Display on Error */}
                  {feedback.status === 'incorrect' && feedback.correctAnswerText && (
                    <div className="mt-1.5 text-xs md:text-sm text-slate-700">
                      <span className="font-bold text-rose-700">Đáp án chính xác: </span>
                      <span className="font-extrabold text-slate-900 bg-white/80 px-2 py-0.5 rounded-lg border border-rose-200 vn-diacritic-safe">
                        {feedback.correctAnswerText}
                      </span>
                    </div>
                  )}

                  {feedback.explanation && (
                    <p className="text-xs text-slate-600 mt-1">
                      {feedback.explanation}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="hidden md:block text-xs font-semibold text-slate-400">
                Nhấn <kbd className="px-2 py-1 rounded bg-slate-100 border border-slate-300 font-mono text-[11px] text-slate-600">Enter ↵</kbd> để kiểm tra
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button: Check OR Continue */}
        <div className="w-full md:w-auto md:min-w-[190px]">
          {!isChecked ? (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!canCheck}
              onClick={onCheck}
              is3D
            >
              Kiểm tra • Check
            </Button>
          ) : (
            <Button
              variant={feedback?.status === 'correct' ? 'primary' : 'danger'}
              size="lg"
              fullWidth
              onClick={onContinue}
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              is3D
            >
              Tiếp tục • Continue
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};
