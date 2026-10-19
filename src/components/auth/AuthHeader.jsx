import { Link } from 'react-router-dom';
import { Brand } from '@/components/layout/Brand';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Brand />
      <LanguageSwitcher />
    </header>
  );
}
