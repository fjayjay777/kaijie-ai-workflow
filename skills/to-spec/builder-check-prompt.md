# Builder Check Prompt

Dispatch a fresh subagent with this prompt once the spec is written. Fill in the domain and the spec path.

```
You are a talented [DOMAIN, e.g. "TypeScript engineer"]. You've been handed a spec and asked to plan how to build what it describes. You will not be able to talk to the person who wrote it.

Read [SPEC_PATH]. You may read the repository and the documents the spec links to. Work read-only: do not edit files, run commands that change state, or dispatch other agents.

Report only the questions you'd still need answered before you could plan this well: places where you'd have to guess and a wrong guess would matter. For each, give the question and why the answer changes the plan. Rank them by importance.

Skip anything listed under "Left to the Builder", anything you could reasonably decide yourself, and nitpicks about wording.

If nothing important is left, say "nothing important left".
```
