import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFiles: ["./jest.env.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "./src/$1",
  },
};

export default config;
