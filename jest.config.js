// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: '<rootDir>/__tests__/coverage',
  testMatch: ['<rootDir>__tests__/**/*.spec.[jt]s'],
};
