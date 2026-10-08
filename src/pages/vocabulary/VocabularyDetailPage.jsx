import { BilingualText } from '@/components/common/BilingualText';
import { useCallback, useState } from 'react';
import { SaveVocabularyButton } from '@/components/vocabulary/SaveVocabularyButton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { SpeakButton, EmptyState } from '@/components/common/Ui';
import { Modal } from '@/components/common/Modal';
import { VocabularyCatalogPage } from './VocabularyCatalogPage';
import { ResourceState } from '@/components/common/ResourceState';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { vocabularyCatalogService } from '@/services/vocabularyCatalogService';
import '@/components/vocabulary/vocabulary.css';

export function VocabularyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notebookRevision, setNotebookRevision] = useState(0);
  const resource = useAsyncResource(useCallback(
    (signal) => vocabularyCatalogService.get(id, { signal }),
    [id],
  ));

  return (
    <>
    <VocabularyCatalogPage key={notebookRevision} />
    <section className="vocabulary-detail-page vocabulary-ui vocabulary-catalog-detail">
      <Modal title="Chi tiết từ vựng" onClose={() => navigate(ROUTES.VOCABULARY)}>
      <ResourceState resource={resource}>
        {(entry) => entry?.id ? (
          <>
            <article className="card vocabulary-detail-hero">
              <p className="eyebrow"><BilingualText>{"Khám phá từng từ một"}</BilingualText></p>
              <div className="actions vocabulary-detail-badges">
                {entry.topics?.length > 0 && <p className="muted vocabulary-topics">{entry.topics.map((topic) => topic.name).join(', ')}</p>}
                {entry.cefrLevel && <span className="badge">{entry.cefrLevel}</span>}
              </div>
              <h2 lang="vi">{entry.word}</h2>
              <div className="vocabulary-detail-pronunciation">
                {entry.pronunciation && <p className="muted vocabulary-pronunciation">{entry.pronunciation}</p>}
                {entry.partOfSpeech && <span className="muted">{entry.partOfSpeech}</span>}
              </div>
              <div className="vocabulary-detail-word-actions"><SpeakButton text={entry.word} audioUrl={entry.audioUrl} fallbackToSpeech /><SaveVocabularyButton key={entry.id} entry={entry} onSaved={() => setNotebookRevision(value => value + 1)} onDeleted={() => setNotebookRevision(value => value + 1)} /></div>
            </article>
            {entry.meanings?.length ? entry.meanings.map((meaning, index) => (
              <section className="card vocabulary-meaning-detail" key={meaning.id ?? index}>
                <h2><span className="vocabulary-meaning-number"><BilingualText>{"Nghĩa"}</BilingualText>{index + 1}:</span> <span lang="en">{meaning.translationEn}</span></h2>
                {meaning.definitionEn && <p lang="en">{meaning.definitionEn}</p>}
                {meaning.usageNote && <p className="muted vocabulary-usage-note"><span><BilingualText>{"Lưu ý sử dụng"}</BilingualText></span>{meaning.usageNote}</p>}
                {meaning.examples?.length > 0 && <>
                  <h3><BilingualText>{"Ví dụ"}</BilingualText></h3>
                  {meaning.examples.map((example, exampleIndex) => (
                    <div className="vocabulary-example" key={example.id ?? exampleIndex}>
                      <div className="row">
                        <p lang="vi">{example.exampleVi}</p>
                        <SpeakButton text={example.exampleVi} audioUrl={example.audioUrl} fallbackToSpeech />
                      </div>
                      {example.translationEn && <p className="muted" lang="en">{example.translationEn}</p>}
                    </div>
                  ))}
                </>}
              </section>
            )) : <EmptyState title="Chưa có nghĩa của từ vựng" />}
          </>
        ) : <EmptyState title="Không tìm thấy từ vựng">
          <Link className="button secondary" to={ROUTES.VOCABULARY}><BilingualText>{"Từ vựng"}</BilingualText></Link>
        </EmptyState>}
      </ResourceState>
      <div className="vocabulary-detail-footer"><Link className="text-link" to={ROUTES.VOCABULARY}><BilingualText>{"← Từ vựng"}</BilingualText></Link><Link className="button secondary" to={ROUTES.VOCABULARY_NOTEBOOK}><BilingualText>{"Sổ từ vựng"}</BilingualText></Link></div>
      </Modal>
    </section>
    </>
  );
}
