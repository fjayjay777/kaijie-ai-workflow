import assert from "node:assert/strict";
import { test } from "node:test";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadProfile } from "../src/core/load-profile.js";
import { renderProfile } from "../src/core/render.js";

const root = fileURLToPath(new URL("../", import.meta.url));

async function withFixture(change: (path: string) => Promise<void>) {
  const path = await mkdtemp(join(tmpdir(), "pflow-test-"));
  try {
    for (const dir of ["profiles", "rules", "skills", "workflows", "mcp", "schemas"]) {
      await cp(join(root, dir), join(path, dir), { recursive: true });
    }
    await change(path);
  } finally {
    await rm(path, { recursive: true, force: true });
  }
}

test("coding profile resolves both adapters and packages the planning skills", async () => {
  const profile = await loadProfile(root, "coding");
  for (const harness of ["codex", "claude-code"] as const) {
    const resources = renderProfile(profile, harness);
    const prefix = harness === "codex" ? ".agents/skills" : ".claude/skills";
    assert.equal(resources.filter(r => r.path.endsWith("/SKILL.md")).length, 7);
    assert.ok(resources.some(r => r.path === prefix + "/wayfinder/SKILL.md"));
    assert.ok(resources.some(r => r.path === prefix + "/grilling/subagent-prompt.md"));
    assert.ok(resources.some(r => r.path === prefix + "/domain-modeling/ADR-FORMAT.md"));
    assert.ok(resources.some(r => r.path === prefix + "/to-spec/builder-check-prompt.md"));
    assert.ok(resources.some(r => r.path === prefix + "/to-tickets/SKILL.md"));
    assert.ok(resources.some(r => r.path === prefix + "/triage/AGENT-BRIEF.md"));
    assert.ok(resources.every(r => !r.content.includes(root)));
    assert.deepEqual(renderProfile(profile, harness), resources);
  }
  const claude = renderProfile(profile, "claude-code");
  const mcp = claude.find(r => r.path === ".mcp.json");
  assert.ok(mcp);
  assert.equal(JSON.parse(mcp.content).mcpServers["pflow-openai-docs"].type, "http");
});

test("unknown profile fields are rejected", async () => {
  await withFixture(async path => {
    const file = join(path, "profiles/coding.json");
    const data = JSON.parse(await readFile(file, "utf8"));
    data.silentOverwrite = true;
    await writeFile(file, JSON.stringify(data));
    await assert.rejects(loadProfile(path, "coding"), /schema|additional/i);
  });
});

test("missing workflow dependencies are rejected", async () => {
  await withFixture(async path => {
    const file = join(path, "profiles/coding.json");
    const data = JSON.parse(await readFile(file, "utf8"));
    data.workflows = ["deliver-feature"];
    await writeFile(file, JSON.stringify(data));
    await assert.rejects(loadProfile(path, "coding"), /dependency/i);
  });
});

test("path traversal cannot select a profile", async () => {
  await assert.rejects(loadProfile(root, "../coding"), /identifier/i);
});

test("skill names must match directory names", async () => {
  await withFixture(async path => {
    const file = join(path, "skills/setup-project/SKILL.md");
    const text = await readFile(file, "utf8");
    await writeFile(file, text.replace("name: setup-project", "name: wrong-name"));
    await assert.rejects(loadProfile(path, "coding"), /skill name/i);
  });
});

test("unsupported schema versions are rejected", async () => {
  await withFixture(async path => {
    const file = join(path, "profiles/coding.json");
    const data = JSON.parse(await readFile(file, "utf8"));
    data.schemaVersion = 99;
    await writeFile(file, JSON.stringify(data));
    await assert.rejects(loadProfile(path, "coding"), /schema/i);
  });
});

test("both adapters preserve a skill's supporting documents and license", async () => {
  await withFixture(async path => {
    await writeFile(join(path, "skills/setup-project/domain.md"), "# Domain conventions\n");
    await writeFile(join(path, "skills/setup-project/LICENSE"), "Example license notice\n");
    const profile = await loadProfile(path, "coding");
    for (const harness of ["codex", "claude-code"] as const) {
      const resources = renderProfile(profile, harness);
      const prefix = harness === "codex" ? ".agents/skills" : ".claude/skills";
      assert.equal(resources.find(r => r.path === prefix + "/setup-project/domain.md")?.content, "# Domain conventions\n");
      assert.equal(resources.find(r => r.path === prefix + "/setup-project/LICENSE")?.content, "Example license notice\n");
    }
  });
});
