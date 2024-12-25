import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TRANSLATION_NAMESPACE } from './hooks/useLibTranslation';

// Your existing translations
const resources = {
  en: {
    translation: {
      // Your app translations
      welcome: 'Welcome',
      // ...
    },
    [TRANSLATION_NAMESPACE]: {
      button: {
        delete: 'Remove Item',
        clone: 'Make Copy'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 