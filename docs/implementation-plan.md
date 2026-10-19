# Scaffold Implementation Plan

Goal: publish an English-only, runnable foundation for shared AI workflows.

Architecture: versioned JSON selects Markdown content; pure adapters render desired resources for Codex and Claude Code. The CLI validates content and previews output without installing it.

## Tasks

- [x] Add repository metadata, content, schemas, and architecture documentation.
- [x] Write tests for invalid references, schema errors, adapter output, and portable workflow packaging; observe them fail before implementing the core.
- [x] Implement validation and pure rendering with a read-only CLI.
- [x] Run type checking, tests, validation, and both adapter previews.

Publication target: the user-created private repository fjayjay777/kaijie-ai-workflow. Publish through the GitHub connector and verify the resulting branch head.

## Scope

This scaffold implements source validation and desired-resource preview. It does not implement target diffing, installation, authentication, connection diagnostics, or removal. The next milestone is a conflict-aware installer with explicit ownership and recovery tests.
