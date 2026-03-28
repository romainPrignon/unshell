---
description: Diagnose and fix a broken or misbehaving unshell script
mode: ask
---

The following unshell script is not working as expected:

**Script path or content:**
> ${input:scriptOrPath}

**Observed behavior:**
> ${input:observedBehavior}

**Expected behavior:**
> ${input:expectedBehavior}

## Diagnostic steps

Work through the following checklist systematically:

### 1. Script structure validation
- Is the export a `GeneratorFunction` or `AsyncGeneratorFunction`? (Check with `fn.constructor.name`)
- Does the script use `module.exports = function* ...` (for fixture JS files) or a named export?
- Are there any syntax errors or missing `yield` keywords?

### 2. Command string inspection
- Log each yielded command before execution to confirm it is formed correctly.
- Check for unintended whitespace, missing flags, or shell-unsafe characters in interpolated values.
- Confirm the shell command works in isolation: run it directly in a terminal.

### 3. Generator lifecycle
- Does the generator terminate properly (`done: true`)? An infinite generator will hang.
- Are `yield*` delegations to sub-generators returning correctly?
- Is a `return` value (final command) being handled? `unshell` executes return values too.

### 4. Async generator pitfalls
- If using `async function*`, are all `await` expressions inside the generator resolving?
- Is the generator accidentally mixing `yield` with `return` in a way that skips commands?

### 5. Environment and options
- Was `unshell({ env: process.env })` called with the right environment? Some commands need `PATH` or other variables.
- Are file paths in the script absolute, or relative to the correct working directory?

### 6. Error handling
- Check stderr output — run with `DEBUG=* unshell run <script>` if available, or wrap in try/catch and log `err.cmd` and `err.stderr`.
- Is the error thrown from `child_process.exec`? Look for non-zero exit codes.

## Output

1. Root cause analysis (which step above identified the issue).
2. Minimal code fix with explanation.
3. A test case that would have caught this bug (following the three-layer spec pattern).
