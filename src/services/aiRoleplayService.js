// AI Roleplay & Scenarios Service (Người 4: /ai-scenarios, /ai-scenarios/:id, /ai-roleplay/:id, /ai-sessions/:id/result)

import axiosClient from '@/infrastructure/api/axiosClient';
import { detectInputLanguage, getCurrentUserStorageKey } from './aiTutorService';

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

const ROLEPLAY_SESSION_STORAGE = 'hola_ai_roleplay_session_v2_';
const ROLEPLAY_RESULT_STORAGE = 'hola_ai_roleplay_result_v2_';
const getRoleplaySessionKey = (scenarioId) => `${ROLEPLAY_SESSION_STORAGE}${getCurrentUserStorageKey()}_${scenarioId}`;
const getRoleplayResultKey = (scenarioId) => `${ROLEPLAY_RESULT_STORAGE}${getCurrentUserStorageKey()}_${scenarioId}`;
const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openrouter';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'openrouter/free';
const AI_REQUEST_TIMEOUT_MS = Math.max(5000, Number(import.meta.env.VITE_AI_REQUEST_TIMEOUT_MS) || 30000);

const unwrapAiPayload = (response) => response?.result ?? response?.data ?? response ?? {};

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
  const rawText = getAiText(payload);
  if (typeof rawText !== 'string') return payload;
  const candidate = rawText.trim();
  if (!candidate.startsWith('{') || !candidate.endsWith('}')) return payload;
  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === 'object' ? { ...payload, ...parsed } : payload;
  } catch {
    return payload;
  }
};

const buildRoleplayContext = (scenario, session, lang = 'vi') => {
  const completed = new Set(session.completedTasks || []);
  const remainingObjectives = (scenario.objectives || [])
    .filter(objective => !completed.has(objective.id))
    .map(objective => `- ${objective.id}: ${objective.label}`)
    .join('\\n');
  const recentMessages = (session.messages || [])
    .slice(-8)
    .map(message => `${message.sender === 'user' ? 'HỌC VIÊN' : scenario.aiRole.name}: ${message.text}`)
    .join('\\n');

  return [
    'Bạn đang tham gia roleplay học tiếng Việt theo kịch bản bắt buộc.',
    `KỊCH BẢN: ${scenario.title}`,
    `BỐI CẢNH: ${scenario.overview}`,
    `VAI AI: ${scenario.aiRole.name} — ${scenario.aiRole.role}`,
    `GIỌNG ĐIỆU: ${scenario.aiRole.tone}`,
    `VAI HỌC VIÊN: ${scenario.learnerRole?.role}`,
    `MỤC TIÊU: ${scenario.learnerRole?.context}`,
    'MỤC TIÊU CHƯA HOÀN THÀNH:',
    remainingObjectives || '- Không còn mục tiêu bắt buộc; hãy kết thúc tự nhiên.',
    `TỪ/CỤM TỪ NÊN KHUYẾN KHÍCH: ${(scenario.vocabularyHints || []).map(item => item.word).join(', ')}`,
    `LƯU Ý VĂN HÓA: ${scenario.culturalTip}`,
    'LỊCH SỬ GẦN ĐÂY:',
    recentMessages,
    lang === 'en'
      ? 'QUY TẮC: Học viên vừa hỏi/nói bằng TIẾNG ANH. Hãy ở trong vai và trả lời bằng TIẾNG ANH (có thể kèm cụm từ tiếng Việt ngắn trong ngoặc). Bám sát kịch bản, trả JSON hợp lệ gồm text, translation, explanation, completedTasks; không bọc markdown.'
      : 'QUY TẮC: Học viên vừa hỏi/nói bằng TIẾNG VIỆT. Luôn ở trong vai, trả lời bằng TIẾNG VIỆT và bám kịch bản. Nếu học viên nói lệch chủ đề, trả lời ngắn tối đa một câu rồi kéo họ về mục tiêu gần nhất. Trả JSON hợp lệ gồm text, translation, explanation, completedTasks; không bọc markdown.',
  ].join('\\n');
};

let dynamicScenarios = [...SCENARIOS];

// --- Objective evaluator -------------------------------------------------
// The backend roleplay endpoint only returns the character's reply, so the
// learner's progress is evaluated here from what the learner actually said.
const normalizeVi = (text = '') => String(text)
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const OBJECTIVE_KEYWORDS = {
  'goi-mon-pho-ha-noi': {
    'task-1': ['chao', 'ngoi', 'ban trong', 'cho ngoi'],
    'task-2': ['pho', 'tai', 'chin', 'nam', 'gau', 'hanh', 'ot', 'cay', 'bat'],
    'task-3': ['tra da', 'quay', 'sua dau', 'do uong', 'uong', 'nuoc', 'chanh', 'trung'],
    'task-4': ['bao nhieu', 'tien', 'thanh toan', 'tinh tien', 'cam on', 'gui co'],
  },
  'tra-gia-cho-ben-thanh': {
    'task-1': ['bao nhieu', 'gia'],
    'task-2': ['dep', 'bot', 'giam', 'dat qua', 'mac qua', 're hon'],
    'task-3': ['hai cai', '2 cai', 'lay hai', 'lay 2', 'mua hai', 'mua 2', 'combo'],
    'task-4': ['chot', 'thanh toan', 'gui chi', 'cam on', 'dong y', 'lay luon'],
  },
  'bat-xe-om-cong-nghe': {
    'task-1': ['dung', 'ao', 'cong', 'truoc', 'mac'],
    'task-2': ['bien so', 'mu', 'non bao hiem', 'bao hiem'],
    'task-3': ['ket xe', 'tac duong', 'duong', 'thoi tiet', 'nang', 'mua'],
    'task-4': ['qr', 'quet', 'chuyen khoan', 'thanh toan', 'cam on'],
  },
  'checkin-khach-san-da-nang': {
    'task-1': ['dat phong', 'ma dat', 'ma phong', 'ten la', 'ho chieu', 'giay to', 'cmnd', 'can cuoc'],
    'task-2': ['tang cao', 'ban cong', 'huong bien', 'view', 'nhin ra bien'],
    'task-3': ['an sang', 'buffet', 'wifi', 'mat khau'],
    'task-4': ['thue xe', 'xe may', 'son tra'],
  },
  'ra-mat-gia-dinh-ban': {
    'task-1': ['chao hai bac', 'chao bac', 'con chao', 'chau chao'],
    'task-2': ['qua', 'bieu', 'tang'],
    'task-3': ['moi', 'xoi com', 'an com'],
    'task-4': ['cam on', 'xin phep', 've'],
  },
  'phong-van-xin-viec-cong-so': {
    'task-1': ['gioi thieu', 'kinh nghiem', 'ten toi', 'toi la'],
    'task-2': ['dong luc', 'viet nam', 'yeu thich', 'muon lam', 'gan bo'],
    'task-3': ['bat dong', 'van hoa', 'lam viec nhom', 'xung dot', 'dong nghiep'],
    'task-4': ['cau hoi', 'dinh huong', 'phat trien', 'cong ty', 'lo trinh'],
  },
};

const STOPWORDS = new Set(['va', 'cua', 'cho', 'voi', 'mot', 'cac', 'nhung', 'tai', 'den', 'trong', 'hoac', 'kem', 'de', 'la', 've']);

const includesPhrase = (haystack, phrase) => (` ${haystack} `).includes(` ${phrase} `);

const objectiveMatched = (scenarioId, objective, normalizedText) => {
  const keywords = OBJECTIVE_KEYWORDS[scenarioId]?.[objective.id];
  if (keywords) return keywords.some(k => includesPhrase(normalizedText, k));
  // Admin-created scenario: match on meaningful words from the objective label.
  const words = normalizeVi(objective.label).split(' ').filter(w => w.length >= 2 && !STOPWORDS.has(w));
  const hits = words.filter(w => includesPhrase(normalizedText, w)).length;
  return hits >= Math.min(2, words.length);
};

/** Returns the merged list of completed objective ids after a learner turn. */
export const evaluateObjectives = (scenario, previousCompleted = [], userText = '') => {
  const objectives = scenario?.objectives || [];
  const completed = new Set(previousCompleted || []);
  const text = normalizeVi(userText);
  if (!text) return [...completed];

  let matchedAny = false;
  objectives.forEach(objective => {
    if (!completed.has(objective.id) && objectiveMatched(scenario.id, objective, text)) {
      completed.add(objective.id);
      matchedAny = true;
    }
  });

  // A meaningful on-topic reply still moves the conversation forward:
  // complete the next pending objective in order.
  if (!matchedAny && text.split(' ').length >= 4) {
    const next = objectives.find(objective => !completed.has(objective.id));
    if (next) completed.add(next.id);
  }

  // Keep the original objective order.
  return objectives.map(o => o.id).filter(objId => completed.has(objId));
};

const mergeScenarioItem = (item) => {
  const existing = SCENARIOS.find(s => s.id === item.id) || {};
  const rawObjectives = Array.isArray(item.objectives) && item.objectives.length > 0 ? item.objectives : (existing.objectives || []);
  const normalizedObjectives = rawObjectives.map((obj, idx) => (typeof obj === 'string' ? { id: `task-${idx + 1}`, label: obj, completed: false } : { id: obj?.id || `task-${idx + 1}`, label: obj?.label || String(obj || ''), completed: Boolean(obj?.completed) }));
  const rawHints = Array.isArray(item.vocabularyHints) && item.vocabularyHints.length > 0 ? item.vocabularyHints : (existing.vocabularyHints || []);
  const normalizedHints = rawHints.map(h => (typeof h === 'string' ? { word: h, meaning: '' } : { word: h?.word || '', meaning: h?.meaning || '' }));
  const topicObj = SCENARIO_TOPICS.find(t => t.id === (item.topic || existing.topic));
  const levelObj = SCENARIO_LEVELS.find(l => l.id === (item.level || existing.level));
  return {
    ...existing,
    ...item,
    title: item.title || existing.title || 'Kịch bản giao tiếp',
    overview: item.overview || existing.overview || '',
    destination: item.destination || existing.destination || 'Việt Nam',
    difficulty: item.difficulty || existing.difficulty || 'Trung bình',
    duration: item.duration || existing.duration || '5-10 phút',
    thumbnail: item.thumbnail || existing.thumbnail || SCENARIOS[0].thumbnail,
    coverImage: item.coverImage || existing.coverImage || item.thumbnail || existing.thumbnail || SCENARIOS[0].coverImage,
    topicLabel: existing.topicLabel || (topicObj ? topicObj.label.replace(/^[^\s]+\s/, '') : (item.topicLabel || item.topic || '')),
    levelLabel: existing.levelLabel || (levelObj ? levelObj.label.replace(' - ', ' • ') : (item.levelLabel || item.level || '')),
    aiRole: item.aiRole?.name ? { ...(existing.aiRole || {}), ...item.aiRole } : (existing.aiRole || { name: 'Nhân vật AI', role: 'Người bản xứ', avatar: '🎭', tone: 'Thân thiện', initialGreeting: 'Xin chào bạn!' }),
    learnerRole: item.learnerRole?.role ? { ...(existing.learnerRole || {}), ...item.learnerRole } : (existing.learnerRole || { role: 'Người học tiếng Việt', context: '' }),
    objectives: normalizedObjectives,
    vocabularyHints: normalizedHints,
    culturalTip: item.culturalTip || existing.culturalTip || '',
  };
};

if (typeof window !== 'undefined') {
  axiosClient.get('/api/ai/scenarios')
    .then(res => {
      const list = res?.result ?? res;
      if (Array.isArray(list) && list.length > 0) {
        const map = new Map();
        list.forEach(item => {
          const existing = SCENARIOS.find(s => s.id === item.id) || {};
          // merged via mergeScenarioItem
          map.set(item.id, mergeScenarioItem(item));
          void ({
            ...existing,
            ...item,
            aiRole: item.aiRole || existing.aiRole,
            learnerRole: item.learnerRole || existing.learnerRole,
            objectives: item.objectives || existing.objectives || [],
            vocabularyHints: item.vocabularyHints || existing.vocabularyHints || [],
          });
        });
        dynamicScenarios = Array.from(map.values()).filter(s => s.status === 'ACTIVE');
      }
    })
    .catch(() => {});
}

export const aiRoleplayService = {
  getLevels() {
    return SCENARIO_LEVELS;
  },

  getTopics() {
    return SCENARIO_TOPICS;
  },

  listScenarios({ search = '', level = 'all', topic = 'all' } = {}) {
    let result = [...dynamicScenarios];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          (s.overview || '').toLowerCase().includes(q) ||
          (s.destination || '').toLowerCase().includes(q)
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
    return dynamicScenarios.find(s => s.id === id) || SCENARIOS.find(s => s.id === id) || SCENARIOS[0];
  },

  async fetchScenarios() {
    return this.fetchActiveScenarios();
  },

  async fetchActiveScenarios() {
    try {
      const res = await axiosClient.get('/api/ai/scenarios');
      const list = res?.result ?? res;
      if (Array.isArray(list) && list.length > 0) {
        const map = new Map();
        list.forEach(item => {
          const existing = SCENARIOS.find(s => s.id === item.id) || {};
          // merged via mergeScenarioItem
          map.set(item.id, mergeScenarioItem(item));
          void ({
            ...existing,
            ...item,
            aiRole: item.aiRole || existing.aiRole,
            learnerRole: item.learnerRole || existing.learnerRole,
            objectives: item.objectives || existing.objectives || [],
            vocabularyHints: item.vocabularyHints || existing.vocabularyHints || [],
          });
        });
        dynamicScenarios = Array.from(map.values()).filter(s => s.status === 'ACTIVE');
      }
    } catch {
      // fallback
    }
    return dynamicScenarios;
  },

  getRoleplaySession(scenarioId) {
    const scenario = this.getScenario(scenarioId);
    try {
      const stored = localStorage.getItem(getRoleplaySessionKey(scenarioId));
      if (stored) {
        const parsed = JSON.parse(stored);
        let completed = parsed.completedTasks || [];
        (parsed.messages || []).forEach(msg => {
          if (msg.sender === 'user') {
            completed = evaluateObjectives(scenario, completed, msg.text);
          }
        });
        if (completed.length !== (parsed.completedTasks || []).length) {
          parsed.completedTasks = completed;
          this.saveRoleplaySession(scenarioId, parsed);
        }
        return parsed;
      }
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
      localStorage.setItem(getRoleplaySessionKey(scenarioId), JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save roleplay session', e);
    }
  },

  async initRoleplaySession(scenarioId) {
    const session = this.getRoleplaySession(scenarioId);
    if (!session.backendSessionId && localStorage.getItem('token')) {
      try {
        const res = await axiosClient.post(`/api/ai/roleplay/start/${scenarioId}`);
        const newId = res?.result?.id || res?.id;
        if (newId) {
          session.backendSessionId = newId;
          this.saveRoleplaySession(scenarioId, session);
        }
      } catch (err) {
        console.warn('[AI Roleplay] Could not init backend session:', err.message);
      }
    }
    return session;
  },

  resetRoleplaySession(scenarioId) {
    localStorage.removeItem(getRoleplayResultKey(scenarioId));
    localStorage.removeItem(getRoleplaySessionKey(scenarioId));
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

    // Roleplay pages can be opened by guests. Avoid sending an unauthenticated
    // request to the protected backend; logged-in learners still get the real
    // AI response and the axios client can refresh an expired token.
    if (localStorage.getItem('token')) {
      try {
        let backendSessionId = session.backendSessionId;
        if (!backendSessionId) {
          try {
            const startRes = await axiosClient.post(`/api/ai/roleplay/start/${scenarioId}`);
            backendSessionId = startRes?.result?.id || startRes?.id;
            if (backendSessionId) {
              session.backendSessionId = backendSessionId;
              this.saveRoleplaySession(scenarioId, session);
            }
          } catch (initErr) {
            console.warn('[AI Roleplay] Could not start backend session before message:', initErr.message);
          }
        }

        if (backendSessionId) {
          const apiRes = await axiosClient.post(
            `/api/ai/roleplay/sessions/${backendSessionId}/messages`,
            {
              text: userMsg.text,
              mode: 'roleplay',
              provider: AI_PROVIDER,
              model: AI_MODEL,
              scenarioId,
              language: detectInputLanguage(userMsg.text),
              scenarioContext: buildRoleplayContext(scenario, session, detectInputLanguage(userMsg.text)),
            },
            { timeout: AI_REQUEST_TIMEOUT_MS },
          );
          const response = normalizeAiPayload(unwrapAiPayload(apiRes));
          const responseText = getAiText(response);

          if (responseText) {
            const evaluatedTasks = evaluateObjectives(
              scenario,
              response.completedTasks || session.completedTasks || [],
              userMsg.text,
            );
            const updatedSession = {
              ...session,
              backendSessionId,
              messages: [...(session.messages || []), userMsg, {
                id: response.id || `rp-${Date.now()}-ai`,
                sender: 'ai',
                name: scenario.aiRole.name,
                avatar: scenario.aiRole.avatar,
                text: responseText,
                translation: response.translation || '',
                explanation: response.explanation || '',
                timestamp: response.timestamp || new Date().toISOString(),
              }],
              completedTasks: evaluatedTasks,
            };
            this.saveRoleplaySession(scenarioId, updatedSession);
            return {
              userMsg,
              aiMsg: updatedSession.messages[updatedSession.messages.length - 1],
              session: updatedSession,
            };
          }
        }
      } catch (error) {
        console.warn('[AI Roleplay] Backend AI unavailable; using local scenario fallback:', error.message);
      }
    }

    // Simulate smart roleplay response
    await new Promise(r => setTimeout(r, 400));

    const totalUserMsgs = session.messages.filter(m => m.sender === 'user').length + 1;
    const isEn = detectInputLanguage(userMsg.text) === 'en';
    let aiText = '';
    let translation = '';
    let explanation = '';
    const newCompletedTasks = [...(session.completedTasks || [])];

    // Evaluate tasks based on message content & turn
    if (scenarioId === 'goi-mon-pho-ha-noi') {
      if (totalUserMsgs === 1) {
        aiText = isEn
          ? 'Alright! One rare and well-done pho with less scallions coming right up. Would you like crispy dough sticks (quẩy giòn) or cold iced green tea (trà đá)? Our dough sticks are freshly fried!'
          : 'Được rồi cháu ơi! Một bát tái chín ít hành nhé. Cháu có muốn dùng thêm quẩy giòn nhúng nước dùng hay uống trà đá mát lạnh không? Quẩy nhà cô vừa mới rán giòn tan luôn!';
        translation = 'Alright! One rare and well-done pho with less scallions. Would you like crispy dough sticks or cold iced green tea? Our sticks are freshly fried and very crispy!';
        explanation = 'Cô Mai đã ghi nhận món ăn và chủ động gợi ý đồ ăn kèm (quẩy) cùng thức uống (trà đá). Bạn hãy gọi thêm món nhé!';
        if (!newCompletedTasks.includes('task-1')) newCompletedTasks.push('task-1');
        if (!newCompletedTasks.includes('task-2')) newCompletedTasks.push('task-2');
      } else if (totalUserMsgs === 2) {
        aiText = isEn
          ? 'Here you go! One golden plate of crispy dough sticks and an iced green tea. Try the beef and see if it fits your taste—garlic vinegar and chili sauce are right beside you!'
          : 'Có ngay đây cháu! Một đĩa quẩy vàng ruộm và cốc trà đá bớt ngọt đây. Cháu ăn thử miếng thịt bò xem có vừa miệng không, bên cạnh có dấm tỏi với tương ớt cay đấy nhé!';
        translation = 'Here you go! One golden plate of crispy dough sticks and a green tea. Try the beef and see if it fits your taste, garlic vinegar and chili sauce are right beside you!';
        explanation = 'Cô Mai mang đồ ăn ra và dặn bạn cách nêm nếm gia vị chuẩn Hà Nội (dấm tỏi, tương ớt). Bạn có thể khen ngon và chuẩn bị xin thanh toán.';
        if (!newCompletedTasks.includes('task-3')) newCompletedTasks.push('task-3');
      } else {
        aiText = isEn
          ? 'Your bill is 45,000 VND for pho, 10,000 VND for dough sticks, and 5,000 VND for iced tea—60,000 VND in total! Thank you so much, and have a wonderful trip in Hanoi!'
          : 'Của cháu bát phở bốn mươi lăm nghìn, quẩy mười nghìn, trà đá năm nghìn, tất cả tròn sáu mươi nghìn đồng cháu nhé! Cảm ơn cháu nhiều, chúc cháu có chuyến đi chơi Hà Nội vui vẻ nha!';
        translation = 'Your bill is 45k for pho, 10k for dough sticks, 5k for iced tea, total is exactly 60,000 VND! Thank you very much, have a wonderful trip in Hanoi!';
        explanation = 'Cô Mai đã báo chi tiết từng món và tổng tiền rất rõ ràng. Nhiệm vụ thanh toán hoàn tất xuất sắc!';
        if (!newCompletedTasks.includes('task-4')) newCompletedTasks.push('task-4');
      }
    } else {
      // Generic smart roleplay
      aiText = isEn
        ? `Awesome! I completely understand and agree with your point. Do you have any other questions or requests for me in this scenario?`
        : `Hay quá bạn ơi! Nghe bạn nói bằng tiếng Việt tự nhiên thế này tôi mừng lắm. Tôi rất tán thành ý của bạn. Bạn còn thắc mắc hay muốn tìm hiểu thêm điều gì nữa không?`;
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
    session.completedTasks = evaluateObjectives(scenario, newCompletedTasks, userMsg.text);
    this.saveRoleplaySession(scenarioId, session);

    return { userMsg, aiMsg, session };
  },

  async finishRoleplayAndGetResult(scenarioId) {
    const result = this.buildRoleplayResult(scenarioId);

    // Synchronize completion with backend to update completionsCount and admin stats
    // (deduplicated: skipped if progress already reported 100% for this session)
    await this.reportCompletion(scenarioId, result.totalScore);

    localStorage.setItem(getRoleplayResultKey(scenarioId), JSON.stringify(result));
    return result;
  },

  buildRoleplayResult(scenarioId) {
    const session = this.getRoleplaySession(scenarioId);
    const scenario = this.getScenario(scenarioId);

    const userMessages = session.messages.filter(m => m.sender === 'user');
    const taskCount = scenario.objectives.length;
    const completedCount = Math.min(taskCount, (session.completedTasks || []).length);
    const objectiveRatio = taskCount > 0 ? completedCount / taskCount : 0;
    const allTexts = userMessages.map(m => String(m.text || '').trim()).filter(Boolean);
    const joinedNormalized = normalizeVi(allTexts.join(' '));
    const words = joinedNormalized ? joinedNormalized.split(' ').filter(Boolean) : [];
    const uniqueWords = new Set(words);
    const avgWordsPerTurn = userMessages.length > 0 ? words.length / userMessages.length : 0;

    const fluencyScore = userMessages.length === 0 ? 0 : Math.min(98, Math.max(35, Math.min(35, userMessages.length * 8) + Math.min(30, Math.round(avgWordsPerTurn * 3)) + Math.round(objectiveRatio * 35)));
    const hints = scenario.vocabularyHints || [];
    const matchedHints = hints.filter(h => normalizeVi(h.word).split(' ').filter(w => w.length >= 2 && !STOPWORDS.has(w)).some(hw => includesPhrase(joinedNormalized, hw))).length;
    const hintRatio = hints.length > 0 ? matchedHints / hints.length : objectiveRatio;
    const vocabScore = userMessages.length === 0 ? 0 : Math.min(98, Math.max(35, 30 + Math.round(hintRatio * 30) + Math.min(40, uniqueWords.size * 2)));
    const hasDiacritics = /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/i.test(allTexts.join(' '));
    const fullSentenceRatio = userMessages.length > 0 ? allTexts.filter(t => t.split(/\s+/).length >= 4).length / userMessages.length : 0;
    const grammarScore = userMessages.length === 0 ? 0 : Math.min(97, Math.max(35, 35 + Math.round(fullSentenceRatio * 30) + (hasDiacritics ? 15 : 4) + Math.round(objectiveRatio * 17)));
    const politeTokens = ['da', 'a', 'vang', 'cam on', 'xin', 'nhe', 'nha', 'co', 'chu', 'bac', 'chi', 'anh', 'em', 'chau', 'con'];
    const usedPoliteCount = politeTokens.filter(tok => includesPhrase(joinedNormalized, tok)).length;
    const cultureScore = userMessages.length === 0 ? 0 : Math.min(99, Math.max(40, 42 + Math.min(35, usedPoliteCount * 7) + Math.round(objectiveRatio * 22)));
    const totalScore = Math.round((fluencyScore + vocabScore + grammarScore + cultureScore) / 4);

    const result = {
      sessionId: `session-${scenarioId}-${Date.now()}`,
      scenarioId,
      scenarioTitle: scenario.title,
      level: scenario.levelLabel,
      completedDate: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      totalScore,
      rating: totalScore >= 90 ? 'Xuất sắc' : totalScore >= 80 ? 'Rất tốt' : totalScore >= 65 ? 'Khá tốt' : totalScore >= 50 ? 'Đạt yêu cầu' : 'Cần cố gắng thêm',
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

    return result;
  },

  getResult(scenarioId) {
    try {
      localStorage.getItem(getRoleplayResultKey(scenarioId));
      // Always recompute result from current session so score is never stuck on stale cache
    } catch {
      // fallback
    }
    const result = this.buildRoleplayResult(scenarioId);
    localStorage.setItem(getRoleplayResultKey(scenarioId), JSON.stringify(result));
    return result;
  },

  isProgressComplete(scenarioId, session = this.getRoleplaySession(scenarioId)) {
    const scenario = this.getScenario(scenarioId);
    const total = scenario?.objectives?.length || 0;
    return total > 0 && (session?.completedTasks?.length || 0) >= total;
  },

  /**
   * Report a finished roleplay to the backend exactly once per local session,
   * so Admin "Lượt hoàn thành" increases by 1 per real completion.
   */
  async reportCompletion(scenarioId, score) {
    const session = this.getRoleplaySession(scenarioId);
    if (session.completionReported) return { alreadyReported: true };

    // Mark first to avoid double posts from concurrent triggers (auto 100% + button).
    this.saveRoleplaySession(scenarioId, { ...session, completionReported: true, completionReportedAt: new Date().toISOString() });

    const userMessages = (session.messages || []).filter(m => m.sender === 'user').length;
    const effectiveScore = (score !== undefined && score !== null) ? score : this.buildRoleplayResult(scenarioId).totalScore;
    try {
      let res;
      if (session.backendSessionId) {
        try {
          res = await axiosClient.post(`/api/ai/roleplay/sessions/${session.backendSessionId}/finish`, { score: effectiveScore });
        } catch {
          res = await axiosClient.post(`/api/ai/roleplay/scenarios/${scenarioId}/complete`, { score: effectiveScore });
        }
      } else {
        res = await axiosClient.post(`/api/ai/roleplay/scenarios/${scenarioId}/complete`, { score: effectiveScore });
      }
      return res?.result ?? res;
    } catch (err) {
      // Allow retry later if the backend was unreachable.
      const latest = this.getRoleplaySession(scenarioId);
      this.saveRoleplaySession(scenarioId, { ...latest, completionReported: false });
      console.warn('[AI Roleplay] Could not report completion:', err?.message);
      return null;
    }
  },

  async syncCompletion(scenarioId, score = 85) {
    return this.reportCompletion(scenarioId, score);
  },
};

