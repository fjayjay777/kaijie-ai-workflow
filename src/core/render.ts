import { codexAdapter } from "../adapters/codex.js";
import { claudeCodeAdapter } from "../adapters/claude-code.js";
import type { Adapter, DesiredResource, Harness, ResolvedProfile } from "./types.js";

const adapters: Record<Harness, Adapter> = {
  codex: codexAdapter,
  "claude-code": claudeCodeAdapter,
};

export function renderProfile(profile: ResolvedProfile, harness: Harness): DesiredResource[] {
  const adapter = adapters[harness];
  const resources = adapter.renderConfiguration(profile);
  for (const skill of profile.skills) {
    resources.push({
      path: adapter.skillDirectory + "/" + skill.id + "/SKILL.md",
      kind: "skill-file",
      content: skill.content,
    });
  }
  for (const workflow of profile.workflows) {
    const name = "pflow-" + workflow.id;
    const directory = adapter.skillDirectory + "/" + name;
    const steps = workflow.orderedSteps.map((id, index) =>
      (index + 1) + ". Read [the " + id + " method](references/" + id + ".md)."
    ).join("\n");
    resources.push({
      path: directory + "/SKILL.md",
      kind: "skill-file",
      content: "---\nname: " + name + "\ndescription: " + JSON.stringify(workflow.description) +
        "\n---\n\n# " + name + "\n\n" + steps +
        "\n\nRead [the workflow instructions](references/workflow.md) before starting.\n",
    }, {
      path: directory + "/references/workflow.md",
      kind: "skill-file",
      // Workflow prose uses paths relative to the skill root.
      content: workflow.instructions,
    });
    for (const id of workflow.orderedSteps) {
      const skill = profile.skills.find(candidate => candidate.id === id);
      if (!skill) throw new Error("Missing workflow dependency: " + id);
      resources.push({
        path: directory + "/references/" + id + ".md",
        kind: "skill-file",
        content: skill.content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ""),
      });
    }
  }
  const paths = resources.map(resource => resource.path);
  if (new Set(paths).size !== paths.length) throw new Error("Duplicate output path");
  return resources;
}
