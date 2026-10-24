import {
  Baby, BriefcaseBusiness, Compass, Dumbbell, HeartHandshake, Landmark,
  MessageCircle, Plane, Sprout, Target, Timer, Trophy, Utensils, Volume2,
} from 'lucide-react';

export const learningReasons = [
  { id: 'travel', title: 'Travel and live confidently in Vietnam', titleVi: 'Tự tin du lịch và sinh hoạt tại Việt Nam', detail: 'Directions, transport, food, shopping, and essential conversations.', detailVi: 'Hỏi đường, di chuyển, gọi món, mua sắm và giao tiếp thiết yếu.', icon: Plane },
  { id: 'connection', title: 'Connect with Vietnamese family and friends', titleVi: 'Kết nối với gia đình và bạn bè người Việt', detail: 'Understand everyday speech and share meaningful conversations.', detailVi: 'Hiểu lời nói hằng ngày và trò chuyện gần gũi hơn.', icon: HeartHandshake },
  { id: 'work', title: 'Study or work with Vietnamese speakers', titleVi: 'Học tập hoặc làm việc với người Việt', detail: 'Communicate clearly and politely in academic and professional settings.', detailVi: 'Giao tiếp rõ ràng, lịch sự trong môi trường học tập và công việc.', icon: BriefcaseBusiness },
  { id: 'culture', title: 'Understand Vietnamese culture more deeply', titleVi: 'Hiểu sâu hơn về văn hóa Việt Nam', detail: 'Learn through traditions, stories, places, and daily life.', detailVi: 'Học qua phong tục, câu chuyện, địa danh và đời sống thường ngày.', icon: Landmark },
  { id: 'challenge', title: 'Build a complete new language skill', titleVi: 'Xây dựng một kỹ năng ngôn ngữ toàn diện', detail: 'Develop listening, speaking, reading, and writing step by step.', detailVi: 'Phát triển nghe, nói, đọc và viết theo từng bước rõ ràng.', icon: Dumbbell },
  { id: 'other', title: 'Explore before choosing a specific goal', titleVi: 'Khám phá trước khi chọn mục tiêu cụ thể', detail: 'Start with a flexible foundation and refine your focus later.', detailVi: 'Bắt đầu với nền tảng linh hoạt và điều chỉnh trọng tâm sau.', icon: Compass },
];

export const levelOptions = [
  { id: 'new', title: "I'm completely new", titleVi: 'Tôi hoàn toàn mới bắt đầu', detail: 'Perfect — we will start with the essentials.', detailVi: 'Rất tốt — chúng ta sẽ bắt đầu từ những điều cốt lõi.', icon: Sprout },
  { id: 'words', title: 'I know a few words', titleVi: 'Tôi biết một vài từ', detail: 'You recognize a handful of useful phrases.', detailVi: 'Bạn nhận biết được một số cụm từ thông dụng.', icon: MessageCircle },
  { id: 'simple', title: 'I can have simple conversations', titleVi: 'Tôi có thể trò chuyện đơn giản', detail: 'You can handle familiar situations.', detailVi: 'Bạn có thể xử lý các tình huống quen thuộc.', icon: Baby },
  { id: 'everyday', title: 'I can discuss everyday topics', titleVi: 'Tôi có thể thảo luận chủ đề thường ngày', detail: 'You can share ideas about daily life.', detailVi: 'Bạn có thể chia sẻ ý kiến về cuộc sống hàng ngày.', icon: Compass },
  { id: 'fluent', title: "I'm already quite fluent", titleVi: 'Tôi đã nói khá lưu loát', detail: 'You want to polish nuance and accuracy.', detailVi: 'Bạn muốn trau chuốt độ tự nhiên và chính xác.', icon: Trophy },
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

export const placementQuestions = [
  ['“Xin chào” means…', ['Hello', 'Sorry', 'Please'], 'Hello', '“Xin chào” có nghĩa là…'],
  ['How do you say “Thank you”?', ['Cảm ơn', 'Tạm biệt', 'Không'], 'Cảm ơn', 'Nói “Thank you” trong tiếng Việt như thế nào?'],
  ['Choose “Goodbye”.', ['Xin chào', 'Tạm biệt', 'Vâng'], 'Tạm biệt', 'Chọn từ có nghĩa là “Goodbye”.'],
  ['What number is “ba”?', ['2', '3', '7'], '3', '“Ba” là số mấy?'],
  ['“Mẹ” means…', ['Mother', 'Friend', 'Teacher'], 'Mother', '“Mẹ” có nghĩa là…'],
  ['Choose the word for “rice / a meal”.', ['Cơm', 'Nước', 'Nhà'], 'Cơm', 'Chọn từ chỉ “cơm / bữa ăn”.'],
  ['“Bạn khỏe không?” asks…', ['How are you?', 'Where are you?', 'What is this?'], 'How are you?', '“Bạn khỏe không?” dùng để hỏi gì?'],
  ['“Tôi sống ở Hà Nội.” means…', ['I live in Hanoi.', 'I like Hanoi.', 'I left Hanoi.'], 'I live in Hanoi.', '“Tôi sống ở Hà Nội.” có nghĩa là gì?'],
  ['Best reply to “Bạn tên là gì?”', ['Tôi tên là Linh.', 'Tôi khỏe.', 'Không có gì.'], 'Tôi tên là Linh.', 'Câu trả lời phù hợp nhất cho “Bạn tên là gì?”'],
  ['Lan: “Bạn muốn uống gì?” Minh: “Cho tôi một cà phê.” What does Minh want?', ['A coffee', 'A meal', 'A taxi'], 'A coffee', 'Lan: “Bạn muốn uống gì?” Minh: “Cho tôi một cà phê.” Minh muốn uống gì?'],
  ['Choose the correct classifier: “Tôi mua hai ___ sách.”', ['quyển', 'con', 'chiếc'], 'quyển', 'Chọn loại từ đúng: “Tôi mua hai ___ sách.”'],
  ['“Tôi đã từng đến Huế” expresses…', ['A past experience', 'A future plan', 'A daily habit'], 'A past experience', '“Tôi đã từng đến Huế” diễn tả điều gì?'],
  ['Complete: “Mặc dù trời mưa, ___ chúng tôi vẫn đi.”', ['nhưng', 'vì', 'nên'], 'nhưng', 'Hoàn thành câu: “Mặc dù trời mưa, ___ chúng tôi vẫn đi.”'],
  ['In “Cô ấy được mọi người quý mến”, “được” signals…', ['A positive passive meaning', 'A command', 'A comparison'], 'A positive passive meaning', 'Trong câu “Cô ấy được mọi người quý mến”, “được” thể hiện điều gì?'],
  ['“Nước đến chân mới nhảy” describes someone who…', ['Waits until the last moment to act', 'Learns very quickly', 'Travels frequently'], 'Waits until the last moment to act', '“Nước đến chân mới nhảy” nói về người như thế nào?'],
].map(([prompt, options, answer, promptVi], index) => ({ id: `p${index + 1}`, prompt, promptVi, options, answer }));

export const placementBands = [
  { min: 0, label: 'New Explorer', labelVi: 'Người mới khám phá', targetLevel: 'A0', recommendation: 'Vietnamese Foundations · Lesson 1' },
  { min: 3, label: 'Foundation Builder', labelVi: 'Đang xây nền tảng', targetLevel: 'A1', recommendation: 'Everyday Vietnamese · Unit 2' },
  { min: 6, label: 'Everyday Communicator', labelVi: 'Giao tiếp thường ngày', targetLevel: 'A2', recommendation: 'Real-life Conversations · Unit 4' },
  { min: 9, label: 'Independent Communicator', labelVi: 'Giao tiếp độc lập', targetLevel: 'B1', recommendation: 'Natural Vietnamese · Unit 6' },
  { min: 12, label: 'Upper-intermediate Communicator', labelVi: 'Giao tiếp trên trung cấp', targetLevel: 'B2', recommendation: 'Advanced Vietnamese · Chapter 4' },
  { min: 14, label: 'Advanced Communicator', labelVi: 'Giao tiếp nâng cao', targetLevel: 'C1', recommendation: 'Advanced Vietnamese · Culture and Heritage' },
];
