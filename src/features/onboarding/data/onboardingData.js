import {
  Award, BriefcaseBusiness, Compass, Crown, Dumbbell, HeartHandshake, Landmark,
  MessageCircle, Plane, Sparkles, Sprout, Target, Timer, Trophy, Utensils, Volume2,
} from 'lucide-react';
import { isAnswerCorrect, getLocalizedOption, areOptionsMatching, PLACEMENT_OPTION_TRANSLATIONS } from './onboardingTranslations.js';

export const learningReasons = [
  { id: 'travel', title: 'Travel and live confidently in Vietnam', titleVi: 'Tự tin du lịch và sinh hoạt tại Việt Nam', detail: 'Directions, transport, food, shopping, and essential conversations.', detailVi: 'Hỏi đường, di chuyển, gọi món, mua sắm và giao tiếp thiết yếu.', icon: Plane },
  { id: 'connection', title: 'Connect with Vietnamese family and friends', titleVi: 'Kết nối với gia đình và bạn bè người Việt', detail: 'Understand everyday speech and share meaningful conversations.', detailVi: 'Hiểu lời nói hằng ngày và trò chuyện gần gũi hơn.', icon: HeartHandshake },
  { id: 'work', title: 'Study or work with Vietnamese speakers', titleVi: 'Học tập hoặc làm việc với người Việt', detail: 'Communicate clearly and politely in academic and professional settings.', detailVi: 'Giao tiếp rõ ràng, lịch sự trong môi trường học tập và công việc.', icon: BriefcaseBusiness },
  { id: 'culture', title: 'Understand Vietnamese culture more deeply', titleVi: 'Hiểu sâu hơn về văn hóa Việt Nam', detail: 'Learn through traditions, stories, places, and daily life.', detailVi: 'Học qua phong tục, câu chuyện, địa danh và đời sống thường ngày.', icon: Landmark },
  { id: 'challenge', title: 'Build a complete new language skill', titleVi: 'Xây dựng một kỹ năng ngôn ngữ toàn diện', detail: 'Develop listening, speaking, reading, and writing step by step.', detailVi: 'Phát triển nghe, nói, đọc và viết theo từng bước rõ ràng.', icon: Dumbbell },
  { id: 'other', title: 'Explore before choosing a specific goal', titleVi: 'Khám phá trước khi chọn mục tiêu cụ thể', detail: 'Start with a flexible foundation and refine your focus later.', detailVi: 'Bắt đầu với nền tảng linh hoạt và điều chỉnh trọng tâm sau.', icon: Compass },
];

export const levelOptions = [
  {
    id: 'A1',
    code: 'A1',
    title: 'A1 · Beginner',
    titleVi: 'A1 · Khởi động cơ bản',
    detail: 'I am completely new or know just a few basic words.',
    detailVi: 'Tôi hoàn toàn mới bắt đầu hoặc chỉ biết vài từ và câu chào hỏi.',
    badge: 'Sơ cấp 1',
    badgeVi: 'SƠ CẤP 1',
    icon: Sprout,
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    id: 'A2',
    code: 'A2',
    title: 'A2 · Elementary',
    titleVi: 'A2 · Sơ cấp giao tiếp',
    detail: 'I can understand familiar phrases and handle simple daily exchanges.',
    detailVi: 'Tôi hiểu các câu thông dụng và có thể giao tiếp trong sinh hoạt thường nhật.',
    badge: 'Sơ cấp 2',
    badgeVi: 'SƠ CẤP 2',
    icon: Compass,
    color: '#0284c7',
    bg: '#f0f9ff',
  },
  {
    id: 'B1',
    code: 'B1',
    title: 'B1 · Intermediate',
    titleVi: 'B1 · Trung cấp tự tin',
    detail: 'I can express opinions, describe events, and navigate most situations.',
    detailVi: 'Tôi có thể diễn đạt ý kiến, kể lại trải nghiệm và tự tin xử lý tình huống.',
    badge: 'Trung cấp 1',
    badgeVi: 'TRUNG CẤP 1',
    icon: MessageCircle,
    color: '#ea580c',
    bg: '#fff7ed',
  },
  {
    id: 'B2',
    code: 'B2',
    title: 'B2 · Upper-Intermediate',
    titleVi: 'B2 · Trung cấp nâng cao',
    detail: 'I can converse smoothly, understand complex ideas, and discuss varied topics.',
    detailVi: 'Tôi giao tiếp lưu loát, hiểu các chủ đề phức tạp và trao đổi tự nhiên.',
    badge: 'Trung cấp 2',
    badgeVi: 'TRUNG CẤP 2',
    icon: Sparkles,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    id: 'C1',
    code: 'C1',
    title: 'C1 · Advanced',
    titleVi: 'C1 · Cao cấp thành thạo',
    detail: 'I can use flexible, nuanced language for social, academic, and work goals.',
    detailVi: 'Tôi diễn đạt trôi chảy, sử dụng từ ngữ uyển chuyển trong công việc và đời sống.',
    badge: 'Cao cấp 1',
    badgeVi: 'CAO CẤP 1',
    icon: Award,
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    id: 'C2',
    code: 'C2',
    title: 'C2 · Mastery',
    titleVi: 'C2 · Tinh thông bản ngữ',
    detail: 'I understand with ease, grasp cultural subtleties, and express with precision.',
    detailVi: 'Tôi gần như người bản xứ, thấu hiểu chiều sâu văn hóa và sắc thái biểu cảm.',
    badge: 'Cao cấp 2',
    badgeVi: 'CAO CẤP 2',
    icon: Crown,
    color: '#dc2626',
    bg: '#fef2f2',
  },
];

export const dailyGoals = [
  { minutes: 5, label: 'Casual', labelVi: 'Nhẹ nhàng', detail: 'One quick practice', detailVi: 'Một lần luyện tập nhanh', icon: Timer, color: '#f59e0b' },
  { minutes: 10, label: 'Regular', labelVi: 'Đều đặn', detail: 'Build a steady habit', detailVi: 'Xây dựng thói quen đều đặn', icon: Timer, color: '#16a34a', recommended: true },
  { minutes: 15, label: 'Serious', labelVi: 'Nghiêm túc', detail: 'Make confident progress', detailVi: 'Tiến bộ vững vàng', icon: Target, color: '#2563eb' },
  { minutes: 30, label: 'Intensive', labelVi: 'Chuyên sâu', detail: 'Move at a focused pace', detailVi: 'Tốc độ học tập tập trung', icon: Trophy, color: '#FF7A00' },
];

export const benefits = [
  { title: 'Introduce yourself', titleVi: 'Tự giới thiệu bản thân', detail: 'Make a warm first impression.', detailVi: 'Tạo ấn tượng ban đầu ấm áp.', icon: MessageCircle },
  { title: 'Order with confidence', titleVi: 'Tự tin gọi món', detail: 'Enjoy phở, coffee, and more.', detailVi: 'Thưởng thức phở, cà phê và nhiều hơn nữa.', icon: Utensils },
  { title: 'Find your way', titleVi: 'Hỏi đường đi', detail: 'Ask for directions while traveling.', detailVi: 'Hỏi đường khi đi du lịch.', icon: Compass },
  { title: 'Understand daily speech', titleVi: 'Hiểu lời nói hàng ngày', detail: 'Follow familiar conversations.', detailVi: 'Nắm bắt các cuộc hội thoại quen thuộc.', icon: HeartHandshake },
  { title: 'Sound more natural', titleVi: 'Nói tự nhiên hơn', detail: 'Train your listening and pronunciation.', detailVi: 'Luyện nghe và phát âm chuẩn xác.', icon: Volume2 },
  { title: 'Discover the culture', titleVi: 'Khám phá văn hóa', detail: 'Connect language with living traditions.', detailVi: 'Gắn kết ngôn ngữ với truyền thống sống động.', icon: Landmark },
];

export const firstLessonQuestions = [
  { id: 'l1', type: 'choice', prompt: 'What does “Xin chào” mean?', promptVi: '“Xin chào” có nghĩa là gì?', options: ['Thank you', 'Hello', 'Good night'], answer: 'Hello', note: '“Xin chào” is a polite, friendly way to say hello.', noteVi: '“Xin chào” là cách lịch sự, thân thiện để chào hỏi.' },
  { id: 'l2', type: 'choice', prompt: 'Which situation matches “Cảm ơn”?', promptVi: 'Tình huống nào phù hợp với “Cảm ơn”?', options: ['🙏 Someone helped you', '👋 You are leaving', '🍜 You are ordering'], answer: '🙏 Someone helped you', note: '“Cảm ơn” means “Thank you.”', noteVi: '“Cảm ơn” có nghĩa là “Thank you”.' },
  { id: 'l3', type: 'match', prompt: 'Match the Vietnamese phrase to “Goodbye”.', promptVi: 'Chọn cụm từ tiếng Việt tương ứng với “Goodbye”.', options: ['Tạm biệt', 'Xin lỗi', 'Không'], answer: 'Tạm biệt', note: '“Tạm biệt” is used when saying goodbye.', noteVi: '“Tạm biệt” được dùng khi nói lời chia tay.' },
  { id: 'l4', type: 'arrange', prompt: 'Build: “Hello, I am Mai.”', promptVi: 'Ghép câu: “Xin chào, tôi là Mai.”', tokens: ['Mai', 'Xin chào,', 'là', 'tôi'], answer: 'Xin chào, tôi là Mai', note: 'Vietnamese uses “Tôi là…” for “I am…”.', noteVi: 'Tiếng Việt dùng “Tôi là…” tương tự như “I am…”.' },
  { id: 'l5', type: 'listen', prompt: 'Listen and choose what you hear.', promptVi: 'Lắng nghe và chọn từ bạn nghe thấy.', speak: 'Cảm ơn', options: ['Cảm ơn', 'Xin chào', 'Tạm biệt'], answer: 'Cảm ơn', note: 'Great listening — notice the rising hỏi tone in “cảm”.', noteVi: 'Tuyệt vời — chú ý thanh hỏi đi lên trong từ “cảm”.' },
  { id: 'l6', type: 'fill', prompt: 'Complete the phrase: “Xin ___”', promptVi: 'Hoàn thành cụm từ: “Xin ___”', options: ['chào', 'ơn', 'biệt'], answer: 'chào', note: '“Xin chào” works throughout the day.', noteVi: '“Xin chào” dùng được cho mọi thời điểm trong ngày.' },
  { id: 'l7', type: 'choice', prompt: 'You are leaving a new friend. What do you say?', promptVi: 'Bạn chào tạm biệt một người bạn mới. Bạn sẽ nói gì?', options: ['Tạm biệt!', 'Cảm ơn!', 'Xin chào!'], answer: 'Tạm biệt!', note: 'Exactly — “Tạm biệt!” means “Goodbye!”', noteVi: 'Chính xác — “Tạm biệt!” có nghĩa là “Goodbye!”.' },
];

/**
 * 15-question distribution table based on user specification:
 * Test A1: 15 A1, 0 A2, 0 B1, 0 B2, 0 C1, 0 C2 (Total 15)
 * Test A2: 5 A1, 10 A2, 0 B1, 0 B2, 0 C1, 0 C2 (Total 15)
 * Test B1: 3 A1, 4 A2, 8 B1, 0 B2, 0 C1, 0 C2 (Total 15)
 * Test B2: 2 A1, 3 A2, 4 B1, 6 B2, 0 C1, 0 C2 (Total 15)
 * Test C1: 1 A1, 2 A2, 3 B1, 4 B2, 5 C1, 0 C2 (Total 15)
 * Test C2: 1 A1, 1 A2, 2 B1, 3 B2, 4 C1, 4 C2 (Total 15)
 */
export const PLACEMENT_DISTRIBUTIONS = Object.freeze({
  A1: { A1: 15 },
  A2: { A1: 5, A2: 10 },
  B1: { A1: 3, A2: 4, B1: 8 },
  B2: { A1: 2, A2: 3, B1: 4, B2: 6 },
  C1: { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 },
  C2: { A1: 1, A2: 1, B1: 2, B2: 3, C1: 4, C2: 4 },
});

/**
 * Tier passing thresholds (%) based on user specification:
 * A1: >= 80% (passed A1 foundation)
 * A2: >= 70% (achieved A2)
 * B1: >= 60% (confirmed B1)
 * B2: >= 60% (confirmed B2)
 * C1: >= 60% (confirmed C1)
 * C2: >= 60% (confirmed C2)
 */
export const TIER_THRESHOLDS = Object.freeze({
  A1: 80,
  A2: 70,
  B1: 60,
  B2: 60,
  C1: 60,
  C2: 60,
});

/**
 * Question Bank categorized strictly by CEFR level.
 * Total: 127 high-quality placement questions across all 6 levels.
 */
export const placementQuestionBank = Object.freeze({
  A1: [
    { id: 'p_a1_01', level: 'A1', prompt: '“Xin chào” means…', promptVi: '“Xin chào” có nghĩa là gì?', options: ['Hello', 'Sorry', 'Goodbye', 'Please'], answer: 'Hello', noteVi: '“Xin chào” là lời chào lịch sự, thân thiện.' },
    { id: 'p_a1_02', level: 'A1', prompt: 'How do you say “Thank you” in Vietnamese?', promptVi: 'Nói “Thank you” trong tiếng Việt là…', options: ['Cảm ơn', 'Tạm biệt', 'Xin lỗi', 'Không có gì'], answer: 'Cảm ơn', noteVi: '“Cảm ơn” dùng để bày tỏ sự cảm kích.' },
    { id: 'p_a1_03', level: 'A1', prompt: 'Choose the word for “Goodbye”.', promptVi: 'Chọn từ có nghĩa là “Goodbye”.', options: ['Tạm biệt', 'Xin chào', 'Hẹn gặp', 'Vâng'], answer: 'Tạm biệt', noteVi: '“Tạm biệt” dùng khi chia tay, chào ra về.' },
    { id: 'p_a1_04', level: 'A1', prompt: 'What number is “ba”?', promptVi: 'Từ “ba” chỉ số mấy?', options: ['3', '2', '7', '8'], answer: '3', noteVi: 'Một, hai, ba = 1, 2, 3.' },
    { id: 'p_a1_05', level: 'A1', prompt: '“Mẹ” means…', promptVi: 'Từ “Mẹ” có nghĩa là…', options: ['Mother', 'Father', 'Sister', 'Teacher'], answer: 'Mother', noteVi: '“Mẹ” là người mẹ trong gia đình.' },
    { id: 'p_a1_06', level: 'A1', prompt: 'Choose the word for “rice / a meal”.', promptVi: 'Chọn từ chỉ “cơm / bữa ăn”.', options: ['Cơm', 'Nước', 'Bánh', 'Trà'], answer: 'Cơm', noteVi: '“Cơm” là thức ăn chính và đại diện cho bữa ăn.' },
    { id: 'p_a1_07', level: 'A1', prompt: '“Bạn khỏe không?” asks…', promptVi: '“Bạn khỏe không?” dùng để hỏi gì?', options: ['How are you?', 'Where are you?', 'Who are you?', 'What is this?'], answer: 'How are you?', noteVi: 'Đây là câu hỏi thăm sức khỏe thông dụng.' },
    { id: 'p_a1_08', level: 'A1', prompt: '“Tôi sống ở Hà Nội.” means…', promptVi: '“Tôi sống ở Hà Nội.” có nghĩa là…', options: ['I live in Hanoi.', 'I love Hanoi.', 'I visited Hanoi.', 'I work in Hanoi.'], answer: 'I live in Hanoi.', noteVi: '“Sống ở…” chỉ nơi chốn cư trú.' },
    { id: 'p_a1_09', level: 'A1', prompt: 'Best reply to “Bạn tên là gì?”', promptVi: 'Câu trả lời phù hợp cho “Bạn tên là gì?” là:', options: ['Tôi tên là Nam.', 'Tôi khỏe, cảm ơn.', 'Tôi là người Việt.', 'Không sao đâu.'], answer: 'Tôi tên là Nam.', noteVi: '“Tôi tên là…” dùng để giới thiệu tên mình.' },
    { id: 'p_a1_10', level: 'A1', prompt: 'How do you politely order coffee?', promptVi: 'Cách gọi một ly cà phê lịch sự:', options: ['Cho tôi một ly cà phê.', 'Tôi ăn cà phê.', 'Cà phê đi đâu?', 'Không thích cà phê.'], answer: 'Cho tôi một ly cà phê.', noteVi: 'Cấu trúc “Cho tôi…” thường dùng khi gọi món.' },
    { id: 'p_a1_11', level: 'A1', prompt: '“Bao nhiêu tiền?” is used to ask about…', promptVi: '“Bao nhiêu tiền?” dùng để hỏi…', options: ['The price', 'The time', 'The location', 'The name'], answer: 'The price', noteVi: '“Bao nhiêu tiền?” dùng khi mua sắm, thanh toán.' },
    { id: 'p_a1_12', level: 'A1', prompt: 'Which word represents a day of the week?', promptVi: 'Từ nào chỉ một ngày trong tuần?', options: ['Thứ Hai', 'Tháng Một', 'Năm nay', 'Buổi trưa'], answer: 'Thứ Hai', noteVi: '“Thứ Hai” là ngày Monday trong tuần.' },
    { id: 'p_a1_13', level: 'A1', prompt: 'Choose the opposite of “lớn” (big).', promptVi: 'Từ trái nghĩa với “lớn” (to) là:', options: ['nhỏ', 'cao', 'dài', 'nặng'], answer: 'nhỏ', noteVi: '“Lớn / to” trái nghĩa với “nhỏ / bé”.' },
    { id: 'p_a1_14', level: 'A1', prompt: 'What does “uống nước” mean?', promptVi: 'Cụm từ “uống nước” có nghĩa là:', options: ['Drink water', 'Boil water', 'Buy water', 'Pour water'], answer: 'Drink water', noteVi: '“Uống” = drink, “nước” = water.' },
    { id: 'p_a1_15', level: 'A1', prompt: 'Friendly pronoun when speaking to peers:', promptVi: 'Đại từ xưng hô thân mật khi nói về bản thân với bạn bè bằng tuổi:', options: ['Mình', 'Cháu', 'Bác', 'Em'], answer: 'Mình', noteVi: '“Mình” dùng thân mật, bình đẳng giữa bạn bè.' },
    { id: 'p_a1_16', level: 'A1', prompt: '“Bao nhiêu tuổi?” is used to ask about…', promptVi: '“Bao nhiêu tuổi?” dùng để hỏi về…', options: ['Tuổi tác', 'Thời gian', 'Giá cả', 'Địa điểm'], answer: 'Tuổi tác', noteVi: '“Bao nhiêu tuổi?” dùng để hỏi số tuổi của người khác.' },
    { id: 'p_a1_17', level: 'A1', prompt: 'Choose the word for “friend”.', promptVi: 'Chọn từ có nghĩa là “bạn bè”.', options: ['Bạn', 'Bàn', 'Bán', 'Bát'], answer: 'Bạn', noteVi: '“Bạn” có nghĩa là bạn bè, người đồng hành.' },
    { id: 'p_a1_18', level: 'A1', prompt: 'What color is “màu đỏ”?', promptVi: '“Màu đỏ” là màu gì?', options: ['Red', 'Blue', 'Yellow', 'Green'], answer: 'Red', noteVi: 'Đỏ = Red, xanh da trời = Blue, vàng = Yellow.' },
    { id: 'p_a1_19', level: 'A1', prompt: '“Hẹn gặp lại” means…', promptVi: '“Hẹn gặp lại” có nghĩa là…', options: ['See you again', 'Nice to meet you', 'Good morning', 'Have a good trip'], answer: 'See you again', noteVi: '“Hẹn gặp lại” dùng khi tạm biệt và hẹn gặp trong tương lai.' },
    { id: 'p_a1_20', level: 'A1', prompt: 'Which word means “eat”?', promptVi: 'Từ nào có nghĩa là “ăn”?', options: ['Ăn', 'Đi', 'Ngủ', 'Học'], answer: 'Ăn', noteVi: '“Ăn” là hành động dùng thức ăn.' },
    { id: 'p_a1_21', level: 'A1', prompt: 'Complete: “Tôi là người ___.” (I am American)', promptVi: 'Hoàn thành: “Tôi là người ___.”', options: ['Mỹ', 'Nước', 'Tiếng', 'Thành phố'], answer: 'Mỹ', noteVi: '“Người Mỹ” là công dân nước Mỹ.' },
    { id: 'p_a1_22', level: 'A1', prompt: 'What time of day is “buổi tối”?', promptVi: '“Buổi tối” là thời điểm nào?', options: ['Evening / Night', 'Morning', 'Noon / Lunchtime', 'Afternoon'], answer: 'Evening / Night', noteVi: 'Sáng = Morning, Trưa = Noon, Chiều = Afternoon, Tối = Evening.' },
    { id: 'p_a1_23', level: 'A1', prompt: 'How do you say “Excuse me / I’m sorry”?', promptVi: 'Cách nói “Xin lỗi” lịch sự:', options: ['Xin lỗi', 'Cảm ơn', 'Chào bạn', 'Được rồi'], answer: 'Xin lỗi', noteVi: '“Xin lỗi” dùng khi làm phiền hoặc bày tỏ sự hối tiếc.' },
    { id: 'p_a1_24', level: 'A1', prompt: 'Which word means “house / home”?', promptVi: 'Từ nào có nghĩa là “nhà / ngôi nhà”?', options: ['Nhà', 'Xe', 'Đường', 'Trường'], answer: 'Nhà', noteVi: '“Nhà” chỉ nơi cư trú của gia đình.' },
    { id: 'p_a1_25', level: 'A1', prompt: '“Một, hai, ___ , bốn, năm.”', promptVi: 'Điền số còn thiếu: “Một, hai, ___ , bốn, năm.”', options: ['ba', 'sáu', 'tám', 'mười'], answer: 'ba', noteVi: 'Thứ tự đếm tự nhiên: một, hai, ba, bốn, năm.' },
    { id: 'p_a1_26', level: 'A1', prompt: 'What is “trà đá”?', promptVi: '“Trà đá” là thức uống gì?', options: ['Iced tea', 'Hot coffee', 'Mineral water', 'Fruit juice'], answer: 'Iced tea', noteVi: '“Trà đá” là thức uống trà ướp đá cực kỳ phổ biến ở Việt Nam.' },
    { id: 'p_a1_27', level: 'A1', prompt: 'Choose the correct word for “delicious”.', promptVi: 'Từ chỉ món ăn “ngon” là:', options: ['Ngon', 'Đẹp', 'Vui', 'Đắt'], answer: 'Ngon', noteVi: '“Ngon” dùng để khen món ăn hoặc đồ uống.' },
    { id: 'p_a1_28', level: 'A1', prompt: '“Bây giờ là mấy giờ?” asks about…', promptVi: '“Bây giờ là mấy giờ?” dùng để hỏi…', options: ['The time', 'The weather', 'The distance', 'The date'], answer: 'The time', noteVi: 'Câu hỏi dùng để biết thời gian hiện tại.' },
    { id: 'p_a1_29', level: 'A1', prompt: 'Opposite of “nóng” (hot) is…', promptVi: 'Từ trái nghĩa với “nóng” là:', options: ['Lạnh', 'Ấm', 'Khô', 'Ướt'], answer: 'Lạnh', noteVi: 'Nóng trái nghĩa với lạnh.' },
    { id: 'p_a1_30', level: 'A1', prompt: '“Tôi hiểu rồi.” means…', promptVi: '“Tôi hiểu rồi.” có nghĩa là…', options: ['I understand now.', 'I don’t know.', 'I’m listening.', 'I agree completely.'], answer: 'I understand now.', noteVi: '“Tôi hiểu rồi” dùng để xác nhận đã nắm được thông tin.' },
  ],
  A2: [
    { id: 'p_a2_01', level: 'A2', prompt: 'Choose the correct classifier: “Tôi mua hai ___ sách.”', promptVi: 'Chọn loại từ thích hợp: “Tôi mua hai ___ sách.”', options: ['quyển', 'con', 'chiếc', 'cái'], answer: 'quyển', noteVi: '“Quyển” (hoặc “cuốn”) là loại từ dùng cho sách, vở.' },
    { id: 'p_a2_02', level: 'A2', prompt: 'Complete: “Hôm qua trời mưa ___ tôi ở nhà.”', promptVi: 'Hoàn thành câu: “Hôm qua trời mưa ___ tôi ở nhà.”', options: ['nên', 'nhưng', 'tuy', 'hoặc'], answer: 'nên', noteVi: '“Nên” chỉ kết quả của nguyên nhân phía trước.' },
    { id: 'p_a2_03', level: 'A2', prompt: 'How to ask directions to the post office?', promptVi: 'Cách hỏi đường đến bưu điện chính xác nhất:', options: ['Làm ơn cho tôi hỏi bưu điện ở đâu?', 'Bưu điện có ăn không?', 'Tôi đi bưu điện bao giờ?', 'Bưu điện tên là gì?'], answer: 'Làm ơn cho tôi hỏi bưu điện ở đâu?', noteVi: '“Làm ơn cho tôi hỏi… ở đâu?” là cách hỏi đường lịch sự.' },
    { id: 'p_a2_04', level: 'A2', prompt: '“Chiếc áo này giá bao nhiêu?” - “Dạ, ___ nghìn đồng.”', promptVi: 'Điền từ chỉ số lượng: “Dạ, ___ nghìn đồng.”', options: ['năm mươi', 'năm con', 'năm cái', 'năm quả'], answer: 'năm mươi', noteVi: '“Năm mươi nghìn” = 50.000 VNĐ.' },
    { id: 'p_a2_05', level: 'A2', prompt: '“Tôi đã từng đến Huế” expresses…', promptVi: '“Tôi đã từng đến Huế” diễn tả điều gì?', options: ['A past experience', 'A future intention', 'A repeated habit', 'A current state'], answer: 'A past experience', noteVi: '“Đã từng…” diễn tả trải nghiệm trong quá khứ.' },
    { id: 'p_a2_06', level: 'A2', prompt: 'Complete: “Nhà của tôi cách trường học không ___.”', promptVi: 'Hoàn thành: “Nhà của tôi cách trường học không ___.”', options: ['xa', 'cao', 'sâu', 'nặng'], answer: 'xa', noteVi: '“Không xa” chỉ khoảng cách gần.' },
    { id: 'p_a2_07', level: 'A2', prompt: 'Complete: “Buổi sáng tôi thường ___ thể dục.”', promptVi: 'Chọn từ đúng: “Buổi sáng tôi thường ___ thể dục.”', options: ['tập', 'làm', 'chơi', 'chạy'], answer: 'tập', noteVi: 'Kết hợp từ chuẩn xác là “tập thể dục”.' },
    { id: 'p_a2_08', level: 'A2', prompt: 'Complete: “Bác sĩ khuyên anh ấy không ___ hút thuốc.”', promptVi: 'Điền từ khuyên nhủ: “Bác sĩ khuyên anh ấy không ___ hút thuốc.”', options: ['nên', 'được', 'thể', 'phải'], answer: 'nên', noteVi: '“Không nên” dùng để đưa ra lời khuyên ngăn.' },
    { id: 'p_a2_09', level: 'A2', prompt: 'Choose the grammatically natural sentence:', promptVi: 'Chọn câu tự nhiên và đúng ngữ pháp:', options: ['Chị ấy vừa đẹp lại vừa thông minh.', 'Chị ấy rất đẹp nhưng rất thông minh.', 'Chị ấy vì đẹp nên thông minh.', 'Chị ấy đẹp thì là thông minh.'], answer: 'Chị ấy vừa đẹp lại vừa thông minh.', noteVi: 'Cấu trúc “vừa… vừa…” biểu thị hai đặc điểm cùng tồn tại.' },
    { id: 'p_a2_10', level: 'A2', prompt: 'How to ask for help politely?', promptVi: 'Khi muốn nhờ giúp đỡ một cách lịch sự, bạn nói:', options: ['Làm ơn giúp tôi một chút được không ạ?', 'Phải giúp tôi ngay bây giờ!', 'Ai giúp tôi đấy?', 'Tại sao không giúp tôi?'], answer: 'Làm ơn giúp tôi một chút được không ạ?', noteVi: '“Làm ơn… được không ạ?” là lời thỉnh cầu lịch thiệp.' },
    { id: 'p_a2_11', level: 'A2', prompt: 'Choose the correct classifier for a cat: “Một ___ mèo.”', promptVi: 'Chọn loại từ cho mèo: “Một ___ mèo.”', options: ['con', 'cái', 'quyển', 'chiếc'], answer: 'con', noteVi: 'Loại từ “con” dùng cho động vật.' },
    { id: 'p_a2_12', level: 'A2', prompt: 'Complete: “Chị ấy đang ___ tiếng Việt ở trường.”', promptVi: 'Điền động từ thích hợp: “Chị ấy đang ___ tiếng Việt ở trường.”', options: ['học', 'nói', 'ăn', 'mua'], answer: 'học', noteVi: '“Học tiếng Việt” là cấu trúc tự nhiên nhất.' },
    { id: 'p_a2_13', level: 'A2', prompt: 'Complete: “Tôi thích mùa thu ___ thời tiết rất mát mẻ.”', promptVi: 'Điền từ nối chỉ nguyên nhân: “Tôi thích mùa thu ___ thời tiết rất mát mẻ.”', options: ['vì', 'nhưng', 'tuy', 'nên'], answer: 'vì', noteVi: '“Vì” chỉ nguyên nhân giải thích cho sở thích phía trước.' },
    { id: 'p_a2_14', level: 'A2', prompt: 'Choose the sentence with correct comparative structure:', promptVi: 'Chọn câu so sánh hơn đúng cấu trúc:', options: ['Hà Nội cổ kính hơn TP. Hồ Chí Minh.', 'Hà Nội hơn cổ kính TP. Hồ Chí Minh.', 'Hà Nội cổ kính bằng TP. Hồ Chí Minh hơn.', 'Hà Nội là hơn cổ kính TP. Hồ Chí Minh.'], answer: 'Hà Nội cổ kính hơn TP. Hồ Chí Minh.', noteVi: 'Cấu trúc so sánh hơn: A + Tính từ + hơn + B.' },
    { id: 'p_a2_15', level: 'A2', prompt: '“Bưu điện mở cửa lúc mấy giờ?” asks…', promptVi: '“Bưu điện mở cửa lúc mấy giờ?” dùng để hỏi…', options: ['What time the post office opens', 'Where the post office is located', 'How far the post office is', 'Who works at the post office'], answer: 'What time the post office opens', noteVi: 'Hỏi về giờ mở cửa của bưu điện.' },
    { id: 'p_a2_16', level: 'A2', prompt: 'Choose the correct classifier for vehicles: “Một ___ xe máy.”', promptVi: 'Chọn loại từ cho phương tiện giao thông: “Một ___ xe máy.”', options: ['chiếc', 'bức', 'ngôi', 'tấm'], answer: 'chiếc', noteVi: '“Chiếc” (hoặc “cái”) là loại từ dùng cho xe cộ, máy móc.' },
    { id: 'p_a2_17', level: 'A2', prompt: 'Complete: “Tôi ___ ăn sáng trước khi đi làm.”', promptVi: 'Điền phó từ chỉ thói quen thường xuyên: “Tôi ___ ăn sáng trước khi đi làm.”', options: ['thường', 'vừa', 'sẽ', 'chưa'], answer: 'thường', noteVi: '“Thường” diễn tả thói quen lặp lại đều đặn.' },
    { id: 'p_a2_18', level: 'A2', prompt: 'How to ask someone to speak slower?', promptVi: 'Cách nhờ người khác nói chậm lại lịch sự:', options: ['Xin bạn nói chậm lại một chút.', 'Bạn phải nói thật to lên.', 'Đừng nói nữa nhé.', 'Nói nhanh lên giúp tôi.'], answer: 'Xin bạn nói chậm lại một chút.', noteVi: 'Lời nhờ cậy lịch sự khi chưa nghe kịp.' },
    { id: 'p_a2_19', level: 'A2', prompt: 'Complete: “Ngày mai nếu trời đẹp, chúng tôi ___ đi dã ngoại.”', promptVi: 'Điền từ diễn tả hành động tương lai: “Ngày mai nếu trời đẹp, chúng tôi ___ đi dã ngoại.”', options: ['sẽ', 'đã', 'vừa', 'đang'], answer: 'sẽ', noteVi: '“Sẽ” chỉ hành động dự kiến trong tương lai.' },
    { id: 'p_a2_20', level: 'A2', prompt: 'Which phrase means “Turn left”?', promptVi: 'Cụm từ chỉ hướng “Rẽ trái” là:', options: ['Rẽ trái', 'Rẽ phải', 'Đi thẳng', 'Quay đầu'], answer: 'Rẽ trái', noteVi: 'Rẽ trái = Turn left, Rẽ phải = Turn right.' },
    { id: 'p_a2_21', level: 'A2', prompt: 'Complete: “Tôi chưa từng đi máy bay ___ giờ.”', promptVi: 'Hoàn thành câu: “Tôi chưa từng đi máy bay ___ giờ.”', options: ['bao', 'khi', 'nào', 'sao'], answer: 'bao', noteVi: 'Cụm “chưa từng... bao giờ” diễn tả chưa từng có trải nghiệm đó.' },
    { id: 'p_a2_22', level: 'A2', prompt: 'Choose the classifier for a photo/picture: “Một ___ ảnh.”', promptVi: 'Loại từ dùng cho tranh ảnh: “Một ___ ảnh.”', options: ['bức', 'con', 'trái', 'viên'], answer: 'bức', noteVi: '“Bức” là loại từ dành cho tranh, ảnh, thư pháp.' },
    { id: 'p_a2_23', level: 'A2', prompt: 'Complete: “Áo này quá rộng, có cái nào ___ hơn không?”', promptVi: 'Điền từ so sánh kích cỡ: “Áo này quá rộng, có cái nào ___ hơn không?”', options: ['nhỏ', 'lớn', 'to', 'dài'], answer: 'nhỏ', noteVi: 'Rộng cần tìm áo “nhỏ hơn”.' },
    { id: 'p_a2_24', level: 'A2', prompt: '“Trời sắp mưa rồi, bạn nhớ mang ô nhé.” expresses…', promptVi: '“Trời sắp mưa rồi, bạn nhớ mang ô nhé.” là lời…', options: ['Nhắc nhở, dặn dò thân mật', 'Trách móc, giận dữ', 'Mệnh lệnh bắt buộc', 'Từ chối lời mời'], answer: 'Nhắc nhở, dặn dò thân mật', noteVi: 'Lời khuyên và dặn dò quan tâm giữa bạn bè.' },
    { id: 'p_a2_25', level: 'A2', prompt: 'Complete: “Cuốn sách này ___ hay ___ bổ ích.”', promptVi: 'Điền cặp từ liên kết tăng tiến: “Cuốn sách này ___ hay ___ bổ ích.”', options: ['vừa... vừa...', 'tuy... nhưng...', 'hoặc... hoặc...', 'nếu... thì...'], answer: 'vừa... vừa...', noteVi: 'Cặp từ “vừa... vừa...” nêu 2 đặc điểm song song tích cực.' },
  ],
  B1: [
    { id: 'p_b1_01', level: 'B1', prompt: 'Complete: “Mặc dù trời mưa to, ___ các bạn vẫn đến đúng giờ.”', promptVi: 'Điền liên từ: “Mặc dù trời mưa to, ___ các bạn vẫn đến đúng giờ.”', options: ['nhưng', 'vì', 'cho nên', 'hoặc là'], answer: 'nhưng', noteVi: 'Cặp liên từ chỉ sự tương phản: “Mặc dù… nhưng…”.' },
    { id: 'p_b1_02', level: 'B1', prompt: 'In “Cậu ấy được khen ngợi”, “được” signals…', promptVi: 'Trong câu “Cậu ấy được thầy khen ngợi”, từ “được” biểu thị…', options: ['A positive passive meaning', 'An obligation', 'A negative passive meaning', 'A conditional action'], answer: 'A positive passive meaning', noteVi: '“Được” dùng cho câu bị động mang ý nghĩa tích cực, có lợi cho chủ ngữ.' },
    { id: 'p_b1_03', level: 'B1', prompt: '“Anh ấy dự định chuyển công tác.” “Dự định” is closest to…', promptVi: '“Anh ấy dự định chuyển công tác.” Từ “dự định” đồng nghĩa với…', options: ['có kế hoạch', 'bắt buộc', 'vừa mới xong', 'không muốn'], answer: 'có kế hoạch', noteVi: '“Dự định” thể hiện ý định, kế hoạch trong tương lai gần.' },
    { id: 'p_b1_04', level: 'B1', prompt: 'Complete: “Càng học tiếng Việt, tôi ___ thấy thú vị.”', promptVi: 'Điền từ tương liên: “Càng học tiếng Việt, tôi ___ thấy thú vị.”', options: ['càng', 'lại', 'rất', 'vẫn'], answer: 'càng', noteVi: 'Cấu trúc tương liên lũy tiến “càng… càng…”.' },
    { id: 'p_b1_05', level: 'B1', prompt: 'Best phrase to introduce an objective personal viewpoint:', promptVi: 'Cụm từ thích hợp nhất để nêu quan điểm cá nhân trong thảo luận:', options: ['Theo quan điểm của tôi,…', 'Tôi bắt mọi người nghe,…', 'Chắc chắn ai cũng sai,…', 'Không cần giải thích,…'], answer: 'Theo quan điểm của tôi,…', noteVi: '“Theo quan điểm của tôi,…” mang tính khách quan và tôn trọng người nghe.' },
    { id: 'p_b1_06', level: 'B1', prompt: '“Dù gặp nhiều trở ngại, họ không bao giờ từ bỏ.” This emphasizes…', promptVi: '“Dù gặp nhiều trở ngại, họ không bao giờ từ bỏ.” Câu này nhấn mạnh…', options: ['Sự kiên trì, bền bỉ', 'Sự vội vàng, nóng vội', 'Sự do dự, thiếu quyết đoán', 'Sự may mắn ngẫu nhiên'], answer: 'Sự kiên trì, bền bỉ', noteVi: 'Câu diễn tả nghị lực và quyết tâm vượt qua thử thách.' },
    { id: 'p_b1_07', level: 'B1', prompt: '“Thời tiết dạo này thất thường quá.” “Thất thường” means…', promptVi: '“Thời tiết dạo này thất thường quá.” Từ “thất thường” có nghĩa là…', options: ['Thay đổi khó dự đoán', 'Rất nóng bức', 'Luôn luôn mưa', 'Không có gió'], answer: 'Thay đổi khó dự đoán', noteVi: '“Thất thường” = không theo quy luật thông thường, lúc nắng lúc mưa.' },
    { id: 'p_b1_08', level: 'B1', prompt: 'Complete: “Không những học giỏi mà Nam ___ hát rất hay.”', promptVi: 'Điền liên từ bổ sung: “Không những học giỏi mà Nam ___ hát rất hay.”', options: ['còn', 'nhưng', 'thì', 'với'], answer: 'còn', noteVi: 'Cặp liên từ tăng tiến: “Không những… mà còn…”.' },
    { id: 'p_b1_09', level: 'B1', prompt: 'Complete: “Hễ trời mưa to là đường phố lại ___.”', promptVi: 'Điền từ phù hợp với ngữ cảnh: “Hễ trời mưa to là đường phố lại ___.”', options: ['ngập nước', 'khô ráo', 'vắng vẻ', 'bốc khói'], answer: 'ngập nước', noteVi: 'Cặp hô ứng “Hễ... là...” diễn tả điều kiện - hệ quả thường xảy ra.' },
    { id: 'p_b1_10', level: 'B1', prompt: 'Distinguish “được” vs “bị”: “Anh ấy ___ phạt tiền vì vượt đèn đỏ.”', promptVi: 'Chọn từ đúng biểu thị bị động tiêu cực: “Anh ấy ___ phạt tiền vì vượt đèn đỏ.”', options: ['bị', 'được', 'phải', 'do'], answer: 'bị', noteVi: '“Bị” dùng cho câu bị động có kết quả bất lợi, tiêu cực cho chủ ngữ.' },
    { id: 'p_b1_11', level: 'B1', prompt: 'Complete: “Sở dĩ anh ấy tiến bộ nhanh chóng ___ anh ấy rất chăm chỉ.”', promptVi: 'Điền liên từ nguyên nhân: “Sở dĩ anh ấy tiến bộ nhanh chóng ___ anh ấy rất chăm chỉ.”', options: ['là vì', 'mặc dù', 'tuy rằng', 'cho nên'], answer: 'là vì', noteVi: 'Cấu trúc giải thích nguyên nhân: “Sở dĩ... là vì...”.' },
    { id: 'p_b1_12', level: 'B1', prompt: '“Chúng ta nên cân nhắc kỹ trước khi quyết định.” “Cân nhắc” means…', promptVi: 'Từ “cân nhắc” trong câu có nghĩa là…', options: ['Suy nghĩ, tính toán cẩn thận', 'Hành động ngay lập tức', 'Bỏ qua không quan tâm', 'Nhờ người khác làm hộ'], answer: 'Suy nghĩ, tính toán cẩn thận', noteVi: '“Cân nhắc” = xem xét kỹ các mặt lợi hại trước khi hành động.' },
    { id: 'p_b1_13', level: 'B1', prompt: 'Expressing uncertainty politely: “___ ngày mai tôi sẽ bận việc gia đình.”', promptVi: 'Điền từ biểu thị khả năng không chắc chắn một cách lịch sự:', options: ['Có lẽ', 'Chắc chắn 100%', 'Bắt buộc', 'Tuyệt đối'], answer: 'Có lẽ', noteVi: '“Có lẽ” biểu đạt phỏng đoán dè dặt, lịch sự.' },
    { id: 'p_b1_14', level: 'B1', prompt: 'Complete: “Tuy hoàn cảnh khó khăn ___ bạn ấy luôn lạc quan.”', promptVi: 'Điền từ liên kết tương phản: “Tuy hoàn cảnh khó khăn ___ bạn ấy luôn lạc quan.”', options: ['nhưng', 'vì vậy', 'hoặc là', 'do đó'], answer: 'nhưng', noteVi: 'Cặp liên từ nhượng bộ - tương phản: “Tuy... nhưng...”.' },
    { id: 'p_b1_15', level: 'B1', prompt: '“Bức tranh này gợi cho tôi nhớ về quê hương.” “Gợi nhớ” means…', promptVi: 'Cụm từ “gợi nhớ” thể hiện điều gì?', options: ['Làm liên tưởng, khơi gợi ký ức', 'Xóa bỏ hoàn toàn trí nhớ', 'Miêu tả địa điểm mới', 'Vẽ lại phong cảnh'], answer: 'Làm liên tưởng, khơi gợi ký ức', noteVi: '“Gợi nhớ” = làm cho nhớ lại hình ảnh hoặc kỷ niệm trong quá khứ.' },
    { id: 'p_b1_16', level: 'B1', prompt: 'Complete: “Nhờ có sự giúp đỡ của thầy cô, tôi ___ kỳ thi dễ dàng.”', promptVi: 'Chọn từ phù hợp với kết quả tích cực: “Tôi ___ kỳ thi dễ dàng.”', options: ['đã vượt qua', 'đã thất bại', 'đã bỏ cuộc', 'đã hoãn lại'], answer: 'đã vượt qua', noteVi: 'Vế trước có “Nhờ có...” mang ý nghĩa tích cực, do đó kết quả là “đã vượt qua”.' },
    { id: 'p_b1_17', level: 'B1', prompt: 'In business communication, which phrase opens an email politely?', promptVi: 'Cụm từ mở đầu email trang trọng, lịch sự:', options: ['Kính gửi Ông/Bà,…', 'Này bạn ơi,…', 'Nghe này,…', 'Có chuyện gì thế,…'], answer: 'Kính gửi Ông/Bà,…', noteVi: '“Kính gửi…” là lời xưng hô chuẩn mực và lịch sự trong thư từ công việc.' },
    { id: 'p_b1_18', level: 'B1', prompt: 'Complete: “Thay vì đi xem phim, chúng tôi quyết định ___ nhà nấu ăn.”', promptVi: 'Điền giới từ nơi chốn: “Chúng tôi quyết định ___ nhà nấu ăn.”', options: ['ở', 'vào', 'lên', 'qua'], answer: 'ở', noteVi: '“Ở nhà” diễn tả vị trí lưu lại tại nhà.' },
    { id: 'p_b1_19', level: 'B1', prompt: '“Dù sao đi nữa, mọi chuyện cũng đã qua rồi.” expresses…', promptVi: 'Thành ngữ “Dù sao đi nữa,…” dùng để…', options: ['Khuyên nhủ chấp nhận thực tế và hướng tới phía trước', 'Bắt đầu cuộc tranh cãi mới', 'Phê bình gay gắt người đối thoại', 'Từ chối nói chuyện tiếp'], answer: 'Khuyên nhủ chấp nhận thực tế và hướng tới phía trước', noteVi: 'Dùng để xoa dịu và khép lại vấn đề đã qua.' },
    { id: 'p_b1_20', level: 'B1', prompt: 'Complete: “Chỉ cần bạn kiên trì, nhất định bạn ___ thành công.”', promptVi: 'Điền cặp từ điều kiện tiên quyết: “Chỉ cần..., nhất định bạn ___ thành công.”', options: ['sẽ', 'đã', 'chẳng', 'không thể'], answer: 'sẽ', noteVi: 'Cấu trúc khẳng định kết quả tất yếu trong tương lai: “Chỉ cần... nhất định sẽ...”.' },
    { id: 'p_b1_21', level: 'B1', prompt: '“Tôi rất ấn tượng với sự mến khách của người Việt.” “Mến khách” means…', promptVi: 'Từ “mến khách” thể hiện phẩm chất gì?', options: ['Hiếu khách, nồng nhiệt chào đón người khác', 'Thích đi du lịch nhiều nơi', 'Thích ở một mình', 'Kén chọn đồ ăn'], answer: 'Hiếu khách, nồng nhiệt chào đón người khác', noteVi: '“Mến khách / hiếu khách” là nét đẹp văn hóa tiêu biểu của người Việt.' },
    { id: 'p_b1_22', level: 'B1', prompt: 'Complete: “Theo số liệu thống kê, tỷ lệ này đang có xu hướng ___ dần.”', promptVi: 'Chọn cụm từ mô tả sự biến thiên: “Tỷ lệ này đang có xu hướng ___ dần.”', options: ['tăng lên', 'đứng im', 'hết sạch', 'đóng băng'], answer: 'tăng lên', noteVi: '“Có xu hướng tăng lên dần” là cách diễn đạt tự nhiên khi phân tích số liệu.' },
  ],
  B2: [
    { id: 'p_b2_01', level: 'B2', prompt: 'The idiom “Nước đến chân mới nhảy” describes…', promptVi: 'Thành ngữ “Nước đến chân mới nhảy” phê phán thói quen gì?', options: ['Chần chừ, sát nút mới hành động', 'Hành động vội vàng, hấp tấp', 'Chăm chỉ làm việc trước thời hạn', 'Thích bơi lội và thể thao dưới nước'], answer: 'Chần chừ, sát nút mới hành động', noteVi: 'Phê phán tính lười nhác, để việc dồn ứ đến phút chót mới làm.' },
    { id: 'p_b2_02', level: 'B2', prompt: 'Formal context: “Hội đồng quản trị đã ___ phương án phát triển mới.”', promptVi: 'Chọn từ trang trọng: “Hội đồng quản trị đã ___ phương án phát triển mới.”', options: ['thông qua', 'nói qua', 'xem chơi', 'bỏ qua'], answer: 'thông qua', noteVi: '“Thông qua” là thuật ngữ hành chính thể hiện sự phê chuẩn chính thức.' },
    { id: 'p_b2_03', level: 'B2', prompt: '“Chính sách này tạo ra nhiều tác động tích cực.” “Tác động” means…', promptVi: '“Chính sách này tạo ra nhiều tác động tích cực.” Từ “tác động” có nghĩa là…', options: ['Ảnh hưởng, hiệu ứng', 'Sự trừng phạt', 'Nguy cơ tiềm ẩn', 'Sự gián đoạn'], answer: 'Ảnh hưởng, hiệu ứng', noteVi: '“Tác động” là sức ảnh hưởng lan tỏa đối với đời sống, kinh tế.' },
    { id: 'p_b2_04', level: 'B2', prompt: 'The connector “Nói cách khác,…” is used to…', promptVi: 'Cụm từ liên kết “Nói cách khác,…” được dùng nhằm mục đích…', options: ['Diễn giải lại ý trước theo cách rõ ràng hơn', 'Bác bỏ hoàn toàn luận điểm trước', 'Chuyển sang một đề tài hoàn toàn khác', 'Kể lại một câu chuyện cười'], answer: 'Diễn giải lại ý trước theo cách rõ ràng hơn', noteVi: 'Dùng để diễn giải hoặc làm sáng tỏ luận điểm vừa trình bày.' },
    { id: 'p_b2_05', level: 'B2', prompt: '“Hai bên đã đạt được sự đồng thuận.” “Đồng thuận” means…', promptVi: '“Hai bên đã đạt được sự đồng thuận.” Từ “đồng thuận” có nghĩa là…', options: ['Nhất trí, cùng chung ý kiến', 'Bất đồng sâu sắc', 'Chưa thể đưa ra quyết định', 'Hủy bỏ đàm phán'], answer: 'Nhất trí, cùng chung ý kiến', noteVi: '“Đồng thuận” = đồng lòng và cùng chấp thuận một giải pháp chung.' },
    { id: 'p_b2_06', level: 'B2', prompt: 'Complete: “Để nâng cao năng lực cạnh tranh, doanh nghiệp cần ___ đổi mới sáng tạo.”', promptVi: 'Chọn từ phù hợp: “Doanh nghiệp cần ___ đổi mới sáng tạo.”', options: ['chú trọng', 'lơ là', 'tránh né', 'hạn chế'], answer: 'chú trọng', noteVi: '“Chú trọng” = coi trọng và dành nhiều tâm huyết, nguồn lực.' },
    { id: 'p_b2_07', level: 'B2', prompt: 'Idiom “Có công mài sắt, có ngày nên kim” praises which virtue?', promptVi: 'Thành ngữ “Có công mài sắt, có ngày nên kim” ca ngợi đức tính nào?', options: ['Lòng kiên trì, nhẫn nại vượt khó', 'Sự thông minh bẩm sinh', 'Tính tiết kiệm của cải', 'Khả năng tính toán khéo léo'], answer: 'Lòng kiên trì, nhẫn nại vượt khó', noteVi: 'Nhấn mạnh sự bền bỉ, kiên nhẫn tích lũy sẽ đem lại thành quả to lớn.' },
    { id: 'p_b2_08', level: 'B2', prompt: 'Formal text: “Chính phủ đã ___ nghị định mới về bảo vệ môi trường.”', promptVi: 'Chọn từ ngữ hành chính chuẩn xác: “Chính phủ đã ___ nghị định mới.”', options: ['ban hành', 'nói ra', 'bày tỏ', 'nhắn nhủ'], answer: 'ban hành', noteVi: '“Ban hành” là thuật ngữ pháp lý dùng cho luật, nghị định, chính sách.' },
    { id: 'p_b2_09', level: 'B2', prompt: '“Đề xuất này mang tính khả thi cao.” “Khả thi” means…', promptVi: 'Thuật ngữ “khả thi” trong lập kế hoạch có nghĩa là…', options: ['Có thể thực hiện được trong thực tế', 'Hoàn toàn bất khả thi', 'Mang tính viển vông, ảo tưởng', 'Cần loại bỏ ngay'], answer: 'Có thể thực hiện được trong thực tế', noteVi: '“Khả thi” (feasible) = có đủ điều kiện và tiềm năng để hiện thực hóa.' },
    { id: 'p_b2_10', level: 'B2', prompt: 'Complete: “Mặt khác, chúng ta cũng cần tính đến những ___ tiềm ẩn.”', promptVi: 'Chọn danh từ trừu tượng phù hợp: “Tính đến những ___ tiềm ẩn.”', options: ['rủi ro', 'may mắn', 'lợi nhuận', 'phần thưởng'], answer: 'rủi ro', noteVi: 'Kết hợp từ chuẩn xác trong phân tích quản trị là “rủi ro tiềm ẩn”.' },
    { id: 'p_b2_11', level: 'B2', prompt: 'Idiom “Học đi đôi với hành” emphasizes…', promptVi: 'Ý nghĩa của câu “Học đi đôi với hành” là:', options: ['Lý thuyết phải gắn liền với thực hành', 'Chỉ cần học lý thuyết trong sách', 'Chỉ cần làm việc mà không cần học', 'Học càng nhiều trường càng tốt'], answer: 'Lý thuyết phải gắn liền với thực hành', noteVi: 'Phương châm giáo dục kết hợp hài hòa tri thức và ứng dụng thực tiễn.' },
    { id: 'p_b2_12', level: 'B2', prompt: 'Formal contrast: “Xét về mặt kinh tế thì khả quan, ___ về mặt xã hội vẫn còn nhiều âu lo.”', promptVi: 'Điền từ nối văn phong học thuật: “...khả quan, ___ về mặt xã hội...”', options: ['song', 'nên', 'do đó', 'vì thế'], answer: 'song', noteVi: '“Song” là liên từ mang sắc thái trang trọng, tương phản tinh tế.' },
    { id: 'p_b2_13', level: 'B2', prompt: '“Doanh nghiệp cần tái cơ cấu để thích ứng.” “Tái cơ cấu” means…', promptVi: 'Thuật ngữ kinh tế “tái cơ cấu” biểu thị…', options: ['Tổ chức và sắp xếp lại bộ máy hoạt động', 'Ngừng kinh doanh hoàn toàn', 'Mở rộng chi nhánh ồ ạt', 'Đổi tên công ty'], answer: 'Tổ chức và sắp xếp lại bộ máy hoạt động', noteVi: '“Tái cơ cấu” (restructuring) = cải tổ cấu trúc tổ chức và quy trình.' },
    { id: 'p_b2_14', level: 'B2', prompt: '“Vấn đề này đã được giải quyết một cách thỏa đáng.” “Thỏa đáng” means…', promptVi: 'Từ “thỏa đáng” mang ý nghĩa gì?', options: ['Hợp lý, công bằng và làm hài lòng các bên', 'Chưa đầy đủ, thiếu sót', 'Tạm thời trì hoãn', 'Gây tranh cãi dữ dội'], answer: 'Hợp lý, công bằng và làm hài lòng các bên', noteVi: '“Thỏa đáng” = giải pháp hợp tình hợp lý, xử lý trọn vẹn.' },
    { id: 'p_b2_15', level: 'B2', prompt: 'Complete: “Nhằm mục đích mở rộng thị trường, công ty đã ___ hợp tác toàn diện.”', promptVi: 'Chọn động từ mang tính chiến lược: “Công ty đã ___ hợp tác toàn diện.”', options: ['ký kết thỏa thuận', 'hỏi thăm qua loa', 'hủy bỏ kế hoạch', 'từ chối gặp gỡ'], answer: 'ký kết thỏa thuận', noteVi: 'Văn phong văn bản thương mại chuẩn: “ký kết thỏa thuận hợp tác toàn diện”.' },
    { id: 'p_b2_16', level: 'B2', prompt: 'Idiom “Đi một ngày đàng, học một sàng khôn” implies…', promptVi: 'Câu tục ngữ “Đi một ngày đàng, học một sàng khôn” khuyên con người…', options: ['Mở rộng tầm mắt và học hỏi từ những trải nghiệm thực tế', 'Chỉ nên ở yên một chỗ cho an toàn', 'Tiết kiệm chi phí đi lại', 'Tránh xa các chuyến đi xa'], answer: 'Mở rộng tầm mắt và học hỏi từ những trải nghiệm thực tế', noteVi: 'Đúc kết giá trị của sự trải nghiệm và cọ xát với cuộc sống bên ngoài.' },
    { id: 'p_b2_17', level: 'B2', prompt: 'In formal argumentation, “Không thể phủ nhận rằng…” is used to…', promptVi: 'Cụm từ “Không thể phủ nhận rằng…” được dùng nhằm mục đích…', options: ['Khẳng định một chân lý hoặc sự thật hiển nhiên khó bác bỏ', 'Bày tỏ sự hoài nghi sâu sắc', 'Xin lỗi về một nhận định sai lầm', 'Chuyển đề tài bất ngờ'], answer: 'Khẳng định một chân lý hoặc sự thật hiển nhiên khó bác bỏ', noteVi: 'Dùng làm đòn bẩy lập luận nhấn mạnh luận cứ có cơ sở vững chắc.' },
    { id: 'p_b2_18', level: 'B2', prompt: 'Complete: “Chương trình đã tạo được sức ___ lan tỏa mạnh mẽ trong cộng đồng.”', promptVi: 'Chọn danh từ kết hợp chuẩn xác: “Sức ___ lan tỏa mạnh mẽ.”', options: ['hút', 'đẩy', 'nặng', 'ép'], answer: 'hút', noteVi: 'Cụm thành ngữ - từ ghép tự nhiên: “sức hút lan tỏa”.' },
    { id: 'p_b2_19', level: 'B2', prompt: '“Giải pháp này tuy tốn kém nhưng mang lại lợi ích lâu dài.” “Lâu dài” means…', promptVi: 'Từ “lâu dài” trong chiến lược đầu tư tương đương với khái niệm nào?', options: ['Bền vững trong tương lai (dài hạn)', 'Tức thời trong vài ngày', 'Không có giá trị thực tiễn', 'Ngắn hạn'], answer: 'Bền vững trong tương lai (dài hạn)', noteVi: '“Lâu dài” = có giá trị chiến lược dài hạn.' },
    { id: 'p_b2_20', level: 'B2', prompt: 'Complete: “Trước khi đưa ra kết luận, ta cần nhìn nhận vấn đề một cách ___.”', promptVi: 'Chọn tính từ chỉ phương pháp luận khoa học: “Nhìn nhận vấn đề một cách ___.”', options: ['toàn diện và khách quan', 'thiển cận và hời hợt', 'chủ quan và thiên vị', 'cảm tính cá nhân'], answer: 'toàn diện và khách quan', noteVi: 'Văn phong học thuật: nhìn nhận đa chiều, khách quan và toàn diện.' },
  ],
  C1: [
    { id: 'p_c1_01', level: 'C1', prompt: 'The proverb “Uống nước nhớ nguồn” embodies which Vietnamese cultural value?', promptVi: 'Đạo lý cốt lõi thể hiện qua câu “Uống nước nhớ nguồn” là:', options: ['Lòng biết ơn với tiền nhân và cội nguồn', 'Ý thức bảo vệ tài nguyên nước', 'Tiết kiệm trong tiêu dùng hằng ngày', 'Tinh thần khám phá địa lý'], answer: 'Lòng biết ơn với tiền nhân và cội nguồn', noteVi: 'Thể hiện truyền thống tri ân những người đã dày công vun đắp thành quả cho thế hệ sau.' },
    { id: 'p_c1_02', level: 'C1', prompt: 'Choose the most academic and accurate term: “Báo cáo nhằm ___ các hạn chế còn tồn đọng.”', promptVi: 'Chọn từ mang sắc thái học thuật chuẩn xác: “Báo cáo nhằm ___ các hạn chế còn tồn đọng.”', options: ['làm rõ và phân tích sâu sắc', 'kể lể linh tinh', 'viết đại khái', 'nhắc nhở vu vơ'], answer: 'làm rõ và phân tích sâu sắc', noteVi: 'Phong cách học thuật đòi hỏi diễn đạt mạch lạc, chuẩn xác và sâu sắc.' },
    { id: 'p_c1_03', level: 'C1', prompt: 'Which sentence best exemplifies natural advanced socio-economic discourse?', promptVi: 'Câu nào mang phong cách ngôn ngữ chính luận - xã hội chuẩn xác và tự nhiên nhất?', options: ['Phát triển bền vững đòi hỏi phải dung hòa giữa tăng trưởng kinh tế và bảo tồn di sản.', 'Kinh tế thì cứ tăng lên còn di sản muốn sao cũng được.', 'Bảo tồn di sản làm cho kinh tế không thể nào tiến lên nổi.', 'Tăng trưởng kinh tế là thứ duy nhất xã hội cần hướng tới.'], answer: 'Phát triển bền vững đòi hỏi phải dung hòa giữa tăng trưởng kinh tế và bảo tồn di sản.', noteVi: 'Sử dụng từ ngữ chuẩn xác: “phát triển bền vững”, “dung hòa”, “tăng trưởng kinh tế”, “bảo tồn di sản”.' },
    { id: 'p_c1_04', level: 'C1', prompt: '“Trăm nghe không bằng một thấy” conveys a principle similar to…', promptVi: 'Câu tục ngữ “Trăm nghe không bằng một thấy” tương đồng với quan niệm…', options: ['Trải nghiệm thực chứng có giá trị hơn tin đồn', 'Lời nói có sức thuyết phục tuyệt đối', 'Không cần quan sát thực tế', 'Chỉ tin vào sách vở kinh điển'], answer: 'Trải nghiệm thực chứng có giá trị hơn tin đồn', noteVi: 'Nhấn mạnh vai trò của việc chứng kiến và kiểm chứng thực tế so với nghe kể lại.' },
    { id: 'p_c1_05', level: 'C1', prompt: 'In culture and linguistics, “tính dung hợp” (syncretism / inclusiveness) refers to…', promptVi: 'Khái niệm “tính dung hợp” trong văn hóa Việt Nam phản ánh đặc trưng nào?', options: ['Khả năng tiếp thu có chọn lọc và hòa quyện các yếu tố mới', 'Sự bài xích tuyệt đối các nền văn hóa khác', 'Việc sao chép nguyên xi văn hóa nước ngoài', 'Sự chia rẽ không thể hàn gắn giữa các vùng miền'], answer: 'Khả năng tiếp thu có chọn lọc và hòa quyện các yếu tố mới', noteVi: 'Văn hóa Việt Nam nổi bật với đặc tính dung hợp: tiếp biến văn hóa bên ngoài nhưng giữ gìn bản sắc cốt lõi.' },
    { id: 'p_c1_06', level: 'C1', prompt: 'The philosophical concept “Hòa nhập nhưng không hòa tan” asserts…', promptVi: 'Thông điệp sâu sắc của luận điểm “Hòa nhập nhưng không hòa tan” trong thời kỳ toàn cầu hóa là:', options: ['Tích cực kết nối quốc tế nhưng kiên định giữ gìn bản sắc văn hóa dân tộc', 'Từ chối mọi sự giao lưu với văn hóa bên ngoài', 'Đồng hóa hoàn toàn theo lối sống phương Tây', 'Bỏ qua các giá trị truyền thống để theo đuổi hiện đại hóa'], answer: 'Tích cực kết nối quốc tế nhưng kiên định giữ gìn bản sắc văn hóa dân tộc', noteVi: 'Khẳng định nguyên lý mở rộng giao lưu quốc tế mà vẫn bảo tồn bản sắc cội nguồn.' },
    { id: 'p_c1_07', level: 'C1', prompt: 'Choose the most precise sociological term: “Sự ___ văn hóa diễn ra khi hai cộng đồng tiếp xúc lâu dài.”', promptVi: 'Chọn thuật ngữ nhân học - xã hội học chuẩn xác: “Sự ___ văn hóa diễn ra qua tiếp xúc lâu dài.”', options: ['tiếp biến', 'xa lánh', 'đánh mất', 'bắt chước'], answer: 'tiếp biến', noteVi: '“Tiếp biến văn hóa” (acculturation) là thuật ngữ học thuật chỉ quá trình giao lưu và biến đổi văn hóa.' },
    { id: 'p_c1_08', level: 'C1', prompt: 'Idiom “Gừng cay muối mặn xin đừng quên nhau” tượng trưng cho…', promptVi: 'Hình ảnh ẩn dụ “Gừng cay muối mặn” trong ca dao Việt Nam biểu trưng cho điều gì?', options: ['Nghĩa tình thủy chung gắn bó son sắt qua bao gian nan thử thách', 'Các loại gia vị truyền thống trong ẩm thực dân gian', 'Sự cay đắng và chia ly trong tình cảm lứa đôi', 'Bữa ăn thanh đạm của người nghèo thời xưa'], answer: 'Nghĩa tình thủy chung gắn bó son sắt qua bao gian nan thử thách', noteVi: 'Ẩn dụ về tình nghĩa vợ chồng, bạn hữu gắn kết bền chặt qua thăng trầm cuộc đời.' },
    { id: 'p_c1_09', level: 'C1', prompt: 'Analyze the tone of: “Thiết nghĩ, đây là thời điểm then chốt để tái định hình chiến lược.”', promptVi: 'Sắc thái tu từ của cụm từ “Thiết nghĩ,…” trong văn bản nghị luận thể hiện:', options: ['Sự đề xuất khiêm nhường nhưng đầy trọng lượng và tính thuyết phục cao', 'Mệnh lệnh áp đặt quyền lực', 'Sự trốn tránh trách nhiệm cá nhân', 'Sự thiếu tự tin vào quan điểm của mình'], answer: 'Sự đề xuất khiêm nhường nhưng đầy trọng lượng và tính thuyết phục cao', noteVi: '“Thiết nghĩ” là cách nói nhã nhặn, khiêm từ của người trí thức khi nêu kiến giải quan trọng.' },
    { id: 'p_c1_10', level: 'C1', prompt: 'In ecological governance: “Chuyển đổi xanh” (Green transition) encompasses…', promptVi: 'Khái niệm “Chuyển đổi xanh” trong phát triển kinh tế bền vững hướng tới mục tiêu cốt lõi nào?', options: ['Tái cơ cấu mô hình tăng trưởng theo hướng giảm phát thải và hài hòa với tự nhiên', 'Chỉ đơn thuần là trồng thêm nhiều cây xanh ven đường', 'Cấm hoàn toàn các hoạt động sản xuất công nghiệp', 'Sử dụng các sản phẩm có bao bì màu xanh lá cây'], answer: 'Tái cơ cấu mô hình tăng trưởng theo hướng giảm phát thải và hài hòa với tự nhiên', noteVi: 'Chuyển đổi toàn diện phương thức phát triển kinh tế hài hòa với bảo vệ hệ sinh thái.' },
    { id: 'p_c1_11', level: 'C1', prompt: 'Proverb “Ăn quả nhớ kẻ trồng cây” conveys the same moral principle as…', promptVi: 'Câu tục ngữ nào sau đây đồng nghĩa về mặt đạo lý với “Ăn quả nhớ kẻ trồng cây”?', options: ['Uống nước nhớ nguồn', 'Được đằng chân lân đằng đầu', 'Qua cầu rút ván', 'Đủng đỉnh như chú đi chợ'], answer: 'Uống nước nhớ nguồn', noteVi: 'Cả hai câu đều răn dạy đạo lý tri ân, ghi nhớ công lao của người đi trước.' },
    { id: 'p_c1_12', level: 'C1', prompt: 'Choose the sentence exhibiting high syntactic balance (phép đối ngẫu):', promptVi: 'Câu nào thể hiện nghệ thuật đối ngẫu và nhịp điệu ngôn ngữ tinh tế nhất?', options: ['Nước non nghìn dặm một màu biếc, nắng gió muôn phương trọn khối tình.', 'Trời hôm nay vừa nắng to lại vừa có nhiều gió thổi qua.', 'Tôi đi từ sáng tới chiều mà chưa thấy tới nơi muốn đến.', 'Khung cảnh thiên nhiên nhìn chung là rất phong phú và đa dạng.'], answer: 'Nước non nghìn dặm một màu biếc, nắng gió muôn phương trọn khối tình.', noteVi: 'Cặp đối chuẩn mực: “Nước non nghìn dặm” đối với “nắng gió muôn phương”, “một màu biếc” đối với “trọn khối tình”.' },
    { id: 'p_c1_13', level: 'C1', prompt: '“Bảo tồn di sản không đồng nghĩa với đóng băng di sản.” This implies…', promptVi: 'Luận điểm “Bảo tồn di sản không đồng nghĩa với đóng băng di sản” hàm ý điều gì?', options: ['Cần phát huy giá trị sống của di sản trong đời sống đương đại một cách sáng tạo', 'Nên cất giữ mọi di sản vào kho kín và không cho ai tiếp cận', 'Di sản cần được thay thế hoàn toàn bằng công nghệ số', 'Không cần quan tâm đến giá trị lịch sử gốc của di sản'], answer: 'Cần phát huy giá trị sống của di sản trong đời sống đương đại một cách sáng tạo', noteVi: 'Bảo tồn động: giữ gìn linh hồn di sản đồng thời làm cho di sản tiếp tục phát huy giá trị.' },
    { id: 'p_c1_14', level: 'C1', prompt: 'In scholarly Vietnamese writing, “xét trên bình diện…” serves to…', promptVi: 'Cụm liên kết “Xét trên bình diện…” trong văn phong nghiên cứu có chức năng gì?', options: ['Khu biệt phạm vi và góc độ tiếp cận của một vấn đề khoa học', 'Chấm dứt hoàn toàn cuộc nghiên cứu', 'Trích dẫn lời phát biểu của một nhân chứng', 'Bày tỏ cảm xúc yêu ghét cá nhân'], answer: 'Khu biệt phạm vi và góc độ tiếp cận của một vấn đề khoa học', noteVi: 'Dùng để xác định rõ góc nhìn chuyên môn (bình diện ngôn ngữ, văn hóa, kinh tế...).' },
    { id: 'p_c1_15', level: 'C1', prompt: '“Văn hóa là hồn cốt của dân tộc.” “Hồn cốt” metaphorically signifies…', promptVi: 'Từ ngữ mang tính biểu tượng “Hồn cốt” trong câu nói trên có nghĩa là:', options: ['Bản chất tinh túy, sức sống và giá trị cốt lõi nhất', 'Hình thức bề ngoài của các lễ hội', 'Một tác phẩm nghệ thuật cổ điển', 'Di tích lịch sử cụ thể'], answer: 'Bản chất tinh túy, sức sống và giá trị cốt lõi nhất', noteVi: '“Hồn cốt” = phần tinh túy, cốt lõi quyết định sự tồn vong và bản sắc của một dân tộc.' },
  ],
  C2: [
    { id: 'p_c2_01', level: 'C2', prompt: 'Analyze the profound social philosophy of “Gần mực thì đen, gần đèn thì rạng”:', promptVi: 'Triết lý nhân sinh sâu sắc thể hiện qua câu “Gần mực thì đen, gần đèn thì rạng” là:', options: ['Môi trường sống và các mối quan hệ xã hội tác động mạnh mẽ đến phẩm cách con người', 'Màu sắc đồ vật ảnh hưởng trực tiếp đến thị lực', 'Người có tài năng thì ở đâu cũng phát triển như nhau', 'Số phận mỗi người đã được định đoạt sẵn, không đổi thay'], answer: 'Môi trường sống và các mối quan hệ xã hội tác động mạnh mẽ đến phẩm cách con người', noteVi: 'Khuyên nhủ về tầm ảnh hưởng quyết định của môi trường xã hội và việc chọn bạn mà chơi.' },
    { id: 'p_c2_02', level: 'C2', prompt: 'In classic Vietnamese literature, the emotion “ngậm ngùi” conveys…', promptVi: 'Sắc thái thẩm mỹ của từ “ngậm ngùi” trong văn học cổ điển Việt Nam gợi tả…', options: ['Nỗi xót xa, tiếc nuối âm thầm lắng đọng trong tâm tư', 'Cơn giận dữ bộc phát mãnh liệt ra bên ngoài', 'Niềm vui sướng hân hoan không kìm nén được', 'Sự thờ ơ, lạnh lùng trước biến cố cuộc đời'], answer: 'Nỗi xót xa, tiếc nuối âm thầm lắng đọng trong tâm tư', noteVi: '“Ngậm ngùi” là nỗi niềm bi cảm kín đáo, sâu lắng, đặc trưng của tâm thức phương Đông.' },
    { id: 'p_c2_03', level: 'C2', prompt: 'What linguistic competency does understanding Vietnamese “nói lái” (spoonerism) require?', promptVi: 'Để hiểu và vận dụng nghệ thuật “nói lái” tinh tế trong tiếng Việt, người học cần có năng lực gì?', options: ['Phản xạ nhanh nhạy trong hoán đổi thanh điệu, âm vần và nắm bắt ngữ cảnh ngầm', 'Chỉ cần tra từ điển các từ đơn lẻ', 'Khả năng dịch từng từ sang tiếng nước ngoài', 'Chỉ cần nhớ các quy tắc ngữ pháp cơ bản'], answer: 'Phản xạ nhanh nhạy trong hoán đổi thanh điệu, âm vần và nắm bắt ngữ cảnh ngầm', noteVi: 'Nói lái là hiện tượng ngữ âm độc đáo, kết hợp giữa vần điệu, thanh điệu và sự dí dỏm văn hóa.' },
    { id: 'p_c2_04', level: 'C2', prompt: 'What represents the highest mastery of Vietnamese address terms in formal discourse?', promptVi: 'Đỉnh cao của sự tinh tế trong hệ thống xưng hô tiếng Việt ở hoàn cảnh trang trọng là:', options: ['Uyển chuyển lựa chọn đại từ theo vai vế, khéo léo “tôn xưng khiêm xưng” để giữ hòa khí', 'Luôn dùng đại từ ngôi thứ nhất “tôi” trong mọi tình huống', 'Không sử dụng bất kỳ đại từ xưng hô nào', 'Xưng hô ngang hàng bất chấp tuổi tác và địa vị'], answer: 'Uyển chuyển lựa chọn đại từ theo vai vế, khéo léo “tôn xưng khiêm xưng” để giữ hòa khí', noteVi: 'Văn hóa xưng hô tiếng Việt thể hiện chữ “Tình” và chữ “Lễ”, hạ mình khiêm tốn và tôn vinh người đối thoại.' },
    { id: 'p_c2_05', level: 'C2', prompt: 'Analyze the poetic resonance of “sắc sắc không không” (form and emptiness) in Vietnamese Zen literature:', promptVi: 'Triết lý uyên áo thể hiện qua mệnh đề “Sắc sắc không không” trong thi ca thiền học thời Lý - Trần là:', options: ['Vạn vật biến dịch khôn lường, hiện hữu và hư vô chỉ là hai mặt tương dung của thực tại', 'Cuộc đời hoàn toàn vô nghĩa và không có bất kỳ giá trị nào', 'Chỉ có vật chất cụ thể mới là điều chân thực duy nhất', 'Con người nên từ bỏ hoàn toàn mọi hoạt động xã hội'], answer: 'Vạn vật biến dịch khôn lường, hiện hữu và hư vô chỉ là hai mặt tương dung của thực tại', noteVi: 'Triết học Phật giáo dung hợp trong văn học Lý - Trần: thấu suốt lẽ sinh diệt mà an nhiên tự tại giữa dòng đời.' },
    { id: 'p_c2_06', level: 'C2', prompt: 'In Truyện Kiều, analyze the evocative aesthetic of “Cỏ non xanh tận chân trời / Cành lê trắng điểm một vài bông hoa”:', promptVi: 'Bút pháp nghệ thuật bậc thầy của Nguyễn Du trong hai câu thơ tả cảnh mùa xuân là:', options: ['Nghệ thuật chấm phá tài hoa, lấy gam màu trắng tinh khôi điểm xuyết trên nền xanh bát ngát', 'Tả thực tỉ mỉ từng chi tiết sinh học của các loài cây', 'Miêu tả tâm trạng bi lụy tuyệt vọng của nhân vật', 'Kể lể sự việc theo trình tự thời gian biên niên'], answer: 'Nghệ thuật chấm phá tài hoa, lấy gam màu trắng tinh khôi điểm xuyết trên nền xanh bát ngát', noteVi: 'Đỉnh cao của thi pháp cổ điển phương Đông: thi trung hữu họa, bút pháp chấm phá tạo nên không gian xuân khoáng đạt, thanh khiết.' },
    { id: 'p_c2_07', level: 'C2', prompt: 'What subtle pragmatic intention does the particle “chăng” convey in “Phải chăng ta đã lỡ hẹn?”', promptVi: 'Hư từ ngữ khí “chăng” trong câu hỏi tu từ mang sắc thái cảm xúc tinh tế nào?', options: ['Sự băn khoăn, ngập ngừng, hoài nghi kín đáo đầy vẻ tế nhị', 'Lời chất vấn gắt gao nhằm quy kết tội lỗi', 'Mệnh lệnh bắt buộc người nghe phải trả lời ngay', 'Sự khẳng định đanh thép không thể tranh cãi'], answer: 'Sự băn khoăn, ngập ngừng, hoài nghi kín đáo đầy vẻ tế nhị', noteVi: '“Chăng” làm dịu đi sắc thái của câu hỏi, gợi mở sự suy ngẫm lắng đọng và tế nhị.' },
    { id: 'p_c2_08', level: 'C2', prompt: 'Explain the cultural depth of “chữ Tâm kia mới bằng ba chữ Tài” in Vietnamese moral philosophy:', promptVi: 'Chiều sâu nhân văn trong câu thơ “Chữ Tâm kia mới bằng ba chữ Tài” khẳng định chuẩn mực nào?', options: ['Đạo đức, lương tri và tấm lòng nhân ái luôn giữ vị thế tối thượng so với tài năng đơn thuần', 'Tài năng là yếu tố duy nhất làm nên giá trị con người', 'Có đạo đức thì không cần trau dồi tri thức hay tài năng', 'Tài năng và tâm đức luôn loại trừ lẫn nhau trong đời sống'], answer: 'Đạo đức, lương tri và tấm lòng nhân ái luôn giữ vị thế tối thượng so với tài năng đơn thuần', noteVi: 'Triết lý nhân sinh bất hủ của Nguyễn Du: tài năng phải được soi sáng và nâng đỡ bởi cái Tâm hướng thiện.' },
    { id: 'p_c2_09', level: 'C2', prompt: 'Analyze the rhetorical function of “nói giảm nói tránh” (euphemism) in traditional condolence:', promptVi: 'Khi chia buồn cùng gia quyến, người Việt thường nói “cụ đã quy tiên / trăm tuổi quy lão” nhằm:', options: ['Giảm nhẹ cảm giác đau thương, bày tỏ sự kính trọng và an ủi sâu sắc đối với người đã khuất', 'Che giấu sự thật về nguyên nhân qua đời', 'Tránh né việc tham dự tang lễ', 'Sử dụng từ ngữ cầu kỳ để khoe chữ'], answer: 'Giảm nhẹ cảm giác đau thương, bày tỏ sự kính trọng và an ủi sâu sắc đối với người đã khuất', noteVi: 'Nghệ thuật nói giảm nói tránh thể hiện sự tinh tế nhân văn, xoa dịu nỗi đau mất mát của gia đình.' },
    { id: 'p_c2_10', level: 'C2', prompt: 'The linguistic aesthetic of Vietnamese “từ láy tượng thanh, tượng hình” is uniquely characterized by…', promptVi: 'Đặc trưng thẩm mỹ độc đáo của hệ thống từ láy tượng hình, tượng thanh trong tiếng Việt là:', options: ['Khả năng gợi hình, gợi cảm sống động và truyền tải đa tầng sắc thái biểu cảm', 'Chỉ có chức năng ngữ pháp mà không gợi tả được hình ảnh cụ thể', 'Hoàn toàn tương đồng với các ngôn ngữ đơn lập khác mà không có tính riêng biệt', 'Khó nhớ và không có giá trị nghệ thuật trong văn chương'], answer: 'Khả năng gợi hình, gợi cảm sống động và truyền tải đa tầng sắc thái biểu cảm', noteVi: 'Từ láy là kho báu biểu cảm của tiếng Việt: “lấp lánh”, “róc rách”, “thoang thoảng”, “bồi hồi”... khắc họa tinh vi rung động tâm hồn và thế giới.' },
    { id: 'p_c2_11', level: 'C2', prompt: 'In advanced diplomatic discourse, what is the strategic role of “vừa kiên định về nguyên tắc, vừa mềm dẻo về sách lược”?', promptVi: 'Triết lý ngoại giao “Dĩ bất biến, ứng vạn biến” (Cây tre Việt Nam) thể hiện nghệ thuật lãnh đạo nào?', options: ['Vững vàng về độc lập chủ quyền, nhưng linh hoạt và thích ứng khéo léo trước mọi biến động thời cuộc', 'Nhượng bộ vô điều kiện trước các cường quốc bên ngoài', 'Đóng cửa tuyệt đối không quan hệ ngoại giao với bất kỳ ai', 'Thay đổi lập trường cốt lõi theo từng hoàn cảnh cụ thể'], answer: 'Vững vàng về độc lập chủ quyền, nhưng linh hoạt và thích ứng khéo léo trước mọi biến động thời cuộc', noteVi: 'Gốc rễ vững chắc, thân cành uyển chuyển: kiên định lợi ích quốc gia tối thượng đồng thời linh hoạt trong phương pháp.' },
    { id: 'p_c2_12', level: 'C2', prompt: 'Analyze the deep sentiment of “thương người như thể thương thân”:', promptVi: 'Đạo lý tương thân tương ái “Thương người như thể thương thân” đặt nền tảng trên tinh thần:', options: ['Xem nỗi đau và phẩm giá của đồng loại như chính nỗi đau và phẩm giá của bản thân mình', 'Chỉ giúp đỡ những người có chung quan hệ huyết thống', 'Giúp đỡ người khác nhằm mục đích vụ lợi cá nhân sau này', 'Thương hại kẻ yếu hơn từ vị thế trịch thượng bề trên'], answer: 'Xem nỗi đau và phẩm giá của đồng loại như chính nỗi đau và phẩm giá của bản thân mình', noteVi: 'Đỉnh cao của lòng trắc ẩn: thấu cảm và yêu thương tha nhân với sự bình đẳng, bao dung sâu sắc.' },
    { id: 'p_c2_13', level: 'C2', prompt: 'In classical Vietnamese aesthetics, what does “phong cốt” (vital demeanor / integrity) mean?', promptVi: 'Khái niệm thẩm mỹ học truyền thống “Phong cốt” khi bình phẩm nhân vật hoặc áng văn biểu đạt:', options: ['Khí phách hiên ngang, cốt cách thanh tao và khí chất nội tâm vững vàng', 'Hình thức trang phục lộng lẫy xa hoa', 'Sự khéo léo nịnh bợ quyền quý', 'Sự mềm yếu, bi quan trước thời thế'], answer: 'Khí phách hiên ngang, cốt cách thanh tao và khí chất nội tâm vững vàng', noteVi: '“Phong cốt” là khí chất cao thượng, bản lĩnh thanh cao toát ra từ bên trong con người và tác phẩm.' },
    { id: 'p_c2_14', level: 'C2', prompt: 'Explain the sophisticated linguistic nuance of modal particle “cơ chứ” in: “Đến nông nỗi này cơ chứ!”', promptVi: 'Tổ hợp ngữ khí từ “cơ chứ” trong câu cảm thán biểu thị sắc thái tình cảm gì?', options: ['Nỗi ngậm ngùi, xót xa cay đắng xen lẫn sự bất lực tột cùng trước biến cố', 'Lời khen ngợi hân hoan trước một thành công bất ngờ', 'Sự thờ ơ không bận tâm', 'Câu hỏi tìm kiếm thông tin thông thường'], answer: 'Nỗi ngậm ngùi, xót xa cay đắng xen lẫn sự bất lực tột cùng trước biến cố', noteVi: '“Cơ chứ” là sự kết hợp ngữ khí cực kỳ biểu cảm, đẩy sắc thái bi cảm và trăn trở lên mức độ sâu sắc nhất.' },
    { id: 'p_c2_15', level: 'C2', prompt: 'The mastery of “chơi chữ” (pun / wordplay) in Hồ Xuân Hương’s poetry highlights…', promptVi: 'Nghệ thuật chơi chữ tài hoa, sắc sảo trong thơ Nôm Hồ Xuân Hương biểu hiện năng lực ngôn ngữ nào?', options: ['Sự thấu triệt cấu trúc thanh điệu, ngữ nghĩa đa tầng và bản lĩnh phá vỡ các khuôn sáo giáo điều', 'Việc sao chép các điển cố Trung Hoa kinh điển', 'Sự bế tắc trong việc tìm kiếm từ ngữ miêu tả', 'Chỉ là sự đùa cợt ngẫu hứng không mang tư tưởng tiến bộ'], answer: 'Sự thấu triệt cấu trúc thanh điệu, ngữ nghĩa đa tầng và bản lĩnh phá vỡ các khuôn sáo giáo điều', noteVi: 'Bà chúa thơ Nôm: bậc thầy khai thác hiện tượng đồng âm, đa nghĩa và thanh điệu để chuyển tải tư tưởng giải phóng con người độc đáo.' },
  ],
});

/**
 * Fisher-Yates array shuffling utility.
 */
export function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Builds the 15-question placement test based on the learner's chosen starting level.
 * Randomly samples questions from the bank according to the level's tier distribution,
 * and shuffles the answer options so the correct answer does not always appear in position A.
 *
 * @param {string} selectedLevel - 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
 * @returns {Array} 15 randomly sampled and option-shuffled questions
 */
export function getPlacementQuestions(selectedLevel = 'A1') {
  const normLevel = String(selectedLevel || 'A1').toUpperCase();
  const distribution = PLACEMENT_DISTRIBUTIONS[normLevel] || PLACEMENT_DISTRIBUTIONS.A1;
  const selectedQuestions = [];

  for (const [tier, count] of Object.entries(distribution)) {
    if (count > 0 && placementQuestionBank[tier]) {
      const bank = placementQuestionBank[tier];
      // Randomly shuffle the pool for this tier
      const shuffledBank = shuffleArray(bank);
      const chosen = shuffledBank.slice(0, Math.min(count, shuffledBank.length));

      // Shuffle options for each question so correct answer is NOT always in the first position (A)
      const randomizedChosen = chosen.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));

      selectedQuestions.push(...randomizedChosen);
    }
  }

  return selectedQuestions;
}

const ALL_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

/**
 * Evaluates the placement test using the Tiered Waterfall Algorithm.
 * - Each tier must meet its threshold (A1 >= 80%, A2 >= 70%, B1..C2 >= 60%).
 * - Lower tiers are strictly prerequisite: if a lower tier is missed, the assessed level
 *   stops at the highest passed consecutive tier, preventing higher certification if foundation is lost.
 *
 * @param {string} selectedLevel - Target level chosen by user
 * @param {Array} answers - Array of learner answers: { questionId, response, correct }
 * @param {Array} questions - The 15 questions served
 * @returns {Object} Full evaluation report including tier scores and explanations
 */
export function evaluatePlacementTest(selectedLevel, answers = [], questions = []) {
  const normLevel = String(selectedLevel || 'A1').toUpperCase();
  const distribution = PLACEMENT_DISTRIBUTIONS[normLevel] || PLACEMENT_DISTRIBUTIONS.A1;
  const tiersInTest = ALL_LEVELS.filter((lvl) => Boolean(distribution[lvl]));

  const tierScores = {};
  let totalCorrect = 0;

  for (const tier of tiersInTest) {
    const tierQuestions = questions.filter((q) => q.level === tier);
    const tierTotal = tierQuestions.length;
    let tierCorrect = 0;

    for (const q of tierQuestions) {
      const ans = answers.find((a) => a?.questionId === q.id);
      if (ans?.correct ?? isAnswerCorrect(ans?.response, q)) {
        tierCorrect++;
        totalCorrect++;
      }
    }

    const percent = tierTotal > 0 ? Math.round((tierCorrect / tierTotal) * 100) : 0;
    const threshold = TIER_THRESHOLDS[tier] || 60;
    const passed = percent >= threshold;

    tierScores[tier] = {
      tier,
      correct: tierCorrect,
      total: tierTotal,
      percent,
      threshold,
      passed,
    };
  }

  // Tiered Waterfall Evaluation:
  // Starts at 'A0'. Advances step-by-step through tiersInTest in sequential order.
  // Breaks on the first failed tier to preserve foundational integrity.
  let assessedLevel = 'A0';
  for (const tier of tiersInTest) {
    if (tierScores[tier]?.passed) {
      assessedLevel = tier;
    } else {
      break;
    }
  }

  const totalQuestions = questions.length || 15;
  const accuracy = Math.round((totalCorrect / totalQuestions) * 100);

  // Generate detailed pedagogical explanations
  let explanationVi;
  let explanationEn;

  if (assessedLevel === normLevel) {
    explanationVi = `Chúc mừng bạn! Bạn đã hoàn thành xuất sắc các tầng kiến thức và được xác nhận đạt trình độ ${normLevel}.`;
    explanationEn = `Congratulations! You mastered all foundation tiers and confirmed your ${normLevel} proficiency.`;
  } else if (assessedLevel === 'A0') {
    const a1Percent = tierScores.A1?.percent ?? 0;
    explanationVi = `Bạn đạt ${a1Percent}% ở phần nền tảng A1 (yêu cầu ≥ 80%). Hệ thống đề xuất bắt đầu từ A0 để xây dựng nền móng tiếng Việt vững chắc nhất.`;
    explanationEn = `You scored ${a1Percent}% in the A1 foundation (requires ≥ 80%). We recommend starting at A0 to build a solid base.`;
  } else {
    const nextFailedTier = tiersInTest.find((t) => !tierScores[t]?.passed);
    const failedInfo = nextFailedTier ? tierScores[nextFailedTier] : null;
    explanationVi = `Bạn đã qua nền tảng ${assessedLevel}, tuy nhiên ở cấp ${nextFailedTier || normLevel} bạn đạt ${failedInfo?.percent ?? 0}% (yêu cầu ≥ ${failedInfo?.threshold ?? 60}%). Hệ thống đề xuất lộ trình ${assessedLevel} để bạn củng cố kiến thức trước khi tiến lên ${normLevel}.`;
    explanationEn = `You passed the ${assessedLevel} foundation, but at ${nextFailedTier || normLevel} you scored ${failedInfo?.percent ?? 0}% (requires ≥ ${failedInfo?.threshold ?? 60}%). We recommend starting at ${assessedLevel} to solidify your knowledge before advancing.`;
  }

  return {
    selectedLevel: normLevel,
    assessedLevel,
    placementScore: totalCorrect,
    totalQuestions,
    accuracy,
    tierScores,
    explanationVi,
    explanationEn,
    targetLevel: assessedLevel,
  };
}

// Backward compatibility export
export const placementQuestions = getPlacementQuestions('A1');

export const placementBands = [
  { min: 0, label: 'New Explorer', labelVi: 'Người mới khám phá', targetLevel: 'A0', recommendation: 'Vietnamese Foundations · Lesson 1' },
  { min: 3, label: 'Foundation Builder', labelVi: 'Đang xây nền tảng', targetLevel: 'A1', recommendation: 'Everyday Vietnamese · Unit 2' },
  { min: 6, label: 'Everyday Communicator', labelVi: 'Giao tiếp thường ngày', targetLevel: 'A2', recommendation: 'Real-life Conversations · Unit 4' },
  { min: 9, label: 'Independent Communicator', labelVi: 'Giao tiếp độc lập', targetLevel: 'B1', recommendation: 'Natural Vietnamese · Unit 6' },
  { min: 12, label: 'Upper-intermediate Communicator', labelVi: 'Giao tiếp trên trung cấp', targetLevel: 'B2', recommendation: 'Advanced Vietnamese · Chapter 4' },
  { min: 14, label: 'Advanced Communicator', labelVi: 'Giao tiếp nâng cao', targetLevel: 'C1', recommendation: 'Advanced Vietnamese · Culture and Heritage' },
];

export { PLACEMENT_OPTION_TRANSLATIONS, getLocalizedOption, areOptionsMatching, isAnswerCorrect };
