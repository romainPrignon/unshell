---
applyTo: "spec/**/*.ts"
---

# Testing conventions for unshell

## Framework

Tests use **Jest** with **ts-jest** (see `jest.config.js`). Run the suite with:

```sh
npm test
# or with coverage
npm run test:coverage
```

## File naming and location

| Layer | Location | Pattern |
|-------|----------|---------|
| Integration (spec) | `spec/` | `<scenarioName>.spec.ts` |
| Unit (co-located) | `src/**` | `<module>.test.ts` |
| Examples | `examples/` | separate jest config |

## Three-layer test structure

Each behavior scenario in `spec/` must cover three layers:

```ts
describe('<scenarioName>', () => {
  // Layer 1: direct engine call
  describe('unshell', () => {
    it('should ...', async () => { ... })
  })

  // Layer 2: CLI function call with synthetic argv
  describe('cli', () => {
    it('should ... from cli', async () => { ... })
  })

  // Layer 3: real subprocess via exec
  describe('e2e', () => {
    it('should ... from e2e', (done) => { ... })
  })
})
```

## Setup and teardown

Always suppress console output in every spec file:

```ts
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})
```

## Assertions

- Use `toHaveBeenNthCalledWith(n, ...)` to assert ordered `console.log` calls (command echo + output echo).
- Prefix command echo: `• <cmd>`.
- Prefix output echo: `➜ <stdout>` (stdout includes trailing newline from shell).
- For e2e tests, assert the full combined stdout string.

## Fixture scripts

Fixture scripts referenced by `cli` and `e2e` layers live in `fixtures/scripts/`. They must be plain CommonJS generator files:

```js
// fixtures/scripts/myScenario.js
module.exports = function* myScenario() {
  yield 'echo hello'
}
```

## Example: minimal spec

```ts
import { unshell } from '../src/unshell'
import { cli } from '../src/cli'

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})
afterEach(() => { jest.restoreAllMocks() })

describe('yieldSingleCommand', () => {
  describe('unshell', () => {
    it('should exec a single yielded command', async () => {
      const script = function* () { yield 'echo hi' }
      await unshell({ env: {} })(script)
      expect(console.log).toHaveBeenNthCalledWith(1, '• echo hi')
      expect(console.log).toHaveBeenNthCalledWith(2, '➜ hi\n')
    })
  })
})
```
