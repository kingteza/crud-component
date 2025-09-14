import { useInRouterContext, useNavigate } from "react-router-dom";

export function useNavigateOptional() {
  if (!useInRouterContext()) {
    return ((to: string | number) => {
      console.warn("React router not found, navigating to", to);
    }) as ReturnType<typeof useNavigate>;
  }
  return useNavigate();
}
