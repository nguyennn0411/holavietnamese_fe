import {
  Baby, BriefcaseBusiness, Compass, Dumbbell, HeartHandshake, Landmark,
  MessageCircle, Plane, Sparkles, Sprout, Target, Timer, Trophy, Utensils,
} from 'lucide-react';

export const learningReasons = [
  { id: 'travel', title: 'Travel to Vietnam', detail: 'Navigate every adventure with confidence.', icon: Plane },
  { id: 'connection', title: 'Connect with friends or family', detail: 'Share more meaningful moments together.', icon: HeartHandshake },
  { id: 'work', title: 'Work or study in Vietnam', detail: 'Feel ready for your next opportunity.', icon: BriefcaseBusiness },
  { id: 'culture', title: 'Explore Vietnamese culture', detail: 'Understand traditions, stories, and daily life.', icon: Landmark },
  { id: 'challenge', title: 'Challenge myself', detail: 'Build a rewarding new skill.', icon: Dumbbell },
  { id: 'other', title: 'Other reasons', detail: 'Create a journey that is uniquely yours.', icon: Sparkles },
];

export const levelOptions = [
  { id: 'new', title: "I'm completely new", detail: 'Perfect — we will start with the essentials.', icon: Sprout },
  { id: 'words', title: 'I know a few words', detail: 'You recognize a handful of useful phrases.', icon: MessageCircle },
  { id: 'simple', title: 'I can have simple conversations', detail: 'You can handle familiar situations.', icon: Baby },
  { id: 'everyday', title: 'I can discuss everyday topics', detail: 'You can share ideas about daily life.', icon: Compass },
  { id: 'fluent', title: "I'm already quite fluent", detail: 'You want to polish nuance and accuracy.', icon: Trophy },
];

export const dailyGoals = [
  { minutes: 5, label: 'Casual', detail: 'One quick practice', icon: Sparkles, color: '#f59e0b' },
  { minutes: 10, label: 'Regular', detail: 'Build a steady habit', icon: Timer, color: '#16a34a', recommended: true },
  { minutes: 15, label: 'Serious', detail: 'Make confident progress', icon: Target, color: '#2563eb' },
  { minutes: 30, label: 'Intensive', detail: 'Move at a focused pace', icon: Trophy, color: '#da251d' },
];

export const benefits = [
  { title: 'Introduce yourself', detail: 'Make a warm first impression.', icon: MessageCircle },
  { title: 'Order with confidence', detail: 'Enjoy phở, coffee, and more.', icon: Utensils },
  { title: 'Find your way', detail: 'Ask for directions while traveling.', icon: Compass },
  { title: 'Understand daily speech', detail: 'Follow familiar conversations.', icon: HeartHandshake },
  { title: 'Sound more natural', detail: 'Train your listening and pronunciation.', icon: Sparkles },
  { title: 'Discover the culture', detail: 'Connect language with living traditions.', icon: Landmark },
];

export const firstLessonQuestions = [
  { id: 'l1', type: 'choice', prompt: 'What does “Xin chào” mean?', options: ['Thank you', 'Hello', 'Good night'], answer: 'Hello', note: '“Xin chào” is a polite, friendly way to say hello.' },
  { id: 'l2', type: 'choice', prompt: 'Which situation matches “Cảm ơn”?', options: ['🙏 Someone helped you', '👋 You are leaving', '🍜 You are ordering'], answer: '🙏 Someone helped you', note: '“Cảm ơn” means “Thank you.”' },
  { id: 'l3', type: 'match', prompt: 'Match the Vietnamese phrase to “Goodbye”.', options: ['Tạm biệt', 'Xin lỗi', 'Không'], answer: 'Tạm biệt', note: '“Tạm biệt” is used when saying goodbye.' },
  { id: 'l4', type: 'arrange', prompt: 'Build: “Hello, I am Mai.”', tokens: ['Mai', 'Xin chào,', 'là', 'tôi'], answer: 'Xin chào, tôi là Mai', note: 'Vietnamese uses “Tôi là…” for “I am…”.' },
  { id: 'l5', type: 'listen', prompt: 'Listen and choose what you hear.', speak: 'Cảm ơn', options: ['Cảm ơn', 'Xin chào', 'Tạm biệt'], answer: 'Cảm ơn', note: 'Great listening — notice the rising hỏi tone in “cảm”.' },
  { id: 'l6', type: 'fill', prompt: 'Complete the phrase: “Xin ___”', options: ['chào', 'ơn', 'biệt'], answer: 'chào', note: '“Xin chào” works throughout the day.' },
  { id: 'l7', type: 'choice', prompt: 'You are leaving a new friend. What do you say?', options: ['Tạm biệt!', 'Cảm ơn!', 'Xin chào!'], answer: 'Tạm biệt!', note: 'Exactly — “Tạm biệt!” means “Goodbye!”' },
];

export const placementQuestions = [
  ['“Xin chào” means…', ['Hello', 'Sorry', 'Please'], 'Hello'],
  ['How do you say “Thank you”?', ['Cảm ơn', 'Tạm biệt', 'Không'], 'Cảm ơn'],
  ['Choose “Goodbye”.', ['Xin chào', 'Tạm biệt', 'Vâng'], 'Tạm biệt'],
  ['What number is “ba”?', ['2', '3', '7'], '3'],
  ['“Mẹ” means…', ['Mother', 'Friend', 'Teacher'], 'Mother'],
  ['Choose the word for “rice / a meal”.', ['Cơm', 'Nước', 'Nhà'], 'Cơm'],
  ['“Bạn khỏe không?” asks…', ['How are you?', 'Where are you?', 'What is this?'], 'How are you?'],
  ['“Tôi sống ở Hà Nội.” means…', ['I live in Hanoi.', 'I like Hanoi.', 'I left Hanoi.'], 'I live in Hanoi.'],
  ['Best reply to “Bạn tên là gì?”', ['Tôi tên là Linh.', 'Tôi khỏe.', 'Không có gì.'], 'Tôi tên là Linh.'],
  ['Lan: “Bạn muốn uống gì?” Minh: “Cho tôi một cà phê.” What does Minh want?', ['A coffee', 'A meal', 'A taxi'], 'A coffee'],
].map(([prompt, options, answer], index) => ({ id: `p${index + 1}`, prompt, options, answer }));

export const placementBands = [
  { min: 0, label: 'New Explorer', recommendation: 'Vietnamese Foundations · Lesson 1' },
  { min: 4, label: 'Foundation Builder', recommendation: 'Everyday Vietnamese · Unit 2' },
  { min: 7, label: 'Confident Communicator', recommendation: 'Real-life Conversations · Unit 4' },
  { min: 9, label: 'Advanced Explorer', recommendation: 'Natural Vietnamese · Unit 6' },
];
