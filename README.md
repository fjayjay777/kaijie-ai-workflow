# kaijie-ai-workflow

Personal AI working methods with a shared core and thin adapters for **Codex** and **Claude Code**.

Define your rules, skills, workflows, and MCP declarations once. Validate them and preview the resources each host needs.

## Status

This is a runnable scaffold, not a complete installer.

**Available:** a coding profile, seven skills (setup-project, triage, grilling, wayfinder, domain-modeling, to-spec, and to-tickets), JSON Schema validation, reference checks, deterministic adapter previews, tests, and CI.

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
| skills/ | Set up project conventions and collaboratively resolve decisions |
| workflows/deliver-feature/ | Inactive scaffold example; its placeholder skills have been removed |
| profiles/coding.json | Selection of rules, skills, workflows, and servers |
| mcp/servers.json | MCP server declarations without credentials |
| schemas/ | Versioned configuration contracts |
| src/adapters/ | Host-specific paths and serialization |

The coding profile selects setup-project, triage, grilling, wayfinder, domain-modeling, to-spec, and to-tickets, with no implementation workflow. Grilling owns outcome clarification and tests each proposed question with a subagent before the main agent decides whether to answer or ask. Remaining independent questions are presented together in numbered rounds, with recommendations; dependent questions wait for the next round. Use it directly for small requests. Wayfinder calls the same skill while maintaining a shared local decision map for larger work. It plans by default; it does not automatically implement the destination.

The bundled OpenAI Docs MCP is for OpenAI documentation, not general web search.

Use `setup-project` when establishing project conventions: local Markdown issues, triage labels, and domain documentation. The skill and its local-issue, triage, and domain templates are included in the coding profile.

Use `triage` to log a bug or idea as `.scratch/<effort>/issue.md` and move it through triage states. It checks whether the request is already implemented or previously rejected (`.out-of-scope/`), reproduces bugs, and routes the issue by size: an agent brief for to-tickets, or a wayfinder map for larger work.

Use `grilling` for focused clarification, or `wayfinder` with a loose idea or `.scratch/<effort>/map.md` for larger efforts. Grilling and its subagent prompt are bundled; research and prototype helpers remain optional. Subagent orchestration requires host support; without it, grilling explicitly reports the limitation and uses the same evidence-first review locally.

Use `domain-modeling` when a discussion settles domain terms or a hard-to-reverse decision. It writes the `GLOSSARY.md` and ADRs whose layout `setup-project` documents, and asks its questions through grilling.

Use `to-spec` when decisions are settled and you want an implementation spec. It reads a wayfinder map and its resolved tickets when one exists, otherwise the current conversation, and writes `.scratch/<effort>/spec.md`. It reports missing decisions instead of making them and confirms the test seams. A fresh subagent then reads the spec as a builder who cannot ask questions; at most one round of user questions follows, and the spec is handed off only after user approval.

Use `to-tickets` on an approved spec to plan the implementation. It splits the work into tracer-bullet tickets under `.scratch/<effort>/tickets/`, each fixing behaviour, interfaces, placement, TDD steps, and acceptance criteria, so a weaker agent can implement it without making decisions. Frontier tickets are meant to run in parallel, one git worktree each, followed by one review of the whole change. Executing tickets and that review are not yet bundled.

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
