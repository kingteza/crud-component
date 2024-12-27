import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";
import en from "./translations/en";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultTranslations = {
  en: {
    [TRANSLATION_NAMESPACE]: en,
  },
};

export type LibTranslations = typeof en;

export interface SetupI18nOptions {
  translations?: Record<string, { [TRANSLATION_NAMESPACE]: LibTranslations }>;
  language?: string;
  i18nInstance?: typeof i18n;
}

export const setupI18n = (options: SetupI18nOptions = {}) => {
  const { translations = defaultTranslations, language = "en", i18nInstance } = options;
  // Use provided i18n instance or create new one
  const i18nToUse = i18nInstance || i18n;
  if (!i18nToUse.isInitialized) {
    i18nToUse.use(initReactI18next).init({
      resources: translations,
      lng: language,
      fallbackLng: "en",
      ns: TRANSLATION_NAMESPACE,
      interpolation: {
        escapeValue: false,
      },
    });
  } else {
    Object.entries(translations).forEach(([lang, namespaces]) => {
      Object.entries(namespaces).forEach(([ns, resources]) => {
        i18n.addResourceBundle(lang, ns, resources, true, true);
      });
    });
  }

  return i18n;
};

// Add this function to update translations at runtime
export const updateTranslations = (
  language: string,
  translations: Record<string, any>,
  i18nInstance?: typeof i18n
) => {
  const i18nToUse = i18nInstance || i18n;
  i18nToUse.addResourceBundle(
    language,
    TRANSLATION_NAMESPACE,
    translations,
    true,
    true
  );
};
