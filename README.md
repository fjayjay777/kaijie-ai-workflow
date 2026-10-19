# kaijie-ai-workflow

Personal AI working methods with a shared core and thin adapters for **Codex** and **Claude Code**.

Define your rules, skills, workflows, and MCP declarations once. Validate them and preview the resources each host needs.

## Status

This is a runnable scaffold, not a complete installer.

**Available:** a coding profile, three skills, one generated workflow entry, JSON Schema validation, reference checks, deterministic adapter previews, tests, and CI.

**Planned:** target diffs, safe installation and updates, ownership tracking, recovery, removal, authenticated MCP, and live host diagnostics. The scaffold only renders unauthenticated HTTPS MCP servers.

## Quick start

Requires Node.js 22.19.0 or newer and npm.

```sh
git clone https://github.com/fjayjay777/kaijie-ai-workflow.git
cd kaijie-ai-workflow
npm ci
npm run check
npm run plan -- --harness codex
npm run plan -- --harness claude-code
```

The plan command prints JSON to stdout. It does not inspect or modify another project. Instruction and MCP fragments must not replace existing configuration files.

## Shared content

| Source | Purpose |
| --- | --- |
| rules/ | Personal preferences and coding conventions |
| skills/ | Plan, implement, and review a code change |
| workflows/deliver-feature/ | Ordered delivery method and acceptance requirements |
| profiles/coding.json | Selection of rules, skills, workflows, and servers |
| mcp/servers.json | MCP server declarations without credentials |
| schemas/ | Versioned configuration contracts |
| src/adapters/ | Host-specific paths and serialization |

A workflow produces an entry skill named pflow-deliver-feature, with bundled reference documents. It guides an agent through planning, implementation, review, and handoff; it does not guarantee execution order or persist task state.

The bundled OpenAI Docs MCP is for OpenAI documentation, not general web search.

## Commands

```sh
npm run validate
npm run typecheck
npm test
npm run pflow -- --help
```

All source content, configuration, and documentation are in English. The personal rule allows conversational replies in the user's language.

## Design and next steps

- [Architecture](docs/architecture.md)
- [Compatibility](docs/compatibility.md)
- [Implementation plan](docs/implementation-plan.md)
- [Installer boundary](src/installer/README.md)

Keep secrets, local state, and conversation history outside Git. Dependency versions are locked. No model, account, or permission configuration is changed by this scaffold.
