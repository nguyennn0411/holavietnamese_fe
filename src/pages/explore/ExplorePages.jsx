import { BilingualText } from '@/components/common/BilingualText';
import { useAuth } from '@/application/context/AuthContext';
import { useCallback, useState } from 'react';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, EmptyState, Artwork } from '@/components/common/Ui';
import { ContentImage } from '@/components/common/ContentImage';
import { ResourceState } from '@/components/common/ResourceState';
import { DestinationRegion } from '@/components/destinations/DestinationMetadata';
import { DestinationJourneyContent } from '@/components/destinations/DestinationJourneyContent';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { DESTINATION_REGIONS } from '@/models/Destination';
import { destinationService } from '@/services/destinationService';
import { journeyService } from '@/services/journeyService';
import { ROUTES } from '@/constants/routes';
import '@/components/destinations/destinations.css';
import { Search, X, Compass, ArrowLeft, Sparkles } from 'lucide-react';

const emptyFilters = { keyword: '', region: '' };
function stopLabel(stop) {
  if (stop?.status === 'COMPLETED') return <BilingualText vi="Đã hoàn thành" en="Completed" />;
  if (stop?.status === 'LOCKED') return <BilingualText vi="Đang khóa" en="Locked" />;
  if (stop?.status === 'CURRENT') return <BilingualText vi="Hiện tại" en="Current" />;
  return <BilingualText vi="Đã mở khóa" en="Unlocked" />;
}

export function ExploreVietnamPage() {
  const { isAuthenticated, user } = useAuth();
  const viewerId = user?.id ?? user?.userId;
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const location = useLocation();
  const detailRoute = location.pathname === ROUTES.EXPLORE ? ROUTES.DESTINATION_DETAIL : ROUTES.LEARNER_DESTINATION_DETAIL;
  const resource = useAsyncResource(useCallback(async signal => {
    if (!isAuthenticated) throw Object.assign(new Error('Đăng nhập để xem hành trình.'), { status: 401 });
    const [items, journey] = await Promise.all([destinationService.list(query, { signal }), journeyService.get(query, { signal })]);
    return { items, journey };
  }, [query, viewerId, isAuthenticated]));

  const handleRegionClick = (val) => {
    setQuery(current => ({ ...current, region: val }));
  };

  return (
    <section className="explore-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF7E8] via-[#F7F0E3] to-[#EEE3D1] border border-[#E8E5DF] p-6 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none overflow-hidden hidden md:block">
          <Artwork kind="dong-son" className="w-full h-full object-contain object-right" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0DC] border border-[#E7B59D] text-[#EA580C] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles size={14} className="text-[#EA580C]" />
            <BilingualText>{"Ngôn ngữ chỉ là điểm bắt đầu • Culture & Destinations"}</BilingualText>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#253044] tracking-tight leading-tight">
            <BilingualText>{"Khám phá Việt Nam"}</BilingualText>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-2xl">
            <BilingualText>
              {"Học ngôn ngữ. Gặp gỡ văn hóa. Cảm thấy gần gũi hơn mỗi ngày qua từng nẻo đường đất nước hình chữ S."}
            </BilingualText>
          </p>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <form
        className="library-toolbar bg-white rounded-2xl border border-[#E8E5DF] p-4 sm:p-5 shadow-xs space-y-3"
        style={{ flexWrap: 'wrap', alignItems: 'end' }}
        onSubmit={event => {
          event.preventDefault();
          setQuery(current => ({ ...current, keyword: keyword.trim() }));
        }}
      >
        <div className="flex flex-wrap items-center gap-2 pb-1 w-full">
          <span className="text-xs font-bold text-[#64748B] mr-1">Vùng miền:</span>
          <button
            type="button"
            onClick={() => handleRegionClick('')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              !query.region
                ? 'bg-[#EA580C] text-white shadow-xs'
                : 'bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF] hover:bg-[#F7F0E3]'
            }`}
          >
            Tất cả
          </button>
          {DESTINATION_REGIONS.map(reg => (
            <button
              key={reg.value}
              type="button"
              onClick={() => handleRegionClick(reg.value)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                query.region === reg.value
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF] hover:bg-[#F7F0E3]'
              }`}
            >
              {reg.vi}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <label className="explore-keyword-filter w-full">
            <span className="sr-only"><BilingualText>Tìm kiếm</BilingualText></span>
            <div className="relative w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                value={keyword}
                onChange={event => setKeyword(event.target.value)}
                placeholder="Tên tiếng Việt hoặc tiếng Anh · Vietnamese or English name"
                className="w-full pl-10 pr-9 py-2.5 bg-[#FFF7E8] border border-[#E8E5DF] focus:border-[#EA580C] rounded-xl text-xs sm:text-sm text-[#253044] outline-hidden"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#253044]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </label>

          <label className="explore-region-filter w-full sm:w-auto">
            <span className="sr-only"><BilingualText vi="Vùng miền" en="Region" /></span>
            <select
              value={query.region}
              onChange={event => setQuery(current => ({ ...current, region: event.target.value }))}
              className="w-full py-2.5 px-3 bg-[#FFF7E8] border border-[#E8E5DF] focus:border-[#EA580C] rounded-xl text-xs sm:text-sm text-[#253044] outline-hidden"
            >
              <option value="">Tất cả vùng miền · All regions</option>
              {DESTINATION_REGIONS.map(region => (
                <option key={region.value} value={region.value}>{region.vi} · {region.en}</option>
              ))}
            </select>
          </label>

          <div className="actions flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-md transition-all"
            >
              <BilingualText>Tìm kiếm</BilingualText>
            </button>
            <button
              type="button"
              className="secondary px-4 py-2.5 rounded-xl bg-[#FFF7E8] hover:bg-[#F7F0E3] text-[#253044] border border-[#E8E5DF] font-semibold text-xs transition-all"
              onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}
            >
              <BilingualText>Đặt lại bộ lọc</BilingualText>
            </button>
          </div>
        </div>
      </form>

      {/* Destinations Board */}
      {!isAuthenticated ? <EmptyState title="Đăng nhập để xem hành trình"><Link className="button" to={ROUTES.LOGIN}><BilingualText>Đăng nhập</BilingualText></Link></EmptyState> : <ResourceState resource={resource}>
        {({ items, journey }) => {
          const destinations = journey.totalStops > 0 ? journey.stops.map(stop => stop.destination) : items.filter(item => item.status === 'PUBLISHED');
          return destinations.length === 0
            ? (
              <EmptyState
                title={<BilingualText vi="Chưa có điểm đến phù hợp" en="No matching destinations" />}
                description={<BilingualText vi="Thử từ khóa hoặc vùng miền khác. Các điểm đến sẽ xuất hiện khi được xuất bản." en="Try another keyword or region. Destinations appear once published." />}
              />
            )
            : (
              <div className="journey-board card bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-8 shadow-sm">
                <aside className="journey-map">
                  <p className="eyebrow text-xs font-bold text-[#EA580C] tracking-widest uppercase mb-2">
                    {journey.totalStops > 0 ? <BilingualText vi={`VIỆT NAM · ${journey.completedStops}/${journey.totalStops} điểm đến`} en={`VIETNAM · ${journey.progressPercent}% complete`} /> : <BilingualText>VIỆT NAM · VIET NAM</BilingualText>}
                  </p>
                  <img
                    src="/design/vietnam-map.svg"
                    alt="Bản đồ Việt Nam"
                    className="max-h-[500px] w-full object-contain drop-shadow-md mx-auto my-4"
                  />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif text-[#253044] leading-snug">
                      <BilingualText>Một đất nước để khám phá.</BilingualText>
                      <br />
                      <BilingualText>Một ngôn ngữ để sống cùng.</BilingualText>
                    </h2>
                    <p className="muted text-xs text-[#64748B] mt-2">
                      <BilingualText>Mỗi điểm đến mang một từ mới, một hương vị mới và một góc nhìn mới.</BilingualText>
                    </p>
                  </div>
                </aside>

                <div className="journey-stops space-y-4">
                  {destinations.map(destination => {
                    const stop = journey.stops.find(item => item.destination.id === destination.id);
                    return <Link
                      className="journey-stop group relative block p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] hover:bg-white border border-[#E8E5DF] hover:border-[#EA580C] shadow-xs hover:shadow-md transition-all text-decoration-none"
                      key={destination.id}
                      to={generatePath(detailRoute, { id: String(destination.id) })}
                      aria-disabled={stop ? !stop.accessible : undefined}
                      aria-current={stop?.status === 'CURRENT' ? 'step' : undefined}
                      data-journey-status={stop?.status}
                      title={stop && !stop.accessible ? 'Hoàn thành điểm đến trước để mở khóa.' : undefined}
                      onClick={event => { if (stop && !stop.accessible) event.preventDefault(); }}
                    >
                      <span className="journey-dot" aria-hidden="true" />
                      <div className="journey-thumbnail rounded-xl overflow-hidden shadow-xs">
                        <ContentImage
                          src={destination.imageUrl}
                          alt={destination.nameVi}
                          className="figma-art w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <p className="eyebrow text-[11px] font-bold text-[#EA580C] uppercase tracking-wider mb-1">
                          <DestinationRegion value={destination.region} />{stop && <> · {stopLabel(stop)}</>}
                        </p>
                        <h2 className="text-lg sm:text-xl font-black text-[#253044] group-hover:text-[#EA580C] transition-colors leading-snug">
                          <BilingualText vi={destination.nameVi} en={destination.nameEn} />
                        </h2>
                        {(destination.shortDescriptionVi || destination.shortDescriptionEn) && (
                          <p className="text-xs sm:text-sm text-[#64748B] line-clamp-2 mt-1 leading-relaxed">
                            <BilingualText vi={destination.shortDescriptionVi || destination.shortDescriptionEn} en={destination.shortDescriptionEn} />
                          </p>
                        )}
                        <small className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] mt-2 group-hover:underline">
                          {stop ? <BilingualText vi={`${stop.progressPercent}% · ${stop.completedLessons}/${stop.requiredLessons} bài học`} en={`${stop.progressPercent}% · ${stop.completedLessons}/${stop.requiredLessons} lessons`} /> : <BilingualText>Chi tiết</BilingualText>} →
                        </small>
                      </div>
                      <span className="journey-number text-[#64748B] group-hover:text-[#EA580C] group-hover:translate-x-1 transition-all" aria-hidden="true">
                        →
                      </span>
                    </Link>;
                  })}
                </div>
              </div>
            );
        }}
      </ResourceState>}
    </section>
  );
}

export function DestinationDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const backRoute = location.pathname.startsWith(ROUTES.EXPLORE + '/') ? ROUTES.EXPLORE : ROUTES.EXPLORE_VIETNAM;
  const legacySlug = backRoute === ROUTES.EXPLORE && !/^\d+$/.test(id);
  const resource = useAsyncResource(useCallback(signal => legacySlug
    ? destinationService.getBySlug(id, { signal })
    : destinationService.get(id, { signal }), [id, legacySlug]));
  const missing = (
    <EmptyState title="Không tìm thấy điểm đến">
      <Link className="button secondary" to={backRoute}>
        <BilingualText vi="Về Khám phá Việt Nam" en="Back to Explore Vietnam" />
      </Link>
    </EmptyState>
  );

  if (resource.error?.status === 404) return missing;
  return (
    <ResourceState resource={resource}>
      {destination => {
        if (!destination || destination.status !== 'PUBLISHED') return missing;
        return (
          <section className="destination-detail-page w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <Breadcrumb items={[{ label: 'Khám phá Việt Nam', to: backRoute }, { label: destination.nameVi }]} />

            {/* Destination Hero Banner */}
            <div className="destination-hero card rounded-3xl bg-white border border-[#E8E5DF] p-6 sm:p-10 shadow-sm overflow-hidden">
              <div className="space-y-4">
                <p className="eyebrow text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  <DestinationRegion value={destination.region} />
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#253044] tracking-tight">
                  <BilingualText vi={destination.nameVi} en={destination.nameEn} />
                </h1>
                {(destination.shortDescriptionVi || destination.shortDescriptionEn) && (
                  <p className="lead text-sm sm:text-base text-[#64748B] leading-relaxed" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                    <BilingualText vi={destination.shortDescriptionVi || destination.shortDescriptionEn} en={destination.shortDescriptionEn} />
                  </p>
                )}
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md mt-4 lg:mt-0">
                <ContentImage
                  src={destination.imageUrl}
                  alt={destination.nameVi}
                  className="figma-art w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Cultural Stories & Descriptions */}
            {(destination.descriptionVi || destination.descriptionEn) && (
              <div className="split-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.descriptionVi && (
                  <section className="card bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-4">
                    <h2 className="text-lg sm:text-xl font-black text-[#253044] flex items-center gap-2">
                      <Sparkles size={18} className="text-[#FF7A00]" />
                      <BilingualText vi="Khám phá điểm đến" en="Explore the destination" />
                    </h2>
                    <div className="rich-text text-sm sm:text-base text-[#253044] leading-relaxed" lang="vi" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                      {destination.descriptionVi}
                    </div>
                  </section>
                )}
                {destination.descriptionEn && (
                  <section className="card bg-white rounded-3xl border border-[#E8E5DF] p-6 sm:p-8 shadow-xs space-y-4">
                    <h2 className="text-lg sm:text-xl font-black text-[#253044] flex items-center gap-2">
                      <Compass size={18} className="text-[#FF7A00]" />
                      <BilingualText vi="Mô tả tiếng Anh" en="English description" />
                    </h2>
                    <div className="rich-text text-sm sm:text-base text-[#64748B] leading-relaxed" lang="en" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                      {destination.descriptionEn}
                    </div>
                  </section>
                )}
              </div>
            )}

            <DestinationJourneyContent key={destination.id} destinationId={destination.id} />
            <div className="actions pt-4">
              <Link
                className="button secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF7E8] text-[#253044] border border-[#E8E5DF] font-semibold text-xs shadow-xs transition-all"
                to={backRoute}
              >
                <ArrowLeft size={14} />
                <BilingualText vi="← Khám phá Việt Nam" en="← Explore Vietnam" />
              </Link>
            </div>
          </section>
        );
      }}
    </ResourceState>
  );
}
