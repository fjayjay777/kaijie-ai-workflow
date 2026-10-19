import { readFile, readdir, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { Ajv } from "ajv";
import type { HttpServer, Profile, ResolvedProfile, SkillSource, Workflow } from "./types.js";

const identifier = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const ajv = new Ajv({ allErrors: true });

function assertIdentifier(value: string): void {
  if (!identifier.test(value)) throw new Error("Invalid identifier: " + value);
}

async function sourceFile(root: string, ...parts: string[]): Promise<string> {
  const base = await realpath(root);
  const path = await realpath(resolve(base, ...parts));
  const rel = relative(base, path);
  if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
    throw new Error("Source path escapes repository: " + parts.join("/"));
  }
  return readFile(path, "utf8");
}

async function readValidated<T>(root: string, schema: string, ...parts: string[]): Promise<T> {
  const definition = JSON.parse(await sourceFile(root, "schemas", schema + ".schema.json"));
  const validate = ajv.compile<T>(definition);
  const value: unknown = JSON.parse(await sourceFile(root, ...parts));
  if (!validate(value)) {
    throw new Error(parts.join("/") + " schema error: " + ajv.errorsText(validate.errors));
  }
  return value;
}

async function loadSkill(root: string, id: string): Promise<SkillSource> {
  const content = await sourceFile(root, "skills", id, "SKILL.md");
  const metadata = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(content)?.[1];
  if (!metadata) throw new Error("Missing skill metadata: " + id);
  const name = /^name: ([a-z0-9-]+)\r?$/m.exec(metadata)?.[1];
  if (name !== id) throw new Error("Skill name must match directory: " + id);
  if (!/^description: \S[^\r\n]*\r?$/m.test(metadata)) {
    throw new Error("Skill requires a single-line description: " + id);
  }
  const entries = await readdir(resolve(root, "skills", id), { withFileTypes: true });
  const names = entries
    .filter(entry => entry.isFile() && entry.name !== "SKILL.md" &&
      (entry.name.endsWith(".md") || entry.name === "LICENSE"))
    .map(entry => entry.name)
    .sort();
  const supportingFiles = await Promise.all(names.map(async name => ({
    name, content: await sourceFile(root, "skills", id, name),
  })));
  return { id, content, supportingFiles };
}

export async function loadProfile(root: string, profileId: string): Promise<ResolvedProfile> {
  assertIdentifier(profileId);
  const profile = await readValidated<Profile>(root, "profile", "profiles", profileId + ".json");
  if (profile.id !== profileId) throw new Error("Profile id must match filename");
  const registry = await readValidated<{ schemaVersion: 1; servers: HttpServer[] }>(
    root, "servers", "mcp", "servers.json",
  );
  if (new Set(registry.servers.map(server => server.id)).size !== registry.servers.length) {
    throw new Error("Duplicate MCP server id");
  }
  for (const server of registry.servers) {
    const url = new URL(server.url);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
      throw new Error("MCP URL must be HTTPS without credentials, query, or fragment: " + server.id);
    }
  }
  const rules = await Promise.all(profile.rules.map(async id => ({
    id, content: await sourceFile(root, "rules", id + ".md"),
  })));
  const skills = await Promise.all(profile.skills.map(id => loadSkill(root, id)));
  const workflows = await Promise.all(profile.workflows.map(async id => {
    const workflow = await readValidated<Workflow>(root, "workflow", "workflows", id, "workflow.json");
    if (workflow.id !== id) throw new Error("Workflow id must match directory");
    for (const skill of workflow.orderedSteps) {
      if (!profile.skills.includes(skill)) throw new Error("Missing workflow dependency: " + skill);
    }
    return { ...workflow, instructions: await sourceFile(root, "workflows", id, "instructions.md") };
  }));
  const generatedIds = workflows.map(workflow => "pflow-" + workflow.id);
  if (generatedIds.some(id => profile.skills.includes(id))) {
    throw new Error("Generated workflow skill collides with a selected skill");
  }
  const servers = profile.mcpServers.map(id => {
    const server = registry.servers.find(candidate => candidate.id === id);
    if (!server) throw new Error("Unknown MCP server reference: " + id);
    return server;
  });
  return { id: profile.id, rules, skills, workflows, servers };
}
