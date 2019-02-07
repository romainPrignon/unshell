module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/src/**/*.test.ts'
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
