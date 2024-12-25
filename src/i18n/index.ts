import { TRANSLATION_NAMESPACE } from 'i18n/hooks/useLibTranslation';
import en from './locale/en';

export const defaultTranslations = {
  en: {
    [TRANSLATION_NAMESPACE]: en
  }
};

export type LibTranslations = typeof en; 