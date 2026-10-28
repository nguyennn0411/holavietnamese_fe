import axiosClient from '@/infrastructure/api/axiosClient';

// AI Tutor Service supporting 7 modes:
// Tutor, Grammar, Translation, Conversation, Culture Guide, Travel, Regional Vietnamese

export const TUTOR_MODES = [
  {
    id: 'tutor',
    name: 'Tutor',
    nameEn: 'Tutor',
    title: 'Gia sư toàn diện',
    titleEn: 'Comprehensive Tutor',
    icon: '🎓',
    badge: 'Toàn diện',
    badgeEn: 'Comprehensive',
    color: '#245c48',
    bg: '#edf4ef',
    description: 'Hỏi đáp mọi thắc mắc về tiếng Việt: giải thích từ vựng, ngữ pháp, ngữ cảnh và cách dùng tự nhiên.',
    descriptionEn: 'Ask any question about Vietnamese: vocabulary, grammar explanations, context, and natural usage.',
    placeholder: 'Hỏi bất kỳ điều gì về tiếng Việt (ví dụ: "Phân biệt từ \'được\' và \'bị\'")',
    placeholderEn: 'Ask anything about Vietnamese (e.g. "Difference between \'được\' and \'bị\'")',
    quickPrompts: [
      'Giải thích sự khác nhau giữa "được" và "bị"',
      'Cách sử dụng hệ thống đại từ xưng hô tiếng Việt (anh, chị, em, cô, chú...)',
      'Làm thế nào để phân biệt dấu hỏi (?) và dấu ngã (~)?',
      'Cho tôi 5 cách chào hỏi thông dụng ngoài "Xin chào"',
    ],
    quickPromptsEn: [
      'Explain the difference between "được" and "bị"',
      'How to use Vietnamese kinship pronouns (anh, chị, em, cô, chú...)',
      'How to distinguish between hỏi (?) and ngã (~) tones?',
      'Give me 5 common Vietnamese greetings besides "Xin chào"',
    ],
  },
  {
    id: 'grammar',
    name: 'Grammar',
    nameEn: 'Grammar',
    title: 'Ngữ pháp & Sửa câu',
    titleEn: 'Grammar & Correction',
    icon: '📝',
    badge: 'Chuyên sâu',
    badgeEn: 'In-Depth',
    color: '#8b4513',
    bg: '#fcf3eb',
    description: 'Sửa lỗi ngữ pháp, cải thiện câu văn, giải thích trật tự từ và các cấu trúc câu tiếng Việt chuẩn xác.',
    descriptionEn: 'Grammar error checking, sentence improvement, word order explanations, and standard syntax.',
    placeholder: 'Nhập câu tiếng Việt của bạn để kiểm tra và sửa lỗi...',
    placeholderEn: 'Enter your Vietnamese sentence to check and correct...',
    quickPrompts: [
      'Sửa giúp tôi câu: "Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."',
      'Cấu trúc so sánh hơn và so sánh nhất trong tiếng Việt',
      'Cách dùng đúng các từ nối: "tuy... nhưng", "vì... nên", "nếu... thì"',
      'Tại sao người Việt nói "nhà tôi có 3 người" mà không dùng từ "tồn tại"?',
    ],
    quickPromptsEn: [
      'Correct my sentence: "Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."',
      'Comparative and superlative structures in Vietnamese',
      'How to properly use conjunctions: "tuy... nhưng", "vì... nên", "nếu... thì"',
      'Why do Vietnamese say "nhà tôi có 3 người" instead of "exist"?',
    ],
  },
  {
    id: 'translation',
    name: 'Translation',
    nameEn: 'Translation',
    title: 'Dịch thuật ngữ cảnh',
    titleEn: 'Contextual Translation',
    icon: '🌐',
    badge: '2 chiều',
    badgeEn: '2-Way',
    color: '#1a5f7a',
    bg: '#e8f4f8',
    description: 'Dịch chuẩn xác giữa tiếng Việt và tiếng Anh/ngoại ngữ, kèm phân tích sắc thái biểu đạt và từ tương đương.',
    descriptionEn: 'Accurate translation between Vietnamese and English/other languages with nuanced expressions.',
    placeholder: 'Nhập câu hoặc đoạn văn cần dịch (tiếng Việt hoặc tiếng Anh)...',
    placeholderEn: 'Enter text to translate (Vietnamese or English)...',
    quickPrompts: [
      'Dịch sang tiếng Việt tự nhiên: "Could you please make it less spicy for me?"',
      'Từ "duyên" trong tiếng Việt dịch sang tiếng Anh thế nào cho trọn nghĩa?',
      'Dịch lịch sự câu từ chối lời mời ăn tối: "Cảm ơn bạn, nhưng tối nay tôi có việc bận mất rồi."',
      'Cách nói "I feel at home here" bằng tiếng Việt mộc mạc nhất',
    ],
    quickPromptsEn: [
      'Natural Vietnamese translation: "Could you please make it less spicy for me?"',
      'How to translate the cultural word "duyên" into English?',
      'Politely decline a dinner invite: "Cảm ơn bạn, nhưng tối nay tôi có việc bận mất rồi."',
      'How to say "I feel at home here" most naturally in Vietnamese?',
    ],
  },
  {
    id: 'conversation',
    name: 'Conversation',
    nameEn: 'Conversation',
    title: 'Luyện hội thoại phản xạ',
    titleEn: 'Conversational Fluency',
    icon: '💬',
    badge: 'Giao tiếp',
    badgeEn: 'Speaking',
    color: '#2e7d32',
    bg: '#edf7ed',
    description: 'Trò chuyện 2 chiều tự nhiên như người bản xứ. AI sẽ đóng vai bạn trò chuyện và gợi ý câu trả lời.',
    descriptionEn: 'Interactive 2-way conversation practice. AI acts as a native partner and suggests natural responses.',
    placeholder: 'Gõ tin nhắn để bắt đầu trò chuyện cùng Hola AI...',
    placeholderEn: 'Type a message to start chatting with Hola AI...',
    quickPrompts: [
      'Chào bạn! Hôm nay thời tiết ở chỗ bạn thế nào?',
      'Hãy đóng vai một người bạn Việt Nam rủ tôi đi cà phê trứng cuối tuần.',
      'Luyện tập đối thoại: Lần đầu tiên gặp gỡ và làm quen tại lớp học',
      'Gợi ý cho tôi các chủ đề nói chuyện phiếm (small talk) quen thuộc của người Việt',
    ],
    quickPromptsEn: [
      'Hi there! How is the weather where you are today?',
      'Roleplay as a Vietnamese friend inviting me for egg coffee this weekend.',
      'Dialogue practice: First time meeting and introducing oneself in class',
      'Suggest common Vietnamese small-talk topics',
    ],
  },
  {
    id: 'culture_guide',
    name: 'Culture Guide',
    nameEn: 'Culture Guide',
    title: 'Chỉ dẫn văn hóa',
    titleEn: 'Cultural Guide',
    icon: '🏮',
    badge: 'Phong tục',
    badgeEn: 'Customs',
    color: '#9f2d20',
    bg: '#fcedeb',
    description: 'Khám phá văn hóa, phong tục, nghi lễ, thói quen sinh hoạt và các quy tắc ứng xử tế nhị của người Việt.',
    descriptionEn: 'Explore Vietnamese culture, customs, traditions, lifestyle, and social etiquette.',
    placeholder: 'Hỏi về phong tục, văn hóa, ngày lễ hoặc cách cư xử Việt Nam...',
    placeholderEn: 'Ask about Vietnamese culture, customs, festivals, or social etiquette...',
    quickPrompts: [
      'Quy tắc ứng xử khi được mời đến nhà người Việt dùng cơm',
      'Ý nghĩa của mâm ngũ quả và tục xông đất ngày Tết Nguyên Đán',
      'Tại sao người Việt hay hỏi "Ăn cơm chưa?" khi chào nhau?',
      'Những điều nên và không nên làm khi vào thăm chùa chiền ở Việt Nam',
    ],
    quickPromptsEn: [
      'Dining etiquette when invited to a Vietnamese home',
      'Significance of the five-fruit tray and Tết first-footer tradition',
      'Why do Vietnamese ask "Have you eaten?" as a greeting?',
      'Dos and Don\'ts when visiting pagodas and temples in Vietnam',
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    nameEn: 'Travel',
    title: 'Du lịch & Sinh tồn',
    titleEn: 'Travel & Survival',
    icon: '✈️',
    badge: 'Thực tế',
    badgeEn: 'Practical',
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Các mẫu câu và tình huống du lịch sinh tồn: hỏi đường, mặc cả giá, đặt phòng, gọi món ăn đường phố.',
    descriptionEn: 'Essential phrases and survival skills: directions, bargaining, booking rooms, street food.',
    placeholder: 'Cần hỗ trợ tình huống du lịch nào tại Việt Nam?',
    placeholderEn: 'Need travel phrases or survival help in Vietnam?',
    quickPrompts: [
      'Mẫu câu hỏi đường và bắt xe ôm/taxi khi đi du lịch',
      'Cách mặc cả lịch sự nhưng hiệu quả tại chợ đêm hoặc chợ Bến Thành',
      'Các câu tiếng Việt cần thiết khi vào quán phở/bún bò gọi món theo sở thích',
      'Cách nói khi tôi bị dị ứng đậu phộng hoặc hải sản',
    ],
    quickPromptsEn: [
      'Asking for directions and taking a motorbike taxi / Grab',
      'How to bargain politely and effectively at night markets or Bến Thành market',
      'Essential Vietnamese phrases when ordering at a phở/bún bò stall',
      'How to say I am allergic to peanuts or seafood',
    ],
  },
  {
    id: 'regional',
    name: 'Regional Vietnamese',
    nameEn: 'Regional Vietnamese',
    title: 'Tiếng Việt vùng miền',
    titleEn: 'Regional Vietnamese',
    icon: '🗺️',
    badge: 'Bắc • Trung • Nam',
    badgeEn: 'North • Central • South',
    color: '#7c3aed',
    bg: '#f3e8ff',
    description: 'Tìm hiểu từ vựng, ngữ điệu và cách dùng từ đặc trưng của 3 miền Bắc - Trung - Nam Việt Nam.',
    descriptionEn: 'Learn dialect words, accents, and unique expressions of Northern, Central, and Southern Vietnam.',
    placeholder: 'Tìm hiểu từ địa phương hoặc ngữ điệu vùng miền (Bắc/Trung/Nam)...',
    placeholderEn: 'Explore regional slang, dialects, or accents (North/Central/South)...',
    quickPrompts: [
      'So sánh từ vựng hàng ngày giữa miền Bắc và miền Nam (muỗng - thìa, heo - lợn...)',
      'Giải thích các từ địa phương miền Trung đặc trưng: "mô, tê, răng, rứa"',
      'Đại từ nhân xưng thân mật ở miền Tây Nam Bộ: "chế", "hai", "út", "tía"',
      'Khác biệt giữa từ "chè" ở miền Bắc (uống) và miền Nam (món tráng miệng)',
    ],
    quickPromptsEn: [
      'Daily vocabulary differences between Northern and Southern Vietnam (spoon, pork...)',
      'Explain unique Central dialect words: "mô, tê, răng, rứa"',
      'Affectionate pronouns in the Mekong Delta: "chế", "hai", "út", "tía"',
      'Difference between "chè" in the North (tea) vs the South (sweet dessert)',
    ],
  },
];

const LEGACY_STORAGE_KEY = 'hola_ai_tutor_sessions_v1';
const LEGACY_ACTIVE_SESSION_KEY = 'hola_ai_tutor_active_id_v1';
const LEGACY_MINI_DAILY_SESSION_KEY = 'hola_ai_tutor_mini_daily_v1';

const STORAGE_KEY_PREFIX = 'hola_ai_tutor_sessions_v2_';
const ACTIVE_SESSION_KEY_PREFIX = 'hola_ai_tutor_active_id_v2_';
const MINI_DAILY_SESSION_KEY_PREFIX = 'hola_ai_tutor_mini_daily_v2_';

export const getCurrentUserStorageKey = () => {
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      const idCandidate = parsed?.userId ?? parsed?.id ?? parsed?.username ?? parsed?.email;
      if (idCandidate !== undefined && idCandidate !== null && String(idCandidate).trim()) {
        return String(idCandidate).trim().toLowerCase();
      }
    }
    const directUserId = localStorage.getItem('userId') || localStorage.getItem('username');
    if (directUserId && directUserId.trim()) {
      return directUserId.trim().toLowerCase();
    }
    const token = localStorage.getItem('token');
    if (token && token.includes('.')) {
      const payloadPart = token.split('.')[1];
      const json = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(json);
      const subCandidate = payload?.userId ?? payload?.sub;
      if (subCandidate !== undefined && subCandidate !== null && String(subCandidate).trim()) {
        return String(subCandidate).trim().toLowerCase();
      }
    }
  } catch {
    // fallback to guest
  }
  return 'guest';
};

const getStorageKey = () => `${STORAGE_KEY_PREFIX}${getCurrentUserStorageKey()}`;
const getActiveSessionKey = () => `${ACTIVE_SESSION_KEY_PREFIX}${getCurrentUserStorageKey()}`;
const getMiniDailySessionKey = () => `${MINI_DAILY_SESSION_KEY_PREFIX}${getCurrentUserStorageKey()}`;
const getWelcomeSessionId = () => `session-welcome-${getCurrentUserStorageKey()}`;
const isWelcomeSessionId = (id) => typeof id === 'string' && (id === 'session-welcome' || id.startsWith('session-welcome-'));

export const getLocalDateKey = (value = new Date()) => {
  const d = value instanceof Date ? value : new Date(value);
  const target = Number.isNaN(d.getTime()) ? new Date() : d;
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
};
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'openrouter/free';
const ALLOW_OFFLINE_AI_FALLBACK = import.meta.env.VITE_AI_ALLOW_OFFLINE_FALLBACK === 'true';
const AI_REQUEST_TIMEOUT_MS = Math.max(
  5000,
  Number(import.meta.env.VITE_AI_REQUEST_TIMEOUT_MS) || 60000,
);
const AI_SETTINGS_STORAGE_KEY = 'hola_admin_ai_settings_v1';
const pendingSessionCreations = new Map();

const getMaxTurnsPerSession = () => {
  try {
    const settings = JSON.parse(localStorage.getItem(AI_SETTINGS_STORAGE_KEY) || '{}');
    return Math.max(1, Number(settings?.limits?.maxTurnsPerSession) || 25);
  } catch {
    return 25;
  }
};

// Backend deployments may wrap the payload in `result` or `data`, and older
// AI handlers may call the generated text `content`, `answer`, or `reply`.
// Normalize those shapes here so a valid BE response is not mistaken for a
// failed request and replaced by the local demo engine.
const unwrapAiPayload = (response) => response?.result ?? response?.data ?? response ?? {};

const parseJsonTextPayload = (value) => {
  if (typeof value !== 'string') return null;

  const candidate = value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  if (!(candidate.startsWith('{') && candidate.endsWith('}'))) return null;

  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const getAiText = (payload) => (
  payload?.text
  ?? payload?.content
  ?? payload?.answer
  ?? payload?.reply
  ?? payload?.message?.text
  ?? payload?.choices?.[0]?.message?.content
  ?? payload?.choices?.[0]?.text
  ?? payload?.output_text
  ?? payload?.output?.[0]?.content?.[0]?.text
  ?? null
);

const normalizeAiPayload = (payload) => {
  const directPayload = parseJsonTextPayload(payload);
  if (directPayload) return normalizeAiPayload(directPayload);

  const rawText = getAiText(payload);
  if (typeof rawText !== 'string') return payload;

  const parsedTextPayload = parseJsonTextPayload(rawText);
  if (parsedTextPayload && (parsedTextPayload.text || parsedTextPayload.content || parsedTextPayload.answer || parsedTextPayload.reply)) {
    return {
      ...payload,
      ...parsedTextPayload,
      text: parsedTextPayload.text
        || parsedTextPayload.content
        || parsedTextPayload.answer
        || parsedTextPayload.reply,
    };
  }

  return payload;
};

const isSessionLimitError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('số lượt trao đổi tối đa')
    || message.includes('so luot trao doi toi da')
    || message.includes('maximum number of turns')
    || message.includes('maximum turns')
    || message.includes('conversation limit');
};

export const detectInputLanguage = (text = '') => {
  const trimmed = String(text || '').trim();
  if (!trimmed) return 'vi';
  const hasViDiacritics = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(trimmed);
  const tokens = trimmed
    .toLowerCase()
    .replace(/[^a-zàáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ\s]/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const enWords = new Set([
    'hello', 'hi', 'hey', 'what', 'whats', 'how', 'why', 'where', 'when', 'who', 'which',
    'can', 'could', 'would', 'should', 'will', 'please', 'thank', 'thanks',
    'help', 'tell', 'explain', 'define', 'pronounce', 'pronunciation', 'mean', 'means', 'meaning',
    'translate', 'translation', 'difference', 'between', 'about', 'want', 'need', 'like', 'know',
    'speak', 'learn', 'learning', 'vietnamese', 'english', 'good', 'morning', 'afternoon', 'evening', 'night',
    'much', 'many', 'price', 'cost', 'order', 'food', 'coffee', 'drink', 'eat',
    'is', 'are', 'am', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had',
    'my', 'your', 'his', 'her', 'our', 'their', 'this', 'that', 'these', 'those',
    'with', 'for', 'from', 'to', 'in', 'of', 'the', 'a', 'an', 'and', 'or', 'but',
    'i', 'you', 'we', 'they', 'he', 'she', 'it', 'me', 'us', 'them', 'say', 'said', 'use', 'sentence', 'example',
  ]);
  const viQuestionOrFunctionWords = new Set([
    'xin', 'chao', 'ban', 'toi', 'minh', 'anh', 'chi', 'em', 'chau', 'bac',
    'khong', 'duoc', 'chua', 'nhung', 'nhu', 'the', 'nao', 'bao', 'nhieu', 'tien',
    'lam', 'on', 'giup', 'voi', 'nhe', 'nha', 'vang', 'cam', 'ngon', 'qua',
    'muon', 'hoc', 'tieng', 'viet', 'nghia', 'la', 'gi', 'sao', 'vay', 'ha', 'nhi',
  ]);

  let enCount = 0;
  let viFuncCount = 0;
  tokens.forEach(t => {
    const unacc = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    if (enWords.has(t)) enCount += 1;
    if (viQuestionOrFunctionWords.has(unacc) && !enWords.has(t)) viFuncCount += 1;
  });

  if (hasViDiacritics) {
    return (enCount >= 1 && enCount >= viFuncCount) ? 'en' : 'vi';
  }
  if (enCount > 0 && enCount >= viFuncCount) return 'en';
  if (viFuncCount > 0) return 'vi';
  return /^[a-z0-9\s?,!.'"-]+$/i.test(trimmed) ? 'en' : 'vi';
};

export const enforceLanguageConsistency = (value, lang = 'vi') => {
  if (typeof value !== 'string' || !value.trim()) return value;
  if (lang === 'en') {
    return value
      .replace(/\(đi tới chỗ bơi để chơi trong nước\)/gi, '(to go to a swimming place to play in the water)')
      .replace(/\*\*Ví dụ(?:\s+minh họa)?:\*\*/gi, '**Example:**')
      .replace(/\bVí dụ(?:\s+minh họa)?:/gi, 'Example:')
      .replace(/\*\*Giải thích:\*\*/gi, '**Explanation:**')
      .replace(/\*\*Lưu ý:\*\*/gi, '**Note:**')
      .replace(/Bạn có dùng cụm từ này trong câu nào không\?\s*Hay muốn (?:tôi|mình) giúp phát âm\?/gi,
        'Have you used this phrase in any sentence? Or would you like me to help with pronunciation?')
      .replace(/Bạn có dùng từ này trong câu nào không\?\s*Hay muốn (?:tôi|mình) giúp phát âm\?/gi,
        'Have you used this word in any sentence? Or would you like me to help with pronunciation?')
      .replace(/Bạn có (?:dùng|thử dùng|thử đặt) (?:cụm )?từ này trong câu nào (?:không|chưa)\?/gi,
        'Have you used this phrase in any sentence?')
      .replace(/Bạn có muốn thử đặt câu với (?:cụm )?từ này không\?/gi,
        'Would you like to try making a sentence with this phrase?')
      .replace(/Hay (?:bạn )?muốn (?:tôi|mình) giúp (?:luyện )?phát âm(?: không)?\?/gi,
        'Or would you like me to help with pronunciation?');
  }
  return value
    .replace(/\*\*Examples?:\*\*/gi, '**Ví dụ:**')
    .replace(/^Examples?:/gim, 'Ví dụ:')
    .replace(/\*\*Explanation:\*\*/gi, '**Giải thích:**')
    .replace(/\*\*Note:\*\*/gi, '**Lưu ý:**')
    .replace(/Have you used this (?:phrase|word) in (?:any|a) sentence(?: yet)?\?\s*Or would you like(?: me to)? help with pronunciation\?/gi,
      'Bạn có dùng cụm từ này trong câu nào không? Hay muốn mình giúp phát âm?')
    .replace(/Have you (?:used|tried using) this (?:phrase|word) in (?:any|a) sentence(?: yet)?\?/gi,
      'Bạn có dùng cụm từ này trong câu nào không?')
    .replace(/Or would you like(?: me to)? help with pronunciation\?/gi,
      'Hay muốn mình giúp phát âm?');
};

const getSessionTimestamp = (session) => {
  if (!session) return 0;
  const lastMsg = Array.isArray(session.messages) && session.messages.length > 0
    ? session.messages[session.messages.length - 1]
    : null;
  const rawDate = session.updatedAt || lastMsg?.timestamp || session.createdAt;
  const time = rawDate ? new Date(rawDate).getTime() : 0;
  return Number.isNaN(time) ? 0 : time;
};

const sortSessionsByLatest = (sessions = []) => {
  if (!Array.isArray(sessions)) return [];
  return [...sessions].sort((a, b) => getSessionTimestamp(b) - getSessionTimestamp(a));
};

const normalizeSessionMessages = (sessions = []) => sessions.map(session => {
  const msgs = Array.isArray(session.messages) ? session.messages : [];
  const normalizedMessages = msgs.map((msg, idx) => {
    if (msg.sender !== 'ai' || idx === 0) return msg;
    let prevUserMsg = null;
    for (let j = idx - 1; j >= 0; j -= 1) {
      if (msgs[j]?.sender === 'user') {
        prevUserMsg = msgs[j];
        break;
      }
    }
    if (!prevUserMsg?.text) return msg;
    const lang = detectInputLanguage(prevUserMsg.text);
    return {
      ...msg,
      text: enforceLanguageConsistency(msg.text, lang),
      explanation: enforceLanguageConsistency(msg.explanation, lang),
      culturalNote: enforceLanguageConsistency(msg.culturalNote, lang),
      grammarCorrection: enforceLanguageConsistency(msg.grammarCorrection, lang),
    };
  });
  return { ...session, messages: normalizedMessages };
});

const requestAiResponse = async (sessionId, text, mode, language = null) => {
  const resolvedLang = language || detectInputLanguage(text);
  const inlineLangDirective = resolvedLang === 'en'
    ? '\n\n[Language rule: I am asking in ENGLISH. Reply 100% in ENGLISH, use "**Example:**" instead of "**Ví dụ:**", write definitions in English, and write your closing follow-up question in English (e.g., "Have you used this phrase in any sentence? Or would you like me to help with pronunciation?").]'
    : '\n\n[Quy tắc ngôn ngữ: Tôi đang hỏi bằng TIẾNG VIỆT. Hãy trả lời và giải thích 100% bằng TIẾNG VIỆT, dùng "**Ví dụ:**" (không dùng "**Example:**") và đặt câu hỏi gợi mở cuối câu bằng tiếng Việt (ví dụ: "Bạn có dùng cụm từ này trong câu nào không? Hay muốn mình giúp phát âm?").]';
  const apiRes = await axiosClient.post(
    `/api/ai/sessions/${sessionId}/messages`,
    {
      text: text.trim() + inlineLangDirective,
      mode,
      language: resolvedLang,
      provider: AI_PROVIDER,
      model: AI_MODEL,
    },
    { timeout: AI_REQUEST_TIMEOUT_MS },
  );

  return normalizeAiPayload(unwrapAiPayload(apiRes));
};

const normalizeText = (value = '') => value
  .toLocaleLowerCase('vi-VN')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .trim();

function conversationalReply(query, messages = [], lang = null) {
  const normalized = normalizeText(query);
  const lower = query.toLowerCase();
  const isEn = (lang || detectInputLanguage(query)) === 'en';

  // 0. Pronouns & Kinship Terms: "đại từ xưng hô", "xưng hô", "anh, chị, em, cô, chú"
  if (normalized.includes('dai tu xung ho') || normalized.includes('xung ho') || (normalized.includes('dai tu') && (normalized.includes('anh') || normalized.includes('em') || normalized.includes('co') || normalized.includes('chu'))) || (isEn && (lower.includes('pronoun') || lower.includes('address')))) {
    return {
      text: isEn
        ? `### 🏮 Vietnamese Kinship Pronoun System\n\nUnlike English which relies on generic *"I"* and *"you"*, Vietnamese addresses people like extended family based on relative age and social intimacy:\n\n| Person You Speak To | Call Them | Refer to Yourself As |\n| :--- | :--- | :--- |\n| **Male slightly older** | **Anh** | **Em** |\n| **Female slightly older** | **Chị** | **Em** |\n| **Someone younger** | **Em** | **Anh / Chị** |\n| **Woman parent's age** | **Cô** (or *Bác*) | **Cháu** (or *Con*) |\n| **Man parent's age** | **Chú** (or *Bác*) | **Cháu** |\n| **Elderly person** | **Ông / Bà** | **Cháu** |\n| **Peers of same age** | **Bạn / Cậu** | **Mình / Tôi / Tớ** |\n\n💡 **Golden Rule:** When shopping, dining, or asking directions, calling the other person **"Anh / Chị"** and referring to yourself as **"Em"** is always considered polite and flattering!`
        : `### 🏮 Hướng dẫn sử dụng Hệ thống Đại từ Xưng hô tiếng Việt\n\nHệ thống xưng hô là nét văn hóa đặc sắc và tinh tế bậc nhất của tiếng Việt, nơi mọi người đối đãi với nhau ấm áp như người trong một gia đình:\n\n| Người bạn nói chuyện | Gọi họ là | Tự xưng là |\n| :--- | :--- | :--- |\n| Nam lớn hơn một chút | **Anh** | **Em** |\n| Nữ lớn hơn một chút | **Chị** | **Em** |\n| Người nhỏ hơn bạn | **Em** | **Anh / Chị** |\n| Phụ nữ trạc tuổi cha mẹ | **Cô** (hoặc *Bác*) | **Cháu** (hoặc *Con*) |\n| Đàn ông trạc tuổi cha mẹ | **Chú** (hoặc *Bác*) | **Cháu** |\n| Người già ngang tuổi ông bà | **Ông / Bà** | **Cháu** |\n| Bạn bè cùng trang lứa | **Bạn / Cậu** | **Mình / Tôi / Tớ** |\n\n---\n\n💡 **Mẹo vàng giao tiếp thực tế:**\n1. **Khi vào quán xá / đi đường:** Luôn chủ động gọi người phục vụ hoặc người đối diện là **"Anh / Chị"** và xưng **"Em"** (ví dụ: *"Anh ơi cho em xem thực đơn với nhé!"*).\n2. **Kính ngữ cuối câu:** Luôn thêm chữ **"ạ"** ở cuối câu với người lớn hơn (ví dụ: *"Dạ em cảm ơn chị ạ!"*).`,
      nativeAlternative: 'Dạ anh ơi, cho em hỏi thăm đường này đi đâu ạ?',
      culturalNote: isEn
        ? 'Using kinship pronouns shows warmth, respect, and instantly bridges social distance in Vietnam.'
        : 'Xưng hô theo ngôi thứ thể hiện sự kính trọng, lễ phép và tinh thần gắn bó cộng đồng của người Việt.',
      savedWords: [
        { word: 'Đại từ xưng hô', meaning: 'Kinship pronouns / forms of address' },
        { word: 'Dạ / Ạ', meaning: 'Polite words used at start or end of sentence' },
        { word: 'Kính trên nhường dưới', meaning: 'Respecting elders and caring for youngsters' },
      ],
    };
  }

  // 1. Age error: "tôi có 20 tuổi"
  if (/.*(toi|minh|em)\s+(co|la)\s+\d+\s+tuoi.*/.test(normalized) || lower.includes('có 20 tuổi') || lower.includes('có 18 tuổi') || lower.includes('có 25 tuổi')) {
    const ageMatch = query.match(/\d+/);
    const age = ageMatch ? ageMatch[0] : '20';
    return {
      text: isEn
        ? `### 📝 Grammar Note: Stating Your Age in Vietnamese\nIn Vietnamese, when stating your age, we **do not use "có" (have)** or **"là" (am/is)**. Native speakers place the number directly after the pronoun!\n\n✨ **Natural Native Expression:**\n> **"Năm nay tôi ${age} tuổi ạ."** (or casually: *"Mình ${age} tuổi."*)\n\n💡 **Structure:** \`[Pronoun] + [năm nay] + [age] + tuổi (ạ).\``
        : `### 📝 Nhận xét ngữ pháp: Cách nói tuổi trong tiếng Việt\nTrong tiếng Việt, khi nói về số tuổi, chúng ta **không dùng từ "có"** (khác với tiếng Pháp *"J'ai 20 ans"* hay tiếng Tây Ban Nha *"Tengo 20 años"*). Người Việt nói trực tiếp số tuổi ngay sau đại từ!\n\n✨ **Cách nói tự nhiên của người bản xứ:**  \n> **"Năm nay tôi ${age} tuổi ạ."** (hoặc thân mật: *"Mình ${age} tuổi."*)\n\n💡 **Cấu trúc chuẩn:** \`[Đại từ] + [năm nay] + [số tuổi] + tuổi (ạ).\``,
      grammarCorrection: isEn
        ? "Do not use 'có' for age. Say: 'Tôi [age] tuổi'."
        : "Không dùng 'có' cho số tuổi. Người Việt nói: 'Tôi [số tuổi] tuổi'.",
      nativeAlternative: `Năm nay tôi ${age} tuổi ạ.`,
      explanation: isEn
        ? "Do not use 'có' when stating age in Vietnamese."
        : "Không dùng 'có' để nói tuổi trong tiếng Việt.",
      savedWords: [
        { word: 'Năm nay', meaning: 'This year (placed naturally before stating age)' },
        { word: 'Tuổi', meaning: 'Years old / Age' },
      ],
    };
  }

  // 2. Passive voice error with "bị" vs "được"
  if (lower.includes('bị khen') || lower.includes('bị điểm 10') || lower.includes('bị thưởng') || lower.includes('bị trúng số') || lower.includes('bị tăng lương') || (lower.includes('duoc') && lower.includes('bi'))) {
    return {
      text: isEn
        ? `### 💡 Subtle Distinction: "Được" vs "Bị"\nVietnamese uses two different passive markers depending on whether the outcome is positive or negative:\n- **"Được"**: Used for fortunate, positive, or desired experiences (e.g., being praised, receiving a reward).\n- **"Bị"**: Used for unfortunate, negative, or unwanted situations (e.g., getting sick, being fined).\n\n✨ **Natural Example:**\n> **"Hôm nay tôi được sếp khen!"** *(Today I was praised by my boss!)*`
        : `### 💡 Phân biệt tinh tế: "Được" vs "Bị"\nNgười Việt rất coi trọng việc thể hiện cảm xúc qua câu bị động:\n- **"Được"**: Dành cho điều may mắn, tốt lành hoặc được người khác khen ngợi.\n- **"Bị"**: Chỉ dùng cho điều không may, tiêu cực hoặc mang lại cảm giác khó chịu.\n\nVì vậy, khi được khen hay nhận thưởng, hãy tự hào dùng **"Được"** nhé!\n\n✨ **Câu chuẩn:**  \n> **"${query.replace(/bị/g, 'được')}"**`,
      grammarCorrection: isEn
        ? "Use 'được' for positive outcomes and 'bị' for negative ones."
        : "Sai sắc thái: Thay 'bị' bằng 'được' khi nói về điều may mắn, tích cực.",
      nativeAlternative: query.replace(/bị/g, 'được'),
      explanation: isEn
        ? "• Được: Positive/fortunate events. • Bị: Negative/unwanted events."
        : "• Được: Điều tốt đẹp, may mắn. • Bị: Rủi ro, không mong muốn.",
      savedWords: [
        { word: 'Được khen', meaning: 'To be praised (positive)' },
        { word: 'Bị phạt', meaning: 'To be penalized (negative)' },
      ],
    };
  }

  // 3. Adjective before noun: "đỏ xe", "to nhà", "đẹp áo"
  if (lower.includes('đỏ xe') || lower.includes('to nhà') || lower.includes('đẹp áo') || lower.includes('ngon phở')) {
    const fixed = query.replace('đỏ xe', 'xe đỏ').replace('to nhà', 'nhà to').replace('đẹp áo', 'áo đẹp').replace('ngon phở', 'phở ngon');
    return {
      text: isEn
        ? `### 📝 Word Order in Vietnamese\nIn Vietnamese, **Adjectives always come AFTER the Noun** they describe (the opposite of English *red car* -> *xe đỏ*).\n\n✨ **Natural Correction:**\n> **"${fixed}"**\n\n💡 **Formula:** \`[Noun] + [Adjective]\` (e.g., *xe đỏ*, *áo đẹp*, *nhà to*, *phở ngon*).`
        : `### 📝 Trật tự từ trong tiếng Việt\nTrong tiếng Việt, **Tính từ luôn đứng SAU Danh từ** để bổ nghĩa (ngược với tiếng Anh *red car* -> *xe đỏ*).\n\n✨ **Câu sửa tự nhiên:**  \n> **"${fixed}"**\n\n💡 **Công thức ghi nhớ:** \`[Danh từ] + [Tính từ]\` (ví dụ: *xe đỏ*, *áo đẹp*, *nhà to*, *phở ngon*).`,
      grammarCorrection: isEn
        ? "Word order error: Adjectives must follow the noun."
        : "Trật tự từ sai: Tính từ bổ nghĩa phải đứng sau danh từ.",
      nativeAlternative: fixed,
      explanation: isEn
        ? "Noun comes first, modifying adjective follows."
        : "Danh từ đứng trước, tính từ bổ nghĩa đứng sau.",
      savedWords: [
        { word: 'Xe đỏ', meaning: 'Red car (Noun + Adjective)' },
        { word: 'Áo đẹp', meaning: 'Beautiful clothes' },
      ],
    };
  }

  // 4. Food & Coffee
  if (normalized.includes('ca phe') || normalized.includes('coffee')) {
    return {
      text: isEn
        ? `### ☕ Vietnamese Coffee Culture\nVietnamese coffee is famous for its bold flavor! Here are the classic drinks to try:\n1. **Cà phê sữa đá** (called *Nâu đá* in the North): Phin-filtered coffee with sweet condensed milk over ice.\n2. **Cà phê đen đá**: Bold iced black coffee (you can ask for *ít đường* = less sugar).\n3. **Bạc xỉu**: Creamy and sweet (lots of milk with a splash of coffee).\n4. **Cà phê trứng**: Hanoi's iconic egg coffee topped with whipped egg yolk cream!`
        : `### ☕ Văn hóa Cà Phê Việt Nam\nCà phê Việt Nam nổi tiếng với hương vị đậm đà quyến rũ! Đây là các món cà phê kinh điển bạn nên thử:\n1. **Cà phê sữa đá** (miền Bắc gọi là *Nâu đá*): Cà phê phin hòa cùng sữa đặc ngọt béo.\n2. **Cà phê đen đá**: Dành cho người thích vị đắng nguyên bản (có thể dặn *ít đường*).\n3. **Bạc xỉu**: Ngọt ngào, nhẹ nhàng (nhiều sữa, ít cà phê).\n4. **Cà phê trứng**: Kem trứng thơm ngậy đánh bông bồng bềnh trên tách cà phê nóng Hà Nội!`,
      nativeAlternative: 'Cho mình một ly cà phê sữa đá ít ngọt nhé!',
      culturalNote: isEn
        ? 'Sitting at sidewalk cafes watching the street go by is a beloved daily ritual across Vietnam.'
        : 'Ngồi cà phê vỉa hè ngắm phố xá là thói quen thư giãn đặc trưng của người Việt từ Bắc chí Nam.',
      savedWords: [
        { word: 'Cà phê sữa đá', meaning: 'Vietnamese iced coffee with condensed milk' },
        { word: 'Bạc xỉu', meaning: 'Sweet condensed milk with light splash of coffee' },
        { word: 'Ít đường / Ít ngọt', meaning: 'Less sweet / less sugar' },
      ],
    };
  }

  // 5. Food & Pho
  if (normalized.includes('pho') || normalized.includes('banh mi')) {
    return {
      text: isEn
        ? `### 🍜 Vietnamese Street Food Guide\nTo order like a local foodie, try these natural expressions:\n- Ordering Phở: *"Cho cháu một bát phở bò tái nạm, ít hành, kèm đĩa quẩy giòn ạ!"* (One bowl of rare & flank beef pho, less scallions, with crispy dough sticks please!)\n- Ordering Bánh mì: *"Bán cho em một ổ bánh mì thập cẩm, nhiều pate, không ớt nhé chị!"* (One mixed bánh mì, extra pate, no chili please!)`
        : `### 🍜 Khám phá Ẩm Thực Đường Phố\nĐể gọi món ngon chuẩn như người sành ăn, bạn hãy dùng các mẫu câu này nhé:\n- Khi ăn Phở: *"Cho cháu một bát phở bò tái nạm, ít hành, kèm đĩa quẩy giòn ạ!"*\n- Khi mua Bánh mì: *"Bán cho em một ổ bánh mì thập cẩm, nhiều pate, không ớt nhé chị!"*`,
      nativeAlternative: 'Cho em một bát phở bò chín, nước trong, ít hành nhé ạ!',
      culturalNote: isEn
        ? 'Northern phở features a clear, delicate broth with crispy dough sticks (quẩy) and garlic vinegar; Southern phở is richer and served with hoisin sauce and a basket of fresh herbs.'
        : 'Phở miền Bắc chuộng vị thanh nhẹ ăn cùng giấm tỏi và quẩy giòn; phở miền Nam đậm đà ăn kèm tương đen và rổ rau thơm tươi rói.',
      savedWords: [
        { word: 'Phở tái nạm', meaning: 'Pho with rare steak and flank beef' },
        { word: 'Quẩy giòn', meaning: 'Crispy fried dough sticks' },
        { word: 'Bánh mì thập cẩm', meaning: 'Mixed combo Vietnamese baguette' },
      ],
    };
  }

  // 6. Price & Shopping
  if (normalized.includes('bao nhieu') || normalized.includes('tra gia') || normalized.includes('mac ca') || normalized.includes('how much')) {
    return {
      text: isEn
        ? `### 🛍️ Polite Bargaining & Asking Prices\nWhen shopping at traditional markets in Vietnam:\n1. **Ask the price politely:** *"Dạ cô ơi, cái này giá bao nhiêu một cái ạ?"* (Excuse me auntie, how much is this per item?)\n2. **Bargain cheerfully:** *"Cô bớt cho cháu một chút lấy may nhé!"* (Give me a little discount for good luck, please!)\n3. **Close the deal:** *"Hai trăm nghìn được không cô, cháu lấy hai cái luôn ạ!"* (Is 200,000 VND okay? I'll take two!)`
        : `### 🛍️ Mẹo Mặc Cả & Hỏi Giá Lịch Sự\nKhi mua sắm tại chợ truyền thống Việt Nam:\n1. **Hỏi giá nhã nhặn:** *"Dạ cô ơi, cái này giá bao nhiêu một cái/kg ạ?"*\n2. **Mặc cả vui vẻ:** *"Cô bớt cho cháu một chút lấy may nhé! Cháu mở hàng cho cô nha!"*\n3. **Chốt giá:** *"Hai trăm nghìn được không cô, cháu lấy hai cái luôn ạ!"*`,
      nativeAlternative: 'Dạ cái này bao nhiêu tiền hả chị? Bớt chút cho em mở hàng may mắn nhé!',
      culturalNote: isEn
        ? '"Mở hàng" (first sale of the day): Vendors love a friendly first buyer in the morning as it brings good luck all day.'
        : 'Văn hóa "Mở hàng": Người bán rất quý khách mua xởi lởi vào buổi sáng sớm vì tin rằng sẽ mang lại may mắn cả ngày.',
      savedWords: [
        { word: 'Bao nhiêu tiền?', meaning: 'How much does it cost?' },
        { word: 'Mở hàng may mắn', meaning: 'First purchase of the day for good luck' },
      ],
    };
  }

  // 7. Greetings
  const greeting = /^(xin chao|chao|hello|hi|hey|alo)\b/.test(normalized);
  if (greeting) {
    return {
      text: isEn
        ? `Hello there! So glad to practice with you today! 😊\n\nBesides the standard **"Xin chào"**, Vietnamese speakers usually greet each other warmly using pronouns:\n- *"Chào bạn nhé!"* (with friends)\n- *"Em chào anh/chị ạ!"* (politely to someone slightly older)\n- *"Bạn ăn cơm chưa?"* ("Have you eaten yet?" — a classic warm Vietnamese greeting!).\n\nWhat topic would you like to explore or practice today?`
        : `Chào bạn! Rất vui được đồng hành cùng bạn hôm nay! 😊\n\nNgoài câu **"Xin chào"** thông thường, người Việt thường chào thân mật kèm đại từ nhân xưng:\n- *"Chào bạn nhé!"* (với bạn bè)\n- *"Em chào anh/chị ạ!"* (lịch sự với người lớn hơn)\n- *"Bạn ăn cơm chưa?"* (lời chào hỏi thăm tình cảm kinh điển của người Việt!).\n\nHôm nay bạn muốn luyện tập chủ đề gì cùng mình nào?`,
      nativeAlternative: 'Chào bạn nhé! Hôm nay bạn thế nào?',
      culturalNote: isEn
        ? '"Ăn cơm chưa?" (Have you eaten yet?) is a warm way of asking "How are you?", not necessarily an invitation to a meal.'
        : '"Ăn cơm chưa?" là câu chào thể hiện sự quan tâm ấm áp, không nhất thiết là mời ăn uống.',
      savedWords: [
        { word: 'Chào bạn nhé', meaning: 'Hello friend (friendly & polite)' },
        { word: 'Ăn cơm chưa?', meaning: 'Have you eaten yet? (Warm Vietnamese greeting)' },
      ],
    };
  }

  // 8. General conversational response
  return {
    text: isEn
      ? `Got your message: **"${query}"**! 😊\n\nThat's a great topic to explore. To help you practice further, would you like to:\n1. 💬 Continue chatting and see how native Vietnamese speakers express this in daily life?\n2. 📝 Learn natural Vietnamese phrasing and sentence patterns for this?\n3. 🔍 Explore key vocabulary and cultural tips related to your question?`
      : `Mình hiểu câu bạn vừa chia sẻ: **"${query}"**! 😊\n\nĐây là cách diễn đạt rất tốt và người Việt hoàn toàn hiểu ý bạn. Để luyện tập sâu hơn, bạn muốn:\n1. 💬 Tiếp tục trò chuyện và biến tấu câu này trong tình huống đời thường?\n2. 📝 Xem cách nói tự nhiên hơn của người bản xứ?\n3. 🔍 Tìm hiểu từ vựng hoặc điểm ngữ pháp liên quan?`,
    nativeAlternative: query.endsWith('ạ') ? query : `${query} ạ`,
    explanation: isEn
      ? 'Keep up the great momentum! Ask me anything in English or Vietnamese.'
      : 'Bạn đang diễn đạt rất tốt! Hãy tiếp tục duy trì phản xạ tiếng Việt nhé.',
  };
}

function createDefaultSessions() {
  const initialSession = {
    id: getWelcomeSessionId(),
    title: 'Làm quen với Hola AI',
    mode: 'tutor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'ai',
        mode: 'tutor',
        text: 'Xin chào bạn! 👋 Tôi là Hola AI – người bạn đồng hành cùng bạn chinh phục tiếng Việt.\n\nTôi có thể giúp bạn ở 7 chế độ chuyên biệt:\n- 🎓 **Tutor**: Giải đáp từ vựng, ngữ pháp toàn diện\n- 📝 **Grammar**: Soát lỗi ngữ pháp và viết câu tự nhiên\n- 🌐 **Translation**: Dịch thuật 2 chiều kèm giải thích sắc thái\n- 💬 **Conversation**: Luyện phản xạ đối thoại đời thường\n- 🏮 **Culture Guide**: Khám phá phong tục & văn hóa Việt Nam\n- ✈️ **Travel**: Tình huống du lịch, hỏi đường, ăn uống, trả giá\n- 🗺️ **Regional Vietnamese**: Tiếng Việt 3 miền Bắc – Trung – Nam\n\nBạn muốn bắt đầu với chủ đề nào hôm nay?',
        timestamp: new Date().toISOString(),
      },
    ],
  };
  return [initialSession];
}

export const aiTutorService = {
  getModes() {
    try {
      const settings = JSON.parse(localStorage.getItem(AI_SETTINGS_STORAGE_KEY) || '{}');
      const rawModes = settings?.enabledModes;
      let enabled = null;
      if (Array.isArray(rawModes) && rawModes.length > 0) {
        enabled = rawModes.map(m => String(m).trim().toLowerCase());
      } else if (typeof rawModes === 'string' && rawModes.trim()) {
        enabled = rawModes.split(',').map(m => m.trim().toLowerCase()).filter(Boolean);
      }
      if (enabled && enabled.length > 0) {
        const filtered = TUTOR_MODES.filter(m => enabled.includes(m.id.toLowerCase()) || enabled.includes(m.name.toLowerCase()));
        if (filtered.length > 0) return filtered;
      }
    } catch {
      // Fallback to all modes
    }
    return TUTOR_MODES;
  },

  getMode(id) {
    return TUTOR_MODES.find(m => m.id === id) || TUTOR_MODES[0];
  },

  clearLegacySharedCache() {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(LEGACY_ACTIVE_SESSION_KEY);
      localStorage.removeItem(LEGACY_MINI_DAILY_SESSION_KEY);
    } catch {
      // ignore
    }
  },

  getAllSessions() {
    try {
      this.clearLegacySharedCache();
      const key = getStorageKey();
      const stored = localStorage.getItem(key);
      if (!stored) {
        const defaults = createDefaultSessions();
        localStorage.setItem(key, JSON.stringify(defaults));
        return defaults;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const defaults = createDefaultSessions();
        localStorage.setItem(key, JSON.stringify(defaults));
        return defaults;
      }
      return sortSessionsByLatest(normalizeSessionMessages(parsed));
    } catch {
      return createDefaultSessions();
    }
  },

  saveSessions(sessions) {
    try {
      const sorted = sortSessionsByLatest(sessions);
      localStorage.setItem(getStorageKey(), JSON.stringify(sorted));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  },

  async syncSessionsFromBackend() {
    if (!localStorage.getItem('token')) {
      return this.getAllSessions();
    }
    try {
      const res = await axiosClient.get('/api/ai/sessions', { timeout: 5000 });
      const remoteList = unwrapAiPayload(res);
      if (!Array.isArray(remoteList)) {
        return this.getAllSessions();
      }

      const normalizedRemote = remoteList
        .filter(item => item && item.id && String(item.mode || '').toLowerCase() !== 'roleplay')
        .map(item => {
          const rawMsgs = Array.isArray(item.messages) ? item.messages : [];
          const mappedMsgs = rawMsgs.map((m, idx) => ({
            id: m.id || `msg-${idx}-${item.id}`,
            sender: m.sender || 'ai',
            mode: m.mode || item.mode || 'tutor',
            text: m.text || '',
            translation: m.translation || null,
            explanation: m.explanation || null,
            nativeAlternative: m.nativeAlternative || null,
            culturalNote: m.culturalNote || null,
            grammarCorrection: m.grammarCorrection || null,
            savedWords: m.savedWords || [],
            timestamp: m.timestamp || m.createdAt || item.createdAt || new Date().toISOString(),
          }));
          return {
            id: item.id,
            title: item.title || `Hội thoại AI (${this.getMode(item.mode).name})`,
            mode: item.mode || 'tutor',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
            messages: mappedMsgs.length > 0 ? mappedMsgs : createDefaultSessions()[0].messages,
          };
        });

      if (normalizedRemote.length > 0) {
        const finalSessions = sortSessionsByLatest(normalizeSessionMessages(normalizedRemote));
        this.saveSessions(finalSessions);
        return finalSessions;
      }

      // User has 0 sessions on backend: keep local user-scoped sessions if any, otherwise default welcome session
      return this.getAllSessions();
    } catch (err) {
      console.warn('[Hola AI] Không thể đồng bộ lịch sử từ backend:', err?.message || err);
      return this.getAllSessions();
    }
  },

  getActiveSessionId() {
    return localStorage.getItem(getActiveSessionKey()) || getWelcomeSessionId();
  },

  setActiveSessionId(id) {
    localStorage.setItem(getActiveSessionKey(), id);
  },

  getSession(id) {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || sessions[0];
  },

  getOrCreateTodayMiniSession(preferredSessionId = null) {
    const todayKey = getLocalDateKey(new Date());
    const miniStorageKey = getMiniDailySessionKey();
    const sessions = this.getAllSessions();

    if (preferredSessionId) {
      const preferred = sessions.find(s => s.id === preferredSessionId);
      if (preferred && !isWelcomeSessionId(preferred.id) && getLocalDateKey(preferred.createdAt || preferred.updatedAt) === todayKey) {
        try {
          localStorage.setItem(miniStorageKey, JSON.stringify({ dateKey: todayKey, sessionId: preferred.id }));
        } catch {
          // ignore
        }
        return preferred;
      }
    }

    try {
      const storedDaily = JSON.parse(localStorage.getItem(miniStorageKey) || 'null');
      if (storedDaily && storedDaily.dateKey === todayKey && storedDaily.sessionId) {
        const existingToday = sessions.find(s => s.id === storedDaily.sessionId);
        if (existingToday && getLocalDateKey(existingToday.createdAt || existingToday.updatedAt) === todayKey) {
          this.setActiveSessionId(existingToday.id);
          return existingToday;
        }
      }
    } catch {
      // ignore
    }

    // Look for any session created today (excluding the static welcome template if it was from an older day)
    const todayExisting = sessions.find(
      s => !isWelcomeSessionId(s.id) && getLocalDateKey(s.createdAt) === todayKey
    );
    if (todayExisting) {
      try {
        localStorage.setItem(miniStorageKey, JSON.stringify({ dateKey: todayKey, sessionId: todayExisting.id }));
      } catch {
        // ignore
      }
      this.setActiveSessionId(todayExisting.id);
      return todayExisting;
    }

    // New day: create a fresh conversation for today
    const freshSession = this.createSession('tutor');
    try {
      localStorage.setItem(miniStorageKey, JSON.stringify({ dateKey: todayKey, sessionId: freshSession.id }));
    } catch {
      // ignore
    }
    return freshSession;
  },

  async getAiStatus() {
    try {
      const res = await axiosClient.get('/api/ai/status', { timeout: 2500 });
      return unwrapAiPayload(res);
    } catch (error) {
      console.warn('[Hola AI] Không đọc được trạng thái AI từ backend:', error.message);
      return { isLiveCall: false, provider: AI_PROVIDER, activeModel: AI_MODEL, apiKeyConfigured: false };
    }
  },

  async configureApiKey(apiKey) {
    const res = await axiosClient.post('/api/ai/configure-key', {
      apiKey,
      provider: AI_PROVIDER,
      model: AI_MODEL,
    }, { timeout: 6000 });
    return res?.result ?? res;
  },

  createSession(mode = 'tutor', title = '') {
    const modeConfig = this.getMode(mode);
    const userSuffix = getCurrentUserStorageKey();
    const titleVi = title || `Hội thoại mới (${modeConfig.name})`;
    const titleEn = title || `New Chat (${modeConfig.nameEn || modeConfig.name})`;
    const newSession = {
      id: `session-${Date.now()}-${userSuffix}`,
      title: titleVi,
      titleVi: titleVi,
      titleEn: titleEn,
      mode: mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          mode: mode,
          text: `Chào mừng bạn đến với chế độ **${modeConfig.title}**! ${modeConfig.icon}\n\n${modeConfig.description}\n\nHãy gửi câu hỏi hoặc chọn một trong các gợi ý bên dưới để chúng ta cùng luyện tập nhé!`,
          textVi: `Chào mừng bạn đến với chế độ **${modeConfig.title}**! ${modeConfig.icon}\n\n${modeConfig.description}\n\nHãy gửi câu hỏi hoặc chọn một trong các gợi ý bên dưới để chúng ta cùng luyện tập nhé!`,
          textEn: `Welcome to **${modeConfig.titleEn || modeConfig.name}** mode! ${modeConfig.icon}\n\n${modeConfig.descriptionEn || modeConfig.description}\n\nAsk a question or pick one of the suggestions below to start practicing together!`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Keep the creation request available so the first message cannot race it.
    const creationRequest = axiosClient.post(
      '/api/ai/sessions',
      { id: newSession.id, mode, title: newSession.title },
      { timeout: 3000 },
    ).catch((error) => {
      // A pre-existing backend record is safe; the message request can continue.
      if (error?.response?.status !== 409 && error?.status !== 409) {
        console.warn('[Hola AI] Không đồng bộ được phiên mới lên backend:', error?.message || error);
      }
    }).finally(() => {
      pendingSessionCreations.delete(newSession.id);
    });
    pendingSessionCreations.set(newSession.id, creationRequest);

    const sessions = [newSession, ...this.getAllSessions()];
    this.saveSessions(sessions);
    this.setActiveSessionId(newSession.id);
    return newSession;
  },

  renameSession(id, newTitle) {
    const trimmedTitle = newTitle.trim();
    const sessions = this.getAllSessions().map(s => {
      if (s.id === id) {
        return { ...s, title: trimmedTitle || s.title, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveSessions(sessions);
    if (trimmedTitle && localStorage.getItem('token')) {
      axiosClient.patch(`/api/ai/sessions/${id}`, { title: trimmedTitle }).catch(() => {});
    }
    return sessions.find(s => s.id === id) || sessions[0];
  },

  deleteSession(id) {
    let sessions = this.getAllSessions().filter(s => s.id !== id);
    if (sessions.length === 0) {
      sessions = createDefaultSessions();
    }
    this.saveSessions(sessions);

    if (this.getActiveSessionId() === id) {
      this.setActiveSessionId(sessions[0].id);
    }
    if (localStorage.getItem('token')) {
      axiosClient.delete(`/api/ai/sessions/${id}`).catch(() => {});
    }
    return sessions;
  },

  updateSessionMode(id, newMode) {
    const modeConfig = this.getMode(newMode);
    const sessions = this.getAllSessions().map(s => {
      if (s.id === id) {
        if (s.mode === newMode) return s;

        const hasUserMessages = s.messages && s.messages.some(m => m.sender === 'user');
        let updatedMessages = s.messages || [];
        let updatedTitle = s.title;

        if (!hasUserMessages) {
          if (s.title.startsWith('Hội thoại mới') || /^Làm quen với (?:AI Tutor|Hola AI)$/.test(s.title)) {
            updatedTitle = `Hội thoại mới (${modeConfig.name})`;
          }
          updatedMessages = [
            {
              id: `msg-${Date.now()}`,
              sender: 'ai',
              mode: newMode,
              text: `Chào mừng bạn đến với chế độ **${modeConfig.title}**! ${modeConfig.icon}\n\n${modeConfig.description}\n\nHãy gửi câu hỏi hoặc chọn một trong các gợi ý bên dưới để chúng ta cùng luyện tập nhé!`,
              timestamp: new Date().toISOString(),
            },
          ];
        } else {
          updatedMessages = [
            ...s.messages,
            {
              id: `msg-${Date.now()}-switch`,
              sender: 'ai',
              mode: newMode,
              text: `✨ **Đã chuyển sang chế độ ${modeConfig.title} (${modeConfig.name})** ${modeConfig.icon}\n\n${modeConfig.description}\n\nHãy tiếp tục gửi câu hỏi hoặc câu cần kiểm tra theo chế độ mới này nhé!`,
              timestamp: new Date().toISOString(),
            },
          ];
        }

        return {
          ...s,
          mode: newMode,
          title: updatedTitle,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
      }
      return s;
    });

    this.saveSessions(sessions);
    const updated = sessions.find(s => s.id === id);
    if (updated && localStorage.getItem('token')) {
      axiosClient.patch(`/api/ai/sessions/${id}`, { mode: newMode, title: updated.title }).catch(() => {});
    }
    return updated;
  },

  async sendMessage(sessionId, text, currentMode = 'tutor', language = null) {
    const detectedLanguage = language || detectInputLanguage(text);
    const sessions = this.getAllSessions();
    let session = sessions.find(s => s.id === sessionId);
    if (!session) {
      session = this.createSession(currentMode);
      sessionId = session.id;
    }

    const userTurnCount = (session.messages || []).filter(message => message.sender === 'user').length;
    if (userTurnCount >= getMaxTurnsPerSession()) {
      session = this.createSession(currentMode);
      sessionId = session.id;
    }

    await pendingSessionCreations.get(sessionId);

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      mode: currentMode,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    let newTitle = session.title;
    if ((session.messages || []).filter(m => m.sender === 'user').length === 0) {
      newTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;
    }

    let aiMsg = null;
    let backendError = null;

    for (let attempt = 0; attempt < 2 && !aiMsg; attempt += 1) {
      try {
        const r = await requestAiResponse(sessionId, text, currentMode, detectedLanguage);
        const aiText = enforceLanguageConsistency(getAiText(r), detectedLanguage);
        if (aiText) {
          aiMsg = {
            id: r.id || `msg-${Date.now()}-ai`,
            sender: 'ai',
            mode: currentMode,
            text: aiText,
            translation: r.translation || null,
            explanation: enforceLanguageConsistency(r.explanation || null, detectedLanguage),
            nativeAlternative: r.nativeAlternative || null,
            culturalNote: enforceLanguageConsistency(r.culturalNote || null, detectedLanguage),
            grammarCorrection: enforceLanguageConsistency(r.grammarCorrection || null, detectedLanguage),
            grammarCheck: r.grammarCorrection ? {
              original: text.trim(),
              corrected: r.nativeAlternative || text.trim(),
              explanation: enforceLanguageConsistency(r.grammarCorrection, detectedLanguage),
            } : null,
            savedWords: r.savedWords || [],
            timestamp: r.timestamp || new Date().toISOString(),
          };
        }
      } catch (apiErr) {
        backendError = apiErr;
        console.warn('[Hola AI] Backend AI request failed:', {
          status: apiErr.status,
          code: apiErr.code,
          message: apiErr.message,
          details: apiErr.details,
        });

        if (attempt === 0 && isSessionLimitError(apiErr)) {
          session = this.createSession(currentMode);
          sessionId = session.id;
          newTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;
          backendError = null;
        }
      }
    }

    if (!aiMsg) {
      if (!ALLOW_OFFLINE_AI_FALLBACK) {
        if (backendError?.code === 'ECONNABORTED' || backendError?.message?.includes('timeout')) {
          throw new Error(`Backend AI không phản hồi trong ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} giây. Hãy kiểm tra log backend/OpenRouter hoặc thử lại sau.`);
        }
        if (backendError?.status) {
          const statusLabel = backendError.status === 401
            ? 'Bạn cần đăng nhập lại để sử dụng Hola AI.'
            : backendError.status === 403
              ? 'Tài khoản hiện không có quyền sử dụng Hola AI.'
              : `Backend AI trả về HTTP ${backendError.status}.`;
          throw new Error(`${statusLabel}${backendError.message ? ` ${backendError.message}` : ''}`);
        }
        throw new Error('Backend AI không trả về câu trả lời hợp lệ. Hãy kiểm tra request /api/ai/sessions/{id}/messages trong DevTools.');
      }

      console.warn('[Hola AI] Backend returned no usable text; using local engine because VITE_AI_ALLOW_OFFLINE_FALLBACK=true.');
      const aiResponseData = await this.generateResponse(text, currentMode, session.messages || [], detectedLanguage);
      aiMsg = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        mode: currentMode,
        text: aiResponseData.text,
        translation: aiResponseData.translation || null,
        explanation: aiResponseData.explanation || null,
        nativeAlternative: aiResponseData.nativeAlternative || null,
        culturalNote: aiResponseData.culturalNote || null,
        grammarCorrection: aiResponseData.grammarCorrection || null,
        grammarCheck: aiResponseData.grammarCheck || (aiResponseData.grammarCorrection ? {
          original: text.trim(),
          corrected: aiResponseData.nativeAlternative || text.trim(),
          explanation: aiResponseData.grammarCorrection,
        } : null),
        savedWords: aiResponseData.savedWords || [],
        timestamp: new Date().toISOString(),
      };
    }

    const updatedSession = {
      ...session,
      title: newTitle,
      mode: currentMode,
      updatedAt: new Date().toISOString(),
      messages: [...(session.messages || []), userMsg, aiMsg],
    };

    const otherSessions = this.getAllSessions().filter(s => s.id !== sessionId);
    const updatedSessions = [updatedSession, ...otherSessions];
    this.saveSessions(updatedSessions);
    if (newTitle !== session.title && localStorage.getItem('token')) {
      axiosClient.patch(`/api/ai/sessions/${sessionId}`, { title: newTitle, mode: currentMode }).catch(() => {});
    }

    return { userMsg, aiMsg, updatedSession };
  },

  async generateResponse(query, mode, messages = [], lang = null) {
    await new Promise(r => setTimeout(r, 350));

    const q = query.trim().toLowerCase();
    const resolvedLang = lang || detectInputLanguage(query);
    const isEn = resolvedLang === 'en';

    // Mode: GRAMMAR
    if (mode === 'grammar') {
      if (q.includes('hai quả chuối') || q.includes('ăn nó ngon')) {
        return {
          text: isEn
            ? `### 📝 Grammar Analysis & Correction\n\n**Your original sentence:**\n> *"Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."*\n\n**Natural native Vietnamese:**\n✨ **"Hôm qua tôi mua hai quả chuối to lắm, ăn rất ngon."**\n\n---\n\n#### 🔍 Key Improvements:\n1. **Use "to lắm" instead of "rất to"**: In spoken Vietnamese, expressive ending intensifiers like **"to lắm"** sound much more natural.\n2. **Drop the redundant "nó"**: Vietnamese omits object pronouns ("it") when the object was already mentioned.\n3. **Connect clauses with a comma**: Separating *"mua"* and *"ăn"* with a comma creates a smoother rhythm than *"và"*.`
            : `### 📝 Phân tích & Sửa câu ngữ pháp\n\n**Câu gốc của bạn:**  \n> *"Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."*\n\n**Câu chuẩn tự nhiên của người bản xứ:**  \n✨ **"Hôm qua tôi mua hai quả chuối to lắm, ăn rất ngon."**\n\n---\n\n#### 🔍 Các điểm cần cải thiện:\n1. **Lược bỏ "đi" & "rất to"**: Trong văn phong nói hàng ngày, người Việt ưa dùng trợ từ biểu cảm cuối câu như **"to lắm"** hoặc **"ngon ghê"** thay vì lặp từ "rất".\n2. **Từ "nó" thừa thãi**: Tiếng Việt là ngôn ngữ tỉnh lược chủ ngữ/tân ngữ khi ngữ cảnh đã rõ. Người Việt nói trực tiếp *"ăn rất ngon"* chứ ít khi nói *"ăn nó ngon"*.\n3. **Dấu phẩy nối ý**: Tách hai hành động *"mua"* và *"ăn"* bằng dấu phẩy tạo nhịp điệu tự nhiên hơn liên từ *"và"*.\n\n💡 **Cấu trúc gợi ý để ghi nhớ:**  \n\`[Chủ ngữ] + [Động từ] + [Danh từ] + [Tính từ + lắm/quá], [Cảm nhận].\``,
          grammarCheck: {
            original: 'Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon.',
            corrected: 'Hôm qua tôi mua hai quả chuối to lắm, ăn rất ngon.',
            explanation: isEn
              ? 'Drop the redundant pronoun "nó" and replace "rất to" with "to lắm" for natural flow.'
              : 'Bỏ đại từ tân ngữ "nó", thay "rất to" bằng "to lắm" để tăng tính tự nhiên.',
          },
          savedWords: [
            { word: 'To lắm', meaning: 'Very big (natural conversational tone)' },
            { word: 'Ăn rất ngon', meaning: 'Tastes delicious' },
          ],
        };
      }

      return {
        text: isEn
          ? `### 📝 Grammar Review & Tips\n\n**Your sentence:**\n> *"${query}"*\n\n---\n\n#### 📌 Essential Vietnamese Grammar Rules:\n1. **Basic Word Order:** \`Subject + Verb + Object\`. Adjectives always come **after** the noun they modify (e.g., *áo đẹp*, *xe mới*).\n2. **Positive vs. Negative Passive:** Use **"được"** for positive/fortunate experiences and **"bị"** only for negative/unwanted ones.\n3. **Ending Particles:** Adding particles like *nhé, nha, ạ* at the end of a sentence makes your Vietnamese sound warm and natural!`
          : `### 📝 Nhận xét & Sửa ngữ pháp\n\n**Câu của bạn:**  \n> *"${query}"*\n\n**Gợi ý sửa chuẩn văn phong tiếng Việt:**  \n✨ **"${query.replace(/rất/g, 'rất đỗi').replace(/của tôi/g, 'tôi')}"**\n\n---\n\n#### 📌 Quy tắc ngữ pháp trọng tâm:\n1. **Trật tự từ Tiếng Việt cơ bản:** \`Chủ ngữ + Vị ngữ + Tân ngữ\`. Tính từ luôn đứng sau danh từ (ví dụ: *áo đẹp*, *xe mới*).\n2. **Hạn chế dùng bị động "bị/được" bừa bãi:** Tiếng Việt chuộng câu chủ động. Chỉ dùng **"được"** khi nhận điều may mắn, dùng **"bị"** khi gặp sự việc không vui.\n3. **Hư từ & Trợ từ cảm thán:** Thêm các từ như *nhé, nha, nha bạn, nè, á* vào cuối câu khi trò chuyện thân mật sẽ giúp câu nói tự nhiên và gần gũi gấp 10 lần!`,
        grammarCheck: {
          original: query,
          corrected: query,
          explanation: isEn
            ? 'Your sentence is clear! Remember to use ending particles like "nhé" or "ạ" in spoken conversation.'
            : 'Câu tương đối rõ ràng. Hãy lưu ý các từ đệm cảm thán cuối câu để giao tiếp tự nhiên hơn.',
        },
      };
    }

    // Mode: REGIONAL VIETNAMESE
    if (mode === 'regional') {
      if (q.includes('chè') || q.includes('khác gì')) {
        return {
          text: isEn
            ? `### 🗺️ How "Chè" Differs Across Northern, Central & Southern Vietnam\n\nThe word **"Chè"** is a classic example of regional Vietnamese vocabulary:\n\n| Region | Primary Meaning of "Chè" | Example |\n| :--- | :--- | :--- |\n| **North** | Dried tea leaves / freshly brewed green tea | *"Mời bác uống chén chè Thái Nguyên nóng."* |\n| **South** | Sweet dessert soup made with beans & coconut milk | *"Trưa nắng ghé làm ly chè đậu đỏ mát lạnh nghen!"* |\n| **Central** | Used for both green tea (*chè xanh*) and sweet dessert soups (*chè bắp, chè hạt sen*) | *"Múc một chén chè bắp Cồn Hến thơm ngọt."* |`
            : `### 🗺️ Khác biệt từ "Chè" giữa 3 miền Bắc - Trung - Nam\n\nTừ **"Chè"** là một ví dụ kinh điển về sự phong phú của phương ngữ tiếng Việt:\n\n| Vùng miền | Ý nghĩa chính của từ "Chè" | Ví dụ sử dụng |\n| :--- | :--- | :--- |\n| **Miền Bắc** | Lá trà khô, nước trà xanh đun uống thường nhật | *"Mời bác uống chén chè Thái Nguyên nóng."* |\n| **Miền Nam** | Món chè ngọt tráng miệng nấu bằng đậu, nước cốt dừa | *"Trưa nắng ghé làm ly chè đậu đỏ mát lạnh nghen!"* |\n| **Miền Trung** | Dùng cho cả hai (trà Huế gọi là chè xanh, món ngọt gọi chè sen, chè bắp) | *"Múc một chén chè bắp Cồn Hến thơm ngọt."* |\n\n---\n\n💡 **Lưu ý giao tiếp du lịch:**  \nKhi ở Hà Nội, nếu bạn vào quán gọi *"cho một ly chè"*, chủ quán sẽ mang ra chén nước trà xanh đậm vị. Nhưng nếu ở Sài Gòn, họ sẽ hỏi bạn: *"Ăn chè ba màu hay chè bưởi?"*!`,
          savedWords: [
            { word: 'Chén chè (Bắc)', meaning: 'A cup of green tea' },
            { word: 'Ly chè (Nam)', meaning: 'Sweet dessert soup with coconut milk' },
            { word: 'Nước chè xanh', meaning: 'Fresh boiled green tea' },
          ],
        };
      }

      if (q.includes('mô') || q.includes('tê') || q.includes('răng') || q.includes('rứa') || q.includes('huế') || q.includes('miền trung') || q.includes('central')) {
        return {
          text: isEn
            ? `### 🗺️ Central Vietnamese Signature Words: Mô - Tê - Răng - Rứa\n\nWhen visiting Hue, Da Nang, or Quang Nam, you will often hear these four iconic words:\n\n1. **MÔ** = Where (*đâu / ở đâu*)\n   👉 Example: *"Đi mô rứa?"* = Where are you going?\n2. **TÊ** = Over there (*kia / đằng kia*)\n   👉 Example: *"Ở bên tê cầu Tràng Tiền"* = Over there on the other side of Trang Tien Bridge.\n3. **RĂNG** = Why / How (*sao / thế nào*)\n   👉 Example: *"Răng mà đẹp dữ rứa?"* = How is it so beautiful?\n4. **RỨA** = Like that / So (*thế / vậy*)\n   👉 Example: *"Rứa hả?"* = Really? / Is that so?`
            : `### 🗺️ Bộ tứ từ địa phương đặc trưng Miền Trung: Mô - Tê - Răng - Rứa\n\nKhi đến Huế, Đà Nẵng, Quảng Nam, bạn sẽ thường xuyên nghe thấy 4 từ này:\n\n1. **MÔ** = Đâu / Ở đâu  \n   👉 Ví dụ: *"Đi mô rứa?"* = Đi đâu đấy?\n2. **TÊ** = Kia / Đằng kia  \n   👉 Ví dụ: *"Ở bên tê cầu Tràng Tiền"* = Ở bên kia cầu Tràng Tiền.\n3. **RĂNG** = Sao / Làm sao / Thế nào  \n   👉 Ví dụ: *"Răng mà đẹp dữ rứa?"* = Sao mà đẹp thế này?\n4. **RỨA** = Thế / Thế đó / Vậy  \n   👉 Ví dụ: *"Rứa hả?"* = Thế à? / Vậy sao?\n\n---\n\n🗣️ **Cặp đại từ xưng hô Miền Trung:**  \n- **Tau - Mi** = Tao - Mày (bạn bè rất thân)\n- **O** = Cô (chị em gái của ba, hoặc cô gái trẻ)`,
          savedWords: [
            { word: 'Đi mô rứa?', meaning: 'Where are you going? (Central VN)' },
            { word: 'Răng mà...', meaning: 'Why / How come... (Central VN)' },
            { word: 'Bên tê', meaning: 'Over there (Central VN)' },
          ],
        };
      }

      return {
        text: isEn
          ? `### 🗺️ Common Northern vs. Southern Vietnamese Vocabulary\n\nHere are essential regional word pairs to know when traveling across Vietnam:\n\n| Meaning | Northern (Hanoi) | Southern (Saigon) |\n| :--- | :--- | :--- |\n| **Spoon** | Thìa | Muỗng |\n| **Pork** | Thịt lợn | Thịt heo |\n| **Fork** | Dĩa / Xiên | Nĩa |\n| **Plate** | Đĩa | Dĩa |\n| **Plastic bag** | Túi bóng | Bọc / Bịch |\n| **Umbrella** | Cái ô | Cây dù |\n| **Pineapple** | Quả dứa | Trái thơm / Trái khóm |\n\n💡 **Intonation Tip:** Southern speakers often merge the *ngã (~)* tone into the *hỏi (?)* tone, creating a soft, melodic cadence!`
          : `### 🗺️ Bảng đối chiếu từ vựng Bắc - Nam thông dụng\n\nDưới đây là các cặp từ bạn nhất định phải biết khi đi du lịch xuyên Việt:\n\n| Khái niệm | Miền Bắc | Miền Nam |\n| :--- | :--- | :--- |\n| **Thìa ăn cơm** | Thìa | Muỗng |\n| **Thịt lợn/heo** | Thịt lợn | Thịt heo |\n| **Cái nĩa/dĩa** | Dĩa / Xiên | Nĩa |\n| **Đĩa đựng đồ ăn** | Đĩa | Dĩa |\n| **Bao nylon** | Túi bóng | Bọc / Bịch |\n| **Ô / Dù che mưa** | Cái ô | Cây dù |\n| **Quả dứa** | Quả dứa | Trái thơm / Trái khóm |\n\n💡 **Ngữ điệu:** Người miền Nam thường nói lướt dấu ngã (~) thành dấu hỏi (?), tạo cảm giác mềm mại và ngọt ngào hơn!`,
        savedWords: [
          { word: 'Cái muỗng (Nam)', meaning: 'Spoon (Northern: Thìa)' },
          { word: 'Cây dù (Nam)', meaning: 'Umbrella (Northern: Cái ô)' },
        ],
      };
    }

    // Mode: CULTURE GUIDE
    if (mode === 'culture_guide') {
      return {
        text: isEn
          ? `### 🏮 Vietnamese Cultural Etiquette Guide\n\nThank you for asking about Vietnamese culture! Here are three essential customs:\n\n#### 1. Inviting Elders Before Eating (*Mời cơm*):\nYounger family members always **invite elders to eat before picking up their chopsticks**:\n- *"Con mời ông bà xới cơm, con mời bố mẹ ăn cơm!"*\n- This shows filial piety and deep respect for older generations.\n\n#### 2. Polite Chopstick Etiquette:\n- ❌ **Never stick chopsticks upright into a bowl of rice** (this resembles incense sticks for ancestors).\n- ❌ Avoid tapping chopsticks on the side of your bowl.\n- ✅ Use the clean end of your chopsticks or serving utensils when placing food into someone else's bowl.\n\n#### 3. Family-Based Pronouns:\nVietnamese society treats everyone like extended family, using warm kinship terms like *anh, chị, em, cô, chú, bác* instead of a generic "you".`
          : `### 🏮 Chỉ dẫn văn hóa ứng xử Việt Nam\n\nCảm ơn bạn đã hỏi về nét đẹp văn hóa Việt Nam! Dưới đây là những lưu ý cốt lõi:\n\n#### 1. Văn hóa mời cơm trước bữa ăn:\nNgười nhỏ tuổi luôn phải **mời người lớn tuổi trước khi cầm đũa**:\n- *"Con mời ông bà xới cơm, con mời bố mẹ ăn cơm!"*\n- Đây là nét đẹp thể hiện lòng hiếu thảo và sự kính trọng thế hệ đi trước.\n\n#### 2. Quy tắc dùng đũa lịch sự:\n- ❌ **Tuyệt đối không cắm thẳng đũa vào bát cơm** (hành động này gợi nhớ bát hương cúng giỗ).\n- ❌ Không dùng đũa gõ vào thành bát (quan niệm xưa là thu hút vận xui hoặc người ăn xin).\n- ✅ Khi gắp thức ăn cho người khác, người Việt tinh tế thường **quay đầu đũa** lại.\n\n#### 3. Cách xưng hô thể hiện tình cảm:\nNgười Việt coi xã hội như một đại gia đình. Do đó bạn sẽ thấy người ta xưng hô bằng thứ bậc thân thương như *anh, chị, em, cô, chú, bác* thay vì chỉ dùng *tôi - bạn*.`,
        savedWords: [
          { word: 'Mời cơm', meaning: 'Polite invitation to eat before starting a meal' },
          { word: 'Kính trên nhường dưới', meaning: 'Respecting elders and yielding to youngsters' },
        ],
      };
    }

    // Mode: TRAVEL
    if (mode === 'travel') {
      return {
        text: isEn
          ? `### ✈️ Vietnam Travel & Survival Phrases\n\nHere are practical Vietnamese survival phrases for your trip:\n\n#### 1. Asking Directions & Catching a Ride:\n- *"Cho tôi hỏi đường ra Hồ Gươm / Chợ Bến Thành đi hướng nào ạ?"* (Which way is it to Hoan Kiem Lake / Ben Thanh Market?)\n- *"Bác tài ơi, chở tôi đến khách sạn [...] nhé, hết khoảng bao nhiêu tiền?"* (Driver, please take me to [...] hotel, how much is it?)\n\n#### 2. Ordering Food & Dietary Needs:\n- *"Cho tôi một bát phở bò chín, không hành hoa, ít ớt nhé!"* (One well-done beef pho, no scallions, less chili please!)\n- *"Tôi ăn chay / Tôi bị dị ứng đậu phộng (lạc), món này có đậu phộng không ạ?"* (I am vegetarian / allergic to peanuts, does this have peanuts?)\n\n#### 3. Polite Bargaining:\n- *"Cái này giá bao nhiêu hả cô/chị?"* (How much is this?)\n- *"Bớt cho tôi một chút được không? Hai trăm nghìn nhé!"* (Can you give me a small discount? How about 200,000 VND?)`
          : `### ✈️ Cẩm nang du lịch & Giao tiếp tình huống\n\nDưới đây là các mẫu câu "sinh tồn" cực kỳ hữu ích cho bạn:\n\n#### 1. Hỏi đường & Bắt xe:\n- *"Cho tôi hỏi đường ra Hồ Gươm / Chợ Bến Thành đi hướng nào ạ?"*\n- *"Bác tài ơi, chở tôi đến khách sạn [...] nhé, hết khoảng bao nhiêu tiền?"*\n\n#### 2. Gọi món ăn theo khẩu vị:\n- *"Cho tôi một bát phở bò chín, không hành hoa, ít ớt nhé!"*\n- *"Tôi ăn chay / Tôi bị dị ứng đậu phộng (lạc), món này có đậu phộng không ạ?"*\n- *"Cho tôi xin thêm một ly trà đá và giấy ăn nhé!"*\n\n#### 3. Mặc cả giá (Trả giá) lịch sự:\n- *"Cái này giá bao nhiêu hả cô/chị?"*\n- *"Bớt cho tôi một chút được không? Hai trăm nghìn nhé, tôi lấy hai cái luôn!"*\n- *"Mở hàng may mắn cho tôi giá hữu nghị nhé!"*`,
        savedWords: [
          { word: 'Không hành', meaning: 'No scallions / onions' },
          { word: 'Bớt một chút', meaning: 'A little discount please' },
          { word: 'Bao nhiêu tiền?', meaning: 'How much does it cost?' },
        ],
      };
    }

    // Mode: TRANSLATION
    if (mode === 'translation') {
      return {
        text: isEn
          ? `### 🌐 Natural Contextual Translation\n\n**Source text:**\n> *"${query}"*\n\n---\n\n#### 🇻🇳 Natural Vietnamese Expression:\n✨ **"${q.includes('spicy') ? 'Làm ơn làm ít cay giúp tôi với nhé, tôi không ăn được cay lắm ạ!' : 'Dạ, xin vui lòng hỗ trợ giúp tôi việc này với nhé ạ!'}"**\n\n---\n\n#### 💡 Nuance & Vocabulary Breakdown:\n- Adding **"nhé"** and **"ạ"** at the end makes the sentence sound warm, polite, and natural.\n- Native speakers use \`"Làm ơn + [Action] + giúp tôi với nhé!"\` rather than translating word-for-word from English.`
          : `### 🌐 Bản dịch ngữ cảnh chuẩn xác\n\n**Văn bản nguồn:**  \n> *"${query}"*\n\n---\n\n#### 🇻🇳 Bản dịch tiếng Việt tự nhiên:\n✨ **"${q.includes('spicy') ? 'Làm ơn làm ít cay giúp tôi với nhé, tôi không ăn được cay lắm ạ!' : 'Dạ, câu này trong tiếng Việt đời thường nói là: Xin vui lòng giúp tôi với!'}"**\n\n---\n\n#### 💡 Phân tích sắc thái & Từ vựng:\n- Thêm trợ từ **"nhé", "ạ"** ở cuối câu để tăng tính lịch sự và thân thiện.\n- Người Việt thường biểu đạt sự nhờ vả bằng mẫu câu: \`"Làm ơn + [Hành động] + giúp tôi với nhé!"\` thay vì dịch từng chữ (word-by-word) từ tiếng Anh.`,
        savedWords: [
          { word: 'Ít cay', meaning: 'Less spicy' },
          { word: 'Làm ơn...', meaning: 'Please (polite request)' },
        ],
      };
    }

    // Mode: CONVERSATION & Default TUTOR mode
    const defCr = conversationalReply(query, messages, resolvedLang);
    return typeof defCr === 'string' ? { text: defCr } : defCr;
  },
};
