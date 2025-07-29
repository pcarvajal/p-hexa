const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: { ...tsJestTransformCfg },
  moduleNameMapper: {
    '^@apps/(.*)$': '<rootDir>/src/apps/$1',
    '^@gateway/(.*)$': '<rootDir>/src/gateway/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
  },
};
