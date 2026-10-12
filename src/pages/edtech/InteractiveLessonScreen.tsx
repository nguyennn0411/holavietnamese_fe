import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { LessonResponse, QuestionDTO, VietnameseTone, WordBankToken } from '@/types/edtech';
import { LessonHeader } from '@/components/edtech/lesson/LessonHeader';
import { BottomActionBar, FeedbackState } from '@/components/edtech/lesson/BottomActionBar';
import { FlashcardExercise } from '@/components/edtech/exercises/FlashcardExercise';
import { WordBankExercise } from '@/components/edtech/exercises/WordBankExercise';
import { TonePracticeExercise } from '@/components/edtech/exercises/TonePracticeExercise';
import { DictationExercise } from '@/components/edtech/exercises/DictationExercise';
import { MinimalPairsComparator, COMMON_MINIMAL_PAIRS } from '@/components/edtech/ui/MinimalPairsComparator';
import { LessonCompleteModal } from '@/components/edtech/lesson/LessonCompleteModal';
import { audioFeedback } from '@/utils/audioFeedback';

// High-fidelity Mock Lesson matching Spring Boot DTO contract
export const MOCK_LESSON: LessonResponse = {
  id: 'lesson-a1-coffee-and-tones',
  unitId: 'unit-1-street-food',
  unitTitle: 'Ẩm thực & Đời sống đường phố',
  unitNumber: 1,
  title: 'Cà phê sữa đá & Thanh điệu',
  titleVi: 'Gọi cà phê & Nhận diện dấu thanh',
  description: 'Học cách gọi món cà phê phổ biến nhất Việt Nam và làm chủ 6 thanh điệu cơ bản.',
  cefrLevel: 'A1',
  totalQuestions: 5,
  questions: [
    {
      id: 'q1-flashcard-pho',
      orderIndex: 0,
      type: 'FLASHCARD',
      prompt: 'Học từ vựng mới: Món ăn quốc hồn quốc túy',
      xpValue: 15,
      data: {
        vietnameseWord: 'Phở',
        ipa: '/fəː˧˩˨/',
        englishMeaning: 'Vietnamese Traditional Noodle Soup',
        partOfSpeech: 'Danh từ (Noun)',
        tone: 'HOI',
        exampleSentenceVi: 'Cho tôi một bát phở bò tái.',
        exampleSentenceEn: 'Please give me a bowl of rare beef pho.',
        notesForForeigners: 'Dấu hỏi (?) phát âm như bạn đang thắc mắc "Really?". Đừng nhầm với "phố" (street)!',
      },
    },
    {
      id: 'q2-wordbank-coffee',
      orderIndex: 1,
      type: 'WORD_BANK',
      prompt: 'Dịch câu gọi đồ uống sang tiếng Việt',
      xpValue: 20,
      data: {
        promptEn: 'I would like an iced milk coffee please',
        sentenceViTarget: ['Cho', 'tôi', 'một', 'ly', 'cà phê', 'sữa', 'đá'],
        translationEn: 'Give me a glass of iced milk coffee please',
        grammarNote: '"Cho tôi..." là cấu trúc lịch sự, tự nhiên nhất của người Việt khi gọi đồ ăn/uống.',
        tokens: [
          { id: 't1', text: 'Cho' },
          { id: 't2', text: 'tôi' },
          { id: 't3', text: 'một' },
          { id: 't4', text: 'ly' },
          { id: 't5', text: 'cà phê' },
          { id: 't6', text: 'sữa' },
          { id: 't7', text: 'đá' },
          { id: 't8', text: 'nóng' },
          { id: 't9', text: 'trà' },
        ],
      },
    },
    {
      id: 'q3-dictation-cam-on',
      orderIndex: 2,
      type: 'DICTATION',
      prompt: 'Nghe phát âm và gõ lại câu tiếng Việt',
      xpValue: 25,
      data: {
        audioPromptTextVi: 'Cảm ơn bạn rất nhiều',
        targetSentenceVi: 'Cảm ơn bạn rất nhiều',
        acceptableAlternatives: ['Cảm ơn bạn', 'Cam on ban rat nhieu'],
        translationEn: 'Thank you very much',
        wordCount: 5,
        hint: 'Bắt đầu bằng lời cảm ơn lịch sự.',
        notesForForeigners: 'Dùng bàn phím ảo bên dưới để gõ chữ "ả" trong "Cảm" và "ớ" trong "ơn".',
      },
    },
    {
      id: 'q4-tone-practice-ma',
      orderIndex: 3,
      type: 'TONE_PRACTICE',
      prompt: 'Phân biệt 6 thanh điệu với âm "ma"',
      xpValue: 25,
      data: {
        baseSyllable: 'ma',
        targetTone: 'SAC',
        targetWord: 'má',
        targetMeaningEn: 'Mother / Cheek',
        explanation: 'Thanh sắc mang cao độ vút lên cao (Rising pitch 3-5), phát âm dứt khoát như khi bạn ngạc nhiên.',
        options: [
          { tone: 'NGANG', word: 'ma', meaningEn: 'Ghost', ipa: '/maː˧˧/' },
          { tone: 'HUYEN', word: 'mà', meaningEn: 'But / That', ipa: '/maː˨˩/' },
          { tone: 'SAC', word: 'má', meaningEn: 'Mother / Cheek', ipa: '/maː˧˥/' },
          { tone: 'HOI', word: 'mả', meaningEn: 'Grave', ipa: '/maː˧˩˨/' },
          { tone: 'NGA', word: 'mã', meaningEn: 'Horse / Code', ipa: '/maː˧ˀ˥/' },
          { tone: 'NANG', word: 'mạ', meaningEn: 'Rice seedling', ipa: '/maː˨˩ˀ/' },
        ],
      },
    },
    {
      id: 'q5-minimal-pairs-contrast',
      orderIndex: 4,
      type: 'MINIMAL_PAIRS',
      prompt: 'Phân biệt cặp thanh điệu dễ nhầm: Hỏi (?) vs Ngã (~)',
      xpValue: 30,
      data: COMMON_MINIMAL_PAIRS[0], // 'mả' vs 'mã'
    },
  ],
};

export const InteractiveLessonScreen: React.FC = () => {
  const navigate = useNavigate();

  // Lesson State
  const [lesson] = useState<LessonResponse>(MOCK_LESSON);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Exercise Specific States
  // 1. Flashcard: flipped or acknowledged
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // 2. Word Bank: selected tokens
  const [selectedWordTokenIds, setSelectedWordTokenIds] = useState<string[]>([]);

  // 3. Tone Practice: selected tone
  const [selectedTone, setSelectedTone] = useState<VietnameseTone | null>(null);

  // 4. Dictation: user input text
  const [dictationInput, setDictationInput] = useState<string>('');

  // 5. Minimal Pairs: user selected choice ('A' | 'B')
  const [selectedMinimalPairChoice, setSelectedMinimalPairChoice] = useState<'A' | 'B' | null>(null);

  const currentQuestion: QuestionDTO = lesson.questions[currentIndex];

  // Determine if the current question is ready to be checked
  const canCheckAnswer = (): boolean => {
    if (isAnswerChecked) return false;

    switch (currentQuestion.type) {
      case 'FLASHCARD':
        return true;
      case 'WORD_BANK':
        return selectedWordTokenIds.length > 0;
      case 'TONE_PRACTICE':
        return selectedTone !== null;
      case 'DICTATION':
        return dictationInput.trim().length > 0;
      case 'MINIMAL_PAIRS':
        return selectedMinimalPairChoice !== null;
      default:
        return false;
    }
  };

  // Handle Verify Answer
  const handleCheckAnswer = () => {
    if (!canCheckAnswer()) return;

    let isCorrect = false;
    let feedbackObj: FeedbackState;

    switch (currentQuestion.type) {
      case 'FLASHCARD': {
        isCorrect = true;
        feedbackObj = {
          status: 'correct',
          messageVi: 'Rất tốt!',
          messageEn: 'Vocabulary learned',
          xpGained: currentQuestion.xpValue,
        };
        break;
      }
      case 'WORD_BANK': {
        const wordBankData = currentQuestion.data;
        const currentAssembled = selectedWordTokenIds
          .map((id) => wordBankData.tokens.find((t: WordBankToken) => t.id === id)?.text)
          .filter(Boolean);

        isCorrect =
          currentAssembled.length === wordBankData.sentenceViTarget.length &&
          currentAssembled.every((val, i) => val === wordBankData.sentenceViTarget[i]);

        if (isCorrect) {
          feedbackObj = {
            status: 'correct',
            messageVi: 'Chính xác tuyệt đối!',
            messageEn: 'Perfect translation',
            xpGained: currentQuestion.xpValue,
          };
        } else {
          feedbackObj = {
            status: 'incorrect',
            messageVi: 'Chưa chính xác!',
            messageEn: 'Keep trying',
            correctAnswerText: wordBankData.sentenceViTarget.join(' '),
            explanation: wordBankData.grammarNote,
          };
        }
        break;
      }
      case 'TONE_PRACTICE': {
        const toneData = currentQuestion.data;
        isCorrect = selectedTone === toneData.targetTone;

        if (isCorrect) {
          feedbackObj = {
            status: 'correct',
            messageVi: 'Tuyệt vời! Bạn nhận diện thanh điệu rất chuẩn!',
            messageEn: 'Sharp tone ear',
            xpGained: currentQuestion.xpValue,
          };
        } else {
          feedbackObj = {
            status: 'incorrect',
            messageVi: 'Chưa đúng thanh điệu!',
            messageEn: 'Pitch mismatch',
            correctAnswerText: `${toneData.targetWord} (${toneData.targetTone})`,
            explanation: toneData.explanation,
          };
        }
        break;
      }
      case 'DICTATION': {
        const dictData = currentQuestion.data;
        const normalize = (str: string) =>
          str.trim().toLowerCase().replace(/[.,!?;:]+$/, '').replace(/\s+/g, ' ');

        const userNorm = normalize(dictationInput);
        const targetNorm = normalize(dictData.targetSentenceVi);
        const altsNorm = (dictData.acceptableAlternatives || []).map(normalize);

        isCorrect = userNorm === targetNorm || altsNorm.includes(userNorm);

        if (isCorrect) {
          feedbackObj = {
            status: 'correct',
            messageVi: 'Chính xác! Bạn nghe và gõ rất chuẩn!',
            messageEn: 'Sharp listening & typing',
            xpGained: currentQuestion.xpValue,
          };
        } else {
          feedbackObj = {
            status: 'incorrect',
            messageVi: 'Chưa chính xác!',
            messageEn: 'Keep practicing',
            correctAnswerText: dictData.targetSentenceVi,
            explanation: dictData.notesForForeigners || `Nghĩa: "${dictData.translationEn}"`,
          };
        }
        break;
      }
      case 'MINIMAL_PAIRS': {
        const pairData = currentQuestion.data;
        const target = pairData.quizTargetItem || 'B';
        isCorrect = selectedMinimalPairChoice === target;

        const correctWord = target === 'A' ? pairData.itemA.word : pairData.itemB.word;
        const correctTone = target === 'A' ? pairData.itemA.tone : pairData.itemB.tone;

        if (isCorrect) {
          feedbackObj = {
            status: 'correct',
            messageVi: 'Xuất sắc! Bạn phân biệt thanh điệu rất nhạy bén!',
            messageEn: 'Mastered tone contrast',
            xpGained: currentQuestion.xpValue,
          };
        } else {
          feedbackObj = {
            status: 'incorrect',
            messageVi: 'Chưa chính xác!',
            messageEn: 'Tone mismatch',
            correctAnswerText: `Lựa chọn ${target}: "${correctWord}" (${correctTone})`,
            explanation: pairData.explanationEn,
          };
        }
        break;
      }
      default:
        return;
    }

    if (isCorrect) {
      audioFeedback.playSuccessChime();
      setTotalXpEarned((prev) => prev + currentQuestion.xpValue);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      audioFeedback.playErrorSound();
      setHearts((prev) => Math.max(0, prev - 1));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setFeedback(feedbackObj);
    setIsAnswerChecked(true);
  };

  // Continue to Next Question or Show Completion
  const handleContinue = () => {
    setIsAnswerChecked(false);
    setFeedback(null);
    setFlashcardFlipped(false);
    setSelectedWordTokenIds([]);
    setSelectedTone(null);
    setDictationInput('');
    setSelectedMinimalPairChoice(null);

    if (currentIndex + 1 < lesson.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsLessonFinished(true);
    }
  };

  // Word Bank Select / Remove handlers
  const handleSelectWordToken = (token: WordBankToken) => {
    setSelectedWordTokenIds((prev) => [...prev, token.id]);
  };

  const handleRemoveWordToken = (tokenId: string) => {
    setSelectedWordTokenIds((prev) => prev.filter((id) => id !== tokenId));
  };

  const handleResetWordTokens = () => {
    setSelectedWordTokenIds([]);
  };

  const handleQuitLesson = () => {
    navigate('/edtech/dashboard');
  };

  const handleFinishLesson = () => {
    navigate('/edtech/dashboard');
  };

  const handleRetryLesson = () => {
    setCurrentIndex(0);
    setHearts(5);
    setIsAnswerChecked(false);
    setFeedback(null);
    setTotalXpEarned(0);
    setCorrectAnswersCount(0);
    setIsLessonFinished(false);
    setFlashcardFlipped(false);
    setSelectedWordTokenIds([]);
    setSelectedTone(null);
    setDictationInput('');
    setSelectedMinimalPairChoice(null);
  };

  const accuracyPercent = Math.round(
    (correctAnswersCount / (lesson.questions.length || 1)) * 100
  );

  return (
    <div className="edtech-lesson min-h-screen bg-[#FFF9EE] flex flex-col justify-between antialiased selection:bg-[#F5E1D8] selection:text-[#A62A24] pb-28">
      {/* Top Header */}
      <LessonHeader
        currentIndex={currentIndex}
        totalQuestions={lesson.questions.length}
        hearts={hearts}
        onQuit={handleQuitLesson}
        onGoHome={() => navigate('/')}
      />

      {/* Main Interactive Workspace Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 flex flex-col justify-center items-center">
        <motion.div
          animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full flex justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full"
            >
              {currentQuestion.type === 'FLASHCARD' && (
                <FlashcardExercise
                  data={currentQuestion.data}
                  onFlipped={(flipped) => setFlashcardFlipped(flipped)}
                />
              )}

              {currentQuestion.type === 'WORD_BANK' && (
                <WordBankExercise
                  data={currentQuestion.data}
                  selectedTokenIds={selectedWordTokenIds}
                  onSelectToken={handleSelectWordToken}
                  onRemoveToken={handleRemoveWordToken}
                  onReset={handleResetWordTokens}
                />
              )}

              {currentQuestion.type === 'TONE_PRACTICE' && (
                <TonePracticeExercise
                  data={currentQuestion.data}
                  selectedTone={selectedTone}
                  onSelectTone={(tone) => setSelectedTone(tone)}
                />
              )}

              {currentQuestion.type === 'DICTATION' && (
                <DictationExercise
                  data={currentQuestion.data}
                  userInput={dictationInput}
                  onInputChange={(val) => setDictationInput(val)}
                  isChecked={isAnswerChecked}
                  isCorrect={feedback?.status === 'correct'}
                />
              )}

              {currentQuestion.type === 'MINIMAL_PAIRS' && (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full max-w-3xl text-left mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                      Thử thách đối chiếu thanh điệu • Tone Contrast Challenge
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 mt-2">
                      Nghe và bấm chọn: Bạn đang nghe thấy Lựa chọn A hay Lựa chọn B?
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Bấm nút loa từng bên để đối chiếu biểu đồ cao độ trước khi chọn.
                    </p>
                  </div>

                  <MinimalPairsComparator
                    initialPairId={currentQuestion.data.id}
                    isQuizMode={true}
                    selectedQuizChoice={selectedMinimalPairChoice}
                    onQuizSelect={(choice) => setSelectedMinimalPairChoice(choice)}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <BottomActionBar
        canCheck={canCheckAnswer()}
        isChecked={isAnswerChecked}
        feedback={feedback}
        onCheck={handleCheckAnswer}
        onContinue={handleContinue}
      />

      {/* Lesson Complete Celebration Modal */}
      {isLessonFinished && (
        <LessonCompleteModal
          xpEarned={totalXpEarned}
          accuracy={accuracyPercent}
          streakDays={7}
          onFinish={handleFinishLesson}
          onRetry={handleRetryLesson}
          onGoHome={() => navigate('/')}
        />
      )}
    </div>
  );
};
