import { BilingualText, bilingualLabel, useTextLanguage } from '@/shared/components/common/BilingualText';
import { useEffect, useRef, useId } from 'react'
import { X } from 'lucide-react'
export function Modal({ title, children, onClose, busy = false, className = '' }) {
  useTextLanguage();
  const dialog = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const element = dialog.current
    const previous = document.activeElement
    element.showModal()
    element.querySelector('input, textarea, select')?.focus()
    return () => { element.close(); previous?.focus() }
  }, [])
  return <dialog ref={dialog} className={`modal ${className}`.trim()} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); if (!busy) onClose() }}>
    <div className="row modal-header"><h2 id={titleId}><BilingualText>{title}</BilingualText></h2><button type="button" className="icon-button modal-close-btn admin-modal-close-btn" aria-label={bilingualLabel("Đóng hộp thoại", "Close dialog")} disabled={busy} onClick={onClose}><X size={18}/></button></div>{children}
  </dialog>
}
