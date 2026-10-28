import axiosClient from '@/infrastructure/api/axiosClient';

const STORAGE_PREFIX = 'hola_ai_coach_';

function getSessionKey(courseId, lessonId) {
  return `${STORAGE_PREFIX}session_${courseId}_${lessonId}`;
}

function getCachedSessionId(courseId, lessonId) {
  return localStorage.getItem(getSessionKey(courseId, lessonId));
}

function cacheSessionId(courseId, lessonId, sessionId) {
  localStorage.setItem(getSessionKey(courseId, lessonId), sessionId);
}

export const COACH_MODES = [
  {
    id: 'ask',
    labelVi: 'Hỏi đáp',
    labelEn: 'Ask',
    icon: '💬',
    descVi: 'Hỏi đáp trong phạm vi bài học',
    descEn: 'Ask questions about this lesson',
  },
  {
    id: 'summarize',
    labelVi: 'Tóm tắt',
    labelEn: 'Summarize',
    icon: '📝',
    descVi: 'Tóm tắt mục tiêu, từ vựng, ngữ pháp bài học',
    descEn: 'Summarize lesson goals, vocabulary, and grammar',
  },
  {
    id: 'explain',
    labelVi: 'Giải thích',
    labelEn: 'Explain',
    icon: '🔍',
    descVi: 'Giải thích chi tiết khái niệm, câu mẫu',
    descEn: 'Explain concepts and example sentences in detail',
  },
  {
    id: 'give_examples',
    labelVi: 'Ví dụ thêm',
    labelEn: 'Give examples',
    icon: '✨',
    descVi: 'Cho thêm ví dụ cùng trình độ',
    descEn: 'Provide extra examples for your current level',
  },
  {
    id: 'practice',
    labelVi: 'Luyện tập',
    labelEn: 'Practice',
    icon: '🎯',
    descVi: 'Luyện tập tương tác từng bước',
    descEn: 'Interactive step-by-step practice',
  },
  {
    id: 'quiz_prep',
    labelVi: 'Chuẩn bị Quiz',
    labelEn: 'Quiz prep',
    icon: '📚',
    descVi: 'Ôn tập kiến thức cần nhớ trước bài kiểm tra',
    descEn: 'Review key points before official quiz',
  },
];

export const QUICK_PROMPTS = {
  ask: {
    vi: 'Bài này dạy về chủ đề gì và có những điểm chính nào?',
    en: 'What is this lesson about and what are the key takeaways?',
  },
  summarize: {
    vi: 'Tóm tắt các điểm kiến thức cốt lõi của bài học này.',
    en: 'Summarize the core knowledge and points of this lesson.',
  },
  explain: {
    vi: 'Giải thích các từ vựng và cấu trúc quan trọng trong bài.',
    en: 'Explain the essential vocabulary and grammar patterns in this lesson.',
  },
  give_examples: {
    vi: 'Cho tôi 3 ví dụ bổ sung cùng trình độ với mẫu câu trong bài.',
    en: 'Give me 3 more example sentences matching my level for this lesson.',
  },
  practice: {
    vi: 'Hãy hỏi tôi một câu để luyện tập theo bài học này.',
    en: 'Ask me a practice question based on this lesson.',
  },
  quiz_prep: {
    vi: 'Kiểm tra xem tôi đã nắm vững kiến thức bài này để chuẩn bị làm Quiz chưa.',
    en: 'Help me review and check if I am ready for the quiz on this lesson.',
  },
};

function truncateContent(content, maxChars = 2000) {
  if (!content) return '';
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > maxChars ? plain.slice(0, maxChars) + '…' : plain;
}

const aiCourseCoachService = {
  async getOrCreateSession({ courseId, lessonId, lessonTitle }) {
    const cachedId = getCachedSessionId(courseId, lessonId);
    try {
      const params = new URLSearchParams({ courseId, lessonId });
      if (lessonTitle) params.set('lessonTitle', lessonTitle);
      const res = await axiosClient.get(`/api/ai/coach/sessions?${params}`);
      const session = res?.result ?? res?.data ?? res;
      if (session?.id) cacheSessionId(courseId, lessonId, session.id);
      return session;
    } catch (err) {
      console.warn('[AiCourseCoach] getOrCreateSession fallback:', err?.message || err);
      const stubId = cachedId || `coach-${courseId}-${lessonId}-local`;
      return { id: stubId, messages: [], mode: 'course_coach', title: `Hola AI – ${lessonTitle || ''}` };
    }
  },

  async sendMessage({ sessionId, text, coachMode = 'ask', language = 'vi', courseId, lessonId, lessonTitle, lessonContent }) {
    const lessonContentSnippet = truncateContent(lessonContent);
    const body = { text, coachMode, language, courseId, lessonId, lessonTitle, lessonContentSnippet };
    const res = await axiosClient.post(`/api/ai/coach/sessions/${sessionId}/messages`, body);
    return res?.result ?? res?.data ?? res;
  },
};

export default aiCourseCoachService;
