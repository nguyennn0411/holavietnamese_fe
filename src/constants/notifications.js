/**
 * Notification Categories, Utilities and Sample Seeds for Hola Vietnamese
 */

export const NOTIFICATION_CATEGORIES = [
  { id: 'all', label: 'Tất cả', labelEn: 'All' },
  { id: 'unread', label: 'Chưa đọc', labelEn: 'Unread' },
  { id: 'lesson', label: 'Bài học & Lộ trình', labelEn: 'Lessons' },
  { id: 'achievement', label: 'Thành tích & Điểm thưởng', labelEn: 'Achievements' },
  { id: 'streak', label: 'Chuỗi học & Nhắc nhở', labelEn: 'Streak' },
  { id: 'system', label: 'Hệ thống & Tin mới', labelEn: 'System' },
];

/**
 * Format timestamp into relative Vietnamese time (e.g. "Vừa xong", "10 phút trước", "Hôm qua")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Vừa xong';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffSeconds) || diffSeconds < 60) return 'Vừa xong';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} phút trước`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} giờ trước`;
    if (diffSeconds < 86400 * 2) return 'Hôm qua';
    if (diffSeconds < 86400 * 7) return `${Math.floor(diffSeconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

/**
 * Normalize notification object from Backend REST or SSE payload
 */
export function normalizeNotification(item) {
  if (!item) return null;
  const isRead = Boolean(item.isRead ?? item.read ?? false);
  const link = item.linkUrl ?? item.link ?? null;
  const rawType = String(item.type || 'SYSTEM').toLowerCase();

  let type = 'system';
  if (rawType.includes('lesson') || rawType.includes('course')) type = 'lesson';
  else if (rawType.includes('achieve') || rawType.includes('badge')) type = 'achievement';
  else if (rawType.includes('streak')) type = 'streak';
  else type = 'system';

  return {
    ...item,
    id: item.id,
    type,
    title: item.title || item.titleVi || 'Thông báo mới',
    titleVi: item.titleVi || item.title || 'Thông báo mới',
    message: item.message || '',
    link,
    linkUrl: link,
    read: isRead,
    isRead,
    time: item.time || formatRelativeTime(item.createdAt),
    createdAt: item.createdAt || new Date().toISOString(),
    xpReward: item.xpReward || null,
  };
}

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    type: 'lesson',
    title: 'Một bài học mới đang chờ bạn',
    titleVi: 'Một bài học mới đang chờ bạn',
    message: 'Tiếp tục hành trình tại quán phở Hà Nội - Luyện ghép câu và nhận diện thanh điệu.',
    time: '10 phút trước',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read: false,
    isRead: false,
    link: '/courses/1/lesson/101',
    linkUrl: '/courses/1/lesson/101',
    xpReward: '+15 XP',
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Bạn đã mở khóa huy hiệu mới!',
    titleVi: 'Bạn đã mở khóa huy hiệu mới!',
    message: 'Lời chào đầu tiên - mỗi bước nhỏ đều đáng ghi nhận trên hành trình nói tiếng Việt.',
    time: '2 giờ trước',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    isRead: false,
    link: '/achievements',
    linkUrl: '/achievements',
    xpReward: '+50 XP',
  },
  {
    id: 3,
    type: 'streak',
    title: 'Bảo vệ chuỗi 7 ngày học liên tục',
    titleVi: 'Bảo vệ chuỗi 7 ngày học liên tục',
    message: 'Đừng quên hoàn thành ít nhất 1 bài học hôm nay để duy trì ngọn lửa học tập rực cháy!',
    time: 'Hôm qua',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    isRead: true,
    link: '/edtech/dashboard',
    linkUrl: '/edtech/dashboard',
    xpReward: '+10 XP',
  },
  {
    id: 4,
    type: 'system',
    title: 'Khám phá phòng đàm thoại Hola AI',
    titleVi: 'Khám phá phòng đàm thoại Hola AI',
    message: 'Trò chuyện tự nhiên với trợ lý AI bản xứ mọi lúc, sửa lỗi phát âm và phản xạ tức thì.',
    time: '3 ngày trước',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    read: true,
    isRead: true,
    link: '/ai-tutor',
    linkUrl: '/ai-tutor',
  },
  {
    id: 5,
    type: 'lesson',
    title: 'Vườn từ vựng đã đến hạn tưới nước',
    titleVi: 'Vườn từ vựng đã đến hạn tưới nước',
    message: 'Thuật toán lặp lại ngắt quãng (SRS) nhắc bạn ôn lại 3 từ vựng để không bị quên.',
    time: '5 ngày trước',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    read: true,
    isRead: true,
    link: '/edtech/vocabulary',
    linkUrl: '/edtech/vocabulary',
    xpReward: '+20 XP',
  },
];
