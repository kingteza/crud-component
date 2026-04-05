/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import React, {
  useEffect,
  useRef,
  ReactNode,
  createContext,
  useMemo,
} from "react";
import { setupI18n, SetupI18nOptions } from "../locale";
import {
  CrudNavigateProvider,
  type CrudNavigateFn,
} from "./CrudNavigateContext";

export interface CrudComponentProviderProps {
  children: ReactNode;
  /**
   * i18n configuration options
   * If not provided, defaults will be used
   */
  i18nOptions?: SetupI18nOptions;

  /**
   * Hints which router you use (docs / future use). Wire navigation with `navigate` and/or optional sync modules:
   * - `react-router`: `@kingteza/crud-component/react-router` exports `CrudReactRouterNavigateSync`, or pass `navigate` from `useNavigate()`.
   * - `nextjs`: `@kingteza/crud-component/next` exports `CrudNextNavigateSync`, or pass a `navigate` wrapper around `useRouter()`.
   *
   * @default "react-router"
   */
  navigatorType?: "react-router" | "nextjs";

  /**
   * Imperative navigation for `useNavigateOptional` (e.g. `Button` with `to`). If omitted, use the optional
   * `react-router` or `next` package entry sync components.
   */
  navigate?: CrudNavigateFn;
}

/**
 * Provider component that initializes the CRUD component library.
 * Wrap your app with this provider to automatically set up i18n.
 *
 * @example
 * ```tsx
 * import { CrudComponentProvider } from '@kingteza/crud-component';
 *
 * function App() {
 *   return (
 *     <CrudComponentProvider>
 *       <YourApp />
 *     </CrudComponentProvider>
 *   );
 * }
 * ```
 *
 * @example With custom i18n options
 * ```tsx
 * <CrudComponentProvider
 *   i18nOptions={{
 *     language: 'en',
 *     translations: {
 *       en: {
 *         'crud-component': {
 *           // your translations
 *         }
 *       }
 *     }
 *   }}
 * >
 *   <YourApp />
 * </CrudComponentProvider>
 * ```
 */

const Context = createContext<{}>({});

export const CrudComponentProvider: React.FC<CrudComponentProviderProps> = ({
  children,
  i18nOptions,
  navigatorType = "react-router",
  navigate,
}) => {
  // Initialize i18n synchronously before first render
  // This ensures i18nInstance is set before any hooks are called
  const isInitialized = useRef(false);

  React.useMemo(() => {
    if (!isInitialized.current) {
      setupI18n(i18nOptions || {});
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Update translations if options change (skip initial mount since useMemo handles it)
    if (isInitialized.current && i18nOptions) {
      setupI18n(i18nOptions);
    }
  }, [i18nOptions?.language]);

  const contextValue = useMemo(
    () => ({ navigatorType } as const),
    [navigatorType]
  );

  return (
    <CrudNavigateProvider navigate={navigate}>
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </CrudNavigateProvider>
  );
};

export default CrudComponentProvider;
