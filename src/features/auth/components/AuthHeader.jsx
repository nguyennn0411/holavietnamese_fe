import { Link } from 'react-router-dom';
import { Brand } from '@/shared/components/layout/Brand';
import { LanguageSwitcher } from '@/shared/components/common/LanguageSwitcher';

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Brand />
      <LanguageSwitcher />
    </header>
  );
}
