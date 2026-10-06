export function LayoutToast({ message, onClose }) {
  if (!message) return null;
  return <div className="layout-toast" role="alert" aria-live="polite"><span aria-hidden="true">!</span><p>{message}</p><button type="button" onClick={onClose} aria-label="Đóng thông báo">×</button></div>;
}
