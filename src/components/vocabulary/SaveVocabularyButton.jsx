import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { Notice } from '@/components/common/Ui';
import { vocabularyService } from '@/services/vocabularyService';

export function SaveVocabularyButton({ entry }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [error, setError] = useState('');

  async function save() {
    if (submitting.current || savedEntry) return;
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname + location.search } });
      return;
    }
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      const saved = await vocabularyService.saveWord(entry);
      if (!saved?.id) throw new Error('Máy chủ chưa xác nhận từ vựng đã được lưu. Vui lòng thử lại.');
      setSavedEntry(saved);
    } catch (failure) {
      setError(failure.message);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return <>
    <div className="actions">
      <button type="button" disabled={loading || pending || !!savedEntry} onClick={save}>
        {pending ? 'Đang lưu…' : savedEntry ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
      </button>
    </div>
    {savedEntry && <Notice kind="success">Đã lưu “{savedEntry.word}” vào sổ tay. <Link to={ROUTES.VOCABULARY_NOTEBOOK}>Mở sổ tay</Link></Notice>}
    {error && <Notice kind="error">{error}</Notice>}
  </>;
}
