import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, ArrowLeftRight, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MinimalPairDTO, VietnameseTone } from '@/types/edtech';
import { VIETNAMESE_TONES, TONE_COLOR_MAP } from '@/constants/vietnameseTones';
import { ToneCurveGraph } from '@/components/edtech/ui/ToneCurveGraph';
import { audioFeedback } from '@/utils/audioFeedback';
import BilingualText, { bilingualLabel } from '@/components/common/BilingualText';

export const COMMON_MINIMAL_PAIRS: MinimalPairDTO[] = [
  {
    id: 'hoi-vs-nga',
    title: 'Thanh Hỏi (?) vs Thanh Ngã (~)',
    titleEn: 'Hỏi Tone (?) vs Ngã Tone (~)',
    contrastFocus: 'Cặp dấu gây bối rối nhất',
    contrastFocusVi: 'Cặp dấu gây bối rối nhất',
    contrastFocusEn: 'Most confusing tone pair',
    explanationVi:
      'Thanh Hỏi hạ giọng xuống đáy cổ họng rồi nảy nhẹ (313). Thanh Ngã bắt đầu cao hơn, bị nghẹn/ngắt thanh hầu (glottal stop) rồi bật vút lên đỉnh (3ˀ5).',
    explanationEn:
      'Hỏi tone dips down into the lower throat then rebounds slightly (313). Ngã tone starts higher, pauses with a glottal stop, then rises sharply to the top (3ˀ5).',
    itemA: {
      word: 'mả',
      tone: 'HOI',
      ipa: '/maː˧˩˨/',
      meaningEn: 'Grave / Tomb',
      exampleVi: 'Ngôi mả đá cổ ven làng.',
      exampleEn: 'The ancient stone grave by the village.',
    },
    itemB: {
      word: 'mã',
      tone: 'NGA',
      ipa: '/maː˧ˀ˥/',
      meaningEn: 'Horse / Code / Appearance',
      exampleVi: 'Mã số bí mật để mở cửa.',
      exampleEn: 'The secret code to open the door.',
    },
    quizTargetItem: 'B',
  },
  {
    id: 'ngang-vs-huyen',
    title: 'Thanh Ngang (Không dấu) vs Thanh Huyền (\\)',
    titleEn: 'Ngang Tone (Flat) vs Huyền Tone (Grave \\)',
    contrastFocus: 'Bằng phẳng vs Hạ thấp dần',
    contrastFocusVi: 'Bằng phẳng vs Hạ thấp dần',
    contrastFocusEn: 'Flat level vs Gentle descent',
    explanationVi:
      'Thanh Ngang giữ cao độ đều 33 không dao động. Thanh Huyền hạ giọng nhẹ nhàng từ 2 xuống 1 như một tiếng thở dài êm dịu.',
    explanationEn:
      'Ngang tone maintains an even mid pitch 33 without fluctuating. Huyền tone gently glides down from 2 to 1 like a soft sigh.',
    itemA: {
      word: 'ma',
      tone: 'NGANG',
      ipa: '/maː˧˧/',
      meaningEn: 'Ghost / Phantom',
      exampleVi: 'Câu chuyện ma kinh dị.',
      exampleEn: 'A horror ghost story.',
    },
    itemB: {
      word: 'mà',
      tone: 'HUYEN',
      ipa: '/maː˨˩/',
      meaningEn: 'But / However / That',
      exampleVi: 'Tôi muốn đi mà bận quá.',
      exampleEn: 'I want to go but I am too busy.',
    },
    quizTargetItem: 'B',
  },
  {
    id: 'huyen-vs-nang',
    title: 'Thanh Huyền (\\) vs Thanh Nặng (.)',
    titleEn: 'Huyền Tone (Grave \\) vs Nặng Tone (Dot .)',
    contrastFocus: 'Hạ êm dịu vs Thả rơi đột ngột',
    contrastFocusVi: 'Hạ êm dịu vs Thả rơi đột ngột',
    contrastFocusEn: 'Gentle descent vs Abrupt drop',
    explanationVi:
      'Thanh Huyền êm dịu và kéo dài. Thanh Nặng rơi gấp xuống tận đáy và bị chặn cụt đột ngột bởi nắp thanh quản.',
    explanationEn:
      'Huyền tone is soft and sustained. Nặng tone drops steeply to the bottom and is abruptly cut short by a glottal closure.',
    itemA: {
      word: 'bà',
      tone: 'HUYEN',
      ipa: '/ɓaː˨˩/',
      meaningEn: 'Grandmother / Madam',
      exampleVi: 'Bà tôi năm nay tám mươi tuổi.',
      exampleEn: 'My grandmother is eighty years old.',
    },
    itemB: {
      word: 'bạ',
      tone: 'NANG',
      ipa: '/ɓaː˨˩ˀ/',
      meaningEn: 'Any / Heedlessly',
      exampleVi: 'Không nên ăn bạ ngoài đường.',
      exampleEn: 'Do not eat just anywhere on the street.',
    },
    quizTargetItem: 'A',
  },
];

interface MinimalPairsComparatorProps {
  initialPairId?: string;
  isQuizMode?: boolean;
  onQuizSelect?: (choice: 'A' | 'B') => void;
  selectedQuizChoice?: 'A' | 'B' | null;
  className?: string;
}

export const MinimalPairsComparator: React.FC<MinimalPairsComparatorProps> = ({
  initialPairId = 'hoi-vs-nga',
  isQuizMode = false,
  onQuizSelect,
  selectedQuizChoice = null,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isEn = (i18n.resolvedLanguage || i18n.language || 'vi').toLowerCase().startsWith('en');
  const [selectedPairId, setSelectedPairId] = useState(initialPairId);
  const activePair =
    COMMON_MINIMAL_PAIRS.find((p) => p.id === selectedPairId) ||
    COMMON_MINIMAL_PAIRS[0];

  const toneA = VIETNAMESE_TONES[activePair.itemA.tone] || VIETNAMESE_TONES.NGANG;
  const toneB = VIETNAMESE_TONES[activePair.itemB.tone] || VIETNAMESE_TONES.NGANG;

  const colorsA = TONE_COLOR_MAP[activePair.itemA.tone];
  const colorsB = TONE_COLOR_MAP[activePair.itemB.tone];

  const handlePlayWord = (word: string, tone: VietnameseTone) => {
    audioFeedback.playVietnameseTone(tone);
    audioFeedback.speakVietnamese(word);
    audioFeedback.playPopSound(1.1);
  };

  return (
    <div
      className={`w-full max-w-3xl mx-auto rounded-3xl bg-white border-2 border-slate-200 p-6 md:p-8 shadow-card-soft ${className}`}
    >
      {/* Header & Pair Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <ArrowLeftRight className="w-3.5 h-3.5 text-purple-600" />
            <BilingualText vi="Cặp Dấu Dễ Nhầm • Đối chiếu thanh điệu" en="Minimal Pairs Tone Contrast" />
          </span>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
            <BilingualText vi={activePair.title} en={activePair.titleEn || activePair.title} />
          </h3>
          <p className="text-xs text-purple-700 font-semibold mt-0.5">
            <BilingualText
              vi={activePair.contrastFocusVi || activePair.contrastFocus}
              en={activePair.contrastFocusEn || activePair.contrastFocus}
            />
          </p>
        </div>

        {/* Pair Switcher Pills */}
        {!isQuizMode && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {COMMON_MINIMAL_PAIRS.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => setSelectedPairId(pair.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedPairId === pair.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {pair.itemA.word} vs {pair.itemB.word}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Side-by-Side Tone Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* VS Badge in Center */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#F97316] text-white font-black text-xs items-center justify-center shadow-lg border-2 border-white">
          VS
        </div>

        {/* SIDE A */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => {
            if (isQuizMode && onQuizSelect) onQuizSelect('A');
          }}
          className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
            selectedQuizChoice === 'A'
              ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-300'
              : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
          } ${isQuizMode ? 'cursor-pointer' : ''}`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${colorsA.bg} ${colorsA.text} ${colorsA.border}`}
              >
                {isEn ? toneA.nameEn : toneA.nameVi} ({toneA.symbol})
              </span>
              <span className="text-xs font-bold text-slate-400">
                <BilingualText vi="Lựa chọn A" en="Option A" />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tight vn-diacritic-safe">
                  "{activePair.itemA.word}"
                </h4>
                <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {activePair.itemA.ipa}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayWord(activePair.itemA.word, activePair.itemA.tone);
                }}
                className="!min-h-0 !min-w-0 !p-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-[0_3px_0_#cbd5e1] hover:border-purple-400 hover:shadow-[0_3px_0_#a855f7] active:translate-y-0.5 active:shadow-none flex items-center justify-center text-purple-700 transition-all cursor-pointer audio-btn"
                aria-label={bilingualLabel(`Nghe từ ${activePair.itemA.word}`, `Listen to word ${activePair.itemA.word}`)}
              >
                <Volume2 className="w-6 h-6 shrink-0" strokeWidth={2.2} />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-700 mb-2">
              <BilingualText vi="Nghĩa: " en="Meaning: " />"{activePair.itemA.meaningEn}"
            </p>

            <p className="text-xs text-slate-500 italic bg-white rounded-xl p-2.5 border border-slate-100">
              "{activePair.itemA.exampleVi}"
            </p>
          </div>

          {/* Embedded Pitch Curve Graph A */}
          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <ToneCurveGraph tone={toneA} compact interactive={false} />
          </div>
        </motion.div>

        {/* SIDE B */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => {
            if (isQuizMode && onQuizSelect) onQuizSelect('B');
          }}
          className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all ${
            selectedQuizChoice === 'B'
              ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-300'
              : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
          } ${isQuizMode ? 'cursor-pointer' : ''}`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${colorsB.bg} ${colorsB.text} ${colorsB.border}`}
              >
                {isEn ? toneB.nameEn : toneB.nameVi} ({toneB.symbol})
              </span>
              <span className="text-xs font-bold text-slate-400">
                <BilingualText vi="Lựa chọn B" en="Option B" />
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-4xl font-black text-slate-900 tracking-tight vn-diacritic-safe">
                  "{activePair.itemB.word}"
                </h4>
                <span className="font-mono text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                  {activePair.itemB.ipa}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayWord(activePair.itemB.word, activePair.itemB.tone);
                }}
                className="!min-h-0 !min-w-0 !p-0 w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-[0_3px_0_#cbd5e1] hover:border-purple-400 hover:shadow-[0_3px_0_#a855f7] active:translate-y-0.5 active:shadow-none flex items-center justify-center text-purple-700 transition-all cursor-pointer audio-btn"
                aria-label={bilingualLabel(`Nghe từ ${activePair.itemB.word}`, `Listen to word ${activePair.itemB.word}`)}
              >
                <Volume2 className="w-6 h-6 shrink-0" strokeWidth={2.2} />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-700 mb-2">
              <BilingualText vi="Nghĩa: " en="Meaning: " />"{activePair.itemB.meaningEn}"
            </p>

            <p className="text-xs text-slate-500 italic bg-white rounded-xl p-2.5 border border-slate-100">
              "{activePair.itemB.exampleVi}"
            </p>
          </div>

          {/* Embedded Pitch Curve Graph B */}
          <div className="mt-4 pt-3 border-t border-slate-200/80">
            <ToneCurveGraph tone={toneB} compact interactive={false} />
          </div>
        </motion.div>
      </div>

      {/* Linguistic Contrast Note */}
      <div className="mt-6 bg-purple-50/80 border border-purple-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-900">
        <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <div>
          <strong><BilingualText vi="Bí quyết phân biệt: " en="Key distinction: " /></strong>
          <BilingualText
            vi={activePair.explanationVi || activePair.explanationEn}
            en={activePair.explanationEn}
          />
        </div>
      </div>
    </div>
  );
};
