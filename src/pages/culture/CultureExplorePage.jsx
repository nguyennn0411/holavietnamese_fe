import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, Sparkles, MapPin, Clock, ArrowRight, RotateCcw } from 'lucide-react';
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
    <div className="p4-container culture-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9EE] via-[#F7F0E3] to-[#EEE3D1] border border-[#DECBB4] p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5E1D8] border border-[#E7B59D] text-[#A62A24] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles size={14} className="text-[#A62A24]" />
            <BilingualText>{"Nhiều hơn những từ ngữ • Culture & Stories"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#431914] tracking-tight leading-tight">
            <BilingualText>{"Khám phá văn hóa Việt Nam"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#78685B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Ngôn ngữ trở nên gần gũi và sống động khi bạn thấu hiểu những câu chuyện phong tục, ẩm thực và nơi chốn phía sau."}
            </BilingualText>
          </p>
        </div>
      </section>

      {/* Featured Article Banner (when not filtered) */}
      {!isFiltered && featured && (
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="w-full">
          <Link
            className="culture-feature group relative block overflow-hidden rounded-3xl bg-[#FFF9EE] border border-[#DECBB4] shadow-md hover:shadow-xl transition-all"
            to={`/culture/${featured.id}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[320px]">
              <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto">
                <ContentImage
                  src={featured.coverImage}
                  alt={featured.title}
                  className="figma-art w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between gap-4 bg-[#FFF9EE]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="badge px-2.5 py-0.5 rounded-md bg-[#24382B] text-[#FFF9EE] text-[10px] font-bold uppercase tracking-wider">
                      {featured.categoryName}
                    </span>
                    <span className="text-xs text-[#78685B] font-medium flex items-center gap-1">
                      <Clock size={12} className="text-[#A62A24]" />
                      {featured.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-[#431914] group-hover:text-[#A62A24] transition-colors leading-snug">
                    <BilingualText vi={featured.titleVi || featured.title} en={featured.title} />
                  </h2>

                  <p className="text-xs sm:text-sm text-[#78685B] line-clamp-3 leading-relaxed">
                    {featured.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#DECBB4]/40">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#A62A24] group-hover:underline">
                    <BilingualText>{"Khám phá câu chuyện →"}</BilingualText>
                    <ArrowRight size={15} />
                  </span>
                  <span className="text-[11px] text-[#78685B]">
                    {featured.destinationName}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <section className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#DECBB4] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Chủ đề văn hóa">
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#A62A24] text-white shadow-sm ring-1 ring-[#89221E]'
                    : 'bg-[#FFF9EE] text-[#78685B] hover:text-[#431914] hover:bg-[#F7F0E3] border border-[#DECBB4]/70'
                }`}
              >
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Destination Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-[#DECBB4]/40">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78685B]" />
            <input
              type="text"
              aria-label="Tìm câu chuyện văn hóa"
              placeholder={bilingualLabel("Tìm câu chuyện theo chủ đề hoặc từ khóa…")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-[#FFF9EE] border border-[#DECBB4] focus:border-[#A62A24] focus:ring-2 focus:ring-[#A62A24]/10 rounded-xl text-xs sm:text-sm text-[#431914] placeholder-[#78685B]/60 outline-hidden transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78685B] hover:text-[#431914]"
                aria-label="Xóa tìm kiếm"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="culture-destination-filter flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#78685B]">
              <MapPin size={15} className="text-[#A62A24]" />
              <BilingualText>{"Điểm đến:"}</BilingualText>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="bg-[#FFF9EE] border border-[#DECBB4] rounded-xl px-3 py-1.5 text-xs text-[#431914] font-medium outline-hidden focus:border-[#A62A24]"
              >
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {bilingualLabel(destination.label)}
                  </option>
                ))}
              </select>
            </label>

            <span className="text-xs font-bold text-[#A62A24] px-2.5 py-1 rounded-lg bg-[#F5E1D8]">
              {articles.length} <BilingualText>{"câu chuyện"}</BilingualText>
            </span>

            {isFiltered && (
              <button
                type="button"
                className="secondary flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#DECBB4] hover:border-[#A62A24] text-xs font-semibold text-[#78685B] transition-all"
                onClick={handleClearFilters}
              >
                <RotateCcw size={12} />
                <BilingualText>{"Xóa bộ lọc"}</BilingualText>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      {articles.length ? (
        <div className="culture-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} key={article.id}>
              <Link
                className="card culture-story-card group relative flex flex-col bg-[#FFF9EE] border border-[#DECBB4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#cfb79d] transition-all duration-300 h-full"
                to={`/culture/${article.id}`}
              >
                <div className="relative overflow-hidden aspect-[16/10] bg-[#EEE3D1]">
                  <ContentImage
                    src={article.coverImage}
                    alt={article.title}
                    className="figma-art w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#24382B] text-[#FFF9EE] shadow-sm tracking-wide">
                      {article.categoryName}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/60 backdrop-blur-xs text-white">
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-[#431914] group-hover:text-[#A62A24] transition-colors leading-snug line-clamp-2 mb-2">
                      <BilingualText vi={article.titleVi || article.title} en={article.title} />
                    </h3>
                    <p className="text-xs text-[#78685B] line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DECBB4]/40 flex items-center justify-between text-xs">
                    <span className="text-link font-bold text-[#A62A24] group-hover:underline inline-flex items-center gap-1">
                      <BilingualText>{"Khám phá câu chuyện →"}</BilingualText>
                    </span>
                    <small className="text-[11px] text-[#78685B]">
                      {article.destinationName}
                    </small>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Không tìm thấy câu chuyện phù hợp"
          description="Thử một từ khóa, chủ đề hoặc điểm đến khác để khám phá nét đẹp văn hóa Việt Nam."
        />
      )}
    </div>
  );
}
