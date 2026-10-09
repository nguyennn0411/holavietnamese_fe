import { BilingualText } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/application/context/AuthContext';
import { useVocabulary } from '@/hooks/useVocabulary';

export function VocabularyNavigation({ active, count }) {
  return <nav className="vocabulary-navigation" aria-label="Từ vựng">
    {[
      { id: 'catalog', to: ROUTES.VOCABULARY, label: 'Từ vựng', icon: 'book' },
      { id: 'notebook', to: ROUTES.VOCABULARY_NOTEBOOK, label: 'Sổ tay', icon: 'bookmark' },
      { id: 'review', to: ROUTES.VOCABULARY_REVIEW, label: 'Ôn tập', icon: 'review' },
    ].map(item => <Link key={item.id} to={item.to} aria-current={active === item.id ? 'page' : undefined}>
      <span className={`vocabulary-icon vocabulary-icon--${item.icon}`} aria-hidden="true" />
      <BilingualText>{item.label}</BilingualText>
      {item.id === 'notebook' && count != null && <span className="vocabulary-navigation-count">{count}</span>}
    </Link>)}
  </nav>;
}

export function VocabularyOverview({ active, children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <NotebookOverview active={active}>{children}</NotebookOverview>
    : <><NotebookBanner>{children}</NotebookBanner><VocabularyNavigation active={active} /></>;
}

function NotebookOverview({ active, children }) {
  const resource = useVocabulary({ search: '', courseId: '', lessonId: '' });
  const count = !resource.loading && !resource.error ? resource.data?.length : undefined;
  return <><NotebookBanner count={count}>{children}</NotebookBanner><VocabularyNavigation active={active} count={count} /></>;
}

function NotebookBanner({ count, children }) {
  return <div className="notebook-banner vocabulary-overview">
    <span className="vocabulary-icon vocabulary-icon--bookmark" aria-hidden="true" />
    <div><strong><BilingualText>{"Sổ tay tiếng Việt của bạn"}</BilingualText></strong>
      <small>{count != null ? <BilingualText vi={<>{count} từ trong sổ tay <span aria-hidden="true">·</span> {count} từ sẵn sàng ôn tập</>} en={<>{count} words in your notebook · {count} ready to review</>} /> : <BilingualText>{'Lưu lại từ hay, ôn lại mỗi ngày.'}</BilingualText>}</small>
    </div>{children}
  </div>;
}
