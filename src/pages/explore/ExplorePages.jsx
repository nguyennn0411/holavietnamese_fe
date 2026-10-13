import { BilingualText } from '@/components/common/BilingualText';
import { useAuth } from '@/application/context/AuthContext';
import { useCallback, useState } from 'react';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, PageHeader, EmptyState } from '@/components/common/Ui';
import { ContentImage } from '@/components/common/ContentImage';
import { ResourceState } from '@/components/common/ResourceState';
import { DestinationRegion } from '@/components/destinations/DestinationMetadata';
import { DestinationJourneyContent } from '@/components/destinations/DestinationJourneyContent';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { DESTINATION_REGIONS } from '@/models/Destination';
import { destinationService } from '@/services/destinationService';
import { journeyService } from '@/services/journeyService';
import { ROUTES } from '@/constants/routes';

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

  return <section>
    <PageHeader eyebrow="Ngôn ngữ chỉ là điểm bắt đầu" title="Khám phá Việt Nam" description="Học ngôn ngữ. Gặp gỡ văn hóa. Cảm thấy gần gũi hơn mỗi ngày." />
    <form className="library-toolbar" style={{ flexWrap: 'wrap', alignItems: 'end' }} onSubmit={event => { event.preventDefault(); setQuery(current => ({ ...current, keyword: keyword.trim() })); }}>
      <label style={{ flex: '1 1 260px' }}><BilingualText>Tìm kiếm</BilingualText><input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Tên tiếng Việt hoặc tiếng Anh · Vietnamese or English name" /></label>
      <label style={{ flex: '1 1 180px' }}><BilingualText vi="Vùng miền" en="Region" /><select value={query.region} onChange={event => setQuery(current => ({ ...current, region: event.target.value }))}>
        <option value="">Tất cả vùng miền · All regions</option>{DESTINATION_REGIONS.map(region => <option key={region.value} value={region.value}>{region.vi} · {region.en}</option>)}
      </select></label>
      <div className="actions"><button type="submit"><BilingualText>Tìm kiếm</BilingualText></button><button type="button" className="secondary" onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}><BilingualText>Đặt lại bộ lọc</BilingualText></button></div>
    </form>
    {!isAuthenticated ? <EmptyState title="Đăng nhập để xem hành trình"><Link className="button" to={ROUTES.LOGIN}><BilingualText>Đăng nhập</BilingualText></Link></EmptyState> : <ResourceState resource={resource}>{({ items, journey }) => {
      const destinations = journey.totalStops > 0 ? journey.stops.map(stop => stop.destination) : items.filter(item => item.status === 'PUBLISHED');
      return destinations.length === 0
        ? <EmptyState title={<BilingualText vi="Chưa có điểm đến phù hợp" en="No matching destinations" />} description={<BilingualText vi="Thử từ khóa hoặc vùng miền khác. Các điểm đến sẽ xuất hiện khi được xuất bản." en="Try another keyword or region. Destinations appear once published." />} />
        : <div className="journey-board card">
          <aside className="journey-map"><p className="eyebrow">{journey.totalStops > 0 ? <BilingualText vi={`VIỆT NAM · ${journey.completedStops}/${journey.totalStops} điểm đến`} en={`VIETNAM · ${journey.progressPercent}% complete`} /> : <BilingualText>VIỆT NAM · VIET NAM</BilingualText>}</p><img src="/design/vietnam-map.svg" alt="Bản đồ Việt Nam" /><div><h2><BilingualText>Một đất nước để khám phá.</BilingualText><br /><BilingualText>Một ngôn ngữ để sống cùng.</BilingualText></h2><p className="muted"><BilingualText>Mỗi điểm đến mang một từ mới, một hương vị mới và một góc nhìn mới.</BilingualText></p></div></aside>
          <div className="journey-stops">{destinations.map(destination => {
            const stop = journey.stops.find(item => item.destination.id === destination.id);
            return <Link className="journey-stop" key={destination.id} to={generatePath(detailRoute, { id: String(destination.id) })} aria-disabled={stop ? !stop.accessible : undefined} aria-current={stop?.status === 'CURRENT' ? 'step' : undefined} title={stop && !stop.accessible ? 'Hoàn thành điểm đến trước để mở khóa.' : undefined} onClick={event => { if (stop && !stop.accessible) event.preventDefault(); }}>
            <span className="journey-dot" aria-hidden="true" />
            <div className="journey-thumbnail"><ContentImage src={destination.imageUrl} alt={destination.nameVi} className="figma-art" /></div>
            <div><p className="eyebrow"><DestinationRegion value={destination.region} />{stop && <> · {stopLabel(stop)}</>}</p><h2><BilingualText vi={destination.nameVi} en={destination.nameEn} /></h2>
              {(destination.shortDescriptionVi || destination.shortDescriptionEn) && <p><BilingualText vi={destination.shortDescriptionVi || destination.shortDescriptionEn} en={destination.shortDescriptionEn} /></p>}
              <small>{stop ? <BilingualText vi={`${stop.progressPercent}% · ${stop.completedLessons}/${stop.requiredLessons} bài học`} en={`${stop.progressPercent}% · ${stop.completedLessons}/${stop.requiredLessons} lessons`} /> : <BilingualText>Chi tiết</BilingualText>} →</small>
            </div><span className="journey-number" aria-hidden="true">→</span>
          </Link>; })}</div>
        </div>;
    }}</ResourceState>}
  </section>;
}

export function DestinationDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const backRoute = location.pathname.startsWith(ROUTES.EXPLORE + '/') ? ROUTES.EXPLORE : ROUTES.EXPLORE_VIETNAM;
  const legacySlug = backRoute === ROUTES.EXPLORE && !/^\d+$/.test(id);
  const resource = useAsyncResource(useCallback(signal => legacySlug
    ? destinationService.getBySlug(id, { signal })
    : destinationService.get(id, { signal }), [id, legacySlug]));
  const missing = <EmptyState title="Không tìm thấy điểm đến"><Link className="button secondary" to={backRoute}><BilingualText vi="Về Khám phá Việt Nam" en="Back to Explore Vietnam" /></Link></EmptyState>;

  if (resource.error?.status === 404) return missing;
  return <ResourceState resource={resource}>{destination => {
    if (!destination || destination.status !== 'PUBLISHED') return missing;
    return <section>
      <Breadcrumb items={[{ label: 'Khám phá Việt Nam', to: backRoute }, { label: destination.nameVi }]} />
      <div className="destination-hero card">
        <div><p className="eyebrow"><DestinationRegion value={destination.region} /></p><h1><BilingualText vi={destination.nameVi} en={destination.nameEn} /></h1>
          {(destination.shortDescriptionVi || destination.shortDescriptionEn) && <p className="lead" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}><BilingualText vi={destination.shortDescriptionVi || destination.shortDescriptionEn} en={destination.shortDescriptionEn} /></p>}
        </div><ContentImage src={destination.imageUrl} alt={destination.nameVi} className="figma-art" loading="eager" />
      </div>
      {(destination.descriptionVi || destination.descriptionEn) && <div className="split-grid">
        {destination.descriptionVi && <section className="card"><h2><BilingualText vi="Khám phá điểm đến" en="Explore the destination" /></h2><div className="rich-text" lang="vi" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{destination.descriptionVi}</div></section>}
        {destination.descriptionEn && <section className="card"><h2><BilingualText vi="Mô tả tiếng Anh" en="English description" /></h2><div className="rich-text" lang="en" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{destination.descriptionEn}</div></section>}
      </div>}
      <DestinationJourneyContent key={destination.id} destinationId={destination.id} />
      <div className="actions" style={{ marginTop: 20 }}><Link className="button secondary" to={backRoute}><BilingualText vi="← Khám phá Việt Nam" en="← Explore Vietnam" /></Link></div>
    </section>;
  }}</ResourceState>;
}
