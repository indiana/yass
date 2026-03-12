
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/", "legacy/", "node_modules/", "public/", "vite.config.js", "eslint.config.js"]
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  }
];
