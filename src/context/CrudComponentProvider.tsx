/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import React, { useEffect, ReactNode, createContext } from "react";
import { setupI18n, SetupI18nOptions } from "../locale";

export interface CrudComponentProviderProps {
  children: ReactNode;
  /**
   * i18n configuration options
   * If not provided, defaults will be used
   */
  i18nOptions?: SetupI18nOptions;
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
}) => {
  useEffect(() => {
    // Initialize i18n when provider mounts
    setupI18n(i18nOptions || {});
  }, []); // Only run once on mount

  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export default CrudComponentProvider;
