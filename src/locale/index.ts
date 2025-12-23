import { TRANSLATION_NAMESPACE } from "../locale/hooks/translation-constants";
import en from "./translations/en";
import i18n, { i18n as i18nType } from "i18next";
import { initReactI18next, useTranslation, UseTranslationOptions } from "react-i18next";

export const defaultTranslations = {
  en: {
    [TRANSLATION_NAMESPACE]: en,
  },
};

export type LibTranslations = typeof en;

export interface SetupI18nOptions {
  translations?: Record<string, { [TRANSLATION_NAMESPACE]: LibTranslations }>;
  language?: string;
  i18nInstance?: i18nType;
}
export let i18nInstance: i18nType = i18n;

export const setupI18n = (options: SetupI18nOptions = {}) => {
  const {
    translations = defaultTranslations,
    language = "en",
    i18nInstance: i18nInstanceToUse,
  } = options;
  // Use provided i18n instance or create new one
  const i18nToUse = i18nInstanceToUse || i18n;
  i18nInstance = i18nToUse;
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
        i18nToUse.addResourceBundle(lang, ns, resources, true, true);
      });
    });
  }

  return i18n;
};

// Add this function to update translations at runtime
export const updateTranslations = (
  language: string,
  translations: Record<string, any>,
  i18nInstance?: i18nType
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

export const useTranslationLib = (options?: Omit<UseTranslationOptions<string>, "i18n">) => {
  if (!i18nInstance.isInitialized) {
    // Initialize with defaults if not already done
    if (!i18nInstance.isInitialized) {
      i18nInstance.use(initReactI18next).init({
        resources: defaultTranslations,
        lng: "en",
        fallbackLng: "en",
        ns: TRANSLATION_NAMESPACE,
        interpolation: { escapeValue: false },
      });
    }
  }
  return useTranslation(TRANSLATION_NAMESPACE, { ...options, i18n: i18nInstance });
};

export const useTranslationLibNoNS = (options?: Omit<UseTranslationOptions<string>, "i18n">) => {

  return useTranslation(undefined, { ...options, i18n: i18nInstance });
};

export const t = (key: string, options?: any) => {
  return i18nInstance?.t(key, {
    ns: TRANSLATION_NAMESPACE,
    ...options,
  });
};


export const tWithOrWithoutNS = (key: string, options?: any, fallback?: string) => {
  const value = t(key, options);
  if (value && key && value !== key) {
    return value;
  }
  if(fallback) {
    return fallback;
  }
  return i18nInstance?.t(key, {
    ns: undefined,
    ...options,
  });
};
