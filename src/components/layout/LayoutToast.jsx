import { BilingualText } from '@/components/common/BilingualText';
import { CircleAlert, X } from 'lucide-react';
export function LayoutToast({ message, onClose }) {
  if (!message) return null;
  return <div className="layout-toast" role="alert" aria-live="polite"><span aria-hidden="true"><CircleAlert size={16}/></span><p><BilingualText>{message}</BilingualText></p><button type="button" onClick={onClose} aria-label="Đóng thông báo"><X size={16}/></button></div>;
}
