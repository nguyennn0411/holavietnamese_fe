import { useCallback, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { ResourceState } from '@/components/common/ResourceState';
import { EmptyState, Tabs } from '@/components/common/Ui';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { destinationExploreService } from '@/services/destinationExploreService';
import { openableExploreScenarios, resolveExploreCultures } from '@/models/DestinationExplore';
import { RegionalVariantCard } from '@/components/regional/RegionalComparison';
import { ROUTES } from '@/constants/routes';

const tabs = [{ id: 'culture', label: 'Văn hóa' }, { id: 'language', label: 'Ngôn ngữ vùng miền' }, { id: 'practice', label: 'Thực hành' }];
export function DestinationExploreContent({ destinationId }) {
  const [tab, setTab] = useState('culture');
  const resource = useAsyncResource(useCallback(signal => destinationExploreService.get(destinationId, { signal }), [destinationId]));
  return <section className="card destination-explore-content">
    <Tabs items={tabs} value={tab} onChange={setTab} />
    <ResourceState resource={resource}>{data => {
      const cultures = resolveExploreCultures(data.cultureIds || []), scenarios = openableExploreScenarios(data.scenarios || []);
      return <>
        {tab === 'culture' && (cultures.length ? <div className="explore-related-grid">{cultures.map(article => <article className="card" key={article.id}>
          {article.coverImage && <ContentImage src={article.coverImage} alt={article.title} className="explore-related-image" />}
          <h3>{article.title}</h3><p>{article.summary}</p><Link className="text-link" to={generatePath(ROUTES.CULTURE_DETAIL, { id: article.id })}><BilingualText vi="Đọc bài văn hóa →" en="Read article →" /></Link>
        </article>)}</div> : <EmptyState title="Chưa có bài văn hóa liên kết" />)}
        {tab === 'language' && <>
          {data.regionalVariants?.length > 0 && <><p className="muted"><BilingualText vi="Cách dùng có thể thay đổi theo địa phương và ngữ cảnh. Bạn vẫn có thể sử dụng tiếng Việt phổ thông." en="Usage varies by place and context. Standard Vietnamese remains appropriate." /></p>
            <div className="explore-related-grid">{data.regionalVariants.map(variant => <div key={variant.id}><p>Từ tương đương: <Link to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(variant.vocabularyId) })}>{variant.masterWord}</Link></p><RegionalVariantCard variant={variant} /></div>)}</div></>}
          {data.vocabulary?.length > 0 && <section><h3><BilingualText vi="Từ vựng hữu ích" en="Useful vocabulary" /></h3><ul>{data.vocabulary.map(word => <li key={word.id}><Link to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(word.id) })}>{word.word}</Link>{word.pronunciation && ` · ${word.pronunciation}`}</li>)}</ul></section>}
          {!data.regionalVariants?.length && !data.vocabulary?.length && <EmptyState title="Chưa có nội dung ngôn ngữ liên kết" />}
          <Link className="text-link" to={ROUTES.REGIONAL_VIETNAMESE}><BilingualText vi="So sánh Bắc – Trung – Nam →" en="Compare regional expressions →" /></Link>
        </>}
        {tab === 'practice' && (scenarios.length ? <div className="explore-related-grid">{scenarios.map(scenario => <article className="card" key={scenario.id}>
          <p className="eyebrow">Trình độ gợi ý: {scenario.level}</p><h3>{scenario.title}</h3><p>{scenario.overview}</p>
          <Link className="button" to={generatePath(ROUTES.AI_SCENARIO_DETAIL, { id: scenario.id })}><BilingualText vi="Xem tình huống và thực hành" en="View scenario and practise" /></Link>
        </article>)}</div> : <EmptyState title="Chưa có kịch bản thực hành khả dụng" />)}
      </>;
    }}</ResourceState>
  </section>;
}
