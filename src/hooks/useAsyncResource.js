import { useCallback, useEffect, useRef, useState } from 'react'
// The caller supplies a stable loader. Invalidate previous requests on navigation/retry.
export function useAsyncResource(loader) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const [revision, setRevision] = useState(0)
  const sequence = useRef(0)
  useEffect(() => {
    const request = ++sequence.current
    const controller = new AbortController()
    setState({ data: null, error: null, loading: true })
    Promise.resolve().then(() => loader(controller.signal)).then(
      data => { if (sequence.current === request) setState({ data, error: null, loading: false }) },
      error => { if (sequence.current === request) setState({ data: null, error, loading: false }) },
    )
    return () => { sequence.current++; controller.abort() }
  }, [loader, revision])
  return { ...state, reload: useCallback(() => setRevision(v => v + 1), []) }
}
