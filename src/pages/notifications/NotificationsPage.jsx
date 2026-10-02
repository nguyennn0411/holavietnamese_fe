import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    learnerService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = async (id) => {
    const updated = await learnerService.markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await learnerService.markAllNotificationsRead();
    setNotifications(updated);
  };

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#2d1810', margin: '0 0 4px 0' }}>
            Thông báo của bạn
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Cập nhật bài học mới, nhắc nhở streak và phần thưởng</p>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          style={{
            padding: '8px 16px',
            borderRadius: '999px',
            border: '1px solid #d1d5db',
            background: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          ✓ Đánh dấu tất cả đã đọc
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 16px',
            borderRadius: '999px',
            border: 'none',
            background: filter === 'all' ? '#8B1A1A' : '#f3f4f6',
            color: filter === 'all' ? '#fff' : '#4b5563',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          style={{
            padding: '6px 16px',
            borderRadius: '999px',
            border: 'none',
            background: filter === 'unread' ? '#8B1A1A' : '#f3f4f6',
            color: filter === 'unread' ? '#fff' : '#4b5563',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Chưa đọc ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* List */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>Không có thông báo nào.</p>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              style={{
                padding: '20px',
                borderBottom: '1px solid #f3f4f6',
                background: n.read ? '#fff' : '#fef9f9',
                display: 'flex',
                gap: '16px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{n.read ? '📩' : '🔔'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111827', fontWeight: n.read ? 600 : 800 }}>
                    {n.title}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{n.time}</span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5 }}>
                  {n.message}
                </p>
                {n.link && (
                  <Link
                    to={n.link}
                    style={{ fontSize: '0.85rem', color: '#8B1A1A', fontWeight: 700, textDecoration: 'none' }}
                  >
                    Xem chi tiết →
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
