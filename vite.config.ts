import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        "common/index": resolve(__dirname, "src/common/index.ts"),
        "util/index": resolve(__dirname, "src/util/index.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "antd",
        "i18next",
        "react-i18next",
        "dayjs",
        "dayjs/plugin/advancedFormat",
        "dayjs/plugin/customParseFormat",
        "dayjs/plugin/localeData",
        "dayjs/plugin/weekday",
        "dayjs/plugin/weekOfYear",
        "dayjs/plugin/weekYear",
        "@ant-design/icons",
        "react-highlight-words",
        "react-responsive",
        "react-router",
        "react-router-dom",
        "uuid",
        "file-saver",
        "mime",
        "papaparse",
        "path-browserify",
        "@dnd-kit/core", // For drag & drop
        "@dnd-kit/sortable", // For sortable lists
        "@dnd-kit/utilities", // For DnD utilities
        "@dnd-kit/modifiers",
        "browser-image-compression",
        "react-advanced-cropper",
        "@iconify/react",
        "react-quill",
        /^antd\/.*/,
        /^@ant-design\/.*/,
        /^dayjs\/.*/,
      ],
      output: {
        entryFileNames: ({ name }) => {
          return `${name}.[format].js`;
        },
        assetFileNames: (assetInfo) => {
          // Extract all CSS into a single file named style.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return "style.css";
          }
          return assetInfo.name || "assets/[name].[ext]";
        },
        preserveModules: true,
        preserveModulesRoot: "src",
        dir: "dist",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsx",
          antd: "antd",
          dayjs: "dayjs",
          "dayjs/plugin/advancedFormat": "dayjsAdvancedFormat",
          "dayjs/plugin/customParseFormat": "dayjsCustomParseFormat",
          "dayjs/plugin/localeData": "dayjsLocaleData",
          "dayjs/plugin/weekday": "dayjsWeekday",
          "dayjs/plugin/weekOfYear": "dayjsWeekOfYear",
          "dayjs/plugin/weekYear": "dayjsWeekYear",
          i18next: "i18next",
          "react-i18next": "reactI18next",
          "react-quill": "ReactQuill",
          "browser-image-compression": "browserImageCompression",
        },
      },
    },
  },

  plugins: [
    tsconfigPaths(),
    react({}),
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
  ],
});
