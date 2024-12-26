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
  translations?: typeof defaultTranslations;
  language?: string;
}

export const setupI18n = (options: SetupI18nOptions = {}) => {
  const { translations = defaultTranslations, language = "en" } = options;

  i18n.use(initReactI18next).init({
    resources: translations,
    lng: language,
    fallbackLng: "en",
    ns: TRANSLATION_NAMESPACE,
    interpolation: {
      escapeValue: false,
    },
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
