---
name: pflow-review-change
description: Review a proposed or completed code change for correctness, regressions, and project conventions.
---

# Review a Change

1. Establish the intended behavior and the diff being reviewed.
2. Trace changed inputs, outputs, errors, and relevant callers.
3. Prioritize actionable correctness and regression findings.
4. Check naming, responsibilities, input validation, type safety, and unnecessary duplication.
5. Report each finding with its file location, triggering condition, and impact.

Separate confirmed defects from uncertainty. If there are no findings, say so and describe any untested risks. Self-review is not independent review.
