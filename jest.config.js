module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/src/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      functions: 100,
      lines: 100,
      branches: 100,
      statements: 100,
    }
  }
}
