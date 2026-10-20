# Root Cause Tracing

Bugs often surface deep in the call stack (git init in the wrong directory, a file created in the wrong place, a database opened with the wrong path). The instinct is to fix where the error appears, but that treats a symptom. Trace backward through the call chain until you find the original trigger, then fix at the source.

Use it when the error happens deep in execution rather than at an entry point, the stack trace shows a long call chain, or it is unclear where an invalid value came from.

## The tracing process

1. **Observe the symptom.**

   ```
   Error: git init failed in ~/project/packages/core
   ```

2. **Find the immediate cause**: the code that directly produces it.

   ```typescript
   await execFileAsync('git', ['init'], { cwd: projectDir });
   ```

3. **Ask what called it, and with what value.**

   ```
   WorktreeManager.createSessionWorktree(projectDir, sessionId)
     → called by Session.initializeWorkspace()
     → called by Session.create()
     → called by test at Project.create()
   ```

   Here `projectDir` is `''`, and an empty `cwd` resolves to `process.cwd()`: the source directory.

4. **Keep tracing up until you reach the origin of the bad value.**

   ```typescript
   const context = setupCoreTest(); // Returns { tempDir: '' }
   Project.create('name', context.tempDir); // Accessed before beforeEach!
   ```

5. **Fix at the origin**: here, make `tempDir` a getter that throws when read before `beforeEach`. When other paths could deliver the same empty value, also reject it where it enters, such as `Project.create()`.

## Adding stack traces

When you can't trace by reading, log just before the dangerous operation, not after it fails:

```typescript
async function gitInit(directory: string) {
  console.error('[DEBUG-7c1e] git init', {
    directory,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    stack: new Error().stack,
  });
  await execFileAsync('git', ['init'], { cwd: directory });
}
```

In tests, use `console.error()`: a logger may be suppressed. Run and filter:

```bash
npm test 2>&1 | grep 'DEBUG-7c1e'
```

Read the stack traces for test file names and the line that triggers the call, and look for the pattern: the same test, the same parameter.

## Finding which test pollutes

When something appears during a test run (a stray file or directory) but you don't know which test creates it, run the test files one by one and stop at the first that produces it. Copy this script to a scratch location, adjust the test command to the project's runner, and run it with the path to watch and a test-file pattern:

```bash
#!/usr/bin/env bash
# Usage: find-polluter.sh <file_or_dir_to_check> <test_pattern>
# Example: find-polluter.sh '.git' 'src/**/*.test.ts'
set -e

if [ $# -ne 2 ]; then
  echo "Usage: $0 <file_to_check> <test_pattern>"
  exit 1
fi

POLLUTION_CHECK="$1"
TEST_PATTERN="${2#./}"

# find -path can't match '**/' against zero directory levels, so also try the
# pattern with '**/' collapsed to cover files directly under the base directory.
TEST_FILES=$(find . \( -path "./$TEST_PATTERN" -o -path "./${TEST_PATTERN//\*\*\//}" \) | sort -u)
TOTAL=$(printf '%s\n' "$TEST_FILES" | grep -c . || true)
echo "Found $TOTAL test files"

COUNT=0
for TEST_FILE in $TEST_FILES; do
  COUNT=$((COUNT + 1))
  if [ -e "$POLLUTION_CHECK" ]; then
    echo "Pollution already exists before test $COUNT/$TOTAL; skipping $TEST_FILE"
    continue
  fi
  echo "[$COUNT/$TOTAL] $TEST_FILE"
  npm test "$TEST_FILE" > /dev/null 2>&1 || true
  if [ -e "$POLLUTION_CHECK" ]; then
    echo "Found polluter: $TEST_FILE created $POLLUTION_CHECK"
    ls -la "$POLLUTION_CHECK"
    exit 1
  fi
done

echo "No polluter found"
