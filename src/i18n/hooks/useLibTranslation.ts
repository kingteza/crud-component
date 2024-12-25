import { useTranslation } from 'react-i18next';

export const TRANSLATION_NAMESPACE = 'crud-component';

export function useLibTranslation() {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  return { t };
} 