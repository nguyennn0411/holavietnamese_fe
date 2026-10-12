import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bell, CheckCheck, ArrowUpRight } from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { learnerService } from '@/services/learnerService';

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const dropdownRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    learnerService.getNotifications().then(setNotifications).catch((failure) => setError(failure.message));
  }, []);

  useEffect(() => {
    function close(event) {
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      if (event.type === 'mousedown' && dropdownRef.current?.contains(event.target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  async function updateNotifications(action) {
    if (busy) return;
    setBusy(true);
    setError('');
    try { setNotifications(await action()); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  return (
    <div className="notification-menu" ref={dropdownRef}>
      <button className="notification-menu__trigger" type="button" onClick={() => setOpen((value) => !value)} aria-label="Thông báo" aria-expanded={open} aria-haspopup="dialog">
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && <span className="notification-menu__count" aria-label={`${unreadCount} thông báo chưa đọc`}>{Math.min(unreadCount, 99)}</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.section className="notification-menu__panel" role="dialog" aria-label="Thông báo gần đây"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
            <header className="notification-menu__header">
              <div><strong><BilingualText>{"Thông báo"}</BilingualText></strong><small>{unreadCount} <BilingualText>{"chưa đọc"}</BilingualText></small></div>
              {unreadCount > 0 && <button className="notification-menu__mark-all" type="button" disabled={busy} onClick={() => updateNotifications(() => learnerService.markAllNotificationsRead())}><CheckCheck size={16}/><BilingualText>{"Đọc tất cả"}</BilingualText></button>}
            </header>
            {error && <p className="notification-menu__error" role="alert"><BilingualText>{error}</BilingualText></p>}
            <div className="notification-menu__list">
              {notifications.length === 0 ? <p className="notification-menu__empty"><Bell size={22}/><BilingualText>{"Bạn chưa có thông báo mới."}</BilingualText></p> : notifications.map((notification) => (
                <article className={`notification-menu__item ${notification.read ? '' : 'is-unread'}`} key={notification.id}>
                  <button type="button" disabled={busy || notification.read} onClick={() => updateNotifications(() => learnerService.markNotificationRead(notification.id))} aria-label={`Đánh dấu đã đọc: ${notification.title}`}>
                    <span className="notification-menu__item-heading"><strong><BilingualText vi={notification.titleVi || notification.title} en={notification.title}/></strong><time>{notification.time}</time></span>
                    <span><BilingualText>{notification.message}</BilingualText></span>
                  </button>
                  {notification.link && <Link to={notification.link} onClick={() => setOpen(false)}><BilingualText>{"Xem chi tiết"}</BilingualText><ArrowUpRight size={14}/></Link>}
                </article>
              ))}
            </div>
            <footer><Link to="/notifications" onClick={() => setOpen(false)}><BilingualText>{"Xem toàn bộ thông báo"}</BilingualText><ArrowUpRight size={14}/></Link></footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
