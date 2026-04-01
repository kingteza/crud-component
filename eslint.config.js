import tseslint from "typescript-eslint";

/**
 * Keeps lint focused: forbid `src/...` imports so emitted .d.ts and consumers stay valid.
 * Stricter typescript-eslint / react rules can be enabled incrementally.
 */
export default [
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["src", "src/**"],
              message:
                "Do not import from 'src/...'. Use relative paths (e.g. ../util/...) so emitted .d.ts resolves in the published package.",
            },
          ],
        },
      ],
    },
  },
];
