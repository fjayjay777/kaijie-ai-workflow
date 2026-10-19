# Installer Boundary

Installation is intentionally not implemented in this scaffold.

The future installer will consume desired resources from the pure adapters and compare them with a target project. Before exposing an apply command, implement:

- Ownership manifests and content hashes.
- Preservation of existing Markdown, JSON, and TOML content.
- AGENTS.md / CLAUDE.md import deduplication and shared ownership.
- Conflict detection for manual edits and unowned names.
- Path containment including symbolic links and Windows junctions.
- Journaled writes, backups, interrupted-operation recovery, and removal.

A rendered fragment is not a safe replacement for an existing configuration file.
