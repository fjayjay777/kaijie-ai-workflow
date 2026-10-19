---
name: pflow-implement-change
description: Implement an authorized code change with a defined scope and acceptance criteria.
---

# Implement a Change

1. Confirm the relevant scope, project conventions, and current working-tree changes.
2. Implement the smallest coherent change without overwriting unrelated work.
3. Add meaningful regression coverage when behavior changes.
4. Run the checks that exercise the changed behavior.
5. Summarize the changes and record the exact verification outcome.

Stop on invalid external inputs with a useful error. If a dependency or permission blocks execution, identify the blocker and complete independent work.
