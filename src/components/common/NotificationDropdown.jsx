import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { learnerService } from '@/services/learnerService';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    learnerService.getNotifications().then(setNotifications).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    const updated = await learnerService.markNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = async () => {
    const updated = await learnerService.markAllNotificationsRead();
    setNotifications(updated);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          position: 'relative',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
        }}
        title="Thông báo"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#ef4444',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            borderRadius: '999px',
            minWidth: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '110%',
          width: '320px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          zIndex: 1000,
          color: '#1f2937',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
            backgroundColor: '#fafafa',
          }}>
            <strong style={{ fontSize: '0.9rem' }}>Thông báo ({unreadCount})</strong>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B1A1A',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {error && <p role="alert" style={{ padding: 16, color: '#b91c1c' }}>{error}</p>}
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '20px', fontSize: '0.85rem' }}>
                Không có thông báo nào.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: n.read ? '#fff' : '#fef9f9',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: n.read ? '500' : '700', color: '#111827' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  {n.link && (
                    <Link
                      to={n.link}
                      onClick={() => setOpen(false)}
                      style={{ fontSize: '0.75rem', color: '#8B1A1A', fontWeight: '600', textDecoration: 'none', display: 'inline-block', marginTop: '4px' }}
                    >
                      Xem chi tiết →
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '8px 16px', textAlign: 'center', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6' }}>
            <Link
              to="/notifications"
              onClick={() => setOpen(false)}
              style={{ fontSize: '0.8rem', color: '#8B1A1A', textDecoration: 'none', fontWeight: '600' }}
            >
              Xem toàn bộ thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
