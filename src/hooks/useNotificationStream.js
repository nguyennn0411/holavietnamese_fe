import { useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Custom Hook to connect and stream real-time notifications via Server-Sent Events (SSE).
 *
 * @param {Function} onNewNotification - Callback fired when 'notification.created' event is received.
 * @param {Function} onNotificationRead - Callback fired when 'notification.read' event is received (e.g. from another tab).
 */
export const useNotificationStream = (onNewNotification, onNotificationRead) => {
  const onNewRef = useRef(onNewNotification);
  const onReadRef = useRef(onNotificationRead);

  // Keep callback refs updated to avoid reconnecting SSE on every render
  useEffect(() => {
    onNewRef.current = onNewNotification;
  }, [onNewNotification]);

  useEffect(() => {
    onReadRef.current = onNotificationRead;
  }, [onNotificationRead]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // 1. Khởi tạo kết nối SSE
    const streamUrl = `${API_BASE_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(streamUrl);

    // 2. Lắng nghe thông báo mới được tạo
    eventSource.addEventListener('notification.created', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('🔔 Có thông báo mới qua SSE:', data);
        if (onNewRef.current) {
          onNewRef.current(data);
        }
      } catch (err) {
        console.error('Lỗi phân tích cú pháp notification.created:', err);
      }
    });

    // 3. Lắng nghe sự kiện đồng bộ khi đã đọc ở tab khác
    eventSource.addEventListener('notification.read', (event) => {
      try {
        const data = JSON.parse(event.data);
        const notificationId = data?.notificationId ?? data?.id;
        if (onReadRef.current && notificationId != null) {
          onReadRef.current(notificationId);
        }
      } catch (err) {
        console.error('Lỗi phân tích cú pháp notification.read:', err);
      }
    });

    eventSource.onerror = (err) => {
      // Browser will automatically attempt to reconnect
      // console.warn('Lỗi kết nối SSE, trình duyệt sẽ tự động thử kết nối lại...');
    };

    // 4. Dọn dẹp khi unmount
    return () => {
      eventSource.close();
    };
  }, []);
};

export default useNotificationStream;
