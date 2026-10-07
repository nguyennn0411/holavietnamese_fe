import { useEffect, useRef, useId } from 'react'
export function Modal({ title, children, onClose, busy = false }) {
  const dialog = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element.showModal()
    element.querySelector('input, textarea, select')?.focus()
    return () => { element.close(); previous?.focus() }
  }, [])
  return <dialog ref={dialog} className="modal" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!busy) onClose() }}>
    <div className="row"><h2 id={titleId}>{title}</h2><button type="button" className="icon-button" aria-label="Đóng hộp thoại" disabled={busy} onClick={onClose}>×</button></div>{children}
  </dialog>
}
