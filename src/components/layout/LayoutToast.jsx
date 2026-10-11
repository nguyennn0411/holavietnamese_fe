import { BilingualText } from '@/components/common/BilingualText';
export function LayoutToast({ message, onClose }) {
  if (!message) return null;
  return <div className="layout-toast" role="alert" aria-live="polite"><span aria-hidden="true">!</span><p><BilingualText>{message}</BilingualText></p><button type="button" onClick={onClose} aria-label="Đóng thông báo">×</button></div>;
}
