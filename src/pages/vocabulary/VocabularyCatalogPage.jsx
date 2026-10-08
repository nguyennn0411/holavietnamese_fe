import { useEffect, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { PageHeader } from '@/components/common/Ui';
import { ResourceState } from '@/components/common/ResourceState';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';

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

  return (
    <section className="vocabulary-page">
      <PageHeader
        eyebrow="Khám phá từng từ một"
        title="Từ vựng tiếng Việt"
        description="Khám phá những từ vựng đã được xuất bản và lưu những từ bạn muốn ôn lại."
        actions={
          <>
            <Link
              to={ROUTES.VOCABULARY_NOTEBOOK}
              className="button secondary"
            >
              Sổ từ vựng
            </Link>

            <Link
              to={ROUTES.VOCABULARY_REVIEW}
              className="button"
            >
              Ôn từ vựng →
            </Link>
          </>
        }
      />

      <form
        className="filters"
        onSubmit={(event) => {
          event.preventDefault();
          filter('keyword', keyword.trim());
        }}
      >
        <label style={{ flex: '1 1 240px' }}>
          Tìm kiếm
          <input
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
            placeholder="Tìm từ vựng…"
          />
        </label>

        <label style={{ flex: '1 1 160px' }}>
          CEFR
          <input
            value={query.cefrLevel}
            onChange={(event) =>
              filter('cefrLevel', event.target.value)
            }
            placeholder="Ví dụ: A1"
          />
        </label>

        <label style={{ flex: '1 1 180px' }}>
          Từ loại
          <input
            value={query.partOfSpeech}
            onChange={(event) =>
              filter('partOfSpeech', event.target.value)
            }
            placeholder="Ví dụ: phrase"
          />
        </label>

        <div className="actions">
          <button type="submit">
            Tìm kiếm
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => {
              setKeyword('');
              setQuery({ ...emptyFilters });
            }}
          >
            Đặt lại
          </button>
        </div>
      </form>

      <ResourceState
        resource={{
          ...resource,
          reload,
        }}
      >
        {(items) =>
          items.length === 0 ? (
            <div className="state">
              <h2>Chưa có từ vựng phù hợp</h2>
              <p>
                Thử tìm từ khác hoặc thay đổi bộ lọc.
              </p>
            </div>
          ) : (
            <div className="card-grid">
              {items.map((item) => (
                <article
                  className="card"
                  key={item.id}
                >
                  <div className="row">
                    <span className="badge">
                      {item.partOfSpeech}
                    </span>

                    <span className="badge">
                      {item.cefrLevel}
                    </span>
                  </div>

                  <h2>{item.word}</h2>

                  {item.pronunciation && (
                    <p className="muted">
                      {item.pronunciation}
                    </p>
                  )}

                  {item.meanings?.[0] && (
                    <>
                      <p>
                        <strong>
                          {item.meanings[0].translationEn}
                        </strong>
                      </p>

                      {item.meanings[0].definitionEn && (
                        <p className="muted">
                          {item.meanings[0].definitionEn}
                        </p>
                      )}
                    </>
                  )}

                  {item.topics?.length > 0 && (
                    <p className="muted">
                      {item.topics
                        .map((topic) => topic.name)
                        .join(', ')}
                    </p>
                  )}

                  <div className="actions">
                    <Link
                      className="button secondary"
                      to={generatePath(ROUTES.VOCABULARY_CATALOG_DETAIL, { id: String(item.id) })}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </ResourceState>
    </section>
  );
}
