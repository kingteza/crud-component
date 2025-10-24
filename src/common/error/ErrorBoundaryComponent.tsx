
import { FC, PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }) {
  console.error(error);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export const ErrorBoundaryComponent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      {children}
    </ErrorBoundary>
  );
};