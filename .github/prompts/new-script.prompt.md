---
description: Scaffold a new unshell script with fixture, spec, and usage example
mode: ask
---

Create a new unshell script named **${input:scriptName}** that performs the following task:

> ${input:taskDescription}

## Requirements

1. **Fixture script** — create `fixtures/scripts/${input:scriptName}.js` as a CommonJS generator function (`module.exports = function* ...`). Use `yield` to execute shell commands and `yield*` to delegate to sub-generators where appropriate.

2. **Spec file** — create `spec/${input:scriptName}.spec.ts` covering all three layers:
   - `unshell` layer: call the engine directly with an inline generator.
   - `cli` layer: call `cli()` with synthetic argv pointing to the fixture.
   - `e2e` layer: spawn a subprocess with `exec('ts-node src/cli.ts run <fixture-path>', ...)`.

   Follow the three-layer pattern from `.github/instructions/testing.instructions.md`.

3. **Example** (optional) — if the task is complex, add a short usage snippet inside `examples/` or extend `README.md`.

## Conventions to follow

- Stub `console.log` and `console.error` in `beforeEach`; restore in `afterEach`.
- Assert `console.log` calls in order: `• <cmd>` then `➜ <stdout>`.
- Keep the fixture script in plain JS (no TypeScript, no imports — just `module.exports`).
- Zero new runtime dependencies.

## Output

Provide the content of all files to create, with their full paths relative to the repo root.
