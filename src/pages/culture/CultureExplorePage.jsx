import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, RotateCcw } from 'lucide-react';
import { cultureService } from '@/services/cultureService';
import { EmptyState } from '@/components/common/Ui';

export function CultureExplorePage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const categories = cultureService.getCategories();
  const destinations = cultureService.getDestinations();
  const articles = cultureService.listArticles({
    search,
    category: selectedCategory,
    destination: selectedDestination,
  });
  const featured = cultureService.getFeaturedArticles()[0];

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDestination('all');
  };

  const isFiltered = search || selectedCategory !== 'all' || selectedDestination !== 'all';

  return (
    <div className="culture-page w-full max-w-full px-0 py-6 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FFF7E8] to-[#FFF0DC] border border-[#E8E5DF] p-8 sm:p-12 shadow-xs">
        <div
          className="absolute -right-8 -bottom-8 w-64 h-64 opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('/design/dong-son.svg')", backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
        />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/90 border border-[#FDBA74] text-[#EA580C] text-xs font-bold uppercase tracking-wider shadow-2xs">
            <BilingualText>{"Văn hóa & Đời sống • Culture & Stories"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#253044] tracking-tight leading-tight">
            <BilingualText>{"Khám phá văn hóa Việt Nam"}</BilingualText>
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-3xl">
            <BilingualText
              vi="Ngôn ngữ trở nên gần gũi và sống động khi bạn thấu hiểu những câu chuyện phong tục, ẩm thực và nơi chốn phía sau."
              en="Language becomes intimate and vivid when you understand the stories, customs, cuisine, and places behind it."
            />
          </p>
        </div>
      </section>

      {/* Featured Article Banner (when not filtered) */}
      {!isFiltered && featured && (
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.25 }} className="w-full">
          <Link
            className="culture-feature group relative block overflow-hidden rounded-3xl bg-white border border-[#E8E5DF] shadow-md hover:shadow-xl hover:border-[#FDBA74] transition-all"
            to={`/culture/${featured.id}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] w-full">
              {/* Image side - spans 7 cols on desktop */}
              <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto min-h-[260px] lg:min-h-[380px] bg-[#FFF7E8]">
                <ContentImage
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#DA251D] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                    <BilingualText>{"Nổi bật"}</BilingualText>
                  </span>
                </div>
              </div>

              {/* Content side - spans 5 cols on desktop */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FFF0DC] text-[#F97316] border border-[#F97316]/30 text-xs font-bold uppercase tracking-wider">
                      <BilingualText vi={featured.categoryNameVi || featured.categoryName} en={featured.categoryNameEn || featured.categoryName} />
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F8FAFC] text-[#64748B] border border-[#E8E5DF] text-xs font-semibold ml-auto">
                      <BilingualText vi={featured.readTimeVi || featured.readTime} en={featured.readTimeEn || featured.readTime} />
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#253044] group-hover:text-[#F97316] transition-colors leading-snug">
                    <BilingualText vi={featured.titleVi || featured.title} en={featured.titleEn || featured.title} />
                  </h2>

                  <p className="text-sm text-[#64748B] line-clamp-3 leading-relaxed">
                    <BilingualText vi={featured.summaryVi || featured.summary} en={featured.summaryEn || featured.summary} />
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[#E8E5DF]">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#F97316] group-hover:translate-x-1 transition-transform">
                    <BilingualText vi="Khám phá câu chuyện →" en="Explore story →" />
                  </span>
                  <span className="text-xs font-semibold text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E8E5DF]">
                    <BilingualText vi={featured.destinationNameVi || featured.destinationName} en={featured.destinationNameEn || featured.destinationName} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <section className="bg-white rounded-2xl border border-[#E8E5DF] p-5 sm:p-6 shadow-xs space-y-5">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label={bilingualLabel("Chủ đề văn hóa", "Culture topics")}>
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF8008] to-[#FF6A00] text-white shadow-sm'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#253044] hover:bg-[#FFF7E8] border border-[#E8E5DF]'
                }`}
              >
                <span><BilingualText vi={category.labelVi || category.label} en={category.labelEn || category.label} /></span>
              </button>
            );
          })}
        </div>

        {/* Search & Destination Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E8E5DF]">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              aria-label={bilingualLabel("Tìm câu chuyện văn hóa", "Search cultural stories")}
              placeholder={bilingualLabel("Tìm câu chuyện theo chủ đề hoặc từ khóa…", "Search stories by topic or keyword…")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8E5DF] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 rounded-xl text-xs sm:text-sm text-[#253044] placeholder-[#94A3B8] outline-hidden transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#253044]"
                aria-label={bilingualLabel("Xóa tìm kiếm", "Clear search")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap">
                <BilingualText vi="Điểm đến:" en="Destination:" />
              </span>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-[#253044] font-medium outline-hidden focus:border-[#F97316] transition-colors cursor-pointer"
                aria-label={bilingualLabel("Lọc theo điểm đến", "Filter by destination")}
              >
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {bilingualLabel(destination.labelVi || destination.label, destination.labelEn || destination.label)}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E8E5DF]">
              {articles.length} <BilingualText vi="bài viết" en="articles" />
            </span>

            {isFiltered && (
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E5DF] hover:border-[#F97316] text-xs font-semibold text-[#64748B] hover:text-[#F97316] transition-all cursor-pointer"
                onClick={handleClearFilters}
              >
                <RotateCcw size={12} />
                <BilingualText vi="Xóa bộ lọc" en="Clear filters" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      {articles.length ? (
        <div className="culture-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
          {articles.map((article) => (
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} key={article.id}>
              <Link
                className="culture-story-card group relative flex flex-col bg-white border border-[#E8E5DF] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#FDBA74] transition-all duration-300 h-full"
                to={`/culture/${article.id}`}
              >
                <div className="relative overflow-hidden aspect-[16/9.5] bg-[#FFF7E8]">
                  <ContentImage
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FFF0DC] text-[#F97316] border border-[#F97316]/30 shadow-xs tracking-wide">
                      <BilingualText vi={article.categoryNameVi || article.categoryName} en={article.categoryNameEn || article.categoryName} />
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-white/95 backdrop-blur-xs text-[#253044] border border-[#E8E5DF] shadow-xs">
                      <BilingualText vi={article.readTimeVi || article.readTime} en={article.readTimeEn || article.readTime} />
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 bg-white">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#253044] group-hover:text-[#F97316] transition-colors leading-snug line-clamp-2 mb-2">
                      <BilingualText vi={article.titleVi || article.title} en={article.titleEn || article.title} />
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 leading-relaxed">
                      <BilingualText vi={article.summaryVi || article.summary} en={article.summaryEn || article.summary} />
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#F97316] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      <BilingualText vi="Khám phá câu chuyện →" en="Explore story →" />
                    </span>
                    <small className="text-[11px] font-medium text-[#64748B]">
                      <BilingualText vi={article.destinationNameVi || article.destinationName} en={article.destinationNameEn || article.destinationName} />
                    </small>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={bilingualLabel("Không tìm thấy câu chuyện phù hợp", "No matching stories found")}
          description={bilingualLabel("Thử một từ khóa, chủ đề hoặc điểm đến khác để khám phá nét đẹp văn hóa Việt Nam.", "Try another keyword, topic, or destination to explore the beauty of Vietnamese culture.")}
        />
      )}
    </div>
  );
}
