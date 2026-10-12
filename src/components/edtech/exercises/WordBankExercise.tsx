import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Undo2 } from 'lucide-react';
import { WordBankDataDTO, WordBankToken } from '@/types/edtech';
import { audioFeedback } from '@/utils/audioFeedback';

interface WordBankExerciseProps {
  data: WordBankDataDTO;
  selectedTokenIds: string[];
  onSelectToken: (token: WordBankToken) => void;
  onRemoveToken: (tokenId: string) => void;
  onReset: () => void;
}

export const WordBankExercise: React.FC<WordBankExerciseProps> = ({
  data,
  selectedTokenIds,
  onSelectToken,
  onRemoveToken,
  onReset,
}) => {
  // Find selected tokens preserving selection order
  const selectedTokens: WordBankToken[] = selectedTokenIds
    .map((id) => data.tokens.find((t) => t.id === id))
    .filter((t): t is WordBankToken => Boolean(t));

  // Determine if a token in bank is already selected
  const isTokenSelected = (id: string) => selectedTokenIds.includes(id);

  const handleBankTokenClick = (token: WordBankToken) => {
    if (isTokenSelected(token.id)) return;
    audioFeedback.playPopSound(1.1);
    onSelectToken(token);
  };

  const handleSentenceTokenClick = (tokenId: string) => {
    audioFeedback.playPopSound(0.85);
    onRemoveToken(tokenId);
  };

  const handleSpeakPrompt = () => {
    audioFeedback.speakVietnamese(data.sentenceViTarget.join(' '));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Exercise Header */}
      <div className="w-full text-left mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-sky-50 text-sky-700 border border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          Ghép câu hoàn chỉnh • Sentence Builder
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mt-2">
          Sắp xếp các từ để hoàn thiện câu sau:
        </h2>
      </div>

      {/* English Prompt Bubble */}
      <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-5 mb-6 flex items-start gap-4 shadow-sm">
        <button
          type="button"
          onClick={handleSpeakPrompt}
          className="!min-h-0 !min-w-0 !p-0 !border-0 shrink-0 w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer audio-btn"
          aria-label="Nghe câu mẫu tiếng Việt"
          title="Nghe câu mẫu"
        >
          <Volume2 className="w-5 h-5 shrink-0" strokeWidth={2.2} />
        </button>

        <div className="flex-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Dịch câu sau sang tiếng Việt:
          </span>
          <p className="text-lg md:text-xl font-bold text-slate-800">
            "{data.promptEn}"
          </p>
          {data.grammarNote && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1 mt-2 inline-block border border-amber-200">
              💡 {data.grammarNote}
            </p>
          )}
        </div>
      </div>

      {/* Target Construction Area (Sentence dock) */}
      <div className="w-full min-h-[96px] bg-white border-2 border-dashed border-slate-300 rounded-3xl p-4 mb-6 flex flex-wrap items-center gap-2.5 shadow-inner relative transition-colors focus-within:border-emerald-500">
        <AnimatePresence>
          {selectedTokens.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-medium text-slate-400 italic mx-auto select-none"
            >
              Chạm vào các từ bên dưới để đưa vào câu...
            </motion.p>
          ) : (
            selectedTokens.map((token, index) => (
              <motion.button
                key={token.id}
                layoutId={`token-${token.id}`}
                onClick={() => handleSentenceTokenClick(token.id)}
                className="group inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 border-2 border-emerald-400 font-bold text-base md:text-lg shadow-sm hover:bg-rose-50 hover:text-rose-700 hover:border-rose-400 active:scale-95 transition-colors cursor-pointer"
                title="Chạm để bỏ chọn"
              >
                <span className="vn-diacritic-safe">{token.text}</span>
              </motion.button>
            ))
          )}
        </AnimatePresence>

        {/* Undo / Reset button */}
        {selectedTokens.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="absolute top-2 right-2 text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Làm lại từ đầu"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Xoá hết</span>
          </button>
        )}
      </div>

      {/* Word Bank Area */}
      <div className="w-full">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Kho từ vựng • Word Bank
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-3xl min-h-[110px]">
          {data.tokens.map((token) => {
            const selected = isTokenSelected(token.id);

            return (
              <div key={token.id} className="relative">
                {/* Placeholder silhouette when token is selected into the dock */}
                {selected && (
                  <div className="px-4 py-2.5 rounded-2xl bg-slate-200/60 border-2 border-transparent text-transparent font-bold text-base md:text-lg select-none">
                    {token.text}
                  </div>
                )}

                {!selected && (
                  <motion.button
                    layoutId={`token-${token.id}`}
                    onClick={() => handleBankTokenClick(token)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 rounded-2xl bg-white text-slate-800 border-2 border-slate-200 font-bold text-base md:text-lg shadow-[0_3px_0_#cbd5e1] hover:border-emerald-300 hover:shadow-[0_3px_0_#10b981] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    <span className="vn-diacritic-safe">{token.text}</span>
                  </motion.button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
