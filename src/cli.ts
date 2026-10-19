import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { loadProfile } from "./core/load-profile.js";
import { renderProfile } from "./core/render.js";
import type { Harness } from "./core/types.js";

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    strict: true,
    options: {
      profile: { type: "string", default: "coding" },
      harness: { type: "string" },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help || positionals.length === 0) {
    console.log("Usage: npm run pflow -- <validate|plan> [--profile coding] [--harness codex|claude-code]");
    console.log("plan prints desired resource fragments; it does not read or modify a target project.");
    return;
  }
  const command = positionals[0];
  if (positionals.length !== 1 || (command !== "validate" && command !== "plan")) {
    throw new Error("Supported commands: validate, plan. Installation is not implemented.");
  }
  if (values.harness && values.harness !== "codex" && values.harness !== "claude-code") {
    throw new Error("Unsupported harness: " + values.harness);
  }
  const root = fileURLToPath(new URL("../", import.meta.url));
  const profile = await loadProfile(root, values.profile);
  if (command === "validate") {
    for (const harness of ["codex", "claude-code"] as const) renderProfile(profile, harness);
    console.log("Valid profile: " + profile.id + " (both adapter previews verified)");
    return;
  }
  const harness: Harness = values.harness === "claude-code" ? "claude-code" : "codex";
  console.log(JSON.stringify({
    mode: "desired-resources-only",
    profile: profile.id,
    harness,
    warning: "Fragments require conflict-aware merging. Do not overwrite existing files.",
    resources: renderProfile(profile, harness),
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
