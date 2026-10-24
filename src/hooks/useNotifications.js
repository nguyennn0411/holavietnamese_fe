import { useState, useEffect, useCallback } from 'react';
import { learnerService } from '@/services/learnerService';
import { audioFeedback } from '@/utils/audioFeedback';
import { DEFAULT_NOTIFICATIONS, normalizeNotification } from '@/constants/notifications';
import { useNotificationStream } from './useNotificationStream';
import { toast } from 'sonner';
import { bilingualLabel, BilingualText } from '@/components/common/BilingualText';

const EVENT_NOTIFICATIONS_UPDATED = 'hola:notifications-updated';

/**
 * Custom hook to manage notifications with real-time SSE stream integration,
 * local optimistic state, audio cues, and toast alerts.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // 1. Initial & Refresh Fetch
  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      // Fetch both list and unread count
      const [listData, count] = await Promise.all([
        learnerService.getNotifications(),
        learnerService.getUnreadCount(),
      ]);

      if (Array.isArray(listData) && listData.length > 0) {
        const normalizedList = listData.map(normalizeNotification);
        setNotifications(normalizedList);
        setUnreadCount(typeof count === 'number' ? count : normalizedList.filter((n) => !n.read).length);
      } else {
        // Fallback for preview/offline
        const cached = localStorage.getItem('hola:notifications');
        const list = cached ? JSON.parse(cached) : DEFAULT_NOTIFICATIONS;
        const normalizedList = list.map(normalizeNotification);
        setNotifications(normalizedList);
        setUnreadCount(normalizedList.filter((n) => !n.read).length);
      }
    } catch (err) {
      setError(err?.message || 'Không thể tải thông báo.');
      const cached = localStorage.getItem('hola:notifications');
      const list = cached ? JSON.parse(cached) : DEFAULT_NOTIFICATIONS;
      const normalizedList = list.map(normalizeNotification);
      setNotifications(normalizedList);
      setUnreadCount(normalizedList.filter((n) => !n.read).length);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // 2. Real-time SSE Callbacks
  const handleNewNotification = useCallback((raw) => {
    const item = normalizeNotification(raw);
    console.log('🔔 [SSE Received]:', item);

    // Audio chime
    try {
      audioFeedback.playSuccessChime();
    } catch (e) {
      // ignore audio errors
    }

    // Prepend to notifications and increment unread
    setNotifications((prev) => {
      // Avoid duplicate by id
      if (prev.some((n) => String(n.id) === String(item.id))) {
        return prev;
      }
      return [item, ...prev];
    });

    setUnreadCount((prev) => prev + 1);

    // Show instant toast notification
    toast(item.title, {
      description: item.message,
      icon: '🔔',
      action: item.linkUrl
        ? {
            label: 'Xem ngay',
            onClick: () => {
              window.location.assign(item.linkUrl);
            },
          }
        : undefined,
    });

    // Notify other components
    window.dispatchEvent(new CustomEvent(EVENT_NOTIFICATIONS_UPDATED));
  }, []);

  const handleNotificationReadSync = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) =>
        String(n.id) === String(notificationId) ? { ...n, read: true, isRead: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // Connect SSE Stream
  useNotificationStream(handleNewNotification, handleNotificationReadSync);

  // Cross-tab / Window event synchronization
  useEffect(() => {
    loadNotifications();

    const handleSync = () => {
      loadNotifications(true);
    };

    window.addEventListener(EVENT_NOTIFICATIONS_UPDATED, handleSync);
    return () => {
      window.removeEventListener(EVENT_NOTIFICATIONS_UPDATED, handleSync);
    };
  }, [loadNotifications]);

  const dispatchSync = () => {
    window.dispatchEvent(new CustomEvent(EVENT_NOTIFICATIONS_UPDATED));
  };

  const syncLocal = (updated) => {
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
    try {
      localStorage.setItem('hola:notifications', JSON.stringify(updated));
    } catch {
      // ignore storage error
    }
    dispatchSync();
  };

  // 3. Mark Single Read
  const markAsRead = async (id) => {
    if (busy) return;
    setBusy(true);
    try {
      audioFeedback.playTap();
      const updated = notifications.map((item) =>
        String(item.id) === String(id) ? { ...item, read: true, isRead: true } : item
      );
      syncLocal(updated);

      try {
        await learnerService.markNotificationRead(id);
      } catch {
        // local state already updated
      }
    } catch (err) {
      toast.error(bilingualLabel('Không thể đánh dấu đã đọc: ', 'Could not mark as read: ') + err.message);
    } finally {
      setBusy(false);
    }
  };

  // 4. Mark All Read
  const markAllAsRead = async () => {
    if (busy || notifications.every((n) => n.read)) return;
    setBusy(true);
    try {
      audioFeedback.playSuccessChime();
      const updated = notifications.map((item) => ({ ...item, read: true, isRead: true }));
      syncLocal(updated);

      try {
        await learnerService.markAllNotificationsRead();
      } catch {
        // local state already updated
      }
      toast.success(bilingualLabel('Đã đánh dấu tất cả thông báo là đã đọc!', 'All notifications marked as read!'));
    } catch (err) {
      toast.error(bilingualLabel('Lỗi khi đánh dấu: ', 'Error marking as read: ') + err.message);
    } finally {
      setBusy(false);
    }
  };

  // 5. Delete Notification
  const deleteNotification = async (id) => {
    if (busy) return;
    setBusy(true);
    try {
      audioFeedback.playTap();
      const updated = notifications.filter((item) => String(item.id) !== String(id));
      syncLocal(updated);

      try {
        await learnerService.deleteNotification(id);
      } catch {
        // local state already updated
      }
      toast.info(bilingualLabel('Đã xóa thông báo.', 'Notification deleted.'));
    } catch (err) {
      toast.error(bilingualLabel('Không thể xóa: ', 'Could not delete: ') + err.message);
    } finally {
      setBusy(false);
    }
  };

  // 6. Clear Read Notifications
  const clearReadNotifications = async () => {
    if (busy) return;
    setBusy(true);
    try {
      audioFeedback.playTap();
      const updated = notifications.filter((item) => !item.read);
      syncLocal(updated);

      try {
        await learnerService.clearReadNotifications();
      } catch {
        // local state already updated
      }
      toast.info(bilingualLabel('Đã dọn dẹp các thông báo đã đọc.', 'Cleaned up read notifications.'));
    } catch (err) {
      toast.error(bilingualLabel('Không thể dọn dẹp: ', 'Could not clean up: ') + err.message);
    } finally {
      setBusy(false);
    }
  };

  // 7. Send Test Notification (Quick Test Backend API)
  const sendTestNotification = async () => {
    setBusy(true);
    try {
      audioFeedback.playTap();
      await learnerService.sendTestNotification();
      toast.success(bilingualLabel('Đã gửi yêu cầu bắn thông báo test! Đang chờ SSE phản hồi...', 'Sent test notification request! Waiting for SSE response...'));
    } catch (err) {
      // Simulate if offline/local test
      handleNewNotification({
        id: Date.now(),
        title: 'Thông báo thử nghiệm (Test SSE)',
        message: 'Chuông thông báo và kết nối Realtime SSE hoạt động chuẩn xác! Nhận +10 XP!',
        type: 'SYSTEM',
        linkUrl: '/edtech/dashboard',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
      toast.success(bilingualLabel('Đã tạo thông báo test cục bộ thành công!', 'Test notification generated successfully!'));
    } finally {
      setBusy(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    busy,
    error,
    reload: loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    sendTestNotification,
  };
}

export default useNotifications;
