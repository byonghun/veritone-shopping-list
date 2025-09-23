import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  // Tell Jest to transpile TS using ts-jest in ESM mode
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { useESM: true, tsconfig: "tsconfig.jest.json" },
    ],
  },
  // Treat TypeScript files as ESM
  extensionsToTreatAsEsm: [".ts"],
  // If your source imports local files with ".js" suffix (ESM-friendly),
  // map them back to extensionless paths for ts-jest at test time.
  moduleNameMapper: {
    // 👇 mock nanoid (ESM-only) for tests
    "^nanoid$": "<rootDir>/tests/test-utils/__mocks__/nanoid.ts",
  },
  // Add global test setup files
  setupFilesAfterEnv: ["<rootDir>/tests/test-utils/setupEnv.ts"],
  // Find test files here
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  // Show a bit more detail; harmless to keep on
  verbose: true,
  // Optional coverage (we’ll use later)
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,tsx}",
    "!<rootDir>/src/server.ts",
    "!<rootDir>/src/db/prisma.ts",
  ],
};

export default config;
