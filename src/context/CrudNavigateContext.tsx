/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Matches common `useNavigate()` / App Router usage used by this library. */
export type CrudNavigateFn = (
  to: string | number | Record<string, unknown>,
  options?: { replace?: boolean; state?: unknown }
) => void;

type RegisterNavigateFn = (navigate: CrudNavigateFn | undefined) => void;

const CrudNavigateContext = createContext<CrudNavigateFn | undefined>(
  undefined
);

const CrudNavigateRegisterContext = createContext<RegisterNavigateFn>(() => {});

export function CrudNavigateProvider({
  children,
  navigate: injectedNavigate,
}: {
  readonly children: ReactNode;
  readonly navigate?: CrudNavigateFn;
}) {
  const [routerNavigate, setRouterNavigate] = useState<
    CrudNavigateFn | undefined
  >();

  const register = useCallback<RegisterNavigateFn>((navigate) => {
    setRouterNavigate(navigate);
  }, []);

  const navigate = useMemo(
    () => injectedNavigate ?? routerNavigate,
    [injectedNavigate, routerNavigate]
  );

  return (
    <CrudNavigateRegisterContext.Provider value={register}>
      <CrudNavigateContext.Provider value={navigate}>
        {children}
      </CrudNavigateContext.Provider>
    </CrudNavigateRegisterContext.Provider>
  );
}

export function useCrudNavigateFromContext(): CrudNavigateFn | undefined {
  return useContext(CrudNavigateContext);
}

export function useCrudNavigateRegister(): RegisterNavigateFn {
  return useContext(CrudNavigateRegisterContext);
}
