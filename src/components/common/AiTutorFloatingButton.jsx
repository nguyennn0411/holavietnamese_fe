import { bilingualLabel } from '@/components/common/BilingualText';
import { Link } from 'react-router-dom';

export function AiTutorFloatingButton() {
  return (
    <Link
      to="/ai-tutor"
      className="ai-tutor-fab"
      aria-label={bilingualLabel("Mở AI Tutor", "Open AI Tutor")}
      title={bilingualLabel("Mở AI Tutor", "Open AI Tutor")}
    >
      <img src="/design/hola-ai-mascot.png" alt="" aria-hidden="true" />
      <span className="ai-tutor-fab__label">AI Tutor</span>
    </Link>
  );
}
