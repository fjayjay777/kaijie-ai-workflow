export type Harness = "codex" | "claude-code";

export interface Profile {
  schemaVersion: 1;
  id: string;
  rules: string[];
  skills: string[];
  workflows: string[];
  mcpServers: string[];
}

export interface Workflow {
  schemaVersion: 1;
  id: string;
  description: string;
  orderedSteps: string[];
}

export interface HttpServer {
  id: string;
  transport: "http";
  url: string;
}

export interface SourceText {
  id: string;
  content: string;
}

export interface ResolvedProfile {
  id: string;
  rules: SourceText[];
  skills: SourceText[];
  workflows: Array<Workflow & { instructions: string }>;
  servers: HttpServer[];
}

export interface DesiredResource {
  path: string;
  kind: "skill-file" | "instructions-fragment" | "mcp-fragment";
  content: string;
}

export interface Adapter {
  skillDirectory: string;
  renderConfiguration(profile: ResolvedProfile): DesiredResource[];
}
