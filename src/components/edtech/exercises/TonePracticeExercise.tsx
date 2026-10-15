import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Music, Info, HelpCircle } from 'lucide-react';
import { TonePracticeDataDTO, VietnameseTone } from '@/types/edtech';
import { VIETNAMESE_TONES, TONE_COLOR_MAP } from '@/constants/vietnameseTones';
import { ToneCurveGraph } from '@/components/edtech/ui/ToneCurveGraph';
import { audioFeedback } from '@/utils/audioFeedback';

interface TonePracticeExerciseProps {
  data: TonePracticeDataDTO;
  selectedTone: VietnameseTone | null;
  onSelectTone: (tone: VietnameseTone) => void;
}

export const TonePracticeExercise: React.FC<TonePracticeExerciseProps> = ({
  data,
  selectedTone,
  onSelectTone,
}) => {
  const [activePreviewTone, setActivePreviewTone] = useState<VietnameseTone>(
    data.targetTone
  );
  const [showGuideModal, setShowGuideModal] = useState(false);

  const targetToneInfo = VIETNAMESE_TONES[data.targetTone] || VIETNAMESE_TONES.NGANG;
  const currentPreviewInfo = VIETNAMESE_TONES[activePreviewTone] || VIETNAMESE_TONES.NGANG;

  const handlePlayTargetWord = () => {
    audioFeedback.speakVietnamese(data.targetWord);
    audioFeedback.playVietnameseTone(data.targetTone);
  };

  const handleSelectOption = (tone: VietnameseTone) => {
    setActivePreviewTone(tone);
    audioFeedback.playVietnameseTone(tone);
    audioFeedback.playPopSound(1.15);
    onSelectTone(tone);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Exercise Badge & Title */}
      <div className="w-full text-left mb-5 flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-purple-50 text-purple-700 border border-purple-200">
            <Music className="w-3.5 h-3.5 text-purple-600" />
            Luyện Cao Độ Thanh Điệu • Tone Mastery
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">
            Nghe và chọn thanh điệu chính xác:
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowGuideModal(!showGuideModal)}
          className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-purple-50/50 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Biểu đồ 6 thanh</span>
        </button>
      </div>

      {/* Target Word Sound Box */}
      <div className="w-full bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border-2 border-purple-200/80 rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePlayTargetWord}
            className="!min-h-0 !min-w-0 !p-0 !border-0 w-16 h-16 rounded-3xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-[0_4px_0_#6b21a8] active:translate-y-1 active:shadow-none transition-all cursor-pointer group shrink-0 audio-btn"
            aria-label="Nghe âm thanh mẫu"
          >
            <Volume2 className="w-8 h-8 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={2.2} />
          </button>

          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">
              Nghĩa tiếng Anh: "{data.targetMeaningEn}"
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight vn-diacritic-safe">
                "{data.targetWord}"
              </span>
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Âm gốc: {data.baseSyllable}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Chạm nút loa để nghe độ cao giọng nói (Pitch Contour).
            </p>
          </div>
        </div>

        {/* Live Pitch Curve Preview */}
        <div className="w-full sm:w-56 shrink-0">
          <ToneCurveGraph
            tone={currentPreviewInfo}
            compact
            interactive={true}
            onPlay={() => {}}
          />
        </div>
      </div>

      {/* Tone Options Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Chọn thanh điệu tương ứng (Select the matching tone):
          </span>
          {selectedTone && (
            <span className="text-xs font-bold text-emerald-600">
              Đã chọn: {VIETNAMESE_TONES[selectedTone]?.nameVi}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {data.options.map((opt) => {
            const toneObj = VIETNAMESE_TONES[opt.tone] || VIETNAMESE_TONES.NGANG;
            const colors = TONE_COLOR_MAP[opt.tone] || TONE_COLOR_MAP.NGANG;
            const isSelected = selectedTone === opt.tone;

            return (
              <motion.button
                key={opt.tone}
                type="button"
                onClick={() => handleSelectOption(opt.tone)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-4 rounded-2xl border-2 text-left flex flex-col justify-between min-h-[110px] transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/80 shadow-[0_4px_0_#9333ea] ring-2 ring-purple-300'
                    : 'border-slate-200 bg-white hover:border-purple-300 shadow-[0_3px_0_#cbd5e1] hover:shadow-[0_3px_0_#d8b4fe]'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-sm ${colors.bg} ${colors.text} border ${colors.border}`}
                    >
                      {toneObj.symbol}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block leading-none">
                        {toneObj.nameVi}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {toneObj.nameEn.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <span className="text-xl font-black text-slate-900 vn-diacritic-safe">
                    {opt.word}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 italic truncate max-w-[120px]">
                    "{opt.meaningEn}"
                  </span>
                  <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                    {opt.ipa}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Guide Note for Foreigners */}
      {data.explanation && (
        <div className="w-full mt-5 bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Ghi nhớ ngữ điệu:</strong> {data.explanation}
          </div>
        </div>
      )}
    </div>
  );
};
