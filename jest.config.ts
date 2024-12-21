import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^services/(.*)$': '<rootDir>/src/services/$1',
    '^interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^dtos/(.*)$': '<rootDir>/src/dtos/$1'
  },
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
};

export default config;