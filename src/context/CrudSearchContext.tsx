import { createContext, useContext, useMemo } from "react";

type SearchFn = () => void;

export const CrudSearchContext = createContext<{
  search: SearchFn;
} | null>(null);

export const useCrudSearchContext = () => {
  const context = useContext(CrudSearchContext);

  return context;
};

export const CrudSearchContextProvider = ({
  children,
  search,
}: {
  children: React.ReactNode;
  search: SearchFn;
}) => {
  const props = useMemo(() => ({ search }), [search]);
  return (
    <CrudSearchContext.Provider value={props}>
      {children}
    </CrudSearchContext.Provider>
  );
};
