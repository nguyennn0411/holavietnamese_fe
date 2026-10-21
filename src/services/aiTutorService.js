import axiosClient from '@/infrastructure/api/axiosClient';

// AI Tutor Service supporting 7 modes:
// Tutor, Grammar, Translation, Conversation, Culture Guide, Travel, Regional Vietnamese

export const TUTOR_MODES = [
  {
    id: 'tutor',
    name: 'Tutor',
    title: 'Gia sư toàn diện',
    icon: '🎓',
    badge: 'Toàn diện',
    color: '#245c48',
    bg: '#edf4ef',
    description: 'Hỏi đáp mọi thắc mắc về tiếng Việt: giải thích từ vựng, ngữ pháp, ngữ cảnh và cách dùng tự nhiên.',
    placeholder: 'Hỏi bất kỳ điều gì về tiếng Việt (ví dụ: "Phân biệt từ \'được\' và \'bị\'")',
    quickPrompts: [
      'Giải thích sự khác nhau giữa "được" và "bị"',
      'Cách sử dụng hệ thống đại từ xưng hô tiếng Việt (anh, chị, em, cô, chú...)',
      'Làm thế nào để phân biệt dấu hỏi (?) và dấu ngã (~)?',
      'Cho tôi 5 cách chào hỏi thông dụng ngoài "Xin chào"',
    ],
  },
  {
    id: 'grammar',
    name: 'Grammar',
    title: 'Ngữ pháp & Sửa câu',
    icon: '📝',
    badge: 'Chuyên sâu',
    color: '#8b4513',
    bg: '#fcf3eb',
    description: 'Sửa lỗi ngữ pháp, cải thiện câu văn, giải thích trật tự từ và các cấu trúc câu tiếng Việt chuẩn xác.',
    placeholder: 'Nhập câu tiếng Việt của bạn để kiểm tra và sửa lỗi...',
    quickPrompts: [
      'Sửa giúp tôi câu: "Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."',
      'Cấu trúc so sánh hơn và so sánh nhất trong tiếng Việt',
      'Cách dùng đúng các từ nối: "tuy... nhưng", "vì... nên", "nếu... thì"',
      'Tại sao người Việt nói "nhà tôi có 3 người" mà không dùng từ "tồn tại"?',
    ],
  },
  {
    id: 'translation',
    name: 'Translation',
    title: 'Dịch thuật ngữ cảnh',
    icon: '🌐',
    badge: '2 chiều',
    color: '#1a5f7a',
    bg: '#e8f4f8',
    description: 'Dịch chuẩn xác giữa tiếng Việt và tiếng Anh/ngoại ngữ, kèm phân tích sắc thái biểu đạt và từ tương đương.',
    placeholder: 'Nhập câu hoặc đoạn văn cần dịch (tiếng Việt hoặc tiếng Anh)...',
    quickPrompts: [
      'Dịch sang tiếng Việt tự nhiên: "Could you please make it less spicy for me?"',
      'Từ "duyên" trong tiếng Việt dịch sang tiếng Anh thế nào cho trọn nghĩa?',
      'Dịch lịch sự câu từ chối lời mời ăn tối: "Cảm ơn bạn, nhưng tối nay tôi có việc bận mất rồi."',
      'Cách nói "I feel at home here" bằng tiếng Việt mộc mạc nhất',
    ],
  },
  {
    id: 'conversation',
    name: 'Conversation',
    title: 'Luyện hội thoại phản xạ',
    icon: '💬',
    badge: 'Giao tiếp',
    color: '#2e7d32',
    bg: '#edf7ed',
    description: 'Trò chuyện 2 chiều tự nhiên như người bản xứ. AI sẽ đóng vai bạn trò chuyện và gợi ý câu trả lời.',
    placeholder: 'Gõ tin nhắn để bắt đầu trò chuyện cùng AI Tutor...',
    quickPrompts: [
      'Chào bạn! Hôm nay thời tiết ở chỗ bạn thế nào?',
      'Hãy đóng vai một người bạn Việt Nam rủ tôi đi cà phê trứng cuối tuần.',
      'Luyện tập đối thoại: Lần đầu tiên gặp gỡ và làm quen tại lớp học',
      'Gợi ý cho tôi các chủ đề nói chuyện phiếm (small talk) quen thuộc của người Việt',
    ],
  },
  {
    id: 'culture_guide',
    name: 'Culture Guide',
    title: 'Chỉ dẫn văn hóa',
    icon: '🏮',
    badge: 'Phong tục',
    color: '#9f2d20',
    bg: '#fcedeb',
    description: 'Khám phá văn hóa, phong tục, nghi lễ, thói quen sinh hoạt và các quy tắc ứng xử tế nhị của người Việt.',
    placeholder: 'Hỏi về phong tục, văn hóa, ngày lễ hoặc cách cư xử Việt Nam...',
    quickPrompts: [
      'Quy tắc ứng xử khi được mời đến nhà người Việt dùng cơm',
      'Ý nghĩa của mâm ngũ quả và tục xông đất ngày Tết Nguyên Đán',
      'Tại sao người Việt hay hỏi "Ăn cơm chưa?" khi chào nhau?',
      'Những điều nên và không nên làm khi vào thăm chùa chiền ở Việt Nam',
    ],
  },
  {
    id: 'travel',
    name: 'Travel',
    title: 'Du lịch & Sinh tồn',
    icon: '✈️',
    badge: 'Thực tế',
    color: '#d97706',
    bg: '#fef3c7',
    description: 'Các mẫu câu và tình huống du lịch sinh tồn: hỏi đường, mặc cả giá, đặt phòng, gọi món ăn đường phố.',
    placeholder: 'Cần hỗ trợ tình huống du lịch nào tại Việt Nam?',
    quickPrompts: [
      'Mẫu câu hỏi đường và bắt xe ôm/taxi khi đi du lịch',
      'Cách mặc cả lịch sự nhưng hiệu quả tại chợ đêm hoặc chợ Bến Thành',
      'Các câu tiếng Việt cần thiết khi vào quán phở/bún bò gọi món theo sở thích',
      'Cách nói khi tôi bị dị ứng đậu phộng hoặc hải sản',
    ],
  },
  {
    id: 'regional',
    name: 'Regional Vietnamese',
    title: 'Tiếng Việt vùng miền',
    icon: '🗺️',
    badge: 'Bắc • Trung • Nam',
    color: '#7c3aed',
    bg: '#f3e8ff',
    description: 'Tìm hiểu từ vựng, ngữ điệu và cách dùng từ đặc trưng của 3 miền Bắc - Trung - Nam Việt Nam.',
    placeholder: 'Tìm hiểu từ địa phương hoặc ngữ điệu vùng miền (Bắc/Trung/Nam)...',
    quickPrompts: [
      'So sánh từ vựng hàng ngày giữa miền Bắc và miền Nam (muỗng - thìa, heo - lợn...)',
      'Giải thích các từ địa phương miền Trung đặc trưng: "mô, tê, răng, rứa"',
      'Đại từ nhân xưng thân mật ở miền Tây Nam Bộ: "chế", "hai", "út", "tía"',
      'Khác biệt giữa từ "chè" ở miền Bắc (uống) và miền Nam (món tráng miệng)',
    ],
  },
];

const STORAGE_KEY = 'hola_ai_tutor_sessions_v1';
const ACTIVE_SESSION_KEY = 'hola_ai_tutor_active_id_v1';
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-5-mini';
const ALLOW_OFFLINE_AI_FALLBACK = import.meta.env.VITE_AI_ALLOW_OFFLINE_FALLBACK === 'true';
const AI_REQUEST_TIMEOUT_MS = Math.max(
  5000,
  Number(import.meta.env.VITE_AI_REQUEST_TIMEOUT_MS) || 60000,
);

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

const normalizeText = (value = '') => value
  .toLocaleLowerCase('vi-VN')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .trim();

function getRecentConversation(messages = []) {
  return messages
    .filter(message => message.sender === 'user' || message.sender === 'ai')
    .slice(-6);
}

function conversationalReply(query, messages = []) {
  const normalized = normalizeText(query);
  const lower = query.toLowerCase();

  // 1. Age error: "tôi có 20 tuổi"
  if (/.*(toi|minh|em)\s+(co|la)\s+\d+\s+tuoi.*/.test(normalized) || lower.includes('có 20 tuổi') || lower.includes('có 18 tuổi') || lower.includes('có 25 tuổi')) {
    const ageMatch = query.match(/\d+/);
    const age = ageMatch ? ageMatch[0] : '20';
    return {
      text: `### 📝 Nhận xét ngữ pháp: Cách nói tuổi trong tiếng Việt
Trong tiếng Việt, khi nói về số tuổi, chúng ta **không dùng từ "có"** (khác với tiếng Pháp *"J'ai 20 ans"* hay tiếng Tây Ban Nha *"Tengo 20 años"*). Người Việt nói trực tiếp số tuổi ngay sau đại từ!

✨ **Cách nói tự nhiên của người bản xứ:**  
> **"Năm nay tôi ${age} tuổi ạ."** (hoặc thân mật: *"Mình ${age} tuổi."*)

💡 **Cấu trúc chuẩn:** \`[Đại từ] + [năm nay] + [số tuổi] + tuổi (ạ).\``,
      grammarCorrection: "Không dùng 'có' cho số tuổi. Người Việt nói: 'Tôi [số tuổi] tuổi'.",
      nativeAlternative: `Năm nay tôi ${age} tuổi ạ.`,
      explanation: "Không dùng 'có' để nói tuổi trong tiếng Việt.",
      savedWords: [
        { word: 'Năm nay', meaning: 'This year (placed naturally before stating age)' },
        { word: 'Tuổi', meaning: 'Years old / Age' },
      ],
    };
  }

  // 2. Passive voice error with "bị" vs "được"
  if (lower.includes('bị khen') || lower.includes('bị điểm 10') || lower.includes('bị thưởng') || lower.includes('bị trúng số') || lower.includes('bị tăng lương')) {
    return {
      text: `### 💡 Phân biệt tinh tế: "Được" vs "Bị"
Người Việt rất coi trọng việc thể hiện cảm xúc qua câu bị động:
- **"Được"**: Dành cho điều may mắn, tốt lành hoặc được người khác khen ngợi.
- **"Bị"**: Chỉ dùng cho điều không may, tiêu cực hoặc mang lại cảm giác khó chịu.

Vì vậy, khi được khen hay nhận thưởng, hãy tự hào dùng **"Được"** nhé!

✨ **Câu chuẩn:**  
> **"${query.replace(/bị/g, 'được')}"**`,
      grammarCorrection: "Sai sắc thái: Thay 'bị' bằng 'được' khi nói về điều may mắn, tích cực.",
      nativeAlternative: query.replace(/bị/g, 'được'),
      explanation: "• Được: Điều tốt đẹp, may mắn. • Bị: Rủi ro, không mong muốn.",
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
      text: `### 📝 Trật tự từ trong tiếng Việt
Trong tiếng Việt, **Tính từ luôn đứng SAU Danh từ** để bổ nghĩa (ngược với tiếng Anh *red car* -> *xe đỏ*).

✨ **Câu sửa tự nhiên:**  
> **"${fixed}"**

💡 **Công thức ghi nhớ:** \`[Danh từ] + [Tính từ]\` (ví dụ: *xe đỏ*, *áo đẹp*, *nhà to*, *phở ngon*).`,
      grammarCorrection: "Trật tự từ sai: Tính từ bổ nghĩa phải đứng sau danh từ.",
      nativeAlternative: fixed,
      explanation: "Danh từ đứng trước, tính từ bổ nghĩa đứng sau.",
      savedWords: [
        { word: 'Xe đỏ', meaning: 'Red car (Noun + Adjective)' },
        { word: 'Áo đẹp', meaning: 'Beautiful clothes' },
      ],
    };
  }

  // 4. Food & Coffee
  if (normalized.includes('ca phe') || normalized.includes('coffee')) {
    return {
      text: `### ☕ Văn hóa Cà Phê Việt Nam
Cà phê Việt Nam nổi tiếng với hương vị đậm đà quyến rũ! Đây là các món cà phê kinh điển bạn nên thử:
1. **Cà phê sữa đá** (miền Bắc gọi là *Nâu đá*): Cà phê phin hòa cùng sữa đặc ngọt béo.
2. **Cà phê đen đá**: Dành cho người thích vị đắng nguyên bản (có thể dặn *ít đường*).
3. **Bạc xỉu**: Ngọt ngào, nhẹ nhàng (nhiều sữa, ít cà phê).
4. **Cà phê trứng**: Kem trứng thơm ngậy đánh bông bồng bềnh trên tách cà phê nóng Hà Nội!`,
      nativeAlternative: 'Cho mình một ly cà phê sữa đá ít ngọt nhé!',
      culturalNote: 'Ngồi cà phê vỉa hè ngắm phố xá là thói quen thư giãn đặc trưng của người Việt từ Bắc chí Nam.',
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
      text: `### 🍜 Khám phá Ẩm Thực Đường Phố
Để gọi món ngon chuẩn như người sành ăn, bạn hãy dùng các mẫu câu này nhé:
- Khi ăn Phở: *"Cho cháu một bát phở bò tái nạm, ít hành, kèm đĩa quẩy giòn ạ!"*
- Khi mua Bánh mì: *"Bán cho em một ổ bánh mì thập cẩm, nhiều pate, không ớt nhé chị!"*`,
      nativeAlternative: 'Cho em một bát phở bò chín, nước trong, ít hành nhé ạ!',
      culturalNote: 'Phở miền Bắc chuộng vị thanh nhẹ ăn cùng giấm tỏi và quẩy giòn; phở miền Nam đậm đà ăn kèm tương đen và rổ rau thơm tươi rói.',
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
      text: `### 🛍️ Mẹo Mặc Cả & Hỏi Giá Lịch Sự
Khi mua sắm tại chợ truyền thống Việt Nam:
1. **Hỏi giá nhã nhặn:** *"Dạ cô ơi, cái này giá bao nhiêu một cái/kg ạ?"*
2. **Mặc cả vui vẻ:** *"Cô bớt cho cháu một chút lấy may nhé! Cháu mở hàng cho cô nha!"*
3. **Chốt giá:** *"Hai trăm nghìn được không cô, cháu lấy hai cái luôn ạ!"*`,
      nativeAlternative: 'Dạ cái này bao nhiêu tiền hả chị? Bớt chút cho em mở hàng may mắn nhé!',
      culturalNote: 'Văn hóa "Mở hàng": Người bán rất quý khách mua xởi lởi vào buổi sáng sớm vì tin rằng sẽ mang lại may mắn cả ngày.',
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
      text: `Chào bạn! Rất vui được đồng hành cùng bạn hôm nay! 😊\n\nNgoài câu **"Xin chào"** thông thường, người Việt thường chào thân mật kèm đại từ nhân xưng:\n- *"Chào bạn nhé!"* (với bạn bè)\n- *"Em chào anh/chị ạ!"* (lịch sự với người lớn hơn)\n- *"Bạn ăn cơm chưa?"* (lời chào hỏi thăm tình cảm kinh điển của người Việt!).\n\nHôm nay bạn muốn luyện tập chủ đề gì cùng mình nào?`,
      nativeAlternative: 'Chào bạn nhé! Hôm nay bạn thế nào?',
      culturalNote: '"Ăn cơm chưa?" là câu chào thể hiện sự quan tâm ấm áp, không nhất thiết là mời ăn uống.',
      savedWords: [
        { word: 'Chào bạn nhé', meaning: 'Hello friend (friendly & polite)' },
        { word: 'Ăn cơm chưa?', meaning: 'Have you eaten yet? (Warm Vietnamese greeting)' },
      ],
    };
  }

  // 8. General conversational response
  return {
    text: `Mình hiểu câu bạn vừa chia sẻ: **"${query}"**! 😊\n\nĐây là cách diễn đạt rất tốt và người Việt hoàn toàn hiểu ý bạn. Để luyện tập sâu hơn, bạn muốn:\n1. 💬 Tiếp tục trò chuyện và biến tấu câu này trong tình huống đời thường?\n2. 📝 Xem cách nói tự nhiên hơn của người bản xứ?\n3. 🔍 Tìm hiểu từ vựng hoặc điểm ngữ pháp liên quan?`,
    nativeAlternative: query.endsWith('ạ') ? query : `${query} ạ`,
    explanation: 'Bạn đang diễn đạt rất tốt! Hãy tiếp tục duy trì phản xạ tiếng Việt nhé.',
  };
}

function createDefaultSessions() {
  const initialSession = {
    id: 'session-welcome',
    title: 'Làm quen với AI Tutor',
    mode: 'tutor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg-1',
        sender: 'ai',
        mode: 'tutor',
        text: 'Xin chào bạn! 👋 Tôi là Hola AI Tutor – người bạn đồng hành cùng bạn chinh phục tiếng Việt.\n\nTôi có thể giúp bạn ở 7 chế độ chuyên biệt:\n- 🎓 **Tutor**: Giải đáp từ vựng, ngữ pháp toàn diện\n- 📝 **Grammar**: Soát lỗi ngữ pháp và viết câu tự nhiên\n- 🌐 **Translation**: Dịch thuật 2 chiều kèm giải thích sắc thái\n- 💬 **Conversation**: Luyện phản xạ đối thoại đời thường\n- 🏮 **Culture Guide**: Khám phá phong tục & văn hóa Việt Nam\n- ✈️ **Travel**: Tình huống du lịch, hỏi đường, ăn uống, trả giá\n- 🗺️ **Regional Vietnamese**: Tiếng Việt 3 miền Bắc – Trung – Nam\n\nBạn muốn bắt đầu với chủ đề nào hôm nay?',
        timestamp: new Date().toISOString(),
      },
    ],
  };
  return [initialSession];
}

export const aiTutorService = {
  getModes() {
    return TUTOR_MODES;
  },

  getMode(id) {
    return TUTOR_MODES.find(m => m.id === id) || TUTOR_MODES[0];
  },

  getAllSessions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const defaults = createDefaultSessions();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(stored);
    } catch {
      return createDefaultSessions();
    }
  },

  saveSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  },

  getActiveSessionId() {
    return localStorage.getItem(ACTIVE_SESSION_KEY) || 'session-welcome';
  },

  setActiveSessionId(id) {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  },

  getSession(id) {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === id) || sessions[0];
  },

  async getAiStatus() {
    try {
      const res = await axiosClient.get('/api/ai/status', { timeout: 2500 });
      return unwrapAiPayload(res);
    } catch (error) {
      console.warn('[AI Tutor] Không đọc được trạng thái AI từ backend:', error.message);
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
    const newSession = {
      id: `session-${Date.now()}`,
      title: title || `Hội thoại mới (${modeConfig.name})`,
      mode: mode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'ai',
          mode: mode,
          text: `Chào mừng bạn đến với chế độ **${modeConfig.title}**! ${modeConfig.icon}\n\n${modeConfig.description}\n\nHãy gửi câu hỏi hoặc chọn một trong các gợi ý bên dưới để chúng ta cùng luyện tập nhé!`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Optionally sync session creation to backend asynchronously if backend is up
    axiosClient.post('/api/ai/sessions', { id: newSession.id, mode, title: newSession.title }, { timeout: 3000 }).catch(() => {});

    const sessions = [newSession, ...this.getAllSessions()];
    this.saveSessions(sessions);
    this.setActiveSessionId(newSession.id);
    return newSession;
  },

  renameSession(id, newTitle) {
    const sessions = this.getAllSessions().map(s => {
      if (s.id === id) {
        return { ...s, title: newTitle.trim() || s.title, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveSessions(sessions);
    return sessions.find(s => s.id === id);
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
    return sessions;
  },

  updateSessionMode(id, newMode) {
    const modeConfig = this.getMode(newMode);
    const sessions = this.getAllSessions().map(s => {
      if (s.id === id) {
        const userMsgCount = (s.messages || []).filter(m => m.sender === 'user').length;
        let updatedMessages = s.messages || [];
        let updatedTitle = s.title;

        // If this session has no user messages yet, customize it for the new mode!
        if (userMsgCount === 0) {
          updatedTitle = `Hội thoại mới (${modeConfig.name})`;
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
          // If there's an ongoing chat, add a helpful AI mode switch notification
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
    return sessions.find(s => s.id === id);
  },

  async sendMessage(sessionId, text, currentMode = 'tutor') {
    const sessions = this.getAllSessions();
    let session = sessions.find(s => s.id === sessionId);
    if (!session) {
      // Fallback: auto-create session if somehow not found
      session = this.createSession(currentMode);
      sessionId = session.id;
    }

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      mode: currentMode,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Auto rename session title on first user message if it has a generic title
    let newTitle = session.title;
    if ((session.messages || []).filter(m => m.sender === 'user').length === 0) {
      newTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;
    }

    let aiMsg = null;
    let backendError = null;

    // 1. Try the real Backend AI API. OpenRouter free models can take longer
    // than a normal API request, so keep this configurable per environment.
    try {
      const apiRes = await axiosClient.post(
        `/api/ai/sessions/${sessionId}/messages`,
        {
          text: text.trim(),
          mode: currentMode,
          provider: AI_PROVIDER,
          model: AI_MODEL,
        },
        { timeout: AI_REQUEST_TIMEOUT_MS }
      );

      const r = normalizeAiPayload(unwrapAiPayload(apiRes));
      const aiText = getAiText(r);
      if (aiText) {
        aiMsg = {
          id: r.id || `msg-${Date.now()}-ai`,
          sender: 'ai',
          mode: currentMode,
          text: aiText,
          translation: r.translation || null,
          explanation: r.explanation || null,
          nativeAlternative: r.nativeAlternative || null,
          culturalNote: r.culturalNote || null,
          grammarCorrection: r.grammarCorrection || null,
          grammarCheck: r.grammarCorrection ? {
            original: text.trim(),
            corrected: r.nativeAlternative || text.trim(),
            explanation: r.grammarCorrection,
          } : null,
          savedWords: r.savedWords || [],
          timestamp: r.timestamp || new Date().toISOString(),
        };
      }
    } catch (apiErr) {
      backendError = apiErr;
      // Keep the cause visible in DevTools instead of hiding a BE/API problem.
      console.warn('[AI Tutor] Backend AI request failed:', {
        status: apiErr.status,
        code: apiErr.code,
        message: apiErr.message,
        details: apiErr.details,
      });
    }

    // 2. Do not silently present demo answers when the user has configured
    // backend AI. The old behavior made Gemini failures look like a weak AI.
    if (!aiMsg) {
      if (!ALLOW_OFFLINE_AI_FALLBACK) {
        if (backendError?.code === 'ECONNABORTED' || backendError?.message?.includes('timeout')) {
          throw new Error(`Backend AI không phản hồi trong ${Math.round(AI_REQUEST_TIMEOUT_MS / 1000)} giây. Hãy kiểm tra log backend/OpenRouter hoặc thử lại sau.`);
        }
        if (backendError?.status) {
          const statusLabel = backendError.status === 401
            ? 'Bạn cần đăng nhập lại để sử dụng AI Tutor.'
            : backendError.status === 403
              ? 'Tài khoản hiện không có quyền sử dụng AI Tutor.'
              : `Backend AI trả về HTTP ${backendError.status}.`;
          throw new Error(`${statusLabel}${backendError.message ? ` ${backendError.message}` : ''}`);
        }
        throw new Error('Backend AI không trả về câu trả lời hợp lệ. Hãy kiểm tra request /api/ai/sessions/{id}/messages trong DevTools.');
      }

      console.warn('[AI Tutor] Backend returned no usable text; using local engine because VITE_AI_ALLOW_OFFLINE_FALLBACK=true.');
      const aiResponseData = await this.generateResponse(text, currentMode, session.messages || []);
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

    const updatedSessions = this.getAllSessions().map(s => (s.id === sessionId ? updatedSession : s));
    this.saveSessions(updatedSessions);

    return { userMsg, aiMsg, updatedSession };
  },

  async generateResponse(query, mode, messages = []) {
    // Simulate slight natural AI processing time (350ms)
    await new Promise(r => setTimeout(r, 350));

    const q = query.trim().toLowerCase();

    // Mode: GRAMMAR
    if (mode === 'grammar') {
      if (q.includes('hai quả chuối') || q.includes('ăn nó ngon')) {
        return {
          text: `### 📝 Phân tích & Sửa câu ngữ pháp

**Câu gốc của bạn:**  
> *"Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon."*

**Câu chuẩn tự nhiên của người bản xứ:**  
✨ **"Hôm qua tôi mua hai quả chuối to lắm, ăn rất ngon."**

---

#### 🔍 Các điểm cần cải thiện:
1. **Lược bỏ "đi" & "rất to"**: Trong văn phong nói hàng ngày, người Việt ưa dùng trợ từ biểu cảm cuối câu như **"to lắm"** hoặc **"ngon ghê"** thay vì lặp từ "rất".
2. **Từ "nó" thừa thãi**: Tiếng Việt là ngôn ngữ tỉnh lược chủ ngữ/tân ngữ khi ngữ cảnh đã rõ. Người Việt nói trực tiếp *"ăn rất ngon"* chứ ít khi nói *"ăn nó ngon"*.
3. **Dấu phẩy nối ý**: Tách hai hành động *"mua"* và *"ăn"* bằng dấu phẩy tạo nhịp điệu tự nhiên hơn liên từ *"và"*.

💡 **Cấu trúc gợi ý để ghi nhớ:**  
\`[Chủ ngữ] + [Động từ] + [Danh từ] + [Tính từ + lắm/quá], [Cảm nhận].\``,
          grammarCheck: {
            original: 'Hôm qua tôi đi mua hai quả chuối rất to và ăn nó ngon.',
            corrected: 'Hôm qua tôi mua hai quả chuối to lắm, ăn rất ngon.',
            explanation: 'Bỏ đại từ tân ngữ "nó", thay "rất to" bằng "to lắm" để tăng tính tự nhiên.',
          },
          savedWords: [
            { word: 'To lắm', meaning: 'Very big (natural conversational tone)' },
            { word: 'Ăn rất ngon', meaning: 'Tastes delicious' },
          ],
        };
      }

      return {
        text: `### 📝 Nhận xét & Sửa ngữ pháp

**Câu của bạn:**  
> *"${query}"*

**Gợi ý sửa chuẩn văn phong tiếng Việt:**  
✨ **"${query.replace(/rất/g, 'rất đỗi').replace(/của tôi/g, 'tôi')}"**

---

#### 📌 Quy tắc ngữ pháp trọng tâm:
1. **Trật tự từ Tiếng Việt cơ bản:** \`Chủ ngữ + Vị ngữ + Tân ngữ\`. Tính từ luôn đứng sau danh từ (ví dụ: *áo đẹp*, *xe mới*).
2. **Hạn chế dùng bị động "bị/được" bừa bãi:** Tiếng Việt chuộng câu chủ động. Chỉ dùng **"được"** khi nhận điều may mắn, dùng **"bị"** khi gặp sự việc không vui.
3. **Hư từ & Trợ từ cảm thán:** Thêm các từ như *nhé, nha, nha bạn, nè, á* vào cuối câu khi trò chuyện thân mật sẽ giúp câu nói tự nhiên và gần gũi gấp 10 lần!`,
        grammarCheck: {
          original: query,
          corrected: query,
          explanation: 'Câu tương đối rõ ràng. Hãy lưu ý các từ đệm cảm thán cuối câu để giao tiếp tự nhiên hơn.',
        },
      };
    }

    // Mode: REGIONAL VIETNAMESE
    if (mode === 'regional') {
      if (q.includes('chè') || q.includes('khác gì')) {
        return {
          text: `### 🗺️ Khác biệt từ "Chè" giữa 3 miền Bắc - Trung - Nam

Từ **"Chè"** là một ví dụ kinh điển về sự phong phú của phương ngữ tiếng Việt:

| Vùng miền | Ý nghĩa chính của từ "Chè" | Ví dụ sử dụng |
| :--- | :--- | :--- |
| **Miền Bắc** | Lá trà khô, nước trà xanh đun uống thường nhật | *"Mời bác uống chén chè Thái Nguyên nóng."* |
| **Miền Nam** | Món chè ngọt tráng miệng nấu bằng đậu, nước cốt dừa | *"Trưa nắng ghé làm ly chè đậu đỏ mát lạnh nghen!"* |
| **Miền Trung** | Dùng cho cả hai (trà Huế gọi là chè xanh, món ngọt gọi chè sen, chè bắp) | *"Múc một chén chè bắp Cồn Hến thơm ngọt."* |

---

💡 **Lưu ý giao tiếp du lịch:**  
Khi ở Hà Nội, nếu bạn vào quán gọi *"cho một ly chè"*, chủ quán sẽ mang ra chén nước trà xanh đậm vị. Nhưng nếu ở Sài Gòn, họ sẽ hỏi bạn: *"Ăn chè ba màu hay chè bưởi?"*!`,
          savedWords: [
            { word: 'Chén chè (Bắc)', meaning: 'A cup of green tea' },
            { word: 'Ly chè (Nam)', meaning: 'Sweet dessert soup with coconut milk' },
            { word: 'Nước chè xanh', meaning: 'Fresh boiled green tea' },
          ],
        };
      }

      if (q.includes('mô') || q.includes('tê') || q.includes('răng') || q.includes('rứa') || q.includes('huế') || q.includes('miền trung')) {
        return {
          text: `### 🗺️ Bộ tứ từ địa phương đặc trưng Miền Trung: Mô - Tê - Răng - Rứa

Khi đến Huế, Đà Nẵng, Quảng Nam, bạn sẽ thường xuyên nghe thấy 4 từ này:

1. **MÔ** = Đâu / Ở đâu  
   👉 Ví dụ: *"Đi mô rứa?"* = Đi đâu đấy?
2. **TÊ** = Kia / Đằng kia  
   👉 Ví dụ: *"Ở bên tê cầu Tràng Tiền"* = Ở bên kia cầu Tràng Tiền.
3. **RĂNG** = Sao / Làm sao / Thế nào  
   👉 Ví dụ: *"Răng mà đẹp dữ rứa?"* = Sao mà đẹp thế này?
4. **RỨA** = Thế / Thế đó / Vậy  
   👉 Ví dụ: *"Rứa hả?"* = Thế à? / Vậy sao?

---

🗣️ **Cặp đại từ xưng hô Miền Trung:**  
- **Tau - Mi** = Tao - Mày (bạn bè rất thân)
- **O** = Cô (chị em gái của ba, hoặc cô gái trẻ)`,
          savedWords: [
            { word: 'Đi mô rứa?', meaning: 'Where are you going? (Central VN)' },
            { word: 'Răng mà...', meaning: 'Why / How come... (Central VN)' },
            { word: 'Bên tê', meaning: 'Over there (Central VN)' },
          ],
        };
      }

      return {
        text: `### 🗺️ Bảng đối chiếu từ vựng Bắc - Nam thông dụng

Dưới đây là các cặp từ bạn nhất định phải biết khi đi du lịch xuyên Việt:

| Khái niệm | Miền Bắc | Miền Nam |
| :--- | :--- | :--- |
| **Thìa ăn cơm** | Thìa | Muỗng |
| **Thịt lợn/heo** | Thịt lợn | Thịt heo |
| **Cái nĩa/dĩa** | Dĩa / Xiên | Nĩa |
| **Đĩa đựng đồ ăn** | Đĩa | Dĩa |
| **Bao nylon** | Túi bóng | Bọc / Bịch |
| **Ô / Dù che mưa** | Cái ô | Cây dù |
| **Quả dứa** | Quả dứa | Trái thơm / Trái khóm |

💡 **Ngữ điệu:** Người miền Nam thường nói lướt dấu ngã (~) thành dấu hỏi (?), tạo cảm giác mềm mại và ngọt ngào hơn!`,
        savedWords: [
          { word: 'Cái muỗng (Nam)', meaning: 'Spoon (Northern: Thìa)' },
          { word: 'Cây dù (Nam)', meaning: 'Umbrella (Northern: Cái ô)' },
        ],
      };
    }

    // Mode: CULTURE GUIDE
    if (mode === 'culture_guide') {
      return {
        text: `### 🏮 Chỉ dẫn văn hóa ứng xử Việt Nam

Cảm ơn bạn đã hỏi về nét đẹp văn hóa Việt Nam! Dưới đây là những lưu ý cốt lõi:

#### 1. Văn hóa mời cơm trước bữa ăn:
Người nhỏ tuổi luôn phải **mời người lớn tuổi trước khi cầm đũa**:
- *"Con mời ông bà xới cơm, con mời bố mẹ ăn cơm!"*
- Đây là nét đẹp thể hiện lòng hiếu thảo và sự kính trọng thế hệ đi trước.

#### 2. Quy tắc dùng đũa lịch sự:
- ❌ **Tuyệt đối không cắm thẳng đũa vào bát cơm** (hành động này gợi nhớ bát hương cúng giỗ).
- ❌ Không dùng đũa gõ vào thành bát (quan niệm xưa là thu hút vận xui hoặc người ăn xin).
- ✅ Khi gắp thức ăn cho người khác, người Việt tinh tế thường **quay đầu đũa** lại.

#### 3. Cách xưng hô thể hiện tình cảm:
Người Việt coi xã hội như một đại gia đình. Do đó bạn sẽ thấy người ta xưng hô bằng thứ bậc thân thương như *anh, chị, em, cô, chú, bác* thay vì chỉ dùng *tôi - bạn*.`,
        savedWords: [
          { word: 'Mời cơm', meaning: 'Polite invitation to eat before starting a meal' },
          { word: 'Kính trên nhường dưới', meaning: 'Respecting elders and yielding to youngsters' },
        ],
      };
    }

    // Mode: TRAVEL
    if (mode === 'travel') {
      return {
        text: `### ✈️ Cẩm nang du lịch & Giao tiếp tình huống

Dưới đây là các mẫu câu "sinh tồn" cực kỳ hữu ích cho bạn:

#### 1. Hỏi đường & Bắt xe:
- *"Cho tôi hỏi đường ra Hồ Gươm / Chợ Bến Thành đi hướng nào ạ?"*
- *"Bác tài ơi, chở tôi đến khách sạn [...] nhé, hết khoảng bao nhiêu tiền?"*

#### 2. Gọi món ăn theo khẩu vị:
- *"Cho tôi một bát phở bò chín, không hành hoa, ít ớt nhé!"*
- *"Tôi ăn chay / Tôi bị dị ứng đậu phộng (lạc), món này có đậu phộng không ạ?"*
- *"Cho tôi xin thêm một ly trà đá và giấy ăn nhé!"*

#### 3. Mặc cả giá (Trả giá) lịch sự:
- *"Cái này giá bao nhiêu hả cô/chị?"*
- *"Bớt cho tôi một chút được không? Hai trăm nghìn nhé, tôi lấy hai cái luôn!"*
- *"Mở hàng may mắn cho tôi giá hữu nghị nhé!"*`,
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
        text: `### 🌐 Bản dịch ngữ cảnh chuẩn xác

**Văn bản nguồn:**  
> *"${query}"*

---

#### 🇻🇳 Bản dịch tiếng Việt tự nhiên:
✨ **"${q.includes('spicy') ? 'Làm ơn làm ít cay giúp tôi với nhé, tôi không ăn được cay lắm ạ!' : 'Dạ, câu này trong tiếng Việt đời thường nói là: Xin vui lòng giúp tôi với!'}"**

---

#### 💡 Phân tích sắc thái & Từ vựng:
- Thêm trợ từ **"nhé", "ạ"** ở cuối câu để tăng tính lịch sự và thân thiện.
- Người Việt thường biểu đạt sự nhờ vả bằng mẫu câu: \`"Làm ơn + [Hành động] + giúp tôi với nhé!"\` thay vì dịch từng chữ (word-by-word) từ tiếng Anh.`,
        savedWords: [
          { word: 'Ít cay', meaning: 'Less spicy' },
          { word: 'Làm ơn...', meaning: 'Please (polite request)' },
        ],
      };
    }

    // Mode: CONVERSATION
    if (mode === 'conversation') {
      const cr = conversationalReply(query, messages);
      return typeof cr === 'string' ? { text: cr } : cr;
    }

    // Default TUTOR mode
    const defCr = conversationalReply(query, messages);
    return typeof defCr === 'string' ? { text: defCr } : defCr;
  },
};
