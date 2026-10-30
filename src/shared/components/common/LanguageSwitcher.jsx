import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ compact = false, className = '' }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('vi') ? 'vi' : 'en';
  const changeLanguage = (next) => {
    if (next !== language) i18n.changeLanguage(next);
  };

  return (
    <div
      className={`language-switcher ${compact ? 'is-compact' : ''} ${className}`.trim()}
      role="group"
      aria-label={language === 'vi' ? 'Chọn ngôn ngữ giao diện' : 'Choose interface language'}
    >
      <button
        type="button"
        className={`secondary ${language === 'en' ? 'is-active' : ''}`}
        aria-pressed={language === 'en'}
        onClick={() => changeLanguage('en')}
        title="English"
        style={language === 'en' ? {
          background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
          color: '#ffffff',
          borderColor: 'transparent',
          boxShadow: '0 4px 10px rgba(234, 88, 12, 0.28)',
          cursor: 'default',
        } : undefined}
      >
        <span aria-hidden="true">🇬🇧</span>
        <b>EN</b>
      </button>
      <button
        type="button"
        className={`secondary ${language === 'vi' ? 'is-active' : ''}`}
        aria-pressed={language === 'vi'}
        onClick={() => changeLanguage('vi')}
        title="Tiếng Việt"
        style={language === 'vi' ? {
          background: 'linear-gradient(135deg, #ff7a00 0%, #ea580c 100%)',
          color: '#ffffff',
          borderColor: 'transparent',
          boxShadow: '0 4px 10px rgba(234, 88, 12, 0.28)',
          cursor: 'default',
        } : undefined}
      >
        <span aria-hidden="true">🇻🇳</span>
        <b>VI</b>
      </button>
    </div>
  );
}

export default LanguageSwitcher;
