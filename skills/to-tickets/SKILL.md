---
name: to-tickets
description: Break an approved spec, plan, or the current conversation into tracer-bullet implementation tickets that a weaker agent can implement without making decisions. Use when the user asks for tickets or an implementation plan, or to-spec hands off an approved spec.
---

# To Tickets

Break the work into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it. Each ticket is the set of decisions its implementer cannot make alone: what to build, how to write it, and what counts as passing. You make those decisions; a weaker agent implements each ticket in its own fresh context, seeing only that ticket. A step is done when the implementer can write exactly one reasonable thing from it.

## Process

### 1. Gather context

With a spec (`.scratch/<effort>/spec.md`, or a path the user passes): read it in full, with the tickets, ADRs, and glossary entries it links. Continue only when it carries an `Approved:` line; otherwise send it back to [to-spec](../to-spec/SKILL.md) for approval. With a triaged issue (`.scratch/<effort>/issue.md` in `ready-for-agent`): work from its **Agent Brief**, with the issue body and triage notes as context. Otherwise, work from the plan or conversation in context. Read `docs/agents/domain.md` when present. Ticket titles and descriptions use the glossary's vocabulary and respect ADRs in the area you're touching.

### 2. Explore the codebase

Signatures and placement depend on the current code, so explore it before drafting. Find:

- the modules each change belongs to, and existing helpers the implementer should reuse
- the test and full-check commands, and prior-art tests to imitate
- opportunities to prefactor the code to make the implementation easier: "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is small enough that a weaker agent gets it right in one fresh context
- Any prefactoring comes first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately. Tickets on the frontier run in parallel, each in its own git worktree, so two tickets that touch the same file need a blocking edge between them.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Sequence it as **expand–contract** instead of a tracer bullet. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work
- **Placement**: the modules it changes

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown. Write the full tickets only after approval.

### 5. Write the tickets

Fill the ticket template below for each approved slice. Write the tests to the standard in the [tdd skill](../tdd/SKILL.md) and its test and mocking references: the implementer copies them as given. Each kind of entry carries what makes it unambiguous and nothing more:

- **A test step:** the test's name and its assertions, as code, with the spec's exact values in them.
- **A code step:** the exact signature (name, parameters, return type), its owning module, and the specific values the spec pins. The implementer writes the body. Add one line on the approach when the signature and test leave a choice (which library call, which data structure). A body appears only for an algorithm the signature and tests do not determine, or for exact copy the spec fixes.
- **A verification step:** the command to run and the output that means it passed.
- **A reference to another ticket:** that ticket's Interfaces block says what to use; this ticket does not repeat its code.

Placement names the files to modify in existing code; for new code, give the file's responsibility and suggested location. Line numbers go stale; leave them out. If a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts.

A ticket longer than the code it describes has written the code instead. Lines that decide nothing ("TBD", "handle edge cases", "add appropriate validation", a type or function no ticket defines) are the opposite failure.

### 6. Self-review

Check the full set against the spec yourself, and fix what you find inline:

1. **Coverage:** every user story and anti-goal in the spec maps to an acceptance criterion in some ticket. Add a ticket or criterion for each gap.
2. **Step scan:** every step lets the implementer write exactly one reasonable thing, and no step carries more than that.
3. **Interface consistency:** each signature a ticket consumes matches, name for name and type for type, the signature another ticket or the existing code produces.
4. **Review focus:** the failure modes and input classes the spec implies but no test exercises. For the five most likely to bite a user, add the test to the ticket that owns the code. The spec's silence on an input is not permission for that input to break the program.
5. **Parallel safety:** no two tickets that can run at the same time modify the same file.
6. **Proportion:** if code blocks are most of a ticket, replace bodies with signatures, test names, and assertions, then check that each step is still unambiguous.

### 7. Publish and hand off

Write one file per ticket under `.scratch/<effort>/tickets/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first), following `docs/agents/issue-tracker.md` when present. When `docs/agents/triage-labels.md` exists, add a `Status:` line with its `ready-for-agent` string. Leave the spec and map unchanged.

Report the frontier and which tickets can run in parallel. [implement](../implement/SKILL.md) builds the tickets and runs the single final review of the whole change.

<ticket-template>

# <NN>: <Ticket title>

State: open
Blocked by: <ticket numbers, or none>
Spec: <link to the spec, when there is one>

## Implementer rules

Implement exactly this ticket, in your own worktree. Keep the given tests, signatures, and placement as written. Build it with the `tdd` skill: watch each new test fail before implementing, then pass. If the ticket contradicts itself or the code, or cannot pass as written, stop and report what blocks you; leave the decision to the ticket author. If your code still fails after three fix attempts, stop and report the failing output and what you tried. Report the commands you ran with their results.

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not a layer-by-layer implementation list. Name the spec's user stories it serves.

## Interfaces

- Consumes: <exact signatures from earlier tickets or existing code, with their owning modules>
- Produces: <exact signatures later tickets rely on, with their owning modules>

## Placement

- Modify: <existing file>
- Create: <responsibility and suggested location>

## Steps

- [ ] Write the failing test `<test name>`:

  ```<language>
  <assertions with literal expected values>
  ```

- [ ] Run `<test command>`; expect FAIL with `<expected failure>`.
- [ ] Implement `<signature>` in `<owning module>`. <One line on the approach, only when a choice remains.>
- [ ] Run `<test command>`; expect PASS.
- [ ] Run `<full check command>`; expect it to pass.
- [ ] Commit.

## Acceptance criteria

- [ ] <Observable behaviour, checkable by a command or test>

</ticket-template>
