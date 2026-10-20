# Condition-Based Waiting

Flaky tests often guess at timing with fixed delays, which creates races: they pass on a fast machine and fail under load or in CI. Wait for the condition you actually care about, not a guess at how long it takes.

Use it when a test sleeps for a fixed time, passes only sometimes, times out when run in parallel, or waits for an async operation to finish. When the test is about timing itself (debounce, throttle intervals), a fixed delay can be right; then document why.

## Core pattern

```typescript
// BEFORE: guessing at timing
await new Promise(r => setTimeout(r, 50));
const result = getResult();
expect(result).toBeDefined();

// AFTER: waiting for the condition
await waitFor(() => getResult() !== undefined, "result to be ready");
const result = getResult();
expect(result).toBeDefined();
```

| Scenario | Pattern |
|----------|---------|
| Wait for event | `waitFor(() => events.find(e => e.type === 'DONE'), "DONE event")` |
| Wait for state | `waitFor(() => machine.state === 'ready', "ready state")` |
| Wait for count | `waitFor(() => items.length >= 5, "5 items")` |
| Wait for file | `waitFor(() => fs.existsSync(path), "output file")` |

## Implementation

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const startTime = Date.now();
  while (true) {
    const result = condition();
    if (result) return result;
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }
    await new Promise(r => setTimeout(r, 10));
  }
}
```

Keep three things right: poll at a modest interval (about 10ms, not 1ms); always time out with an error that names what was awaited; and read fresh state inside the loop rather than a value cached before it.

## When a fixed delay is correct

```typescript
// The tool ticks every 100ms; two ticks are needed to verify partial output.
await waitForEvent(manager, 'TOOL_STARTED'); // first, wait for the trigger
await new Promise(r => setTimeout(r, 200));   // then, wait for the timed behaviour
```

The delay follows a wait for the triggering condition, rests on known timing rather than a guess, and carries a comment explaining why.
