// Import CSS to ensure it's bundled
import "./index.css";

export { TRANSLATION_NAMESPACE } from "./locale/hooks/translation-constants";

export { setupI18n, updateTranslations } from "./locale";
export { CrudComponentProvider, type CrudComponentProviderProps } from "./context";
export * from "./crud";
export type * from "./crud";
