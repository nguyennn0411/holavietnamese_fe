import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakVietnamese } from '@/utils/speech';
import { WORD_OF_THE_DAY } from '@/components/home/data/homeData';

/**
 * Cultural Tip & Word of the Day Card
 */
export function WordOfTheDayCard({ wordData = WORD_OF_THE_DAY }) {
  return (
    <section className="bg-[#FFF9EE]/92 backdrop-blur-xs border border-[#DECBB4] rounded-3xl p-6 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#A62A24] bg-[#F5E1D8] px-2.5 py-0.5 rounded-md">
          Từ vựng & Văn hóa trong ngày
        </span>
        <button
          type="button"
          onClick={() => speakVietnamese(wordData.speechText || wordData.word)}
          className="!min-h-0 !min-w-0 !p-0 w-8 h-8 rounded-full bg-white border border-[#DECBB4] text-[#A62A24] flex items-center justify-center hover:bg-[#A62A24] hover:text-white transition-all shadow-2xs shrink-0 cursor-pointer group/wod audio-btn"
          title="Nghe phát âm “Dạ”"
          aria-label="Nghe phát âm Dạ"
        >
          <Volume2 className="w-4 h-4 shrink-0 transition-transform group-hover/wod:scale-110" strokeWidth={2.2} />
        </button>
      </div>

      <div>
        <h4 className="text-lg font-black text-[#431914]">{wordData.word}</h4>
        <p className="text-xs text-[#78685B] leading-relaxed mt-1">
          {wordData.description}
        </p>
      </div>

      <div className="p-2.5 rounded-xl bg-white/80 border border-[#DECBB4]/60 text-[11px] text-[#431914] italic">
        {wordData.example}
      </div>
    </section>
  );
}

export default WordOfTheDayCard;
