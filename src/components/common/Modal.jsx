import { useEffect, useRef } from 'react'
export function Modal({ title, children, onClose, busy = false }) {
  const dialog = useRef(null)
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element.showModal()
    element.querySelector('input, textarea, select')?.focus()
    return () => { element.close(); previous?.focus() }
  }, [])
  return <dialog ref={dialog} className="modal" aria-labelledby="modal-title" onCancel={event => { event.preventDefault(); if (!busy) onClose() }}>
    <div className="row"><h2 id="modal-title">{title}</h2><button type="button" className="icon-button" aria-label="Đóng hộp thoại / Close dialog" disabled={busy} onClick={onClose}>×</button></div>{children}
  </dialog>
}
