import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Bell,
  CheckCheck,
  ArrowUpRight,
  BookOpen,
  Trophy,
  Flame,
  Sparkles,
  Settings,
  Clock,
} from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { useNotifications } from '@/hooks/useNotifications';

/**
 * Return matching icon and color badge according to notification category
 */
function getCategoryIcon(type) {
  switch (type) {
    case 'lesson':
      return {
        icon: BookOpen,
        colorClass: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      };
    case 'achievement':
      return {
        icon: Trophy,
        colorClass: 'text-amber-700 bg-amber-100 border-amber-200',
      };
    case 'streak':
      return {
        icon: Flame,
        colorClass: 'text-orange-700 bg-orange-100 border-orange-200',
      };
    default:
      return {
        icon: Sparkles,
        colorClass: 'text-[#EA580C] bg-[#FFF0DC] border-[#E8E5DF]',
      };
  }
}

/**
 * Header Notification Popover Dropdown with Real-Time Sync & Audio Feedback
 */
export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    busy,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Close on outside click or Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredItems =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleItemClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    const targetLink = notification.linkUrl || notification.link;
    if (targetLink) {
      setOpen(false);
      navigate(targetLink);
    }
  };

  return (
    <div className="notification-menu relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        className="notification-menu__trigger relative p-2 rounded-xl text-[#253044] hover:bg-[#FFF0DC]/60 transition-colors cursor-pointer flex items-center justify-center"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Thông báo"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell size={19} aria-hidden="true" className={unreadCount > 0 ? 'text-[#EA580C]' : ''} />
        {unreadCount > 0 && (
          <span
            className="notification-menu__count absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EA580C] text-white text-[10px] font-black flex items-center justify-center shadow-xs border-2 border-white animate-pulse"
            aria-label={`${unreadCount} thông báo chưa đọc`}
          >
            {Math.min(unreadCount, 99)}
          </span>
        )}
      </button>

      {/* Popover Panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            className="notification-menu__panel absolute right-0 top-[calc(100%+10px)] w-[min(380px,calc(100vw-24px))] z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E8E5DF]/80 shadow-[0_20px_50px_rgba(67,25,20,0.14)] overflow-hidden text-left"
            role="dialog"
            aria-label="Thông báo gần đây"
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            {/* Header */}
            <header className="p-3.5 bg-[#FFF7E8] border-b border-[#E8E5DF]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <strong className="text-sm font-black text-[#253044]">
                  <BilingualText>Thông báo</BilingualText>
                </strong>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#EA580C] text-white text-[10px] font-bold">
                    {unreadCount} mới
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#EDF0E5] text-[#24382B] text-[10px] font-bold">
                    Đã đọc hết
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#EA580C] hover:bg-[#FFF0DC] transition-colors cursor-pointer"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck size={14} />
                  <span>Đọc tất cả</span>
                </button>
              )}
            </header>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFCF7] border-b border-[#E8E5DF]/40 text-xs">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#EA580C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#253044] hover:bg-white'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-[#EA580C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#253044] hover:bg-white'
                }`}
              >
                Chưa đọc ({unreadCount})
              </button>
            </div>

            {error && (
              <p className="p-2.5 bg-red-50 text-red-700 text-xs font-medium border-b border-red-200" role="alert">
                {error}
              </p>
            )}

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E8E5DF]/40 overscroll-contain">
              {filteredItems.length === 0 ? (
                <div className="py-12 px-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF7E8] border border-[#E8E5DF] text-[#64748B] flex items-center justify-center mx-auto">
                    <Bell size={22} className="opacity-60" />
                  </div>
                  <h4 className="text-xs font-bold text-[#253044]">
                    {filter === 'unread' ? 'Tuyệt vời! Không còn thông báo chưa đọc' : 'Chưa có thông báo nào'}
                  </h4>
                  <p className="text-[11px] text-[#64748B]">
                    Các cập nhật bài học, huy hiệu và sự kiện sẽ hiển thị tại đây.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const { icon: CatIcon, colorClass } = getCategoryIcon(item.type);
                  return (
                    <article
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 relative group ${
                        item.read
                          ? 'bg-white hover:bg-[#FFFCF7]'
                          : 'bg-[#FFF7E8]/70 hover:bg-[#FFF7E8]'
                      }`}
                    >
                      {/* Unread indicator dot */}
                      {!item.read && (
                        <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-[#EA580C] ring-2 ring-white" />
                      )}

                      {/* Icon Pill */}
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
                        <CatIcon size={15} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2 pr-3">
                          <h4 className={`text-xs truncate ${item.read ? 'font-medium text-[#253044]' : 'font-black text-[#EA580C]'}`}>
                            <BilingualText vi={item.titleVi || item.title} en={item.title} />
                          </h4>
                        </div>

                        <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5 text-[10px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {item.time}
                          </span>
                          {item.xpReward && (
                            <span className="px-1.5 py-0.2 rounded font-black text-[#EA580C] bg-[#FFF0DC]">
                              {item.xpReward}
                            </span>
                          )}
                          {item.link && (
                            <span className="text-[#EA580C] font-bold inline-flex items-center gap-0.5 ml-auto group-hover:underline">
                              <span>Xem</span>
                              <ArrowUpRight size={10} />
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <footer className="p-2.5 bg-[#FFF7E8] border-t border-[#E8E5DF]/60 flex items-center justify-between text-xs font-bold text-[#EA580C]">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="hover:underline flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/60 transition-colors"
              >
                <span>Xem toàn bộ thông báo</span>
                <ArrowUpRight size={13} />
              </Link>
              <Link
                to="/settings"
                onClick={() => setOpen(false)}
                className="text-[#64748B] hover:text-[#253044] p-1.5 rounded-lg hover:bg-white/60 transition-colors"
                title="Cài đặt thông báo"
              >
                <Settings size={15} />
              </Link>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationDropdown;
