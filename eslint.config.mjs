import js from "@eslint/js";
import tseslint from "typescript-eslint"; // meta package: provides parser, plugin, and flat presets
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import tailwindcss from "eslint-plugin-tailwindcss";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // 0) Ignores (replaces .eslintignore)
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      ".next/**",
      "out/**",
      "**/*.{test,spec}.{ts,tsx,js,jsx}",
      "**/__tests__/**",
      "**/setupTests.ts",
      "**/src/utils/errors.ts"
    ],
  },

  // Global linter options
  {
    linterOptions: { reportUnusedDisableDirectives: true },
  },

  // Base JS recommendations
  js.configs.recommended,

  // TypeScript base recommendations (flat presets from the meta package)
  ...tseslint.configs.recommended,

  // Web (React) — type-aware
  {
    files: ["apps/web/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      tailwindcss,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off",
      "no-undef": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "import/order": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": ["warn", { fixToUnknown: true, ignoreRestArgs: true }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    settings: {
      "import/resolver": {
        node: true,
      },
    },
  },

  // Shared workspace (plain TS)
  {
    files: ["shared/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
      globals: { ...globals.es2021 },
    },
    plugins: { "@typescript-eslint": tseslint.plugin, import: importPlugin },
    rules: {
      "import/order": ["warn", { "newlines-between": "always" }],
      "@typescript-eslint/no-explicit-any": ["warn", { fixToUnknown: true, ignoreRestArgs: true }],
    },
    settings: {
      "import/resolver": {
        node: true,
      },
    },
  },

  // Server (Node) — type-aware
  {
    files: ["apps/server/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        allowDefaultProject: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
    },
    rules: {
      "import/order": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
    settings: {
      "import/resolver": {
        node: true,
      },
    },
  },

  // 5) Jest test files (both apps)
  {
    files: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": ["warn", { fixToUnknown: true, ignoreRestArgs: true }],
    },
  },

  // 6) Node config files (webpack/babel/jest/tailwind/postcss) — allow require + Node globals
  {
    files: [
      "**/webpack.*.cjs",
      "**/*.config.{js,cjs,ts}",
      "**/jest.config.{js,cjs}",
      "**/babel.config.{js,cjs}",
      "**/tailwind.config.{ts,js,cjs}",
      "**/postcss.config.{ts,js,cjs}",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },

  // 7) Prettier last to disable conflicting stylistic rules
  prettier,
];
