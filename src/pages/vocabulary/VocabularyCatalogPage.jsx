import { BilingualText, bilingualLabel } from '@/components/common/BilingualText';
import { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { PageHeader, SpeakButton } from '@/components/common/Ui';
import { VocabularyOverview } from '@/components/vocabulary/VocabularyNavigation';
import { SaveVocabularyButton } from '@/components/vocabulary/SaveVocabularyButton';
import { ResourceState } from '@/components/common/ResourceState';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';
import '@/components/vocabulary/vocabulary.css';

const emptyFilters = {
  keyword: '',
  cefrLevel: '',
  partOfSpeech: '',
  topicId: '',
};

export function VocabularyCatalogPage() {
  const [query, setQuery] = useState({ ...emptyFilters });
  const [keyword, setKeyword] = useState('');
  const [revision, setRevision] = useState(0);
  const [overviewRevision, setOverviewRevision] = useState(0);
  const [filterOptions, setFilterOptions] = useState([]);
  const [resource, setResource] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const reload = () => {
    setRevision((value) => value + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    setResource((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    vocabularyCatalogService
      .list(query, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          if (Object.values(query).every(value => !value)) setFilterOptions(data);
          setResource({
            data,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResource({
            data: [],
            loading: false,
            error,
          });
        }
      });

    return () => controller.abort();
  }, [query, revision]);

  const filter = (field, value) => {
    setQuery((current) => ({
      ...current,
      [field]: value,
    }));
  };
  const levels = [...new Set(filterOptions.map(item => item.cefrLevel).filter(Boolean))].sort();
  const partsOfSpeech = [...new Set(filterOptions.map(item => item.partOfSpeech).filter(Boolean))].sort();
  const topics = [...new Map(filterOptions.flatMap(item => item.topics || []).map(topic => [String(topic.id), topic])).values()];

  return (
    <section className="vocabulary-page vocabulary-ui vocabulary-catalog-page">
      <PageHeader
        eyebrow="Khám phá từng từ một"
        title="Từ vựng tiếng Việt"
        description="Khám phá những từ vựng đã được xuất bản và lưu những từ bạn muốn ôn lại."
        actions={
            <Link
              to={ROUTES.VOCABULARY_REVIEW}
              className="button"
            ><BilingualText>{"Ôn từ vựng →"}</BilingualText></Link>
        }
      />

      <VocabularyOverview key={overviewRevision} active="catalog">
        <Link to={ROUTES.VOCABULARY_NOTEBOOK} className="button secondary"><BilingualText>{"Mở sổ tay"}</BilingualText></Link>
      </VocabularyOverview>

      <form
        className="filters vocabulary-catalog-filters"
        onSubmit={(event) => {
          event.preventDefault();
          filter('keyword', keyword.trim());
        }}
      >
        <label className="vocabulary-search-field">
          <span className="vocabulary-field-label"><BilingualText>{"Tìm kiếm"}</BilingualText></span>
          <input
            type="search"
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
            placeholder={bilingualLabel("Tìm từ vựng…")}
          />
        </label>

        <label>
          <span className="vocabulary-field-label">CEFR</span>
          <select
            value={query.cefrLevel}
            onChange={(event) =>
              filter('cefrLevel', event.target.value)
            }
          ><option value="">{bilingualLabel("Tất cả CEFR")}</option>{levels.map(level => <option key={level} value={level}>{bilingualLabel(level)}</option>)}</select>
        </label>

        <label>
          <span className="vocabulary-field-label"><BilingualText>{"Từ loại"}</BilingualText></span>
          <select
            value={query.partOfSpeech}
            onChange={(event) =>
              filter('partOfSpeech', event.target.value)
            }
          ><option value="">{bilingualLabel("Tất cả từ loại")}</option>{partsOfSpeech.map(part => <option key={part} value={part}>{bilingualLabel(part)}</option>)}</select>
        </label>

        <div className="actions">
          <button type="submit"><BilingualText>{"Tìm kiếm"}</BilingualText></button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setKeyword('');
              setQuery({ ...emptyFilters });
            }}
          ><BilingualText>{"Đặt lại"}</BilingualText></button>
        </div>
      </form>
      <div className="vocabulary-topic-filters" role="group" aria-label="Lọc theo chủ đề">
        <button type="button" className={!query.topicId ? 'active' : ''} aria-pressed={!query.topicId} onClick={() => filter('topicId', '')}><BilingualText>{"Tất cả"}</BilingualText></button>
        {topics.map(topic => <button type="button" key={topic.id} className={String(query.topicId) === String(topic.id) ? 'active' : ''}
          aria-pressed={String(query.topicId) === String(topic.id)} onClick={() => filter('topicId', String(topic.id))}>{topic.name}</button>)}
      </div>

      <ResourceState
        resource={{
          ...resource,
          reload,
        }}
      >
        {(items) =>
          items.length === 0 ? (
            <div className="state">
              <h2><BilingualText>{"Chưa có từ vựng phù hợp"}</BilingualText></h2>
              <p><BilingualText>{"Thử tìm từ khác hoặc thay đổi bộ lọc."}</BilingualText></p>
            </div>
          ) : (
            <>
            <div className="vocabulary-results-heading"><strong><BilingualText>{"Khám phá từ vựng"}</BilingualText></strong><span>{items.length}<BilingualText>{"từ"}</BilingualText></span></div>
            <div className="card-grid">
              {items.map((item) => (
                <article
                  className="card catalog-word-card"
                  key={item.id}
                >
                  <SaveVocabularyButton key={item.id} entry={item} compact onSaved={() => setOverviewRevision(value => value + 1)} onDeleted={() => setOverviewRevision(value => value + 1)} />
                  <div className="row catalog-word-meta">
                    <span className="badge">
                      {item.partOfSpeech}
                    </span>

                    <span className="badge">
                      {item.cefrLevel}
                    </span>
                    <SpeakButton text={item.word} audioUrl={item.audioUrl} fallbackToSpeech />
                  </div>

                  <h2><Link className="vocabulary-word-link" to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(item.id) })}>{item.word}</Link></h2>

                  {item.pronunciation && (
                    <p className="muted catalog-word-pronunciation">
                      {item.pronunciation}
                    </p>
                  )}

                  {item.meanings?.[0] && (
                    <>
                      <p className="catalog-word-meaning">
                        <strong>
                          {item.meanings[0].translationEn}
                        </strong>
                      </p>

                      {item.meanings[0].definitionEn && (
                        <p className="muted catalog-word-definition">
                          {item.meanings[0].definitionEn}
                        </p>
                      )}
                    </>
                  )}

                  {item.topics?.length > 0 && (
                    <p className="muted catalog-word-topics">
                      {item.topics
                        .map((topic) => topic.name)
                        .join(', ')}
                    </p>
                  )}

                  <div className="actions">
                    <Link
                      className="button secondary"
                      to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(item.id) })}
                    ><BilingualText>{"Xem chi tiết"}</BilingualText></Link>
                  </div>
                </article>
              ))}
            </div>
            </>
          )
        }
      </ResourceState>
    </section>
  );
}
