import { useMemo } from "react";
import { useCrudNavigateFromContext } from "../context/CrudNavigateContext";
import type { CrudNavigateFn } from "../context/CrudNavigateContext";

const warnNavigate: CrudNavigateFn = (to, options) => {
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    console.warn(
      "[@kingteza/crud-component] No navigator configured. Pass `navigate` to CrudComponentProvider, " +
        "or render CrudReactRouterNavigateSync / CrudNextNavigateSync from the optional entry points. " +
        "Attempted navigation:",
      to,
      options
    );
  }
};

/**
 * Returns `navigate` from `CrudComponentProvider` (prop or optional sync modules).
 * Falls back to a no-op that warns in development when nothing is configured.
 */
export function useNavigateOptional(): CrudNavigateFn {
  const fromContext = useCrudNavigateFromContext();
  return useMemo(() => fromContext ?? warnNavigate, [fromContext]);
}
