import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ compact = false, className = '' }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('vi') ? 'vi' : 'en';
  const changeLanguage = (next) => {
    if (next !== language) i18n.changeLanguage(next);
  };

  return <div className={`language-switcher ${compact ? 'is-compact' : ''} ${className}`.trim()} role="group" aria-label={language === 'vi' ? 'Chọn ngôn ngữ giao diện' : 'Choose interface language'}>
    <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => changeLanguage('en')} title="English"><span aria-hidden="true">🇬🇧</span><b>EN</b></button>
    <button type="button" className={language === 'vi' ? 'is-active' : ''} aria-pressed={language === 'vi'} onClick={() => changeLanguage('vi')} title="Tiếng Việt"><span aria-hidden="true">🇻🇳</span><b>VI</b></button>
  </div>;
}

export default LanguageSwitcher;
