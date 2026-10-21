import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Target, RotateCcw, Play } from 'lucide-react';
import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { aiRoleplayService } from '@/services/aiRoleplayService';

export function ScenarioListPage() {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');

  const levels = aiRoleplayService.getLevels();
  const topics = aiRoleplayService.getTopics();
  const scenarios = aiRoleplayService.listScenarios({
    search,
    level: selectedLevel,
    topic: selectedTopic,
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLevel('all');
    setSelectedTopic('all');
  };

  const isFiltered = search || selectedLevel !== 'all' || selectedTopic !== 'all';

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Subtle Heritage Dong Son Bronze Drum Background Watermark */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className="w-[min(96vw,1000px)] h-[min(96vw,1000px)] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] aspect-square opacity-[0.05] bg-contain bg-center bg-no-repeat transform-gpu"
          style={{
            backgroundImage: `url('/design/dong-son-drum.webp')`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
        {/* Header Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7E8] via-[#F7F0E3] to-[#EEE3D1] border border-[#E8E5DF] p-6 sm:p-10 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#E7B59D] text-[#FF7A00] text-xs font-black uppercase tracking-wider shadow-2xs">
              <span>50+ Tình huống giao tiếp • Real-Life Scenarios</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#253044] tracking-tight leading-tight">
              Kịch Bản Nhập Vai Thực Tế
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl">
              Luyện phản xạ giao tiếp tự nhiên cùng AI trong các bối cảnh đời thực: từ gọi món phở Bát Đàn, trả giá chợ Bến Thành cho đến hỏi đường phố cổ và giao lưu bạn bè.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/ai-tutor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF7E8] border border-[#E8E5DF] text-[#253044] hover:text-[#FF7A00] text-xs font-bold shadow-2xs transition-all"
              >
                <span>Trò chuyện tự do với AI Tutor →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Modern Filter Toolbar Card */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8E5DF]/80 p-5 sm:p-6 shadow-xs space-y-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]"
            />
            <input
              type="text"
              aria-label="Tìm kiếm kịch bản"
              placeholder={bilingualLabel("Tìm kịch bản theo tên, địa danh hoặc bối cảnh (Ví dụ: phở, chợ, taxi)...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-[#FFFCF7] border border-[#E8E5DF]/80 focus:border-[#FF7A00] focus:bg-white rounded-2xl text-xs sm:text-sm text-[#253044] placeholder-[#64748B]/60 transition-all outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#FF7A00] p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Level & Topic Filter Pills */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1 border-t border-[#E8E5DF]/40">
            {/* Level Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#64748B] shrink-0">Trình độ:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {levels.map((lvl) => {
                  const isSelected = selectedLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF7A00] text-white shadow-xs'
                          : 'bg-[#FFFCF7] hover:bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF]/70'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#64748B] shrink-0">Chủ đề:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {topics.map((t) => {
                  const isSelected = selectedTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTopic(t.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#253044] text-white shadow-xs'
                          : 'bg-[#FFFCF7] hover:bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF]/70'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Results Header */}
        <div className="flex items-center justify-between text-sm px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#253044]">
              Danh sách kịch bản
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFFCF7] border border-[#E8E5DF] text-xs font-bold text-[#FF7A00]">
              {scenarios.length} tình huống
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-[#FF7A00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>

        {/* Scenarios Grid */}
        {scenarios.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white/90 backdrop-blur-md rounded-3xl border border-[#E8E5DF] space-y-3">
            <MessageSquare size={36} className="text-stone-400 mx-auto" />
            <h3 className="text-lg font-bold text-[#253044]">
              Không tìm thấy kịch bản phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
              Hãy thử chọn cấp độ khác hoặc bấm "Đặt lại bộ lọc" để xem danh sách đầy đủ.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF7A00] text-white text-xs font-bold shadow-xs hover:bg-[#C2410C] transition-colors"
            >
              Xem tất cả kịch bản
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenarios.map((sc) => (
              <motion.div
                key={sc.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#E8E5DF]/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FF7A00]/60 transition-all flex flex-col justify-between group"
              >
                {/* Media Image with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <ContentImage
                    src={sc.thumbnail}
                    alt={sc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Destination Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#253044] border border-[#E8E5DF] text-[11px] font-bold shadow-xs">
                    <MapPin size={12} className="text-[#F97316]" />
                    <span>{sc.destination}</span>
                  </div>

                  {/* Level Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#FF7A00] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                    {sc.level}
                  </div>

                  {/* Title Overlay in Photo */}
                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <span className="text-[10px] font-black uppercase text-[#FFCD00] tracking-wider block">
                      {sc.topicLabel} • {sc.duration}
                    </span>
                    <h3 className="text-base font-black truncate drop-shadow-sm mt-0.5">
                      {sc.titleVi || sc.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {sc.overview}
                    </p>

                    {/* Role Play Snapshot Box */}
                    <div className="p-3 rounded-2xl bg-[#FFFCF7] border border-[#E8E5DF]/70 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#FF7A00] font-bold flex items-center gap-1">
                          <span>AI:</span>
                          <span className="text-[#253044]">{sc.aiRole.name}</span>
                        </span>
                        <span className="text-[10px] text-[#64748B] italic">
                          ({sc.aiRole.role})
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#E8E5DF]/40">
                        <span className="text-[#253044] font-bold flex items-center gap-1">
                          <span>Bạn:</span>
                          <span>{sc.learnerRole.role}</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                          <Target size={11} />
                          <span>{sc.objectives.length} nhiệm vụ</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#E8E5DF]/40 flex items-center gap-2">
                    <Link
                      to={`/ai-scenarios/${sc.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#FFF7E8] border border-[#E8E5DF] text-[#253044] text-xs font-bold text-center transition-colors"
                    >
                      Chi tiết
                    </Link>
                    <Link
                      to={`/ai-roleplay/${sc.id}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#FF7A00] hover:bg-[#C2410C] text-white text-xs font-black text-center shadow-[0_2px_0_#C2410C] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>Nhập vai</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
