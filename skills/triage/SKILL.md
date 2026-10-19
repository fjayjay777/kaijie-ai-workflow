---
name: triage
description: Capture incoming bugs and requests as local issues, then move them through triage states. verify, categorise, route to grilling or wayfinder, and write agent briefs. Use when the user logs a bug or idea, or asks what needs triage.
---

# Triage

Move local issues through a small state machine of triage roles. Triage is the intake of the workflow: it decides whether a request is real, new, and ready, then routes it to the step that fits its size.

## Reference docs

- [AGENT-BRIEF.md](AGENT-BRIEF.md): how to write durable agent briefs
- [OUT-OF-SCOPE.md](OUT-OF-SCOPE.md): how the `.out-of-scope/` knowledge base works

## Issues

An issue is `.scratch/<effort>/issue.md`: one request per effort directory, so a map, spec, and tickets that grow from it sit beside it. Follow `docs/agents/issue-tracker.md` when present. Refer to an issue by its effort name and first heading.

```markdown
# <Issue title>

Category: bug
Status: needs-triage
State: open

<the request as reported>
```

Triage notes and agent briefs are appended as their own sections; other discussion goes under `## Comments`.

## Roles

Two **category** roles, recorded in the `Category:` line:

- `bug`: something is broken
- `enhancement`: new feature or improvement

Five **state** roles, recorded in the `Status:` line:

- `needs-triage`: maintainer needs to evaluate
- `needs-info`: waiting for information from the user or an outside source
- `ready-for-agent`: fully specified, ready for [to-tickets](../to-tickets/SKILL.md)
- `ready-for-human`: needs human implementation
- `wontfix`: will not be actioned

Every triaged issue carries exactly one category role and one state role. If state roles conflict, flag it and ask the maintainer before doing anything else.

These are canonical role names. Use the `Status:` strings mapped in `docs/agents/triage-labels.md` when present; otherwise use the role names as they are.

State transitions: a new issue starts at `needs-triage`; from there it moves to `needs-info`, `ready-for-agent`, `ready-for-human`, or `wontfix`. `needs-info` returns to `needs-triage` once the missing information arrives. `wontfix` also sets `State: resolved`. The maintainer can override at any time; flag transitions that look unusual and ask before proceeding.

## Invocation

The maintainer describes what they want in natural language. Interpret the request and act. Examples:

- "Log this bug: exports drop the last row"
- "Show me anything that needs my attention"
- "Let's look at csv-export"
- "Move csv-export to ready-for-agent"
- "What's ready for agents to pick up?"

## Capture an issue

Write the request to a new `.scratch/<effort>/issue.md` in the reporter's words, with a recommended category and `Status: needs-triage`. Pick an effort slug that names the request; ask when it would collide with an existing effort. Then offer to triage it now.

## Show what needs attention

Scan `.scratch/*/issue.md` and present three buckets, oldest first:

1. **Missing `Status:`**: never triaged.
2. **`needs-triage`**: evaluation in progress.
3. **`needs-info` with new comments since the last triage notes**: needs re-evaluation.

Skip issues whose effort directory has a `map.md`: the wayfinder map tracks them. Show counts and a one-line summary per item. Let the maintainer pick.

## Triage a specific issue

1. **Gather context.** Read the full issue, including prior triage notes, so you don't re-ask resolved questions. Read `docs/agents/domain.md` when present, then explore the codebase using the glossary's vocabulary and respecting ADRs in the area. Run two checks against the codebase: (a) **redundancy**: search for an existing implementation of the requested behavior by domain concept (not just the request's wording), and report where you looked. If found, it's an already-implemented `wontfix` (step 5). (b) **prior rejection**: read `.out-of-scope/*.md` and surface any that resembles this request.

2. **Recommend.** Tell the maintainer your category and state recommendation with reasoning, plus a brief codebase summary relevant to the request (including whether it's already implemented). Wait for direction.

3. **Verify the claim.** Before any grilling, check that the claim holds up. For a bug, reproduce it from the reported steps. Report what happened: confirmed (with code path), failed, or insufficient detail (a strong `needs-info` signal). A confirmed verification makes a much stronger agent brief.

4. **Shape it to its size.**
   - **Fits one agent brief:** sharpen it with the [grilling skill](../grilling/SKILL.md), a round of questions at a time, and the [domain-modeling skill](../domain-modeling/SKILL.md) when domain terms or durable decisions land.
   - **Too big or uncertain for one brief:** recommend [wayfinder](../wayfinder/SKILL.md) in the same effort directory. Once the maintainer agrees, add a triage note linking the map and leave the status as it is; the map tracks the effort from there.

5. **Apply the outcome:**
   - `ready-for-agent`: append an `## Agent Brief` section ([AGENT-BRIEF.md](AGENT-BRIEF.md)). [to-tickets](../to-tickets/SKILL.md) turns it into tickets.
   - `ready-for-human`: same structure as an agent brief, but note why it can't be delegated (judgment calls, external access, design decisions, manual testing).
   - `needs-info`: append triage notes (template below).
   - `wontfix`, with the note depending on *why*:
     - **Already implemented**: the change already exists in the codebase. Point to where it lives; leave `.out-of-scope/` alone, since that knowledge base is for *rejected* requests, not built ones.
     - **Rejected (bug)**: give a short explanation.
     - **Rejected (enhancement)**: write to `.out-of-scope/` and link to it from the triage note ([OUT-OF-SCOPE.md](OUT-OF-SCOPE.md)).
   - `needs-triage`: apply the role. Add a triage note if there's partial progress.

## Quick state override

If the maintainer says "move csv-export to ready-for-agent", trust them and apply the role directly. Confirm what you're about to do (role changes, notes, resolution), then act. Skip grilling. If moving to `ready-for-agent` without an agent brief, ask whether they want one written; to-tickets needs a brief or a spec to work from.

## Needs-info template

```markdown
## Triage Notes

**What we've established so far:**

- point 1
- point 2

**What we still need (and from whom):**

- question 1
- question 2
```

Capture everything resolved during grilling under "established so far" so the work isn't lost. Questions must be specific and actionable, not "please provide more info".

## Resuming a previous session

If prior triage notes exist on the issue, read them, check whether any outstanding questions have been answered, and present an updated picture before continuing. Skip questions already resolved.
