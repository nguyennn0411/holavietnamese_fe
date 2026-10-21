import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowLeft,
  Filter,
  Keyboard,
  ArrowLeftRight,
  Home,
} from 'lucide-react';
import { VocabularyItemDTO, VietnameseTone } from '@/types/edtech';
import { VIETNAMESE_TONES, TONE_COLOR_MAP } from '@/constants/vietnameseTones';
import { DiacriticKeyboardBar } from '@/components/edtech/ui/DiacriticKeyboardBar';
import { MinimalPairsComparator } from '@/components/edtech/ui/MinimalPairsComparator';
import { audioFeedback } from '@/utils/audioFeedback';

const MOCK_VOCABULARY: VocabularyItemDTO[] = [
  {
    id: 'v-1',
    word: 'Phở',
    ipa: '/fəː˧˩˨/',
    tone: 'HOI',
    partOfSpeech: 'Danh từ',
    englishMeaning: 'Vietnamese Traditional Noodle Soup',
    topic: 'Ẩm thực',
    cefrLevel: 'A1',
    exampleVi: 'Buổi sáng tôi thường ăn một bát phở bò.',
    exampleEn: 'In the morning I usually eat a bowl of beef pho.',
    bookmarked: true,
    masteryPercentage: 90,
  },
  {
    id: 'v-2',
    word: 'Cà phê sữa đá',
    ipa: '/kaː˨˩ fe˧˧ sɨə˦ˀ˥ daː˧˥/',
    tone: 'SAC',
    partOfSpeech: 'Cụm danh từ',
    englishMeaning: 'Iced coffee with condensed milk',
    topic: 'Ẩm thực',
    cefrLevel: 'A1',
    exampleVi: 'Một ly cà phê sữa đá mang đi nhé!',
    exampleEn: 'An iced milk coffee to go please!',
    bookmarked: false,
    masteryPercentage: 80,
  },
  {
    id: 'v-3',
    word: 'Cảm ơn',
    ipa: '/kaːm˧˩˨ ʔəːn˧˧/',
    tone: 'HOI',
    partOfSpeech: 'Động từ / Thán từ',
    englishMeaning: 'Thank you',
    topic: 'Giao tiếp hàng ngày',
    cefrLevel: 'A1',
    exampleVi: 'Cảm ơn bạn rất nhiều!',
    exampleEn: 'Thank you very much!',
    bookmarked: true,
    masteryPercentage: 100,
  },
  {
    id: 'v-4',
    word: 'Xin chào',
    ipa: '/siŋ˧˧ t͡ɕaːw˨˩/',
    tone: 'HUYEN',
    partOfSpeech: 'Thán từ',
    englishMeaning: 'Hello / Greetings',
    topic: 'Giao tiếp hàng ngày',
    cefrLevel: 'A1',
    exampleVi: 'Xin chào mọi người!',
    exampleEn: 'Hello everyone!',
    bookmarked: false,
    masteryPercentage: 95,
  },
  {
    id: 'v-5',
    word: 'Bánh mì',
    ipa: '/ɓajŋ̟˧˥ mi˨˩/',
    tone: 'HUYEN',
    partOfSpeech: 'Danh từ',
    englishMeaning: 'Vietnamese Baguette Sandwich',
    topic: 'Ẩm thực',
    cefrLevel: 'A1',
    exampleVi: 'Cho tôi một ổ bánh mì kẹp thịt pate.',
    exampleEn: 'Give me a baguette with meat and pate.',
    bookmarked: false,
    masteryPercentage: 70,
  },
  {
    id: 'v-6',
    word: 'Bao nhiêu',
    ipa: '/ɓaːw˧˧ ɲiəw˧˧/',
    tone: 'NGANG',
    partOfSpeech: 'Đại từ nghi vấn',
    englishMeaning: 'How much / How many',
    topic: 'Mua sắm',
    cefrLevel: 'A1',
    exampleVi: 'Cái này bao nhiêu tiền một ký?',
    exampleEn: 'How much is this per kilogram?',
    bookmarked: false,
    masteryPercentage: 60,
  },
];

export const VocabularyHubScreen: React.FC = () => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [vocabList, setVocabList] = useState<VocabularyItemDTO[]>(MOCK_VOCABULARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToneFilter, setSelectedToneFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'VOCAB' | 'MINIMAL_PAIRS'>('VOCAB');
  const [showKeyboardBar, setShowKeyboardBar] = useState(false);

  const handleToggleBookmark = (id: string) => {
    audioFeedback.playPopSound(1.3);
    setVocabList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
      )
    );
  };

  const handleSpeak = (word: string) => {
    audioFeedback.speakVietnamese(word);
    audioFeedback.playPopSound(1.1);
  };

  // Filtered vocabulary
  const filteredList = vocabList.filter((item) => {
    const matchesQuery =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTone =
      selectedToneFilter === 'ALL' || item.tone === selectedToneFilter;
    return matchesQuery && matchesTone;
  });

  return (
    <div className="w-full antialiased selection:bg-[#FFF4EB] selection:text-[#EA580C] pb-20">
      {/* Breadcrumb Ribbon & Navigation */}
      <div className="bg-white/95 rounded-3xl p-4 md:p-5 border border-[#DECBB4]/70 shadow-card-soft mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 w-full md:w-auto">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[#431914] hover:text-[#EA580C] transition-colors px-2.5 py-1.5 rounded-xl hover:bg-[#FFF9EE]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Trang chủ</span>
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            to="/edtech/dashboard"
            className="flex items-center gap-1.5 text-[#431914] hover:text-[#EA580C] transition-colors px-2.5 py-1.5 rounded-xl hover:bg-[#FFF9EE]"
          >
            <span>Lộ trình học</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#EA580C] bg-[#FFF4EB] px-3 py-1 rounded-xl border border-[#E7B59D] font-bold">
            Kho Từ Vựng & 6 Thanh Điệu
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setActiveTab('VOCAB')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'VOCAB'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Từ vựng ({vocabList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MINIMAL_PAIRS')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'MINIMAL_PAIRS'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-purple-600" />
            <span>Cặp dấu đối chiếu</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'MINIMAL_PAIRS' ? (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Luyện tai người bản ngữ • Ear Training
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
                Phân Biệt Các Cặp Dấu Dễ Nhầm
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Người học tiếng Việt thường nhầm lẫn giữa Hỏi/Ngã hoặc Huyền/Nặng. Hãy nghe và đối chiếu biểu đồ cao độ để làm chủ từng thanh âm!
              </p>
            </div>

            <MinimalPairsComparator />
          </div>
        ) : (
          <>
            {/* Search, Virtual Keyboard & Tone Filters */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card-soft mb-8 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full">
                {/* Search bar with Virtual Keyboard Toggle */}
                <div className="relative w-full md:w-96 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Tìm từ vựng, gõ tiếng Việt..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all vn-diacritic-safe"
                    />
                  </div>

                  {/* Toggle Virtual Keyboard Button */}
                  <button
                    type="button"
                    onClick={() => setShowKeyboardBar(!showKeyboardBar)}
                    className={`p-2.5 rounded-2xl border transition-colors cursor-pointer shrink-0 ${
                      showKeyboardBar
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Bật bàn phím gõ dấu ảo"
                    aria-label="Bật bàn phím gõ dấu ảo"
                  >
                    <Keyboard className="w-4 h-4" />
                  </button>
                </div>

                {/* Tone Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3.5 h-3.5" /> Thanh:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedToneFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedToneFilter === 'ALL'
                        ? 'bg-[#F97316] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  {Object.keys(VIETNAMESE_TONES).map((toneKey) => {
                    const tone = VIETNAMESE_TONES[toneKey];
                    const isSelected = selectedToneFilter === toneKey;
                    return (
                      <button
                        key={toneKey}
                        type="button"
                        onClick={() => setSelectedToneFilter(toneKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tone.symbol} {tone.nameVi.split(' ')[1] || tone.nameVi}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Virtual Keyboard Bar for Search Input */}
              {showKeyboardBar && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <DiacriticKeyboardBar
                    inputRef={searchInputRef}
                    onInsertChar={(char) => {
                      if (searchInputRef.current) {
                        setSearchQuery(searchInputRef.current.value);
                      } else {
                        setSearchQuery(searchQuery + char);
                      }
                    }}
                  />
                </motion.div>
              )}
            </div>

        {/* Vocabulary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredList.map((item) => {
            const toneColors = TONE_COLOR_MAP[item.tone] || TONE_COLOR_MAP.NGANG;
            const toneObj = VIETNAMESE_TONES[item.tone] || VIETNAMESE_TONES.NGANG;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-card-soft hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Row: Tone Pill & Bookmark */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${toneColors.bg} ${toneColors.text} ${toneColors.border}`}
                    >
                      {toneObj.nameVi} ({toneObj.symbol})
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(item.id)}
                      className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                      aria-label="Lưu từ vựng"
                    >
                      {item.bookmarked ? (
                        <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-400" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Word & Audio Pronunciation */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight vn-diacritic-safe">
                      {item.word}
                    </h3>

                    <button
                      type="button"
                      onClick={() => handleSpeak(item.word)}
                      className="!min-h-0 !min-w-0 !p-0 !border-0 w-9 h-9 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors active:scale-95 shrink-0 cursor-pointer audio-btn"
                      aria-label={`Phát âm ${item.word}`}
                    >
                      <Volume2 className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                    </button>
                  </div>

                  {/* IPA & Part of Speech */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-50/70 px-2 py-0.5 rounded-lg border border-emerald-200/50">
                      {item.ipa}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {item.partOfSpeech}
                    </span>
                  </div>

                  {/* English Definition */}
                  <p className="text-sm font-bold text-slate-700 mb-3">
                    {item.englishMeaning}
                  </p>

                  {/* Example Box */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800 vn-diacritic-safe">
                      "{item.exampleVi}"
                    </p>
                    <p className="italic text-slate-400 mt-0.5">
                      "{item.exampleEn}"
                    </p>
                  </div>
                </div>

                {/* Footer Topic Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Chủ đề: {item.topic}</span>
                  <span className="text-emerald-600 font-bold">{item.cefrLevel}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredList.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-400 font-bold text-base">
              Không tìm thấy từ vựng phù hợp với bộ lọc.
            </p>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};
