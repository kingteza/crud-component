import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "common/index": resolve(__dirname, "src/components/common/index.ts"),
        "util/index": resolve(__dirname, "src/util/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "antd"],
      output: {
        preserveModules: true,
      },
    },
  },

  plugins: [
    tsconfigPaths(),
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
      compilerOptions: {
        declarationDir: "./dist",
        declaration: true,
        emitDeclarationOnly: true,
      },
      pathsToAliases: false,
      copyDtsFiles: true,
    }),
  ] as any,
});
