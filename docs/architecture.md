# Architecture

The shared core defines working methods. Adapters express those methods in host-specific file layouts. This repository is independent of any agent runtime.

## Source of truth

Rules, skills, workflow instructions, profiles, and MCP declarations are edited in this repository. Generated resources are disposable previews. Each configuration has schemaVersion 1; unsupported fields, versions, and references fail validation.

Standalone skills also carry their top-level Markdown supporting documents and LICENSE in both adapter previews. Nested assets are not yet packaged.

The coding profile selects setup-project, grilling, wayfinder, domain-modeling, and to-spec, with no active implementation workflow. Grilling owns clarification and subagent answer review; wayfinder owns the persistent map and references grilling instead of duplicating its method. Both use existing authorization and preserve the provenance of decisions. Wayfinder records maps under .scratch/. Domain-modeling writes the glossary and ADRs; wayfinder tickets link to them instead of restating them. To-spec turns a wayfinder map, or the current conversation, into a spec beside the map, sends missing decisions back to wayfinder or grilling, checks it with a cold-reader subagent, and hands it off only after user approval. To-tickets plans from an approved spec: the main agent fixes each ticket's interfaces, placement, tests, and acceptance criteria, so implementers make no design decisions. Implementation tickets live under tickets/, separate from wayfinder decision tickets under issues/. Other helper skills are optional. The deliver-feature directory remains an inactive scaffold example after removal of its placeholder skills.

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
