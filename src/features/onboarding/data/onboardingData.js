import {
  Baby, BriefcaseBusiness, Compass, Dumbbell, HeartHandshake, Landmark,
  MessageCircle, Plane, Sprout, Target, Timer, Trophy, Utensils, Volume2,
} from 'lucide-react';

export const learningReasons = [
  { id: 'travel', title: 'Travel to Vietnam', titleVi: 'Du lịch đến Việt Nam', detail: 'Navigate every adventure with confidence.', detailVi: 'Tự tin trải nghiệm mọi chuyến đi.', icon: Plane },
  { id: 'connection', title: 'Connect with friends or family', titleVi: 'Kết nối bạn bè hoặc người thân', detail: 'Share more meaningful moments together.', detailVi: 'Chia sẻ nhiều khoảnh khắc ý nghĩa hơn.', icon: HeartHandshake },
  { id: 'work', title: 'Work or study in Vietnam', titleVi: 'Làm việc hoặc học tập tại Việt Nam', detail: 'Feel ready for your next opportunity.', detailVi: 'Sẵn sàng cho những cơ hội mới.', icon: BriefcaseBusiness },
  { id: 'culture', title: 'Explore Vietnamese culture', titleVi: 'Khám phá văn hóa Việt Nam', detail: 'Understand traditions, stories, and daily life.', detailVi: 'Hiểu truyền thống, câu chuyện và nếp sống.', icon: Landmark },
  { id: 'challenge', title: 'Challenge myself', titleVi: 'Thử thách bản thân', detail: 'Build a rewarding new skill.', detailVi: 'Rèn luyện một kỹ năng mới giá trị.', icon: Dumbbell },
  { id: 'other', title: 'Other reasons', titleVi: 'Lý do khác', detail: 'Create a journey that is uniquely yours.', detailVi: 'Tạo nên hành trình của riêng bạn.', icon: Compass },
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
].map(([prompt, options, answer, promptVi], index) => ({ id: `p${index + 1}`, prompt, promptVi, options, answer }));

export const placementBands = [
  { min: 0, label: 'New Explorer', targetLevel: 'A1', recommendation: 'Vietnamese Foundations · Lesson 1' },
  { min: 4, label: 'Foundation Builder', targetLevel: 'A1', recommendation: 'Everyday Vietnamese · Unit 2' },
  { min: 7, label: 'Confident Communicator', targetLevel: 'A2', recommendation: 'Real-life Conversations · Unit 4' },
  { min: 9, label: 'Advanced Explorer', targetLevel: 'B1', recommendation: 'Natural Vietnamese · Unit 6' },
];
