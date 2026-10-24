import { useCallback, useEffect, useState } from 'react';
import { learningPathService } from '@/services/learningPathService';

export function useLearningPath() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      setData(await learningPathService.me(signal ? { signal } : {}));
    } catch (reason) {
      if (reason?.name !== 'CanceledError' && reason?.name !== 'AbortError') {
        setError(reason?.message || 'Không thể tải lộ trình học tập.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const mutate = useCallback(async action => {
    setSaving(true);
    setError('');
    try {
      const next = await action();
      setData(next);
      return next;
    } catch (reason) {
      setError(reason?.message || 'Không thể cập nhật lộ trình học tập.');
      throw reason;
    } finally {
      setSaving(false);
    }
  }, []);

  // React passes the click event to an onClick handler. Keep retry parameterless
  // so that event can never be mistaken for an AbortSignal by the HTTP client.
  const reload = useCallback(() => load(), [load]);

  return {
    data, loading, saving, error, reload,
    apply: courseId => mutate(() => learningPathService.apply(courseId)),
    applyPath: courseIds => mutate(() => learningPathService.applyPath(courseIds)),
    updatePreferences: preferences => mutate(() => learningPathService.updatePreferences(preferences)),
  };
}
