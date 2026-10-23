import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { ProgressBar } from '@/components/edtech/ui/ProgressBar';
import { audioFeedback } from '@/utils/audioFeedback';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';

interface LessonHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  hearts: number;
  onQuit: () => void;
  onGoHome?: () => void;
  className?: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentIndex,
  totalQuestions,
  hearts,
  onQuit,
  onGoHome,
  className = '',
}) => {
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(audioFeedback.getMuted());

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioFeedback.setMuted(next);
  };

  const handleConfirmQuit = () => {
    setShowQuitConfirm(false);
    onQuit();
  };

  return (
    <>
      <header
        className={`w-full max-w-4xl mx-auto flex items-center justify-between gap-4 py-4 px-4 select-none ${className}`}
      >
        {/* Quit (X) Button */}
        <button
          type="button"
          onClick={() => setShowQuitConfirm(true)}
          className="!min-h-0 !min-w-0 !p-0 !border-0 bg-transparent hover:bg-slate-200/60 w-10 h-10 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer audio-btn"
          aria-label={bilingualLabel("Thoát bài học", "Quit lesson")}
          title={bilingualLabel("Thoát bài học", "Quit lesson")}
        >
          <X className="w-6 h-6 stroke-[2.5] shrink-0" />
        </button>

        {/* Dynamic Question Progress Bar */}
        <div className="flex-1 max-w-md">
          <ProgressBar
            current={currentIndex}
            total={totalQuestions}
            height="md"
            color="red"
          />
        </div>

        {/* Action Controls: Audio Toggle & Hearts counter */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleMute}
            className="!min-h-0 !min-w-0 !p-0 !border-0 bg-transparent hover:bg-slate-200/60 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer audio-btn"
            aria-label={isMuted ? bilingualLabel('Bật âm thanh', 'Unmute audio') : bilingualLabel('Tắt âm thanh', 'Mute audio')}
            title={isMuted ? bilingualLabel('Bật âm thanh', 'Unmute audio') : bilingualLabel('Tắt âm thanh', 'Mute audio')}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-slate-400 shrink-0" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-600 shrink-0" strokeWidth={2.2} />
            )}
          </button>

          {/* Hearts indicator with shake and pulse */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-sm shadow-sm"
            title={bilingualLabel(`Còn ${hearts} tim`, `${hearts} hearts left`)}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </motion.div>
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Confirmation Quit Modal */}
      <AnimatePresence>
        {showQuitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1.5">
                <BilingualText vi="Bạn có chắc muốn dừng lại?" en="Are you sure you want to quit?" />
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                <BilingualText
                  vi="Nếu thoát bây giờ, tiến trình của bài học này sẽ không được lưu. Cố lên nhé!"
                  en="If you quit now, your progress in this lesson won't be saved. Keep going!"
                />
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowQuitConfirm(false)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <BilingualText vi="Tiếp tục học" en="Stay in lesson" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmQuit}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                >
                  <BilingualText vi="Về Lộ trình học" en="Go to Path" />
                </button>
                {onGoHome && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuitConfirm(false);
                      onGoHome();
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <BilingualText vi="Về Trang chủ" en="Go to Home" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
