module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  testMatch: ['**/src/tests/**/*.test.jsx'],
  moduleNameMapper: { '\\.(css|less|scss)$': '<rootDir>/src/tests/styleMock.cjs' },
  clearMocks: true
};
