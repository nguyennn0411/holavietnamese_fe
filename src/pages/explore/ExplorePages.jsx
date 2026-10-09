import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { generatePath, Link, useLocation, useParams } from 'react-router-dom';
import { Breadcrumb, PageHeader, EmptyState } from '@/components/common/Ui';
import { ContentImage } from '@/components/common/ContentImage';
import { ResourceState } from '@/components/common/ResourceState';
import { DestinationRegion } from '@/components/destinations/DestinationMetadata';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { DESTINATION_REGIONS } from '@/models/Destination';
import { destinationService } from '@/services/destinationService';
import { ROUTES } from '@/constants/routes';

const emptyFilters = { keyword: '', region: '' };

export function ExploreVietnamPage() {
  const [query, setQuery] = useState(emptyFilters);
  const [keyword, setKeyword] = useState('');
  const location = useLocation();
  const detailRoute = location.pathname === ROUTES.EXPLORE ? ROUTES.DESTINATION_DETAIL : ROUTES.LEARNER_DESTINATION_DETAIL;
  const resource = useAsyncResource(useCallback(signal => destinationService.list(query, { signal }), [query]));

  return <section>
    <PageHeader eyebrow="Ngôn ngữ chỉ là điểm bắt đầu" title="Khám phá Việt Nam" description="Học ngôn ngữ. Gặp gỡ văn hóa. Cảm thấy gần gũi hơn mỗi ngày." />
    <form className="library-toolbar" style={{ flexWrap: 'wrap', alignItems: 'end' }} onSubmit={event => { event.preventDefault(); setQuery(current => ({ ...current, keyword: keyword.trim() })); }}>
      <label style={{ flex: '1 1 260px' }}><BilingualText>Tìm kiếm</BilingualText><input value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="Tên tiếng Việt hoặc tiếng Anh · Vietnamese or English name" /></label>
      <label style={{ flex: '1 1 180px' }}><BilingualText vi="Vùng miền" en="Region" /><select value={query.region} onChange={event => setQuery(current => ({ ...current, region: event.target.value }))}>
        <option value="">Tất cả vùng miền · All regions</option>{DESTINATION_REGIONS.map(region => <option key={region.value} value={region.value}>{region.vi} · {region.en}</option>)}
      </select></label>
      <div className="actions"><button type="submit"><BilingualText>Tìm kiếm</BilingualText></button><button type="button" className="secondary" onClick={() => { setKeyword(''); setQuery({ ...emptyFilters }); }}><BilingualText>Đặt lại bộ lọc</BilingualText></button></div>
    </form>
    <ResourceState resource={resource}>{items => {
      const destinations = items.filter(item => item.status === 'PUBLISHED');
      return destinations.length === 0
        ? <EmptyState title={<BilingualText vi="Chưa có điểm đến phù hợp" en="No matching destinations" />} description={<BilingualText vi="Thử từ khóa hoặc vùng miền khác. Các điểm đến sẽ xuất hiện khi được xuất bản." en="Try another keyword or region. Destinations appear once published." />} />
        : <div className="journey-board card">
          <aside className="journey-map"><p className="eyebrow"><BilingualText>VIỆT NAM · VIET NAM</BilingualText></p><img src="/design/vietnam-map.svg" alt="Bản đồ Việt Nam" /><div><h2><BilingualText>Một đất nước để khám phá.</BilingualText><br /><BilingualText>Một ngôn ngữ để sống cùng.</BilingualText></h2><p className="muted"><BilingualText>Mỗi điểm đến mang một từ mới, một hương vị mới và một góc nhìn mới.</BilingualText></p></div></aside>
          <div className="journey-stops">{destinations.map(destination => <Link className="journey-stop" key={destination.id} to={generatePath(detailRoute, { id: String(destination.id) })}>
            <span className="journey-dot" aria-hidden="true" />
            <div className="journey-thumbnail"><ContentImage src={destination.imageUrl} alt={destination.nameVi} className="figma-art" /></div>
            <div><p className="eyebrow"><DestinationRegion value={destination.region} /></p><h2><BilingualText vi={destination.nameVi} en={destination.nameEn} /></h2>
              {(destination.shortDescriptionVi || destination.shortDescriptionEn) && <p><BilingualText vi={destination.shortDescriptionVi || destination.shortDescriptionEn} en={destination.shortDescriptionEn} /></p>}
              <small><BilingualText>Chi tiết</BilingualText> →</small>
            </div><span className="journey-number" aria-hidden="true">→</span>
          </Link>)}</div>
        </div>;
    }}</ResourceState>
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
      <div className="actions" style={{ marginTop: 20 }}><Link className="button secondary" to={backRoute}><BilingualText vi="← Khám phá Việt Nam" en="← Explore Vietnam" /></Link></div>
    </section>;
  }}</ResourceState>;
}
