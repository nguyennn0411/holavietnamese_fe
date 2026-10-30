import { useCallback, useEffect, useRef, useState } from 'react';
import { learningPathService } from '@/features/learning/api/learningPathService';

const isCanceledRequest = reason => (
  reason?.code === 'ERR_CANCELED'
  || reason?.name === 'CanceledError'
  || reason?.name === 'AbortError'
);

export function useLearningPath() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const loadSequence = useRef(0);

  const load = useCallback(async (signal) => {
    const request = ++loadSequence.current;
    setLoading(true);
    setError('');
    try {
      const next = await learningPathService.me(signal ? { signal } : {});
      if (loadSequence.current === request) setData(next);
    } catch (reason) {
      if (loadSequence.current === request && !isCanceledRequest(reason)) {
        setError(reason?.message || 'Không thể tải lộ trình học tập.');
      }
    } finally {
      if (loadSequence.current === request) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => {
      loadSequence.current += 1;
      controller.abort();
    };
  }, [load]);

  const mutate = useCallback(async action => {
    setSaving(true);
    setError('');
    try {
      const next = await action();
      setData(next);
      return next;
    } catch (reason) {
      if (!isCanceledRequest(reason)) {
        setError(reason?.message || 'Không thể cập nhật lộ trình học tập.');
      }
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
