---
description: Structured code review for changes in this repository
mode: ask
---

Review the following changes (or the current diff if no changes are provided):

> ${input:changesDescription}

## Review checklist

### Correctness
- [ ] Does the logic correctly handle the generator lifecycle (`done: true` sentinel, empty yields, return values)?
- [ ] Are errors caught, structured as `{ cmd, stderr }`, and rethrown (not swallowed)?
- [ ] Does async code properly `await` all promises?

### TypeScript quality
- [ ] Are all new functions explicitly typed (parameters and return type)?
- [ ] Is `any` avoided — or if used, is it justified with a comment?
- [ ] Do new types belong in `type/index.d.ts` if they are public API?

### Testing
- [ ] Is there a spec file covering the changed behavior?
- [ ] Does it include all three layers: `unshell` / `cli` / `e2e`?
- [ ] Are `console.log` and `console.error` properly mocked and restored?

### Conventions
- [ ] No new runtime dependencies added to `dependencies` in `package.json`.
- [ ] No changes to `dist/` (build artifact).
- [ ] Lint passes: `npm run lint`.
- [ ] Tests pass: `npm test`.

### Security
- [ ] Shell commands are constructed from trusted input only (no unsanitized user strings interpolated into `yield` expressions).
- [ ] No secrets or credentials are hardcoded in fixtures or examples.

## Output format

For each issue found:
- **File**: `<path>`
- **Line**: `<line number or range>`
- **Severity**: `critical | major | minor | nit`
- **Description**: what is wrong and why
- **Suggestion**: concrete fix or alternative

End with a **summary verdict**: approve / request changes / needs discussion.
