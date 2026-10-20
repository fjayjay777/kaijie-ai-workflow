---
name: review-change
description: Review the changes since a fixed point along two axes, Standards and Spec, in parallel read-only subagents, with findings graded by severity within each axis. Use when the user wants a branch or work-in-progress reviewed, or implement runs its final review.
---

# Review Change

Two-axis review of the diff between `HEAD` and a fixed point:

- **Standards**: does the code conform to this repo's documented coding standards?
- **Spec**: does the code do what the originating spec asked for, and what a reasonable person using it would expect?

Both axes run as **parallel sub-agents** so they don't pollute each other's context, then this skill aggregates their findings. Findings are graded within each axis and never reranked across axes (see [Why two axes](#why-two-axes)).

## Severity

Both axes grade every finding by its effect on a person using the software, not by whether the spec mentions the trigger:

- **Critical**: bugs, security issues, data loss risks, broken functionality
- **Important**: missing or partial requirements, poor error handling, test gaps, architecture problems, hard violations of a documented standard
- **Minor**: naming, style, optimisation, documentation polish

Baseline smells are judgement calls and are graded Minor at most.

## Process

### 1. Pin the fixed point

When implement runs the review, the fixed point is the integration branch's base. Otherwise, whatever the user said is the fixed point (a commit SHA, branch name, tag, `main`, `HEAD~5`, etc.). If they didn't specify one, ask for it.

Capture the diff command once: `git diff <fixed-point>...HEAD` (three-dot, so the comparison is against the merge-base). Also note the list of commits via `git log <fixed-point>..HEAD --oneline`.

Before going further, confirm the fixed point resolves (`git rev-parse <fixed-point>`) and the diff is non-empty. A bad ref or empty diff should fail here, not inside two parallel sub-agents.

If the diff is too large for one pass, split it into ranges: per ticket, using the commit ranges in each ticket's `## Result`, otherwise by directory. Each sub-agent reviews the ranges in passes and says so in its report.

### 2. Identify the spec source

Look for the originating spec, in this order:

1. A path the user passed as an argument.
2. The effort under `.scratch/<effort>/`, named by the user or by an `implement/<effort>` branch: the approved `spec.md`, or the Agent Brief in `issue.md`, together with its tickets. Their `Ruling:` lines record deliberate deviations.
3. Without a spec: the stated intent, from commit messages, the issue body, or the user's description. The Spec axis reviews against that intent and reasonable expectations; it still runs.

### 3. Identify the standards sources

Search the repo for every file that documents how code should be written. When `AGENTS.md`, `CLAUDE.md`, `docs/agents/`, `CODING_STANDARDS.md`, or `CONTRIBUTING.md` exists, it must be on the list. Add the test standards in the tdd skill's [tests.md](../tdd/tests.md) and [mocking.md](../tdd/mocking.md).

On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below: a fixed set of Fowler code smells (_Refactoring_, ch.3) that applies even when a repo documents nothing. Two rules bind it:

- **The repo overrides.** A documented repo standard always wins; where it endorses something the baseline would flag, suppress the smell.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation. Like any standard here, skip anything tooling already enforces.

Each smell reads *what it is* → *how to fix*; match it against the diff:

- **Mysterious Name**: a function, variable, or type whose name doesn't reveal what it does or holds. → rename it; if no honest name comes, the design's murky.
- **Duplicated Code**: the same logic shape appears in more than one hunk or file in the change. → extract the shared shape, call it from both.
- **Feature Envy**: a method that reaches into another object's data more than its own. → move the method onto the data it envies.
- **Data Clumps**: the same few fields or params keep travelling together (a type wanting to be born). → bundle them into one type, pass that.
- **Primitive Obsession**: a primitive or string standing in for a domain concept that deserves its own type. → give the concept its own small type.
- **Repeated Switches**: the same `switch`/`if`-cascade on the same type recurs across the change. → replace with polymorphism, or one map both sites share.
- **Shotgun Surgery**: one logical change forces scattered edits across many files in the diff. → gather what changes together into one module.
- **Divergent Change**: one file or module is edited for several unrelated reasons. → split so each module changes for one reason.
- **Speculative Generality**: abstraction, parameters, or hooks added for needs the spec doesn't have. → delete it; inline back until a real need shows.
- **Message Chains**: long `a.b().c().d()` navigation the caller shouldn't depend on. → hide the walk behind one method on the first object.
- **Middle Man**: a class or function that mostly just delegates onward. → cut it, call the real target direct.
- **Refused Bequest**: a subclass or implementer that ignores or overrides most of what it inherits. → drop the inheritance, use composition.

### 4. Spawn both sub-agents in parallel

Issue both sub-agent calls together, in the foreground, on the most capable available model, named explicitly. Aggregate the reports they return. Without subagent support, run the two axes yourself as separate passes, Standards first, and say so in the report.

Both prompts carry these rules:

- **Read-only.** Leave the working tree, index, HEAD, and branches untouched. To run code, check out the reviewed head into a separate temporary worktree and remove it afterwards.
- **No delegation.** Do the review yourself; dispatch no further sub-agents.
- **Outside the diff, by named risk.** Inspect code outside the diff only to evaluate a concrete risk you can name: the callers of a changed signature, the users of a changed contract, a place that should have changed but didn't. One focused check per named risk; report both the risk and what you checked.
- **Evidence.** A Critical or Important finding about behaviour gives a concrete triggering input or code path, confirmed by running the code when practical. Mark findings you could not confirm as `suspected`.
- **Format.** Each finding gives its severity, location (file:line), what's wrong, why it matters, and the fix when it isn't obvious. List every Critical and Important finding; keep the Minor findings under 400 words.

**Standards sub-agent prompt** should include:

- The full diff command and commit list.
- The list of standards-source files you found in step 3, **plus the smell baseline from step 3** pasted in full (the sub-agent has no other access to it).
- The brief: "Report, per file/hunk where relevant, (a) every place the diff violates a documented standard: cite the standard (file + the rule); (b) any baseline smell you spot: name it and quote the hunk; (c) any test that breaks the test standards: tautological, implementation-coupled, mocking internal collaborators, or a change detector. Distinguish hard violations from judgement calls: documented-standard breaches can be hard, but baseline smells are always judgement calls, graded Minor at most, and a documented repo standard overrides the baseline. Skip anything tooling enforces."

**Spec sub-agent prompt** should include:

- The diff command and commit list.
- The path or fetched contents of the spec source from step 2, including its tickets and ruling lines.
- The brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong; (d) anti-goals the change violates; (e) behaviour a reasonable person using this software would hit that the spec is silent on: unhandled inputs, error paths, security, data loss, resource leaks. The spec is a vision document: its silence is not permission. Quote the spec line, or the stated intent, for each finding. A deviation that matches a ruling line is deliberate; report it only if its cost has materialised. End with **Declined to judge**: every behaviour you considered and set aside as outside the spec, one line each with the reason. An empty list means you set nothing aside."

### 5. Verify citations and aggregate

Before presenting, check that each finding's cited location and quoted code exist. Mark a finding whose citation doesn't match `citation not found` instead of dropping it. Beyond that, leave the findings' merits to the reader; within implement, its fix pass verifies them.

Present the two reports under `## Standards` and `## Spec` headings, verbatim or lightly cleaned, each ordered by severity, with **Declined to judge** at the end of the Spec report. Do **not** merge or rerank findings across axes, because the two axes are deliberately separate (see _Why two axes_).

End with a one-line summary: findings per severity in each axis, and the worst issue _within each axis_ (if any). Don't pick a single winner across axes: that's the reranking the separation exists to prevent.

When implement runs the review, write the report to `.scratch/<effort>/review.md`.

## Why two axes

A change can pass one axis and fail the other:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**

Reporting them separately stops one axis from masking the other.
