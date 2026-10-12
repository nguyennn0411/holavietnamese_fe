import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Sparkles, BookOpen, ArrowRight, Play, Compass } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/course/CourseCard';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Artwork } from '@/components/common/Ui';

export function CourseListPage() {
  const resource = useCourses();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('all');

  const levelOptions = [
    { id: 'all', label: 'Tất cả trình độ', badge: 'All' },
    { id: 'A0', label: 'A0 - Nhập môn', badge: 'Beginner' },
    { id: 'A1', label: 'A1 - Cơ bản', badge: 'Elementary' },
    { id: 'A2', label: 'A2 - Sơ cấp', badge: 'Pre-Int' },
    { id: 'B1', label: 'B1 - Trung cấp', badge: 'Intermediate' },
    { id: 'B2', label: 'B2 - Cao cấp', badge: 'Upper-Int' },
    { id: 'C1', label: 'C1 - Thành thạo', badge: 'Advanced' },
  ];

  return (
    <div className="courses-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden hidden md:block">
          <Artwork kind="dong-son" className="w-full h-full object-contain object-right" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles size={14} className="text-[#A62A24]" />
            <BilingualText>{"Mỗi ngày một chút • Daily Vietnamese"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#431914] tracking-tight leading-tight">
            <BilingualText>{"Học tiếng Việt theo lộ trình bài bản"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#78685B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Tìm điểm bắt đầu của bạn. Từng bài học được thiết kế bám sát thực tế đời sống, ngữ pháp tự nhiên và văn hóa Việt Nam."}
            </BilingualText>
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/my-learning"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A62A24] hover:bg-[#89221E] text-white font-bold text-xs shadow-md transition-all hover:shadow-lg"
            >
              <BilingualText>{"Góc học tập của tôi →"}</BilingualText>
            </Link>

            <Link
              to="/edtech/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#431914] border border-[#DECBB4] font-semibold text-xs shadow-xs transition-all hover:border-[#A62A24]"
            >
              <Compass size={15} className="text-[#A62A24]" />
              <BilingualText>{"Lộ trình học tương tác (EdTech) →"}</BilingualText>
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Filter Toolbar */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#DECBB4] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78685B]"
            />
            <input
              type="text"
              aria-label="Tìm khóa học"
              placeholder={bilingualLabel("Tìm khóa học theo tên hoặc nội dung…")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#FFF9EE] border border-[#DECBB4] focus:border-[#A62A24] focus:ring-2 focus:ring-[#A62A24]/10 rounded-xl text-xs sm:text-sm text-[#431914] placeholder-[#78685B]/60 transition-all outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78685B] hover:text-[#431914] p-1"
                aria-label="Xóa tìm kiếm"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-[#78685B] flex items-center gap-1.5 self-end md:self-center">
            <BookOpen size={14} className="text-[#A62A24]" />
            <span>
              <BilingualText>{"Khám phá kho khóa học chuẩn CEFR"}</BilingualText>
            </span>
          </div>
        </div>

        {/* Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none" role="tablist" aria-label="Trình độ khóa học">
          {levelOptions.map((opt) => {
            const isActive = level === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setLevel(opt.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#A62A24] text-white shadow-sm ring-1 ring-[#89221E]'
                    : 'bg-[#FFF9EE] text-[#78685B] hover:text-[#431914] hover:bg-[#F7F0E3] border border-[#DECBB4]/70'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content Area */}
      <ResourceState resource={resource}>
        {(items) => {
          const filtered = items.filter(
            ({ course }) =>
              (level === 'all' || course.level === level) &&
              `${course.title} ${course.description} ${course.titleVi || ''} ${course.descriptionVi || ''}`
                .toLowerCase()
                .includes(search.toLowerCase())
          );
          const enrolled = filtered.filter((i) => i.enrollment?.isEnrolled);

          return (
            <div className="space-y-8">
              {/* Resume Course Strip if Enrolled */}
              {enrolled.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-gradient-to-r from-[#24382B] to-[#344E3D] text-[#FFF9EE] p-5 sm:p-6 shadow-md border border-[#24382B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#EDF0E5] text-[#24382B] font-bold text-[11px] uppercase tracking-wider">
                      <Play size={11} fill="currentColor" />
                      <BilingualText>{"Tiếp nối hành trình của bạn"}</BilingualText>
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {enrolled[0].course.title}
                    </h2>
                    <p className="text-xs text-[#D5DDCB]">
                      <BilingualText>{"Khóa học bạn đang theo học gần đây nhất."}</BilingualText>
                    </p>
                  </div>

                  <Link
                    to={`/learn/${enrolled[0].course.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#E1B65B] hover:bg-[#d4a849] text-[#431914] font-bold text-xs shadow-md transition-all self-start sm:self-center shrink-0"
                  >
                    <BilingualText>{"Tiếp tục học ngay →"}</BilingualText>
                  </Link>
                </motion.div>
              )}

              {/* Section Heading with Counter */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#431914] tracking-tight">
                    <BilingualText>{"Một thế giới để khám phá"}</BilingualText>
                  </h2>
                  <p className="text-xs text-[#78685B] mt-0.5">
                    <BilingualText>{"Danh sách các khóa học được biên soạn công phu"}</BilingualText>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FFF9EE] border border-[#DECBB4] text-xs font-bold text-[#A62A24]">
                  {filtered.length} <BilingualText>{"khóa học"}</BilingualText>
                </span>
              </div>

              {/* Grid of Course Cards */}
              {filtered.length > 0 ? (
                <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(({ course, enrollment }) => (
                    <CourseCard key={course.id} course={course} enrollment={enrollment} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={items.length ? 'Không tìm thấy khóa học phù hợp' : 'Các khóa học sẽ sớm có mặt'}
                  description={
                    items.length
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc chọn cấp độ khác.'
                      : 'Hãy quay lại sau để đón đọc những bài học mới nhất.'
                  }
                />
              )}
            </div>
          );
        }}
      </ResourceState>
    </div>
  );
}
