import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultTranslations } from './index';
import { TRANSLATION_NAMESPACE } from './hooks/useLibTranslation';

export interface SetupI18nOptions {
  translations?: typeof defaultTranslations;
  language?: string;
}

export const setupI18n = (options: SetupI18nOptions = {}) => {
  const {
    translations = defaultTranslations,
    language = 'en'
  } = options;

  i18n
    .use(initReactI18next)
    .init({
      resources: translations,
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });

  return i18n;
};

// Add this function to update translations at runtime
export const updateTranslations = (
  language: string,
  translations: Record<string, any>
) => {
  i18n.addResourceBundle(
    language,
    TRANSLATION_NAMESPACE,
    translations,
    true,
    true
  );
}; 