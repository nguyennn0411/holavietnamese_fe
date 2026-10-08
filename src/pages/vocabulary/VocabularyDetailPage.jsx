import { useCallback } from 'react';
import { SaveVocabularyButton } from '@/components/vocabulary/SaveVocabularyButton';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { PageHeader, SpeakButton, EmptyState } from '@/components/common/Ui';
import { ResourceState } from '@/components/common/ResourceState';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';

export function VocabularyDetailPage() {
  const { id } = useParams();
  const resource = useAsyncResource(useCallback(
    (signal) => vocabularyCatalogService.get(id, { signal }),
    [id],
  ));

  return (
    <section className="vocabulary-detail-page">
      <Link className="text-link" to={ROUTES.VOCABULARY}>← Từ vựng</Link>
      <PageHeader
        eyebrow="Khám phá từng từ một"
        title="Chi tiết từ vựng"
        actions={<Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}>Sổ từ vựng</Link>}
      />
      <ResourceState resource={resource}>
        {(entry) => entry?.id ? (
          <>
            <article className="card">
              <div className="row">
                <div className="actions">
                  {entry.partOfSpeech && <span className="badge">{entry.partOfSpeech}</span>}
                  {entry.cefrLevel && <span className="badge">{entry.cefrLevel}</span>}
                </div>
                <SpeakButton text={entry.word} audioUrl={entry.audioUrl} />
              </div>
              <h2 lang="vi">{entry.word}</h2>
              {entry.pronunciation && <p className="muted">{entry.pronunciation}</p>}
              {entry.topics?.length > 0 && <p className="muted">{entry.topics.map((topic) => topic.name).join(', ')}</p>}
              <SaveVocabularyButton key={entry.id} entry={entry} />
            </article>
            {entry.meanings?.length ? entry.meanings.map((meaning, index) => (
              <section className="card" key={meaning.id ?? index}>
                <h2>Nghĩa {index + 1}: <span lang="en">{meaning.translationEn}</span></h2>
                {meaning.definitionEn && <p lang="en">{meaning.definitionEn}</p>}
                {meaning.usageNote && <p className="muted">{meaning.usageNote}</p>}
                {meaning.examples?.length > 0 && <>
                  <h3>Ví dụ</h3>
                  {meaning.examples.map((example, exampleIndex) => (
                    <div key={example.id ?? exampleIndex}>
                      <div className="row">
                        <p lang="vi">{example.exampleVi}</p>
                        <SpeakButton text={example.exampleVi} audioUrl={example.audioUrl} />
                      </div>
                      {example.translationEn && <p className="muted" lang="en">{example.translationEn}</p>}
                    </div>
                  ))}
                </>}
              </section>
            )) : <EmptyState title="Chưa có nghĩa của từ vựng" />}
          </>
        ) : <EmptyState title="Không tìm thấy từ vựng">
          <Link className="button secondary" to={ROUTES.VOCABULARY}>Từ vựng</Link>
        </EmptyState>}
      </ResourceState>
    </section>
  );
}
