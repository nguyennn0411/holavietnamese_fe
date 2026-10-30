import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { ContentImage } from '@/shared/components/common/ContentImage';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, RotateCcw, Loader2, MapPin, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cultureService } from '@/features/culture/api/cultureService';
import { EmptyState } from '@/shared/components/common/Ui';

const DESTINATION_LOCALES = {
  all: { vi: 'Toàn quốc', en: 'Nationwide' },
  hanoi: { vi: 'Hà Nội', en: 'Hanoi' },
  hue: { vi: 'Huế', en: 'Hue' },
  hoian: { vi: 'Hội An', en: 'Hoi An' },
  hcmc: { vi: 'TP. Hồ Chí Minh', en: 'Ho Chi Minh City' },
  mientay: { vi: 'Miền Tây', en: 'Mekong Delta' },
  sapa: { vi: 'Sa Pa', en: 'Sa Pa' },
  danang: { vi: 'Đà Nẵng', en: 'Da Nang' },
};

const getDestName = (dest, lang) => {
  if (!dest) return lang === 'vi' ? 'Toàn quốc' : 'Nationwide';
  const id = (dest.id || '').toLowerCase();
  const known = DESTINATION_LOCALES[id];
  if (lang === 'vi') {
    return known?.vi || dest.labelVi || dest.nameVi || dest.label || dest.name || 'Toàn quốc';
  }
  return known?.en || dest.labelEn || dest.nameEn || dest.label || dest.name || 'Nationwide';
};

export function CultureExplorePage() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(
    () => (i18n?.resolvedLanguage || i18n?.language || 'en').startsWith('vi') ? 'vi' : 'en'
  );

  useEffect(() => {
    const handleLangChange = (lng) => {
      setCurrentLang(lng?.startsWith('vi') ? 'vi' : 'en');
    };
    i18n.on('languageChanged', handleLangChange);
    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, [i18n]);

  const isVi = currentLang === 'vi';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');

  const [categories, setCategories] = useState(() => cultureService.getCategoriesSync());
  const [destinations, setDestinations] = useState(() => cultureService.getDestinationsSync());
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const destinationDropdownRef = useRef(null);

  // Click outside to close custom destination dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(event.target)) {
        setDestinationOpen(false);
      }
    };
    if (destinationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [destinationOpen]);

  // Fetch categories, destinations, and featured article on mount
  useEffect(() => {
    let mounted = true;
    Promise.all([
      cultureService.getCategories(),
      cultureService.getDestinations(),
      cultureService.getFeaturedArticles(),
    ])
      .then(([cats, dests, feats]) => {
        if (!mounted) return;
        if (cats?.length) setCategories(cats);
        if (dests?.length) setDestinations(dests);
        if (feats?.length) setFeatured(feats[0]);
      })
      .catch((err) => {
        console.warn('Error loading culture meta:', err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch articles whenever search, category, or destination changes
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    cultureService
      .listArticles({
        search,
        category: selectedCategory,
        destination: selectedDestination,
      })
      .then((res) => {
        if (!mounted) return;
        setArticles(res || []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('Error listing articles:', err);
        setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [search, selectedCategory, selectedDestination]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedDestination('all');
  };

  const isFiltered = search || selectedCategory !== 'all' || selectedDestination !== 'all';

  const currentDestination = destinations.find((d) => d.id === selectedDestination) || destinations[0] || {
    labelVi: 'Toàn quốc',
    labelEn: 'Nationwide',
  };

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
        <div
          className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label={isVi ? "Chủ đề văn hóa" : "Culture topics"}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            const categoryIcon = category.icon || (category.id === 'all' ? '✨' : '🏮');
            return (
              <button
                key={category.id}
                type="button"
                className="secondary"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  minHeight: '38px',
                  maxHeight: '38px',
                  height: '38px',
                  padding: '0 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #EA580C' : '1px solid #E2E8F0',
                  background: isActive
                    ? 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)'
                    : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isActive
                    ? '0 4px 14px rgba(234, 88, 12, 0.28)'
                    : '0 1px 2px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#FDBA74';
                    e.currentTarget.style.background = '#FFF7ED';
                    e.currentTarget.style.color = '#C2410C';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>{categoryIcon}</span>
                <span>
                  <BilingualText
                    vi={category.labelVi || category.nameVi || category.name || category.label}
                    en={category.labelEn || category.nameEn || category.name || category.label}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Custom Destination Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E8E5DF]">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              aria-label={isVi ? "Tìm câu chuyện văn hóa" : "Search cultural stories"}
              placeholder={isVi ? "Tìm câu chuyện theo chủ đề hoặc từ khóa…" : "Search stories by topic or keyword…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-white border border-[#E2E8F0] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 rounded-xl text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] outline-hidden transition-all shadow-xs h-[38px]"
            />
            {search && (
              <button
                type="button"
                className="secondary"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#253044]"
                aria-label={isVi ? "Xóa tìm kiếm" : "Clear search"}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Custom Destination Dropdown Menu */}
            <div className="relative" ref={destinationDropdownRef}>
              <button
                type="button"
                className="secondary"
                onClick={() => setDestinationOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={destinationOpen}
                style={{
                  minHeight: '38px',
                  maxHeight: '38px',
                  height: '38px',
                  padding: '0 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '10px',
                  border: destinationOpen ? '1px solid #F97316' : '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#1E293B',
                  cursor: 'pointer',
                  boxShadow: destinationOpen
                    ? '0 0 0 3px rgba(249, 115, 22, 0.15)'
                    : '0 1px 2px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.15s ease',
                  userSelect: 'none',
                }}
              >
                <MapPin size={15} className="text-[#F97316] flex-shrink-0" />
                <span className="text-xs text-[#64748B] font-medium whitespace-nowrap">
                  {isVi ? 'Điểm đến:' : 'Destination:'}
                </span>
                <span className="text-xs font-bold text-[#1E293B] whitespace-nowrap">
                  {isVi ? getDestName(currentDestination, 'vi') : getDestName(currentDestination, 'en')}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-[#64748B] flex-shrink-0 transition-transform duration-200 ${
                    destinationOpen ? 'rotate-180 text-[#F97316]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Popup */}
              {destinationOpen && (
                <div
                  role="listbox"
                  aria-label={isVi ? 'Chọn điểm đến' : 'Select destination'}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: '220px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '6px',
                    boxShadow: '0 14px 30px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -2px rgba(0, 0, 0, 0.05)',
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      padding: '6px 10px 8px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid #F1F5F9',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{isVi ? 'ĐỊA PHƯƠNG / KHU VỰC' : 'REGION / DESTINATION'}</span>
                    <span style={{ fontSize: '10px', color: '#CBD5E1', fontWeight: 600 }}>
                      {destinations.length}
                    </span>
                  </div>

                  {destinations.map((destination) => {
                    const isSelected = selectedDestination === destination.id;
                    const nameVi = getDestName(destination, 'vi');
                    const nameEn = getDestName(destination, 'en');
                    const primaryName = isVi ? nameVi : nameEn;
                    const secondaryName = isVi ? nameEn : nameVi;
                    const hasSecondary = secondaryName && secondaryName.toLowerCase() !== primaryName.toLowerCase();

                    return (
                      <button
                        key={destination.id}
                        type="button"
                        className="secondary"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedDestination(destination.id);
                          setDestinationOpen(false);
                        }}
                        style={{
                          width: '100%',
                          minHeight: '34px',
                          maxHeight: '40px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: isSelected ? '#FFF7ED' : 'transparent',
                          color: isSelected ? '#C2410C' : '#334155',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = '#F8FAFC';
                            e.currentTarget.style.color = '#0F172A';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#334155';
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <MapPin
                            size={14}
                            className={isSelected ? 'text-[#EA580C]' : 'text-[#94A3B8]'}
                            style={{ flexShrink: 0 }}
                          />
                          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                            <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500 }}>
                              {primaryName}
                            </span>
                            {hasSecondary && (
                              <span style={{ fontSize: '11px', color: isSelected ? '#EA580C' : '#94A3B8', opacity: 0.85 }}>
                                {secondaryName}
                              </span>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <Check size={15} className="text-[#EA580C]" style={{ flexShrink: 0, strokeWidth: 2.5 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="text-xs font-bold text-[#475569] whitespace-nowrap bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#E2E8F0] inline-flex items-center gap-1.5 h-[38px]">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span>{articles.length}</span>
              <BilingualText vi="bài viết" en="articles" />
            </span>

            {isFiltered && (
              <button
                type="button"
                className="secondary"
                style={{
                  minHeight: '38px',
                  maxHeight: '38px',
                  height: '38px',
                  padding: '0 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#F97316';
                  e.currentTarget.style.color = '#EA580C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.color = '#64748B';
                }}
                onClick={handleClearFilters}
              >
                <RotateCcw size={13} />
                <BilingualText vi="Xóa bộ lọc" en="Clear filters" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-[#EA580C]">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : articles.length ? (
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
          title={isVi ? "Không tìm thấy câu chuyện phù hợp" : "No matching stories found"}
          description={isVi ? "Thử một từ khóa, chủ đề hoặc điểm đến khác để khám phá nét đẹp văn hóa Việt Nam." : "Try another keyword, topic, or destination to explore the beauty of Vietnamese culture."}
        />
      )}
    </div>
  );
}
