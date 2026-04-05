/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
"use client";

import React, { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCrudNavigateRegister,
  type CrudNavigateFn,
} from "../context/CrudNavigateContext";

function pathFromTo(to: string | Record<string, unknown>): string {
  if (typeof to === "string") {
    return to;
  }
  if ("pathname" in to && typeof to.pathname === "string") {
    return to.pathname;
  }
  return "/";
}

/**
 * Registers Next.js App Router navigation with {@link CrudComponentProvider}.
 * Use in a client component, inside `CrudComponentProvider`, instead of installing `react-router-dom`.
 *
 * @example
 * ```tsx
 * import { CrudComponentProvider } from "@kingteza/crud-component";
 * import { CrudNextNavigateSync } from "@kingteza/crud-component/next";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <CrudComponentProvider navigatorType="nextjs">
 *       <CrudNextNavigateSync />
 *       {children}
 *     </CrudComponentProvider>
 *   );
 * }
 * ```
 */
export function CrudNextNavigateSync() {
  const router = useRouter();
  const register = useCrudNavigateRegister();

  useLayoutEffect(() => {
    const navigate: CrudNavigateFn = (to, options) => {
      if (typeof to === "number") {
        if (to < 0) {
          router.back();
        } else if (to > 0 && typeof router.forward === "function") {
          router.forward();
        }
        return;
      }
      const path = pathFromTo(to as string | Record<string, unknown>);
      if (options?.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    };
    register(navigate);
    return () => register(undefined);
  }, [register, router]);

  return null;
}
