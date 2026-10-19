import type { Adapter } from "../core/types.js";

export const claudeCodeAdapter: Adapter = {
  skillDirectory: ".claude/skills",
  renderConfiguration(profile) {
    return [
      {
        path: "CLAUDE.md",
        kind: "instructions-fragment",
        content: profile.rules.map(rule => rule.content.trim()).join("\n\n") + "\n",
      },
      {
        path: ".mcp.json",
        kind: "mcp-fragment",
        content: JSON.stringify({
          mcpServers: Object.fromEntries(profile.servers.map(server => [
            server.id, { type: "http", url: server.url },
          ])),
        }, null, 2) + "\n",
      },
    ];
  },
};
