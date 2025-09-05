import { useInRouterContext, useNavigate } from "react-router-dom";

export function useNavigateOptional() {
  if (!useInRouterContext()) {
    return undefined;
  }
  return useNavigate();
}