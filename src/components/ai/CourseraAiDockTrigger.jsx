import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAiSidebar } from '@/contexts/AiSidebarContext';

export function CourseraAiDockTrigger() {
  const { isEligible, isOpen, openAiSidebar } = useAiSidebar();
  const { i18n } = useTranslation();
  const isVi = (i18n.resolvedLanguage || i18n.language || 'en').startsWith('vi');

  if (!isEligible || isOpen) return null;

  return (
    <button
      type="button"
      className="coursera-ai-dock-trigger"
      onClick={() => openAiSidebar()}
      title={isVi ? 'Mở Trợ lý AI Hola' : 'Open Hola AI Coach'}
      aria-label={isVi ? 'Mở Trợ lý AI Hola' : 'Open Hola AI Coach'}
    >
      <Sparkles size={16} aria-hidden="true" />
      <span>{isVi ? 'Trợ lý AI' : 'AI Coach'}</span>
    </button>
  );
}
