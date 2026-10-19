# Compatibility

| Target | Scaffold output | Live harness verification |
| --- | --- | --- |
| Codex | AGENTS.md fragment, .agents/skills, .codex/config.toml fragment | Not yet performed |
| Claude Code | CLAUDE.md fragment, .claude/skills, .mcp.json fragment | Not yet performed |

The scaffold supports unauthenticated HTTPS MCP declarations only. Stdio, credential references, OAuth, installation, and live connection diagnostics are future work.

Project MCP settings may require project trust or approval in the host. Rendering configuration does not grant permission or prove that a server is reachable.

Official references checked during design:
- [Codex skills](https://developers.openai.com/codex/skills)
- [Codex MCP](https://developers.openai.com/codex/mcp)
- [Claude Code skills](https://code.claude.com/docs/en/skills)
- [Claude Code MCP](https://code.claude.com/docs/en/mcp)
- [Claude Code instructions](https://code.claude.com/docs/en/memory)
