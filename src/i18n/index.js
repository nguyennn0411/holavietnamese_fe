import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { resources } from './locales/resources';

const LANGUAGE_STORAGE_KEY = 'hola:ui-language';

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      supportedLngs: ['en', 'vi'],
      fallbackLng: 'en',
      defaultNS: 'common',
      ns: ['common', 'navigation', 'home', 'learner'],
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage'],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
        caches: ['localStorage'],
      },
      react: { useSuspense: false },
      returnNull: false,
    });
}

const syncDocumentLanguage = (language) => {
  if (typeof document !== 'undefined') document.documentElement.lang = language?.startsWith('vi') ? 'vi' : 'en';
};
syncDocumentLanguage(i18n.resolvedLanguage || i18n.language || 'en');
i18n.on('languageChanged', syncDocumentLanguage);

export { LANGUAGE_STORAGE_KEY };
export default i18n;
