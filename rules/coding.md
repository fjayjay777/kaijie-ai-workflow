# Coding Principles

 1. Use small functions with one responsibility and names that describe actual behavior. Distinguish measured observations from estimates.
 2. Keep imports at the top of the module. Justify deferred imports only when dependency cost makes them necessary.
 3. Validate external inputs at boundaries and fail with actionable errors. Prefer enums, literal unions, and schema-derived types over unconstrained strings.
 4. Share repeated behavior when the abstraction makes intent clearer. Keep complex systems documented in one central place, with concrete examples.
 5. Run checks appropriate to the change. Report skipped checks explicitly. Keep changes concise and avoid unrelated refactoring.
 6. Do not over-comment. Comment on the features, not change logs. Prefer good naming over comments.
 7. All public functions should be commented in Google commenting style.
 8. Use abstraction/interface to reduce boilplates. 
 9. Follow the Clean Code principal. 
