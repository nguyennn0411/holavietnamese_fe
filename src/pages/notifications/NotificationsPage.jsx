import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, Trash2, Settings, Search, BookOpen, Trophy, Flame, ArrowRight, Clock, CheckCircle2, Compass, Zap } from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { useNotifications } from '@/hooks/useNotifications';
import { NOTIFICATION_CATEGORIES } from '@/constants/notifications';
import { FixedHeritageBackdrop, AmbientWatermark } from '@/components/home/common/HeritageWatermark';

/**
 * Return category visual metadata
 */
function getCategoryBadge(type) {
  switch (type) {
    case 'lesson':
      return {
        label: 'Bài học',
        icon: BookOpen,
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        cardAccent: 'hover:border-emerald-500',
      };
    case 'achievement':
      return {
        label: 'Thành tích',
        icon: Trophy,
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        cardAccent: 'hover:border-amber-500',
      };
    case 'streak':
      return {
        label: 'Chuỗi học',
        icon: Flame,
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        cardAccent: 'hover:border-orange-500',
      };
    default:
      return {
        label: 'Hệ thống',
        icon: Bell,
        badgeClass: 'bg-[#FFF0DC] text-[#EA580C] border-[#E8E5DF]',
        cardAccent: 'hover:border-[#EA580C]',
      };
  }
}

/**
 * Full-featured Notification Center Page
 */
export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    loading,
    busy,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    sendTestNotification,
  } = useNotifications();

  // Filter and search
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      // Category filter
      if (activeTab === 'unread' && item.read) return false;
      if (activeTab !== 'all' && activeTab !== 'unread' && item.type !== activeTab) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleVi = (item.titleVi || item.title || '').toLowerCase();
        const msg = (item.message || '').toLowerCase();
        return titleVi.includes(query) || msg.includes(query);
      }
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const readCount = notifications.length - unreadCount;

  return (
    <div className="notifications-heritage-root relative w-full min-h-screen">
      {/* Background Dong Son Watermarks */}
      <FixedHeritageBackdrop />
      <AmbientWatermark className="absolute -right-24 top-20 w-[540px] h-[540px] opacity-[0.04]" />
      <AmbientWatermark className="absolute -left-28 bottom-20 w-[560px] h-[560px] opacity-[0.035]" />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-left">
        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E8E5DF]/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0DC] border border-[#E7B59D] text-[#EA580C] text-xs font-bold uppercase tracking-wider">
              <Bell size={13} />
              <span>Trung tâm cập nhật • Notification Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#253044] tracking-tight">
              Thông báo của bạn
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Theo dõi tiến độ, nhiệm vụ hôm nay và thành tích đạt được trên hành trình học tiếng Việt.
            </p>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 shadow-2xs text-center">
              <span className="block text-base font-black text-[#253044] leading-tight">
                {notifications.length}
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase">Tổng cộng</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#FFF7E8] border-2 border-[#EA580C] shadow-2xs text-center">
              <span className="block text-base font-black text-[#EA580C] leading-tight">
                {unreadCount}
              </span>
              <span className="text-[10px] text-[#EA580C] font-semibold uppercase">Chưa đọc</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 shadow-2xs text-center">
              <span className="block text-base font-black text-emerald-700 leading-tight">
                {readCount}
              </span>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase">Đã xem</span>
            </div>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 shadow-[0_4px_20px_rgba(67,25,20,0.02)]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nội dung thông báo…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFCF7] border border-[#E8E5DF]/60 text-xs text-[#253044] placeholder-[#64748B]/70 focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B] hover:text-[#EA580C]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              disabled={busy || unreadCount === 0}
              onClick={markAllAsRead}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                unreadCount > 0
                  ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-2xs active:translate-y-0.5'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              }`}
            >
              <CheckCheck size={15} />
              <span>Đọc tất cả</span>
            </button>

            <button
              type="button"
              disabled={busy || readCount === 0}
              onClick={clearReadNotifications}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                readCount > 0
                  ? 'bg-[#FFFCF7] hover:bg-red-50 text-[#64748B] hover:text-red-700 border border-[#E8E5DF]/60 hover:border-red-200'
                  : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60'
              }`}
              title="Xóa tất cả thông báo đã đọc"
            >
              <Trash2 size={15} />
              <span>Dọn dẹp đã đọc</span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={sendTestNotification}
              className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Bắn thử 1 thông báo test từ Backend để kiểm tra chuông và Realtime SSE"
            >
              <Zap size={14} className="text-purple-600 fill-purple-200" />
              <span>Bắn test SSE</span>
            </button>

            <Link
              to="/settings"
              className="px-3 py-2.5 rounded-xl bg-[#FFFCF7] hover:bg-[#FFF7E8] text-[#64748B] hover:text-[#253044] border border-[#E8E5DF]/60 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Cài đặt thông báo"
            >
              <Settings size={15} />
              <span>Cài đặt</span>
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {NOTIFICATION_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? notifications.length
                : cat.id === 'unread'
                ? unreadCount
                : notifications.filter((n) => n.type === cat.id).length;

            const isSelected = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#EA580C] text-white shadow-2xs scale-102'
                    : 'bg-white/92 hover:bg-[#FFF7E8] text-[#64748B] hover:text-[#253044] border border-[#E8E5DF]/60'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FFFCF7] text-[#64748B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-medium border border-red-200" role="alert">
            {error}
          </div>
        )}

        {/* Notification Cards List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center space-y-3 bg-white/92 rounded-3xl border border-[#E8E5DF]/70">
              <div className="w-10 h-10 rounded-full border-3 border-[#EA580C] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[#64748B]">Đang tải thông báo của bạn…</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            /* Empty State */
            <div className="py-16 sm:py-20 px-6 text-center space-y-4 bg-white/92 backdrop-blur-xs rounded-3xl border border-[#E8E5DF]/70 shadow-2xs">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF7E8] border border-[#E8E5DF] text-[#EA580C] flex items-center justify-center mx-auto shadow-xs">
                {activeTab === 'unread' ? (
                  <CheckCircle2 size={30} className="text-emerald-600" />
                ) : (
                  <Bell size={28} />
                )}
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-black text-[#253044]">
                  {activeTab === 'unread'
                    ? 'Bạn đã xem hết tất cả thông báo!'
                    : searchQuery
                    ? `Không tìm thấy thông báo nào chứa "${searchQuery}"`
                    : 'Chưa có thông báo nào trong mục này'}
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {activeTab === 'unread'
                    ? 'Tuyệt vời! Không còn lời nhắc nào chưa xem. Hãy tiếp tục học bài mới để duy trì phong độ.'
                    : 'Các thông báo mới về bài học, sự kiện hoặc huy hiệu đạt được sẽ xuất hiện tại đây.'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/edtech/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-black shadow-2xs transition-all"
                >
                  <Compass size={15} />
                  <span>Vào Lộ Trình Học Ngay</span>
                </Link>
                {activeTab !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#FFFCF7] hover:bg-[#FFF7E8] border border-[#E8E5DF]/60 text-xs font-bold text-[#253044] transition-all cursor-pointer"
                  >
                    Xem tất cả thông báo
                  </button>
                )}
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((item) => {
                const { label: typeLabel, icon: CatIcon, badgeClass, cardAccent } = getCategoryBadge(item.type);

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 shadow-2xs ${cardAccent} ${
                      item.read
                        ? 'bg-white/92 border-[#E8E5DF]/60'
                        : 'bg-[#FFF7E8]/90 border-2 border-[#EA580C]/60 shadow-xs ring-2 ring-[#EA580C]/5'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {/* Category Icon Badge */}
                      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs ${badgeClass}`}>
                        <CatIcon size={18} />
                      </div>

                      {/* Content Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeClass}`}>
                            {typeLabel}
                          </span>
                          {!item.read && (
                            <span className="px-2 py-0.5 rounded-md bg-[#EA580C] text-white text-[10px] font-bold">
                              Mới
                            </span>
                          )}
                          {item.xpReward && (
                            <span className="px-2 py-0.5 rounded-md bg-[#FFF0DC] text-[#EA580C] text-[10px] font-black">
                              {item.xpReward}
                            </span>
                          )}
                          <small className="text-[11px] text-stone-400 flex items-center gap-1 ml-auto">
                            <Clock size={11} />
                            {item.time}
                          </small>
                        </div>

                        <h3 className={`text-sm sm:text-base leading-snug ${item.read ? 'font-bold text-[#253044]' : 'font-black text-[#EA580C]'}`}>
                          <BilingualText vi={item.titleVi || item.title} en={item.title} />
                        </h3>

                        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E5DF]/40 shrink-0">
                      {(item.linkUrl || item.link) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.read) markAsRead(item.id);
                            navigate(item.linkUrl || item.link);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      <div className="flex items-center gap-1.5">
                        {!item.read ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => markAsRead(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#FFFCF7] hover:bg-[#FFF0DC] text-[#EA580C] font-bold text-xs transition-colors cursor-pointer"
                            title="Đánh dấu đã đọc"
                          >
                            Đã đọc
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 px-2 py-1">
                            <CheckCircle2 size={13} />
                            <span>Đã đọc</span>
                          </span>
                        )}

                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => deleteNotification(item.id)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa thông báo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}

export default NotificationsPage;
