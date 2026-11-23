import { useCallback, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BilingualText, bilingualLabel } from '@/shared/components/common/BilingualText';
import { PageHeader, EmptyState, Pagination } from '@/shared/components/common/Ui';
import { ResourceState } from '@/shared/components/common/ResourceState';
import { RegionalComparison } from '@/features/explore/regional/components/RegionalComparison';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { regionalVocabularyService } from '@/features/explore/regional/api/regionalVocabularyService';
import { REGIONAL_REGIONS } from '@/features/explore/regional/models/RegionalVocabulary';
import { ROUTES } from '@/constants/routes';
import '@/features/explore/regional/components/regional.css';

export function RegionalVietnamesePage() {
  const [params, setParams] = useSearchParams();
  const keyword = params.get('keyword') || '', region = params.get('region') || '', page = Math.max(0, Number(params.get('page')) || 0);
  const [search, setSearch] = useState(keyword);
  const resource = useAsyncResource(useCallback(signal => regionalVocabularyService.page({ keyword, region, page }, { signal }), [keyword, region, page]));
  return <section className="regional-page">
    <PageHeader eyebrow={<BilingualText vi="Cùng một tiếng Việt, nhiều cách nói" en="One language, many expressions" />} title={<BilingualText vi="Tiếng Việt vùng miền" en="Regional Vietnamese" />} description={<BilingualText vi="Khám phá và so sánh cách dùng từ ở miền Bắc, Trung và Nam." en="Explore and compare expressions from Northern, Central and Southern Vietnam." />} actions={<Link className="button secondary" to={ROUTES.VOCABULARY}><BilingualText vi="← Từ vựng" en="← Vocabulary" /></Link>} />
    <form className="card regional-filters" onSubmit={event => { event.preventDefault(); setParams({ keyword: search.trim(), region }); }}>
      <label><BilingualText vi="Tìm từ hoặc nghĩa" en="Search words or meanings" /><input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label><BilingualText vi="Vùng sử dụng" en="Region" /><select value={region} onChange={event => setParams({ keyword, region: event.target.value })}><option value="">{bilingualLabel('Tất cả vùng miền')}</option>{REGIONAL_REGIONS.map(item => <option key={item.value} value={item.value}>{item.vi} · {item.en}</option>)}</select></label>
      <button type="submit"><BilingualText>Tìm kiếm</BilingualText></button><button className="secondary" type="button" onClick={() => { setSearch(''); setParams({}); }}><BilingualText>Đặt lại</BilingualText></button>
    </form>
    <ResourceState resource={resource}>{result => result.content.length ? <><div className="regional-results">{result.content.map(item => <RegionalComparison key={item.vocabularyId} comparison={item} />)}</div><Pagination page={result.number} totalPages={result.totalPages} onChange={nextPage => setParams({ keyword, region, page: String(nextPage) })} /></> : <EmptyState title={<BilingualText vi="Chưa có từ vùng miền phù hợp" en="No matching regional words" />} description={<BilingualText vi="Thử từ khóa hoặc vùng khác. Nội dung sẽ xuất hiện sau khi được xuất bản." en="Try another word or region. Content appears once published." />} />}</ResourceState>
  </section>;
}
