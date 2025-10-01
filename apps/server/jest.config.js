/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  rootDir: ".",
  // Treat TS as ESM
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  // Use SWC to compile TS/JS for tests
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2022",
          parser: { syntax: "typescript", tsx: false },
        },
        module: { type: "es6" },
      },
    ],
  },
  // Make ESM-style TS imports that use ".js" work in Jest
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    // Map your TS path aliases so Jest can resolve them
    "^@app/shared$": "<rootDir>/../../shared/src/index.ts",
    "^@app/shared/(.*)$": "<rootDir>/../../shared/src/$1",
    // Note: mock custom nanoid for tests
    "^nanoid$": "<rootDir>/tests/test-utils/__mocks__/nanoid.ts",
  },
  // Test setup
  setupFilesAfterEnv: ["<rootDir>/tests/test-utils/setupEnv.ts"],
  // Spec discovery
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  verbose: true,
  // Coverage (tweak as needed)
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/server.ts",
    "!<rootDir>/src/db/prisma.ts",
  ],
};
