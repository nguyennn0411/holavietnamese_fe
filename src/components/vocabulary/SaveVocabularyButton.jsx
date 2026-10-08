import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import { Notice } from '@/components/common/Ui';
import { vocabularyService } from '@/services/vocabularyService';

export function SaveVocabularyButton({ entry, compact = false, onSaved, onDeleted }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [savedEntry, setSavedEntry] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function save() {
    if (submitting.current) return;
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname + location.search } });
      return;
    }
    submitting.current = true;
    setPending(true);
    setError('');
    setMessage('');
    try {
      if (savedEntry) {
        await vocabularyService.delete(savedEntry.id);
        setSavedEntry(null);
        setMessage(`Đã xóa “${savedEntry.word}” khỏi sổ tay.`);
        onDeleted?.(savedEntry);
      } else {
        const saved = await vocabularyService.saveWord(entry);
        if (!saved?.id) throw new Error('Máy chủ chưa xác nhận từ vựng đã được lưu. Vui lòng thử lại.');
        setSavedEntry(saved);
        setMessage(`Đã lưu “${saved.word}” vào sổ tay.`);
        onSaved?.(saved);
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return <>
    <div className={compact ? 'vocabulary-card-save' : 'actions vocabulary-detail-save'}>
      <button type="button" className={compact ? `vocabulary-save-icon${savedEntry ? ' is-saved' : ''}` : undefined}
        aria-label={compact ? (pending ? (savedEntry ? 'Đang xóa…' : 'Đang lưu…') : savedEntry ? `Xóa “${entry.word}” khỏi sổ tay` : `Lưu “${entry.word}” vào sổ tay`) : undefined}
        aria-pressed={!!savedEntry} aria-busy={pending}
        title={savedEntry ? 'Xóa khỏi sổ tay' : 'Lưu vào sổ tay'}
        disabled={loading || pending} onClick={save}>
        {pending ? (savedEntry ? 'Đang xóa…' : 'Đang lưu…') : savedEntry ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
      </button>
    </div>
    {message && <Notice kind="success">{message} {savedEntry && <Link to={ROUTES.VOCABULARY_NOTEBOOK}>Mở sổ tay</Link>}</Notice>}
    {error && <Notice kind="error">{error}</Notice>}
  </>;
}
