# GitHub Copilot Instructions — unshell

## Project overview

**unshell** is a zero-dependency TypeScript/Node.js library that lets developers write shell scripts as generator functions, gaining the full power of a programming language while keeping the simplicity of shell commands.

- Source code lives in `src/` and is compiled to `dist/` via `tsc`.
- Tests live in `spec/` (integration) and alongside source files (`*.test.ts`).
- The public API is `unshell(options)(script, ...args)` — an `Engine` that iterates a generator and executes each yielded string as a shell command via `child_process.exec`.
- Type definitions are in `type/index.d.ts`.
- Fixtures (plain JS test scripts) live in `fixtures/scripts/`.

## Architecture

```
src/
  unshell.ts    — core Engine / Interpretor (generator runner)
  cli.ts        — CLI entry point (unshell run <script>)
  utils/
    colors.ts   — ANSI color helpers
    pipe.ts     — functional pipe helper
type/
  index.d.ts    — exported public types (Options, Script, Engine, Command, Args)
spec/
  *.spec.ts     — integration tests covering unshell + cli + e2e
fixtures/
  scripts/      — plain JS generator scripts used by spec tests
```

## Coding conventions

- **Language**: TypeScript with `strict: true`, `noImplicitReturns: true`. Never use `any` unless bridging unavoidable dynamic interop.
- **Modules**: CommonJS (`"module": "commonjs"`). Use `import`/`export`, not `require()` in source (only fixtures use `module.exports`).
- **Style**: Follow the existing `tslint-config-standard` + `tslint-immutable` rules. Run `npm run lint` before committing.
- **Async**: Prefer `async/await`. Use `util.promisify` when wrapping callback APIs (see `unshell.ts`).
- **Generators**: unshell scripts are `GeneratorFunction` or `AsyncGeneratorFunction` — always validate with `assertUnshellScript` before running.
- **Error handling**: Catch errors close to their source, log structured objects (`{ cmd, stderr }`), then rethrow. Do not swallow errors.
- **No dependencies**: Keep `dependencies: {}`. Only add `devDependencies` for tooling.

## Testing patterns

- Tests use **Jest** with **ts-jest**. Config is in `jest.config.js`.
- Each spec file covers a single behavior scenario (e.g., `yieldEmptyCommand.spec.ts`).
- Three layers per scenario:
  1. `unshell` — unit test calling the engine directly.
  2. `cli` — test calling the `cli()` function with synthetic argv.
  3. `e2e` — subprocess test using `exec('ts-node src/cli.ts run <fixture>')`.
- Use `jest.spyOn(console, 'log').mockImplementation()` in `beforeEach` to suppress output.
- Restore mocks in `afterEach` with `jest.restoreAllMocks()`.
- Run tests with `npm test`.

## Generator script conventions (for fixtures and user scripts)

```js
// CommonJS module.exports, plain generator or async generator
module.exports = function* myScript(arg) {
  const result = yield `some-shell-command --flag ${arg}`
  // result is stdout of the command (string)
  yield `echo ${result}`
}
```

- Yield a shell command string to execute it; the resolved value is `stdout`.
- Yield an empty string or falsy value to skip (no-op).
- Use `yield*` to delegate to sub-generators for composability.
- Return a value from a generator to execute a final command.

## Copilot agent guidance

- When suggesting new features, keep them inside `src/` and maintain zero runtime dependencies.
- When writing tests, follow the three-layer pattern (unshell / cli / e2e) and place them in `spec/`.
- When creating fixtures, use plain JS (`module.exports = function* ...`) in `fixtures/scripts/`.
- Prefer functional composition (`pipe`, generator delegation) over class hierarchies.
- Do not modify `dist/` — it is a build artifact.
- Always run `npm run lint` after code changes and `npm test` after spec changes.
