/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCrudNavigateRegister,
  type CrudNavigateFn,
} from "../context/CrudNavigateContext";

/**
 * Registers React Router’s `useNavigate` with {@link CrudComponentProvider}.
 * Render once inside your `<Router>` (e.g. inside `<BrowserRouter>`), as a descendant of `CrudComponentProvider`.
 *
 * @example
 * ```tsx
 * import { CrudComponentProvider } from "@kingteza/crud-component";
 * import { CrudReactRouterNavigateSync } from "@kingteza/crud-component/react-router";
 *
 * <CrudComponentProvider>
 *   <BrowserRouter>
 *     <CrudReactRouterNavigateSync />
 *     <App />
 *   </BrowserRouter>
 * </CrudComponentProvider>
 * ```
 */
export function CrudReactRouterNavigateSync() {
  const navigate = useNavigate();
  const register = useCrudNavigateRegister();

  useLayoutEffect(() => {
    register(navigate as CrudNavigateFn);
    return () => register(undefined);
  }, [navigate, register]);

  return null;
}
