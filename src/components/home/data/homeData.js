import { Coffee, ShoppingBag, Car, MessageCircle } from 'lucide-react';

/**
 * 6 Vietnamese Tones Data for Bento Pitch Visualizer
 */
export const TONE_LIST = [
  { id: 'NGANG', name: 'Ngang', symbol: '—', word: 'Ma', mean: 'Ghost' },
  { id: 'HUYEN', name: 'Huyền', symbol: '`', word: 'Mà', mean: 'But/Which' },
  { id: 'SAC', name: 'Sắc', symbol: '´', word: 'Má', mean: 'Cheek/Mom' },
  { id: 'HOI', name: 'Hỏi', symbol: '?', word: 'Mả', mean: 'Tomb' },
  { id: 'NGA', name: 'Ngã', symbol: '~', word: 'Mã', mean: 'Horse/Code' },
  { id: 'NANG', name: 'Nặng', symbol: '.', word: 'Mạ', mean: 'Rice plant' },
];

/**
 * AI Tutor Sample Dialogue Prompts
 */
export const AI_PROMPTS = [
  {
    ai: '“Chào Mark! Hôm nay bạn muốn ăn phở bò tái hay phở gà ở phố cổ?”',
    user: 'Cho tôi một bát phở bò tái',
    tip: 'AI phản hồi: “Ngon lắm! Bạn nhớ thêm một chút giấm tỏi và ớt nhé!”',
  },
  {
    ai: '“Em chào anh, anh đi đâu để em gọi Grab giúp anh nhé?”',
    user: 'Bác tài cho tôi đến Hồ Gươm',
    tip: 'AI phản hồi: “Dạ được, xe 4 chỗ đang tới đón anh sau 3 phút.”',
  },
  {
    ai: '“Cái nón lá này là đồ thủ công Huế, anh có muốn thử không?”',
    user: 'Cái này bao nhiêu tiền một cái?',
    tip: 'AI phản hồi: “Dạ 80 nghìn một cái, mua hai cái em bớt 10 nghìn nha.”',
  },
];

/**
 * Vietnamese Diacritic Characters for Virtual Keypad
 */
export const DIACRITIC_CHARS = ['á', 'à', 'ả', 'ã', 'ạ', 'ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'đ'];

/**
 * Sample Preset Words for Diacritic Testing
 */
export const SAMPLE_PRESET_WORDS = ['Phở', 'Cà phê', 'Cảm ơn', 'Việt Nam'];

/**
 * Cultural Street Situations for Bento Showcase
 */
export const CULTURAL_SITUATIONS = [
  {
    icon: Coffee,
    title: 'Phở & Cà Phê',
    situation: 'Quán vỉa hè Hà Nội / Sài Gòn',
    phraseVi: 'Cho tôi một ly cà phê sữa đá ít đường nhé.',
    phraseEn: 'One iced milk coffee with less sugar please.',
    ipa: '/kaː˨˩ fe˧˧ sɨə˦ˀ˥ daː˧˥/',
  },
  {
    icon: ShoppingBag,
    title: 'Chợ Bến Thành',
    situation: 'Mặc cả & hỏi giá thân thiện',
    phraseVi: 'Cái này bao nhiêu tiền một cái hả cô?',
    phraseEn: 'How much is this one, ma’am?',
    ipa: '/ɓaːw˧˧ ɲiəw˧˧ tiəŋ˨˩/',
  },
  {
    icon: Car,
    title: 'Grab / Taxi',
    situation: 'Chỉ đường & xác nhận địa điểm',
    phraseVi: 'Bác tài cho tôi đến Hồ Gươm, đi đường ven hồ nhé.',
    phraseEn: 'Driver, take me to Hoan Kiem lake via the lakeside road.',
    ipa: '/ho˨˩ ɣɨəm˧˧/',
  },
  {
    icon: MessageCircle,
    title: 'Giao Lưu Bạn Bè',
    situation: 'Làm quen & chào hỏi lịch sự',
    phraseVi: 'Rất vui được làm quen với bạn! Bạn tên là gì?',
    phraseEn: 'Very nice to meet you! What is your name?',
    ipa: '/zət˧˥ vwi˧˧ ləm˨˩ kwɛn˧˧/',
  },
];

/**
 * Gamified Learning Roadmap Adventure Nodes
 */
export const ROADMAP_NODES = [
  { id: '1', level: 'A0', title: 'Làm quen 6 Thanh điệu & Bảng chữ cái', status: 'completed', stars: 3, xp: 50 },
  { id: '2', level: 'A1', title: 'Chào hỏi & Gọi món đường phố', status: 'completed', stars: 3, xp: 75 },
  { id: '3', level: 'A1+', title: 'Đi chợ & Hỏi giá tiền Việt', status: 'current', stars: 1, xp: 100 },
  { id: '4', level: 'A2', title: 'Giao lưu bạn bè & Đồng nghiệp', status: 'locked', stars: 0, xp: 120 },
  { id: '5', level: 'B1', title: 'Khám phá văn hóa & Đời sống Việt', status: 'locked', stars: 0, xp: 150 },
];

/**
 * Expat Student Testimonials
 */
export const EXPAT_TESTIMONIALS = [
  {
    name: 'Mark Richardson',
    role: 'Kỹ sư phần mềm • Sống tại Đà Nẵng',
    code: 'US',
    quote:
      'Biểu đồ cao độ âm thanh là đột phá lớn nhất. Sau 2 tuần, tôi đã phân biệt rõ ràng dấu Hỏi (?) và dấu Ngã (~), không còn bị người bán hàng nghe nhầm nữa!',
    favPhrase: '“Cho tôi tính tiền nhé em ơi!”',
  },
  {
    name: 'Sophie Laurent',
    role: 'Giám đốc sáng tạo • Sống tại Hà Nội',
    code: 'FR',
    quote:
      'AI Tutor tạo cảm giác trò chuyện vô cùng tự nhiên. Tôi có thể thực hành nói trước khi ra chợ hoa quả mà không sợ bị ngại ngùng.',
    favPhrase: '“Bao nhiêu một cân thanh long ạ?”',
  },
  {
    name: 'Kenji Takahashi',
    role: 'Cố vấn kinh doanh • Sống tại TP.HCM',
    code: 'JP',
    quote:
      'Bàn phím ảo một chạm rất tuyệt vời. Tôi không cần phải cài Unikey hay học bảng mã Telex phức tạp mà vẫn gõ đúng dấu tiếng Việt chính xác.',
    favPhrase: '“Cà phê sữa đá ít đường nhé!”',
  },
];

/**
 * Default 7-day Streak Tracker Days
 */
export const DEFAULT_STREAK_DAYS = [
  { day: 'T2', active: true, label: 'Thứ Hai' },
  { day: 'T3', active: true, label: 'Thứ Ba' },
  { day: 'T4', active: true, label: 'Thứ Tư' },
  { day: 'T5', active: true, label: 'Thứ Năm' },
  { day: 'T6', active: true, label: 'Thứ Sáu' },
  { day: 'T7', active: true, isToday: true, label: 'Hôm nay' },
  { day: 'CN', active: false, label: 'Chủ Nhật' },
];

/**
 * Daily Learner Quests
 */
export const DEFAULT_QUESTS = [
  {
    id: 'q1',
    tier: 'Đồng',
    title: 'Hoàn thành 1 bài học bất kỳ',
    progress: '1/1',
    xp: 15,
    done: true,
  },
  {
    id: 'q2',
    tier: 'Bạc',
    title: 'Luyện 1 bài đối chiếu thanh điệu',
    progress: '1/1',
    xp: 20,
    done: true,
  },
  {
    id: 'q3',
    tier: 'Vàng',
    title: 'Thu thập 50 XP trong ngày',
    progress: '35/50 XP',
    xp: 35,
    done: false,
  },
];

/**
 * Weekly League Rival Leaderboard
 */
export const DEFAULT_LEAGUE_LEADERBOARD = [
  { rank: 1, name: 'Alex M.', code: 'US', xp: 520, badge: '🥇', isUser: false },
  { rank: 2, name: 'Sarah K.', code: 'UK', xp: 485, badge: '🥈', isUser: false },
  { rank: 3, name: 'Kenji T.', code: 'JP', xp: 440, badge: '🥉', isUser: false },
  { rank: 4, name: 'Bạn', code: 'VN', xp: 380, badge: '⭐', isUser: true },
];

/**
 * Spaced Repetition (SRS) 2-Minute Warm-up Words
 */
export const QUICK_SRS_WORDS = [
  { vi: 'Cảm ơn', en: 'Thank you', ipa: '/kaːm˧˩˨ ʔəːn˧˧/', tip: 'Thanh hỏi ả hạ giọng trong họng' },
  { vi: 'Bao nhiêu', en: 'How much', ipa: '/ɓaːw˧˧ ɲiəw˧˧/', tip: 'Thanh ngang bằng phẳng' },
  { vi: 'Xin lỗi', en: 'Excuse me / Sorry', ipa: '/sin˧˧ loj˦ˀ˥/', tip: 'Thanh ngã ỗi ngắt giọng nhẹ' },
];

/**
 * Cultural Tip & Word of the Day
 */
export const WORD_OF_THE_DAY = {
  word: '“Dạ” [zâː / jâː]',
  speechText: 'Dạ. Dạ con cảm ơn bác.',
  description:
    'Từ mở đầu câu kinh điển của người miền Nam, thể hiện sự kính trọng, lễ phép và khiêm nhường đối với người lớn tuổi.',
  example: 'Ví dụ: “Dạ, cho con gửi tiền ạ.”',
};
