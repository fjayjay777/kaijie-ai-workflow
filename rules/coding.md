# Coding Principles

Use small functions with one responsibility and names that describe actual behavior. Distinguish measured observations from estimates.

Keep imports at the top of the module. Justify deferred imports only when dependency cost makes them necessary.

Validate external inputs at boundaries and fail with actionable errors. Prefer enums, literal unions, and schema-derived types over unconstrained strings.

Share repeated behavior when the abstraction makes intent clearer. Keep complex systems documented in one central place, with concrete examples.

Run checks appropriate to the change. Report skipped checks explicitly. Keep changes concise and avoid unrelated refactoring.
