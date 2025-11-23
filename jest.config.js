module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main/index.js',
    '!src/preload/index.js',
    '!src/renderer/**/*.js',
    '!src/main/windows/*.js',
    '!src/main/ipc/*.js'
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js'],
  transform: {},
  testTimeout: 10000
};
