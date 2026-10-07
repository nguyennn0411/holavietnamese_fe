// AI Roleplay & Scenarios Service (Người 4: /ai-scenarios, /ai-scenarios/:id, /ai-roleplay/:id, /ai-sessions/:id/result)

export const SCENARIO_LEVELS = [
  { id: 'all', label: 'Tất cả trình độ' },
  { id: 'A1', label: 'A1 - Sơ cấp 1' },
  { id: 'A2', label: 'A2 - Sơ cấp 2' },
  { id: 'B1', label: 'B1 - Trung cấp 1' },
  { id: 'B2', label: 'B2 - Trung cấp 2' },
  { id: 'C1', label: 'C1 - Nâng cao' },
];

export const SCENARIO_TOPICS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'dining', label: '🍜 Ẩm thực & Quán xá' },
  { id: 'shopping', label: '🛍️ Mua sắm & Mặc cả' },
  { id: 'travel', label: '🛵 Di chuyển & Du lịch' },
  { id: 'hospitality', label: '🏨 Khách sạn & Nghỉ dưỡng' },
  { id: 'social', label: '🏡 Gia đình & Bạn bè' },
  { id: 'work', label: '💼 Giao tiếp công sở' },
];

export const SCENARIOS = [
  {
    id: 'goi-mon-pho-ha-noi',
    title: 'Gọi món tại quán Phở gia truyền Hà Nội',
    level: 'A1',
    levelLabel: 'A1 • Sơ cấp 1',
    topic: 'dining',
    topicLabel: 'Ẩm thực & Quán xá',
    destination: 'Hà Nội',
    difficulty: 'Dễ',
    duration: '5-10 phút',
    thumbnail: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đặt chân đến phố cổ Hà Nội vào một buổi sáng sớm se lạnh và ghé vào một quán phở bò gia truyền đông đúc trên phố Bát Đàn.',
    aiRole: {
      name: 'Cô Mai (Chủ quán Phở)',
      role: 'Chủ quán phở Hà Nội nhanh nhẹn, xưng hô "cô - cháu"',
      avatar: '👩‍🍳',
      tone: 'Thân thiện, xởi lởi, giọng Bắc chuẩn Tràng An, phục vụ nhanh nhẹn',
      initialGreeting: 'Chào cháu! Quán cô đang có bàn trống trong góc kìa, vào ngồi đi cháu! Hôm nay cháu muốn ăn phở bò tái, chín, hay nạm gầu nào?',
    },
    learnerRole: {
      role: 'Du khách lần đầu thưởng thức phở truyền thống',
      context: 'Bạn cần tìm chỗ ngồi, gọi một bát phở bò theo khẩu vị riêng (ít hành, không cay) và gọi thêm đồ uống.',
    },
    objectives: [
      { id: 'task-1', label: 'Chào hỏi và xác nhận chỗ ngồi tại quán', completed: false },
      { id: 'task-2', label: 'Gọi một bát phở bò (tái/chín) kèm yêu cầu đặc biệt (ít hành/ớt)', completed: false },
      { id: 'task-3', label: 'Gọi thêm đồ uống (trà đá/sữa đậu nành) và quẩy giòn', completed: false },
      { id: 'task-4', label: 'Hỏi giá tiền và cảm ơn thanh toán', completed: false },
    ],
    vocabularyHints: [
      { word: 'Bát phở tái chín', meaning: 'Bowl of pho with rare and well-done beef' },
      { word: 'Cho cháu ít hành thôi ạ', meaning: 'Please give me just a little scallion' },
      { word: 'Một đĩa quẩy giòn', meaning: 'A plate of crispy fried dough sticks' },
      { word: 'Một ly trà đá', meaning: 'An iced green tea' },
      { word: 'Hết bao nhiêu tiền ạ?', meaning: 'How much does it cost in total?' },
    ],
    culturalTip: 'Tại các quán phở truyền thống miền Bắc, quẩy được nhúng trực tiếp vào nước dùng phở để hút trọn vị ngọt béo của xương bò.',
  },
  {
    id: 'tra-gia-cho-ben-thanh',
    title: 'Trả giá quà lưu niệm tại Chợ Bến Thành',
    level: 'A2',
    levelLabel: 'A2 • Sơ cấp 2',
    topic: 'shopping',
    topicLabel: 'Mua sắm & Mặc cả',
    destination: 'TP. Hồ Chí Minh',
    difficulty: 'Trung bình',
    duration: '8-12 phút',
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn ghé thăm chợ Bến Thành ở Sài Gòn để mua quà lưu niệm cho bạn bè: nón lá vẽ tay và cà phê Robusta rang xay thơm lừng.',
    aiRole: {
      name: 'Chị Ba Bến Thành',
      role: 'Tiểu thương sành sỏi, hoạt ngôn, xưng hô "chị - em"',
      avatar: '🧣',
      tone: 'Niềm nở, dẻo miệng, giọng Nam Bộ ngọt ngào nhưng báo giá hơi cao',
      initialGreeting: 'Ủa em trai / em gái, ghé sạp chị Ba coi nón lá với cà phê nè! Hàng xịn thủ công loại một đó cưng, mở hàng cho chị một món lấy hên đi!',
    },
    learnerRole: {
      role: 'Khách du lịch muốn mua quà lưu niệm với giá hợp lý',
      context: 'Hỏi giá, khen sản phẩm đẹp, nhưng khéo léo thương lượng giảm từ 20-30% hoặc mua combo để được giá tốt.',
    },
    objectives: [
      { id: 'task-1', label: 'Hỏi giá món đồ lưu niệm bằng tiếng Việt', completed: false },
      { id: 'task-2', label: 'Khen món đồ và đưa ra đề xuất giảm giá lịch sự', completed: false },
      { id: 'task-3', label: 'Đàm phán mua số lượng 2 món để được bớt thêm', completed: false },
      { id: 'task-4', label: 'Chốt giá thân thiện và hoàn tất thanh toán', completed: false },
    ],
    vocabularyHints: [
      { word: 'Cái nón này bao nhiêu tiền chị?', meaning: 'How much is this conical hat, sister?' },
      { word: 'Đắt quá, bớt cho em chút đi!', meaning: 'Too expensive, give me a discount please!' },
      { word: 'Nếu em lấy 2 cái thì chị tính bao nhiêu?', meaning: 'If I take 2, how much will you charge?' },
      { word: 'Giá hữu nghị / Giá mở hàng', meaning: 'Friendly price / First-sale good luck price' },
    ],
    culturalTip: 'Ở miền Nam, nụ cười tươi và cách xưng hô thân mật "Chị Ba ơi, bớt em xíu nghen" luôn là vũ khí trả giá hiệu quả nhất!',
  },
  {
    id: 'bat-xe-om-cong-nghe',
    title: 'Đón xe ôm công nghệ & Chỉ đường đến điểm hẹn',
    level: 'A2',
    levelLabel: 'A2 • Sơ cấp 2',
    topic: 'travel',
    topicLabel: 'Di chuyển & Du lịch',
    destination: 'Hà Nội / Sài Gòn',
    difficulty: 'Dễ - Trung bình',
    duration: '6-10 phút',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đặt một chuyến xe ôm công nghệ trên app và bác tài xế gọi điện thoại xác nhận điểm đón.',
    aiRole: {
      name: 'Bác Hùng (Tài xế công nghệ)',
      role: 'Tài xế xe ôm nhiều năm kinh nghiệm, nhiệt tình và mến khách',
      avatar: '🛵',
      tone: 'Chân chất, hào sảng, xưng "chú - cháu/con"',
      initialGreeting: 'A lô, cháu có phải là người đặt chuyến xe đi Bảo tàng Lịch sử không? Chú đang chạy tới gần rồi, cháu mặc áo màu gì, đứng chỗ nào để chú tấp vào đón?',
    },
    learnerRole: {
      role: 'Hành khách đang chờ đón ở cổng địa điểm',
      context: 'Mô tả vị trí đang đứng, nhận diện biển số xe, yêu cầu tài xế chạy cẩn thận và hỏi han giao thông trên đường.',
    },
    objectives: [
      { id: 'task-1', label: 'Mô tả vị trí và trang phục nhận diện cho tài xế', completed: false },
      { id: 'task-2', label: 'Xác nhận biển số xe và đội mũ bảo hiểm', completed: false },
      { id: 'task-3', label: 'Trò chuyện ngắn về đường xá hoặc thời tiết hôm nay', completed: false },
      { id: 'task-4', label: 'Hỏi quét mã QR thanh toán và gửi lời cảm ơn', completed: false },
    ],
    vocabularyHints: [
      { word: 'Cháu đang đứng trước cổng', meaning: 'I am standing in front of the gate' },
      { word: 'Biển số xe của chú là 29-B1...', meaning: 'Your license plate is 29-B1...' },
      { word: 'Đoạn này có hay bị kẹt xe không chú?', meaning: 'Does this stretch often get traffic jams, uncle?' },
      { word: 'Cháu quét mã QR chuyển khoản nhé', meaning: 'I will scan the QR code to transfer money' },
    ],
    culturalTip: 'Các bác tài xế xe ôm Việt Nam rất thích trò chuyện vui vẻ về cuộc sống và sẵn sàng chỉ cho bạn các quán ăn địa phương ngon nhất.',
  },
  {
    id: 'checkin-khach-san-da-nang',
    title: 'Nhận phòng khách sạn & Hỏi dịch vụ tại Đà Nẵng',
    level: 'B1',
    levelLabel: 'B1 • Trung cấp 1',
    topic: 'hospitality',
    topicLabel: 'Khách sạn & Nghỉ dưỡng',
    destination: 'Đà Nẵng',
    difficulty: 'Trung bình',
    duration: '8-12 phút',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn vừa đến khách sạn 4 sao ven biển Mỹ Khê Đà Nẵng sau chuyến bay dài và làm thủ tục check-in tại quầy lễ tân.',
    aiRole: {
      name: 'Lễ tân Như Ý',
      role: 'Nhân viên lễ tân khách sạn Đà Nẵng chuyên nghiệp, chu đáo',
      avatar: '🛎️',
      tone: 'Lịch thiệp, chuẩn mực dịch vụ, giọng miền Trung nhẹ nhàng dễ thương',
      initialGreeting: 'Dạ em chào quý khách! Chào mừng anh/chị đã đến với Danang Sun Beach Hotel. Em có thể hỗ trợ anh/chị nhận phòng hoặc ký gửi hành lý ạ?',
    },
    learnerRole: {
      role: 'Khách du lịch đã đặt phòng trực tuyến',
      context: 'Cung cấp mã đặt phòng, đề xuất đổi sang phòng tầng cao ngắm biển, hỏi thời gian buffet sáng và xin tư vấn thuê xe máy.',
    },
    objectives: [
      { id: 'task-1', label: 'Cung cấp tên và mã đặt phòng kèm giấy tờ tùy thân', completed: false },
      { id: 'task-2', label: 'Yêu cầu phòng tầng cao có ban công hướng biển', completed: false },
      { id: 'task-3', label: 'Hỏi giờ phục vụ ăn sáng và mật khẩu WiFi', completed: false },
      { id: 'task-4', label: 'Hỏi thủ tục thuê xe máy vi vu bán đảo Sơn Trà', completed: false },
    ],
    vocabularyHints: [
      { word: 'Tôi đã đặt phòng qua mạng', meaning: 'I have booked a room online' },
      { word: 'Phòng ban công hướng biển', meaning: 'Balcony room with ocean view' },
      { word: 'Buffet sáng phục vụ từ mấy giờ?', meaning: 'What time is the breakfast buffet served?' },
      { word: 'Khách sạn có dịch vụ thuê xe máy không?', meaning: 'Does the hotel offer motorbike rental service?' },
    ],
    culturalTip: 'Người Đà Nẵng nổi tiếng thân thiện và mến khách bậc nhất cả nước, luôn sẵn sàng hướng dẫn bạn các quán hải sản người bản địa hay ăn.',
  },
  {
    id: 'ra-mat-gia-dinh-ban',
    title: 'Gặp gỡ và chào hỏi gia đình bạn người Việt',
    level: 'B2',
    levelLabel: 'B2 • Trung cấp 2',
    topic: 'social',
    topicLabel: 'Gia đình & Bạn bè',
    destination: 'Toàn quốc',
    difficulty: 'Nâng cao',
    duration: '10-15 phút',
    thumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn được một người bạn thân mời về thăm nhà dùng cơm trưa nhân dịp cuối tuần. Đây là lần đầu bạn gặp mặt bố mẹ của bạn mình.',
    aiRole: {
      name: 'Bác Hai (Bố của bạn)',
      role: 'Chủ nhà nồng hậu, quý mến bạn của con cái',
      avatar: '👴',
      tone: 'Ấm áp, ân cần, coi trọng lễ nghĩa gia phong',
      initialGreeting: 'Dạ chào cháu! Bác nghe Nam kể nhiều về cháu lắm rồi, hôm nay mới có dịp gặp mặt. Vào nhà uống nước xơi trầu cho mát nhé cháu!',
    },
    learnerRole: {
      role: 'Người bạn ngoại quốc đến thăm nhà dùng cơm',
      context: 'Chào hỏi lễ phép với kính ngữ chuẩn mực, trao món quà nhỏ kèm lời chúc, khen ngợi món ăn và mời cơm đúng phép tắc.',
    },
    objectives: [
      { id: 'task-1', label: 'Chào hỏi bằng kính ngữ "Dạ con chào hai bác ạ"', completed: false },
      { id: 'task-2', label: 'Tặng quà lưu niệm và giải thích ý nghĩa lịch sự', completed: false },
      { id: 'task-3', label: 'Mời cơm người lớn trước khi cầm đũa', completed: false },
      { id: 'task-4', label: 'Cảm ơn lòng hiếu khách trước khi xin phép ra về', completed: false },
    ],
    vocabularyHints: [
      { word: 'Dạ, con chào hai bác ạ!', meaning: 'Polite greeting to the host parents' },
      { word: 'Con có chút hoa quả biếu hai bác', meaning: 'I have some fruits as a gift for you two' },
      { word: 'Con mời hai bác xơi cơm', meaning: 'Polite invitation to eat before starting meal' },
      { word: 'Bác gái nấu ăn ngon quá ạ!', meaning: 'Auntie cooks so deliciously!' },
    ],
    culturalTip: 'Khi đến thăm nhà người Việt, mang theo một giỏ trái cây tươi hoặc trà ngon làm quà biếu là hành động cực kỳ tinh tế và được quý trọng.',
  },
  {
    id: 'phong-van-xin-viec-cong-so',
    title: 'Phỏng vấn xin việc tại doanh nghiệp Việt Nam',
    level: 'C1',
    levelLabel: 'C1 • Nâng cao',
    topic: 'work',
    topicLabel: 'Giao tiếp công sở',
    destination: 'Hà Nội / TP.HCM',
    difficulty: 'Thử thách',
    duration: '12-18 phút',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80',
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    overview: 'Bạn đang tham gia vòng phỏng vấn chuyên sâu cho vị trí Chuyên viên Hợp tác Quốc tế tại một tập đoàn công nghệ lớn ở Việt Nam.',
    aiRole: {
      name: 'Chị Lan Hương (Giám đốc Nhân sự)',
      role: 'Nhà tuyển dụng chuyên nghiệp, đặt câu hỏi logic và tình huống thực tế',
      avatar: '💼',
      tone: 'Trang trọng, chuyên nghiệp, đánh giá cao sự lưu loát và hòa nhập văn hóa',
      initialGreeting: 'Chào bạn. Cảm ơn bạn đã quan tâm đến cơ hội nghề nghiệp tại công ty chúng tôi. Trước hết, bạn vui lòng giới thiệu ngắn gọn về bản thân và lý do bạn muốn làm việc tại Việt Nam nhé.',
    },
    learnerRole: {
      role: 'Ứng viên sáng giá cho vị trí công việc chuyên nghiệp',
      context: 'Trình bày bản thân bằng tiếng Việt chuẩn mực, nêu bật kỹ năng thế mạnh, cách thích nghi môi trường đa văn hóa và hỏi lại nhà tuyển dụng.',
    },
    objectives: [
      { id: 'task-1', label: 'Tự giới thiệu bản thân và kinh nghiệm chuyên môn lưu loát', completed: false },
      { id: 'task-2', label: 'Trình bày động lực làm việc và tình cảm với môi trường Việt Nam', completed: false },
      { id: 'task-3', label: 'Trả lời câu hỏi xử lý bất đồng văn hóa trong làm việc nhóm', completed: false },
      { id: 'task-4', label: 'Đặt câu hỏi thông minh về định hướng phát triển của công ty', completed: false },
    ],
    vocabularyHints: [
      { word: 'Kinh nghiệm chuyên môn', meaning: 'Professional expertise and experience' },
      { word: 'Thích ứng môi trường đa văn hóa', meaning: 'Adapting to multicultural environment' },
      { word: 'Tinh thần làm việc nhóm', meaning: 'Teamwork spirit and collaboration' },
      { word: 'Đóng góp vào sự phát triển', meaning: 'Contribute to the growth/development' },
    ],
    culturalTip: 'Trong văn hóa doanh nghiệp Việt Nam, sự tôn trọng đồng nghiệp, tinh thần đoàn kết và tính khiêm tốn được đánh giá cao ngang bằng với năng lực chuyên môn.',
  },
];

const ROLEPLAY_SESSION_STORAGE = 'hola_ai_roleplay_session_';
const ROLEPLAY_RESULT_STORAGE = 'hola_ai_roleplay_result_';

export const aiRoleplayService = {
  getLevels() {
    return SCENARIO_LEVELS;
  },

  getTopics() {
    return SCENARIO_TOPICS;
  },

  listScenarios({ search = '', level = 'all', topic = 'all' } = {}) {
    let result = [...SCENARIOS];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
      );
    }

    if (level && level !== 'all') {
      result = result.filter(s => s.level === level);
    }

    if (topic && topic !== 'all') {
      result = result.filter(s => s.topic === topic);
    }

    return result;
  },

  getScenario(id) {
    return SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
  },

  getRoleplaySession(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    try {
      const stored = localStorage.getItem(ROLEPLAY_SESSION_STORAGE + scenarioId);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }

    // Default new session
    const session = {
      scenarioId,
      scenarioTitle: scenario.title,
      startTime: new Date().toISOString(),
      messages: [
        {
          id: `rp-${Date.now()}-ai-0`,
          sender: 'ai',
          name: scenario.aiRole.name,
          avatar: scenario.aiRole.avatar,
          text: scenario.aiRole.initialGreeting,
          translation: 'Hello! Our stall has an empty table in the corner, please take a seat! Would you like rare, cooked, or brisket beef pho today?',
          explanation: 'Cô Mai chào đón niềm nở và hỏi bạn muốn ăn loại phở bò nào. Bạn có thể chọn loại phở mình thích và yêu cầu lượng hành/ớt.',
          timestamp: new Date().toISOString(),
        },
      ],
      completedTasks: [],
    };
    this.saveRoleplaySession(scenarioId, session);
    return session;
  },

  saveRoleplaySession(scenarioId, session) {
    try {
      localStorage.setItem(ROLEPLAY_SESSION_STORAGE + scenarioId, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save roleplay session', e);
    }
  },

  resetRoleplaySession(scenarioId) {
    localStorage.removeItem(ROLEPLAY_SESSION_STORAGE + scenarioId);
    return this.getRoleplaySession(scenarioId);
  },

  getSuggestions(scenarioId, messagesCount) {
    const scenario = this.getScenario(scenarioId);
    if (scenarioId === 'goi-mon-pho-ha-noi') {
      if (messagesCount <= 2) {
        return [
          { text: 'Dạ, chào cô ạ! Cho cháu một bát phở bò tái chín, ít hành ít ớt nhé cô!', meaning: 'Hello auntie! Please give me a bowl of rare & cooked beef pho, less scallions and less chili!' },
          { text: 'Dạ cháu chào cô, quán mình còn quẩy giòn không ạ? Cho cháu một bát phở bò chín nhé!', meaning: 'Hello auntie, do you still have crispy dough sticks? Please give me a cooked beef pho!' },
        ];
      }
      if (messagesCount <= 4) {
        return [
          { text: 'Cô cho cháu thêm một đĩa quẩy giòn và một cốc trà đá với ạ!', meaning: 'Auntie, please give me a plate of crispy dough sticks and an iced green tea!' },
          { text: 'Dạ cho cháu xin thêm một chén trứng chần và quả chanh nhé cô!', meaning: 'Please give me a poached egg bowl and a lime, auntie!' },
        ];
      }
      return [
        { text: 'Cô ơi, của cháu hết tất cả bao nhiêu tiền ạ? Cháu gửi cô nhé!', meaning: 'Auntie, how much is my bill in total? Here is the money for you!' },
        { text: 'Phở cô nấu ngon lắm ạ! Cho cháu thanh toán bằng tiền mặt nhé cô!', meaning: 'Your pho is so delicious! Let me pay in cash please!' },
      ];
    }

    if (scenarioId === 'tra-gia-cho-ben-thanh') {
      if (messagesCount <= 2) {
        return [
          { text: 'Dạ chào chị Ba! Cái nón lá thêu hoa sen này chị bán bao nhiêu tiền vậy chị?', meaning: 'Hello sister Ba! How much do you sell this lotus-embroidered conical hat for?' },
          { text: 'Dạ em chào chị, cà phê hạt loại này xuất xứ ở đâu và giá cả thế nào chị ha?', meaning: 'Hello sister, where is this coffee bean from and what is its price?' },
        ];
      }
      return [
        { text: 'Giá ba trăm nghìn hơi cao chị ơi! Bớt cho em chút lấy may mắn đi, hai trăm nhé chị?', meaning: '300,000 VND is a bit high sister! Give me a discount for good luck, 200,000 okay?' },
        { text: 'Nếu em mua 2 cái nón luôn thì chị tính giá hữu nghị cho em bao nhiêu nè?', meaning: 'If I buy 2 hats together, what friendly price will you offer me?' },
      ];
    }

    // Default suggestions
    return [
      { text: `Dạ vâng ạ, tôi hiểu rồi. Tôi rất muốn biết thêm chi tiết về điều này!`, meaning: 'Yes, I understand. I would love to know more details about this!' },
      { text: `Cảm ơn bạn rất nhiều! Bạn có thể hướng dẫn cụ thể hơn cho tôi được không?`, meaning: 'Thank you very much! Could you guide me more specifically?' },
    ];
  },

  async sendRoleplayMessage(scenarioId, userText) {
    const session = this.getRoleplaySession(scenarioId);
    const scenario = this.getScenario(scenarioId);

    const userMsg = {
      id: `rp-${Date.now()}-u`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Simulate smart roleplay response
    await new Promise(r => setTimeout(r, 400));

    const totalUserMsgs = session.messages.filter(m => m.sender === 'user').length + 1;
    let aiText = '';
    let translation = '';
    let explanation = '';
    const newCompletedTasks = [...(session.completedTasks || [])];

    // Evaluate tasks based on message content & turn
    if (scenarioId === 'goi-mon-pho-ha-noi') {
      if (totalUserMsgs === 1) {
        aiText = 'Được rồi cháu ơi! Một bát tái chín ít hành nhé. Cháu có muốn dùng thêm quẩy giòn nhúng nước dùng hay uống trà đá mát lạnh không? Quẩy nhà cô vừa mới rán giòn tan luôn!';
        translation = 'Alright! One rare and well-done pho with less scallions. Would you like crispy dough sticks or cold iced green tea? Our sticks are freshly fried and very crispy!';
        explanation = 'Cô Mai đã ghi nhận món ăn và chủ động gợi ý đồ ăn kèm (quẩy) cùng thức uống (trà đá). Bạn hãy gọi thêm món nhé!';
        if (!newCompletedTasks.includes('task-1')) newCompletedTasks.push('task-1');
        if (!newCompletedTasks.includes('task-2')) newCompletedTasks.push('task-2');
      } else if (totalUserMsgs === 2) {
        aiText = 'Có ngay đây cháu! Một đĩa quẩy vàng ruộm và cốc trà đá bớt ngọt đây. Cháu ăn thử miếng thịt bò xem có vừa miệng không, bên cạnh có dấm tỏi với tương ớt cay đấy nhé!';
        translation = 'Here you go! One golden plate of crispy dough sticks and a green tea. Try the beef and see if it fits your taste, garlic vinegar and chili sauce are right beside you!';
        explanation = 'Cô Mai mang đồ ăn ra và dặn bạn cách nêm nếm gia vị chuẩn Hà Nội (dấm tỏi, tương ớt). Bạn có thể khen ngon và chuẩn bị xin thanh toán.';
        if (!newCompletedTasks.includes('task-3')) newCompletedTasks.push('task-3');
      } else {
        aiText = 'Của cháu bát phở bốn mươi lăm nghìn, quẩy mười nghìn, trà đá năm nghìn, tất cả tròn sáu mươi nghìn đồng cháu nhé! Cảm ơn cháu nhiều, chúc cháu có chuyến đi chơi Hà Nội vui vẻ nha!';
        translation = 'Your bill is 45k for pho, 10k for dough sticks, 5k for iced tea, total is exactly 60,000 VND! Thank you very much, have a wonderful trip in Hanoi!';
        explanation = 'Cô Mai đã báo chi tiết từng món và tổng tiền rất rõ ràng. Nhiệm vụ thanh toán hoàn tất xuất sắc!';
        if (!newCompletedTasks.includes('task-4')) newCompletedTasks.push('task-4');
      }
    } else {
      // Generic smart roleplay
      aiText = `Hay quá bạn ơi! Nghe bạn nói bằng tiếng Việt tự nhiên thế này tôi mừng lắm. Tôi rất tán thành ý của bạn. Bạn còn thắc mắc hay muốn tìm hiểu thêm điều gì nữa không?`;
      translation = `Awesome! Hearing you speak Vietnamese so naturally makes me so glad. I completely agree with your point. Do you have any other questions or things you want to know?`;
      explanation = `Đối phương tiếp nhận phản hồi của bạn rất tích cực và cởi mở. Bạn đang hoàn thành rất tốt vai diễn của mình!`;
      if (totalUserMsgs >= 1 && !newCompletedTasks.includes('task-1')) newCompletedTasks.push('task-1');
      if (totalUserMsgs >= 2 && !newCompletedTasks.includes('task-2')) newCompletedTasks.push('task-2');
      if (totalUserMsgs >= 3 && !newCompletedTasks.includes('task-3')) newCompletedTasks.push('task-3');
      if (totalUserMsgs >= 4 && !newCompletedTasks.includes('task-4')) newCompletedTasks.push('task-4');
    }

    const aiMsg = {
      id: `rp-${Date.now()}-ai`,
      sender: 'ai',
      name: scenario.aiRole.name,
      avatar: scenario.aiRole.avatar,
      text: aiText,
      translation,
      explanation,
      timestamp: new Date().toISOString(),
    };

    session.messages.push(userMsg, aiMsg);
    session.completedTasks = newCompletedTasks;
    this.saveRoleplaySession(scenarioId, session);

    return { userMsg, aiMsg, session };
  },

  finishRoleplayAndGetResult(scenarioId) {
    const session = this.getRoleplaySession(scenarioId);
    const scenario = this.getScenario(scenarioId);

    const userMessages = session.messages.filter(m => m.sender === 'user');
    const taskCount = scenario.objectives.length;
    const completedCount = Math.max(session.completedTasks.length, Math.min(taskCount, userMessages.length + 1));

    const fluencyScore = Math.min(95, 75 + userMessages.length * 5);
    const vocabScore = Math.min(92, 78 + userMessages.length * 4);
    const grammarScore = Math.min(90, 80 + userMessages.length * 3);
    const cultureScore = Math.min(98, 85 + userMessages.length * 3);
    const totalScore = Math.round((fluencyScore + vocabScore + grammarScore + cultureScore) / 4);

    const result = {
      sessionId: `session-${scenarioId}-${Date.now()}`,
      scenarioId,
      scenarioTitle: scenario.title,
      level: scenario.levelLabel,
      completedDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      totalScore,
      rating: totalScore >= 90 ? 'Xuất sắc' : totalScore >= 80 ? 'Rất tốt' : 'Đạt yêu cầu',
      stats: {
        fluency: fluencyScore,
        vocabulary: vocabScore,
        grammar: grammarScore,
        culture: cultureScore,
      },
      completedTasksRatio: `${completedCount}/${taskCount}`,
      aiFeedback: `Bạn đã hoàn thành xuất sắc vai diễn trong kịch bản "${scenario.title}"! Khả năng phản xạ và nắm bắt ngữ cảnh văn hóa rất ấn tượng. Bạn đã sử dụng đúng kính ngữ phù hợp với vai trò của nhân vật và biểu đạt mong muốn một cách lịch sự, tự nhiên.`,
      corrections: [
        {
          original: 'Cho tôi một phở bò tái.',
          nativeSuggestion: 'Dạ cho cháu một bát phở bò tái chín, ít hành nhé cô!',
          reason: 'Thêm kính ngữ "Dạ... nhé cô" và từ chỉ loại bát phở "một bát" để câu nói mang đậm phong thái giao tiếp Hà Nội.',
        },
        {
          original: 'Cái này hết bao nhiêu?',
          nativeSuggestion: 'Dạ của cháu hết tất cả bao nhiêu tiền ạ?',
          reason: 'Dùng từ "bao nhiêu tiền ạ" với người bán lớn tuổi thể hiện sự tôn trọng và lễ phép đúng chuẩn mực người Việt.',
        },
      ],
      practicedExpressions: [
        { phrase: 'Bát phở tái chín ít hành', meaning: 'Bowl of rare & cooked pho with less scallions' },
        { phrase: 'Cho cháu xin thêm trà đá', meaning: 'Please give me extra iced green tea' },
        { phrase: 'Của cháu hết bao nhiêu tiền ạ?', meaning: 'How much is my bill in total please?' },
        { phrase: 'Cảm ơn cô nhiều ạ!', meaning: 'Thank you very much auntie!' },
      ],
      nextScenario: SCENARIOS.find(s => s.id !== scenarioId) || SCENARIOS[1],
    };

    localStorage.setItem(ROLEPLAY_RESULT_STORAGE + scenarioId, JSON.stringify(result));
    return result;
  },

  getResult(scenarioId) {
    try {
      const stored = localStorage.getItem(ROLEPLAY_RESULT_STORAGE + scenarioId);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return this.finishRoleplayAndGetResult(scenarioId);
  },
};
