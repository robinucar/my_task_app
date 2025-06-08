import type { Config } from 'jest';

const config: Config = {
  displayName: 'backend-integration',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/apps/backend/__integration-tests__/**/*.integration*.{ts,js}'],
  setupFilesAfterEnv: ['<rootDir>/apps/backend/__integration-tests__/setup-integration.ts'],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/apps/backend/tsconfig.spec.json',
      },
    ],
  },
};

export default config;
