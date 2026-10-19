# Architecture

The shared core defines working methods. Adapters express those methods in host-specific file layouts. This repository is independent of any agent runtime.

## Source of truth

Rules, skills, workflow instructions, profiles, and MCP declarations are edited in this repository. Generated resources are disposable previews. Each configuration has schemaVersion 1; unsupported fields, versions, and references fail validation.

The coding profile selects three skills and one workflow. The workflow compiles into a fourth entry skill with bundled reference documents. Execution does not depend on a host automatically invoking another skill.

## Boundaries

- core/load-profile validates and resolves source content.
- core/render assembles portable skill resources and delegates host-specific configuration.
- adapters contain paths and serialization rules.
- cli exposes validation and read-only preview.
- installer is a documented future boundary.

The current plan command lists desired resources. It does not inspect a target, compute a merge, write files, or certify installability.

## Future installation

Use project-scoped installation and explicit resource ownership. Preserve unrelated configuration. Stop on conflicts and manual changes. Track shared rules when both hosts are installed; handle Claude's AGENTS.md imports explicitly.

Keep credentials in local environment variables and use dedicated PFLOW_* references. Store no tokens, account state, or chat history in Git.

## Execution

The workflow provides ordered instructions and acceptance criteria, not guaranteed scheduling, state transitions, or durable recovery. Models and permissions remain controlled by the host. The first live acceptance scenario is the same CSV export task in two clean projects.

## Delivery milestones

1. Runnable scaffold: validation, deterministic resource previews, content, tests, and CI.
2. Conflict-aware installer and local diagnostic checks.
3. Stdio and authenticated HTTP configuration.
4. Real Codex and Claude Code workflow acceptance tests.
