export const NOTIFICATION_TYPES = [
  'SYSTEM', 'WELCOME', 'COURSE', 'LESSON', 'QUIZ',
  'ACHIEVEMENT', 'STREAK', 'CONTENT_REVIEW', 'SECURITY',
];

export const NOTIFICATION_CATEGORIES = [
  { id: 'all', label: 'Tất cả', labelEn: 'All' },
  { id: 'unread', label: 'Chưa đọc', labelEn: 'Unread' },
];

export function parseNotificationDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (Array.isArray(value)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0, nano = 0] = value;
    const millisecond = Math.floor(nano / 1000000);
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
  }
  if (typeof value === 'string') {
    let str = value.trim();
    if (!str.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(str)) {
      str = str.replace(' ', 'T') + 'Z';
    }
    const d = new Date(str);
    if (!Number.isNaN(d.getTime())) return d;
    return new Date(value);
  }
  return new Date(value);
}

export function formatRelativeTime(value, locale = 'vi') {
  const isVi = !locale || String(locale).startsWith('vi');
  if (!value) return isVi ? 'Vừa xong' : 'Just now';
  const date = parseNotificationDate(value);
  if (!date || Number.isNaN(date.getTime())) return isVi ? 'Vừa xong' : 'Just now';

  const elapsed = Date.now() - date.getTime();

  // Any notification created recently (or minor clock skew)
  if (elapsed < 60 * 1000) {
    return isVi ? 'Vừa xong' : 'Just now';
  }

  const formatter = new Intl.RelativeTimeFormat(isVi ? 'vi' : 'en', { numeric: 'auto' });
  const units = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
  ];
  const [unit, milliseconds] = units.find(([, duration]) => elapsed >= duration) || ['minute', 60 * 1000];
  return formatter.format(-Math.max(1, Math.floor(elapsed / milliseconds)), unit);
}

export function normalizeNotification(item) {
  if (!item || item.id == null) return null;
  const rawType = String(item.type || 'SYSTEM').toUpperCase();
  const isRead = Boolean(item.isRead ?? item.read);
  const linkUrl = item.linkUrl || null;
  let targetType = item.targetType || null;
  let targetId = item.targetId || null;

  if (linkUrl) {
    const badgeMatch = linkUrl.match(/[?&]badgeId=([^&#]+)/);
    if (badgeMatch) {
      targetType = targetType || 'BADGE';
      targetId = targetId || badgeMatch[1];
    } else {
      const courseMatch = linkUrl.match(/\/courses\/([^/?&#]+)/);
      if (courseMatch) {
        targetType = targetType || 'COURSE';
        targetId = targetId || courseMatch[1];
      } else {
        const lessonMatch = linkUrl.match(/\/lessons\/([^/?&#]+)/);
        if (lessonMatch) {
          targetType = targetType || 'LESSON';
          targetId = targetId || lessonMatch[1];
        }
      }
    }
  }

  if (!targetType && rawType === 'ACHIEVEMENT') {
    targetType = 'BADGE';
  }

  return {
    id: item.id,
    title: item.title || 'Thông báo mới',
    message: item.message || '',
    type: NOTIFICATION_TYPES.includes(rawType) ? rawType : 'SYSTEM',
    linkUrl,
    targetType,
    targetId: targetId ? String(targetId) : null,
    isRead,
    read: isRead,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export function unwrapSseNotification(payload) {
  return normalizeNotification(payload?.result ?? payload?.notification ?? payload);
}
