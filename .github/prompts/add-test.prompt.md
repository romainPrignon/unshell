---
description: Add or complete tests for an existing unshell feature or script
mode: ask
---

Add tests for the following feature or source file:

> ${input:targetFileOrFeature}

## Requirements

1. Locate the relevant source file(s) in `src/` or fixture(s) in `fixtures/scripts/`.
2. If a fixture does not exist yet, create `fixtures/scripts/<name>.js` (plain CommonJS generator).
3. Create or update the spec file in `spec/<name>.spec.ts`.

## Test layers to cover

For each significant behavior, write tests at all three layers:

### Layer 1 — `unshell` (engine unit test)
```ts
it('should ...', async () => {
  const script = function* () { yield 'echo ...' }
  await unshell({ env: {} })(script)
  expect(console.log).toHaveBeenNthCalledWith(1, '• echo ...')
  expect(console.log).toHaveBeenNthCalledWith(2, '➜ ...\n')
})
```

### Layer 2 — `cli` (CLI function test)
```ts
it('should ... from cli', async () => {
  await cli({ argv: ['node', 'unshell', 'run', '<fixturePath>'], env: {} })
  expect(console.log).toHaveBeenNthCalledWith(1, '• echo ...')
})
```

### Layer 3 — `e2e` (subprocess test)
```ts
it('should ... from e2e', (done) => {
  exec(`ts-node src/cli.ts run <fixturePath>`, (_, stdout) => {
    expect(stdout).toEqual('...')
    done()
  })
})
```

## Setup boilerplate

Include at the top of every spec file:
```ts
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})
afterEach(() => { jest.restoreAllMocks() })
```

## Quality gate

After generating tests, verify them by running:
```sh
npm test
```

All tests must pass before the work is complete.
