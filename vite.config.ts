import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { resolve } from "path-browserify";

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
        dir: "dist",
        preserveModules: true,
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
