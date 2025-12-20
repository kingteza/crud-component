import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import CrudComponentProvider from "./context/CrudComponentProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CrudComponentProvider>
      <App />
    </CrudComponentProvider>
  </StrictMode>
);
