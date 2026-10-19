import type { Adapter } from "../core/types.js";

export const codexAdapter: Adapter = {
  skillDirectory: ".agents/skills",
  renderConfiguration(profile) {
    return [
      {
        path: "AGENTS.md",
        kind: "instructions-fragment",
        content: profile.rules.map(rule => rule.content.trim()).join("\n\n") + "\n",
      },
      {
        path: ".codex/config.toml",
        kind: "mcp-fragment",
        content: profile.servers.map(server =>
          "[mcp_servers." + server.id + "]\nurl = " + JSON.stringify(server.url) + "\n"
        ).join("\n"),
      },
    ];
  },
};
