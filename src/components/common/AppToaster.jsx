import { Toaster } from 'sonner';

export default function AppToaster() {
  return <Toaster position="top-right" richColors closeButton duration={4200} toastOptions={{ className: 'hola-toast' }} />;
}

