module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/src/**/*.test.ts',
    '**/spec/**/*.spec.ts',
  ],
  coverageThreshold: {
    global: {
      functions: 100,
      lines: 100,
      branches: 100,
      statements: 100,
    }
  },
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
  ]
}
