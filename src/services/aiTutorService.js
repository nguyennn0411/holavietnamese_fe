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
    const sessions = this.getAllSessions().map(s => {
      if (s.id === id) {
        return { ...s, mode: newMode, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    this.saveSessions(sessions);
    return sessions.find(s => s.id === id);
  },

  async sendMessage(sessionId, text, currentMode = 'tutor') {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Session not found');

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      mode: currentMode,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Auto rename session title on first user message if it has a generic title
    let newTitle = session.title;
    if (session.messages.filter(m => m.sender === 'user').length === 0) {
      newTitle = text.length > 28 ? `${text.slice(0, 28)}...` : text;
    }

    // Generate intelligent AI response
    const aiResponseData = await this.generateResponse(text, currentMode, session.messages);

    const aiMsg = {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      mode: currentMode,
      text: aiResponseData.text,
      grammarCheck: aiResponseData.grammarCheck || null,
      savedWords: aiResponseData.savedWords || [],
      timestamp: new Date().toISOString(),
    };

    const updatedSession = {
      ...session,
      title: newTitle,
      mode: currentMode,
      updatedAt: new Date().toISOString(),
      messages: [...session.messages, userMsg, aiMsg],
    };

    const updatedSessions = sessions.map(s => (s.id === sessionId ? updatedSession : s));
    this.saveSessions(updatedSessions);

    return { userMsg, aiMsg, updatedSession };
  },

  async generateResponse(query, mode) {
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
      return {
        text: `Chào bạn! Rất vui được trò chuyện với bạn hôm nay! 😊

Tôi nghe bạn nói rất thú vị. Bạn có biết là người Việt Nam cực kỳ thích ngồi quán cóc vỉa hè để uống cà phê hoặc trà chanh chém gió không?

Bạn đã thử món cà phê sữa đá hoặc cà phê trứng của Việt Nam bao giờ chưa? Bạn thấy hương vị của nó thế nào so với cà phê ở nước bạn? Hãy kể cho tôi nghe nhé!`,
      };
    }

    // Default TUTOR mode
    return {
      text: `### 🎓 Giải đáp từ AI Tutor

Chào bạn! Với câu hỏi: **"${query}"**, đây là lời giải thích chi tiết dành cho bạn:

#### 1. Bản chất & Quy tắc cốt lõi:
Trong tiếng Việt, ngữ cảnh và cách dùng từ đóng vai trò quyết định ý nghĩa câu nói. Các từ hư từ như *đã, đang, sẽ, rồi, chưa* giúp xác định thì của hành động mà không cần biến đổi hình thái từ như các ngôn ngữ phương Tây.

#### 2. Ví dụ minh họa thực tế:
- **Câu chuẩn:** *"Tôi đang học tiếng Việt cùng gia sư AI."*
- **Câu mở rộng:** *"Mỗi ngày tôi dành 30 phút luyện tập phản xạ giao tiếp để tự tin hơn."*

#### 3. Mẹo ghi nhớ cho người học:
Hãy ghi nhớ từ vựng theo cụm (collocation) và đặt câu hoàn chỉnh thay vì học từ đơn lẻ. Điều này giúp bạn phản xạ nhanh mà không cần mất thời gian dịch nhẩm trong đầu!`,
      savedWords: [
        { word: 'Phản xạ giao tiếp', meaning: 'Communication reflex' },
        { word: 'Tự tin', meaning: 'Confident' },
      ],
    };
  },
};
