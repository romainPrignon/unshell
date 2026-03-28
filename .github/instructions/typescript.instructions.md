---
applyTo: "**/*.ts"
---

# TypeScript conventions for unshell

## Compiler settings (from tsconfig.json)

- Target: `es2018` — use async generators, `Promise.finally`, object spread freely.
- Strict mode is **on** (`strict: true`, `noImplicitReturns: true`). Every function must have an explicit return type or a clearly inferred one.
- `useUnknownInCatchVariables: false` — caught errors are typed `any` (existing pattern); access `.cmd`, `.stderr`, `.message` directly.

## Type definitions

Always import shared types from `../type` (source) or `type` (dist):

```ts
import { Options, Script, Args, Engine, Command } from '../type'
```

Avoid re-declaring these types inline.

## Function style

- Prefer plain functions and arrow functions; avoid classes unless wrapping an external API.
- Use `const` for module-level declarations; avoid `let` unless mutation is necessary.
- Name generator-aware helpers with clear suffixes: `isGenerator`, `isAsyncGenerator`.

## Async patterns

```ts
// Wrap callback APIs with util.promisify
import util from 'util'
import child_process from 'child_process'
const exec = util.promisify(child_process.exec)
```

- Await async generators with `for await...of` or manual `.next()` calls (see `Interpretor.interpret`).
- Never mix `then/catch` chaining with `async/await` in the same function.

## Generator patterns

```ts
// Type a generator script correctly
const script: Script = function* (): IterableIterator<string> {
  yield 'echo hello'
  return 'echo world'   // return also executes
}

// Type an async generator script
const asyncScript: Script = async function* (): AsyncIterableIterator<string> {
  yield 'echo hello'
}
```

- Use `yield*` to delegate to sub-generators for composable sub-scripts.
- Always guard unknown functions with `assertUnshellScript(fn)` before iterating.

## Imports

- Use `import X from 'module'` (default imports) for Node built-ins (`util`, `child_process`, `path`).
- Use named imports `import { X } from './module'` for local modules.
- Keep imports at the top of the file, grouped: Node built-ins → local modules → types.
