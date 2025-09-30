/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  rootDir: ".",

  // Treat TS/TSX as ESM (matches your server style)
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],

  // Use SWC to compile TS/JS for tests
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: { syntax: "typescript", tsx: true },
          transform: { react: { runtime: "automatic" } },
        },
        module: { type: "es6" },
      },
    ],
  },

  // Make ESM-style TS imports that use ".js" work in Jest
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",

    // TS path aliases -> source (or point to ../../shared/dist if you prefer built output)
    "^@app/shared$": "<rootDir>/../../shared/src/index.ts",
    "^@app/shared/(.*)$": "<rootDir>/../../shared/src/$1",

    // Mocks for CSS & static assets (we'll add these files next)
    "^.+\\.module\\.(css|scss|sass)$":
      "<rootDir>/tests/__mocks__/styleModuleMock.js",
    "^.+\\.(css|scss|sass)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "^.+\\.(svg|png|jpg|jpeg|gif|webp|avif|ico)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testMatch: [
    "<rootDir>/src/**/*.(spec|test).[tj]s?(x)",
    "<rootDir>/tests/**/*.(spec|test).[tj]s?(x)",
  ],
  verbose: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx,js,jsx}",
    "!<rootDir>/src/main.tsx",
    "!<rootDir>/src/**/*.d.ts",
    "!<rootDir>/src/api/items.api.ts"
  ],
};
