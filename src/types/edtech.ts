/**
 * Spring Boot REST API DTO Contracts for HolaVietnamese EdTech Platform
 * Matches standard Spring Boot REST controllers: /api/v1/lessons, /api/v1/progress, /api/v1/vocabulary
 */

export type VietnameseTone = 'NGANG' | 'HUYEN' | 'SAC' | 'HOI' | 'NGA' | 'NANG';

export type ExerciseType =
  | 'FLASHCARD'
  | 'WORD_BANK'
  | 'TONE_PRACTICE'
  | 'MULTIPLE_CHOICE'
  | 'DICTATION'
  | 'MINIMAL_PAIRS';

export interface UserProgressDTO {
  userId: string;
  userName: string;
  avatarUrl?: string;
  streakDays: number;
  streakActiveToday: boolean;
  xpTotal: number;
  xpToday: number;
  dailyGoalXp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  currentUnitId: string;
  currentLessonId: string;
  completedLessonIds: string[];
}

export interface ToneInfoDTO {
  id: VietnameseTone;
  nameVi: string;
  nameEn: string;
  symbol: string;
  diacriticName: string;
  descriptionEn: string;
  pitchContour: number[]; // Array of pitch values (1-5 scale) representing pitch frequency curve over time
  mnemonicTip: string;
  sampleWord: string;
  sampleIpa: string;
  sampleMeaning: string;
  audioSampleKey: string;
}

export interface FlashcardDataDTO {
  vietnameseWord: string;
  ipa: string;
  englishMeaning: string;
  partOfSpeech: string;
  tone: VietnameseTone;
  exampleSentenceVi: string;
  exampleSentenceEn: string;
  notesForForeigners?: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface WordBankToken {
  id: string;
  text: string;
  meaningEn?: string;
}

export interface WordBankDataDTO {
  promptEn: string;
  sentenceViTarget: string[]; // Correct ordered word sequence
  tokens: WordBankToken[];    // Bank of words including distractors
  translationEn: string;
  grammarNote?: string;
}

export interface TonePracticeDataDTO {
  baseSyllable: string; // e.g., "ma"
  targetTone: VietnameseTone;
  targetWord: string;   // e.g., "má" (mother/cheek)
  targetMeaningEn: string;
  options: {
    tone: VietnameseTone;
    word: string;
    meaningEn: string;
    ipa: string;
  }[];
  explanation: string;
}

export interface DictationDataDTO {
  audioPromptTextVi: string;
  targetSentenceVi: string;
  acceptableAlternatives?: string[];
  translationEn: string;
  wordCount: number;
  hint?: string;
  notesForForeigners?: string;
}

export interface MinimalPairItemDTO {
  word: string;
  tone: VietnameseTone;
  ipa: string;
  meaningEn: string;
  exampleVi: string;
  exampleEn: string;
}

export interface MinimalPairDTO {
  id: string;
  title: string;
  contrastFocus: string;
  explanationEn: string;
  itemA: MinimalPairItemDTO;
  itemB: MinimalPairItemDTO;
  quizTargetItem?: 'A' | 'B';
}

export interface QuestionDTO {
  id: string;
  orderIndex: number;
  type: ExerciseType;
  prompt: string;
  promptVi?: string;
  data: FlashcardDataDTO | WordBankDataDTO | TonePracticeDataDTO | any;
  xpValue: number;
}

export interface LessonResponse {
  id: string;
  unitId: string;
  unitTitle: string;
  unitNumber: number;
  title: string;
  titleVi: string;
  description: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2';
  totalQuestions: number;
  questions: QuestionDTO[];
  createdAt?: string;
}

export interface DailyChallengeDTO {
  id: string;
  title: string;
  description: string;
  currentCount: number;
  targetCount: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  iconName: 'zap' | 'flame' | 'book' | 'volume-2';
}

export interface LearningPathNodeDTO {
  id: string;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  titleVi: string;
  description: string;
  cefrLevel: string;
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED';
  stars: number; // 0 to 3 stars
  xpReward: number;
  type: 'LESSON' | 'TONE_DRILL' | 'CHEST' | 'CHECKPOINT';
}

export interface LearningUnitDTO {
  id: string;
  unitNumber: number;
  title: string;
  titleVi: string;
  themeColor: string;
  description: string;
  nodes: LearningPathNodeDTO[];
}

export interface VocabularyItemDTO {
  id: string;
  word: string;
  ipa: string;
  tone: VietnameseTone;
  partOfSpeech: string;
  englishMeaning: string;
  topic: string;
  cefrLevel: 'A1' | 'A2' | 'B1';
  exampleVi: string;
  exampleEn: string;
  audioUrl?: string;
  bookmarked: boolean;
  masteryPercentage: number;
}
