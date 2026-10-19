---
name: to-spec
description: Synthesize settled decisions from a wayfinder map or the current conversation into a local implementation spec. Use when the user asks for a spec, or wayfinder hands off a spec destination.
---

# To Spec

Turn decisions already made into a spec an implementer can work from. This is **synthesis**: the spec records the result of earlier discussion and makes no new material decisions. Write it when the user asks for a spec or a wayfinder handoff names a spec as its destination.

## Process

1. **Gather the settled decisions.**
   - With a wayfinder map (the user names the effort or map, or `.scratch/<effort>/map.md` exists for this work): read its Outcome, Destination, Notes, Decisions so far, and Out of scope. Zoom into each resolved ticket's **Answer** the spec relies on, and follow its links to research, prototypes, glossary entries, and ADRs.
   - Without a map: use the current conversation.
   - Read `docs/agents/domain.md` when present. Use the glossary's vocabulary throughout and respect ADRs in the area you're touching.
   - Explore the codebase to understand its current state, if you haven't already.

   Done when every Decisions-so-far entry is either reflected in the spec or judged irrelevant to implementation.

2. **Surface gaps instead of filling them.** A gap is a material decision with no settled answer: an open map ticket, in-scope fog under **Not yet specified**, or a conflict between the conversation and a recorded decision. Report each one and stop. With a map, point to the existing ticket or add a new one through wayfinder's normal create-then-wire step; without a map, resolve it with the [grilling skill](../grilling/SKILL.md) first. Carry delegated choices from the map's Notes into **Left to the Builder**.

3. **Sketch the test seams.** Prefer existing seams to new ones. Use the highest seam possible; if new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better: the ideal number is one. Confirm the seams through grilling, so the code is checked before the user is asked.

4. **Write the spec** using the template below. Save it at `.scratch/<effort>/spec.md`, beside the map when there is one, following `docs/agents/issue-tracker.md` when present.

5. **Run the builder check.** Dispatch a fresh subagent with [builder-check-prompt.md](./builder-check-prompt.md). Tell the user a cold reader is checking the spec first and that one round of questions may follow. Sort what the builder asks into three piles:
   - **Answered already** by the map, conversation, or project: put the answer in the spec.
   - **Minor**: a sensible builder could settle it without changing what gets built. Settle it yourself and mark it in the spec as `(agent's call)`.
   - **Theirs**: only the user can answer it, and the answer changes what gets built. If it reopens a recorded decision or the Outcome, treat it as a gap (step 2). Otherwise ask the whole pile in one numbered message, most important first, with your recommendation for each, and write the answers into the spec.

   That is the only round of questions the check produces. Without subagent support, say so and read the spec as that builder yourself.

6. **Get approval.** Give the user the spec path and the list of agent's calls to check while reading. Approval covers the spec as shown; when a change follows, show the changed parts and get approval for them. Planning and implementation start only after approval.

7. **Hand off.** Add an `Approved: <YYYY-MM-DD>` line near the top of the spec. With a map, link the approved spec from the map's **Destination**. When `docs/agents/triage-labels.md` exists, add a `Status:` line near the top of the spec with its `ready-for-agent` string. Report the spec path; [to-tickets](../to-tickets/SKILL.md) plans the implementation next.

## Spec template

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## Anti-goals

Results that would make this a failure even if it technically works. With a map, carry over its Outcome's unacceptable results.

## User Stories

A long, numbered list of user stories, in the format:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

Cover every behaviour the solution changes, including edge cases. With a map, every success condition in its Outcome is served by at least one story.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

State each decision and link the ticket or ADR that holds its rationale, rather than restating the discussion.

Describe modules and interfaces by name, without file paths or code snippets: those go stale quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- The seams agreed in step 3
- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Left to the Builder

Choices deliberately handed to the implementer, so a silent topic reads as delegated rather than forgotten. Include delegated choices carried from the map's Notes.

## Out of Scope

A description of the things that are out of scope for this spec, including the map's **Out of scope** entries when there is a map.

## Further Notes

Any further notes about the feature.

</spec-template>
