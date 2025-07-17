import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/*.{ts,mts,cts}"],
    plugins: { '@typescript-eslint': tseslint.plugin },
    extends: ["plugin:@typescript-eslint/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: './tsconfig.json' },
      globals: globals.node,
    },
  },
]);
