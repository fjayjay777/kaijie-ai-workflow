---
name: wayfinder
description: Clarify the outcome behind a broad or uncertain large request, then manage its unresolved decisions as a shared local Markdown map across sessions.
---

A loose idea has arrived, too big for one agent session, and wrapped in fog: the way from here to the **destination** isn't visible yet. Wayfinding is about finding that way, not charging at the destination. This skill charts the way as a **shared map** in the repo's local Markdown tracker, then works its **decision tickets** (questions whose resolution is a decision, not slices of a build to execute) one at a time until the route is clear.

The destination varies per effort. First understand the outcome, then name the planning destination: together they shape every ticket. It might be a spec to hand off and iterate on, a decision to lock before planning starts, or a change made in place like a data-structure migration. The map is domain-agnostic: engineering work, course content, whatever fits the shape.

## Outcome clarification

Use the [grilling skill](../grilling/SKILL.md) when clarifying the outcome or resolving a conversation ticket. Route every user-facing clarification question through it, including an ambiguous effort selection. Wayfinder owns the map, dependencies, and ticket lifecycle. Keep the current map and ticket as the shared record; do not restart discovery or maintain a second decision tree.

Record the **Outcome** as the real-world improvement and observable success conditions. The **Destination** is this planning effort's exit condition or handoff artifact. Link each decision ticket to the outcome criterion it affects; implementation tasks follow after those decisions are clear.

## Plan, don't do

Wayfinder is **planning** by default: each ticket resolves a decision, and the map is done when the way is clear, with nothing left to decide before someone goes and does the thing. The pull to just do the work is usually the signal you've reached the edge of the map and it's time to hand off. An effort can override this in its **Notes**, carrying execution into the map itself, but absent that, produce decisions, not deliverables.

## Refer by name

Every map and ticket has a **name**: its first Markdown heading. In everything the human reads (narration, the map's Decisions-so-far), refer to it by that name, never by a bare id, number, or slug. A wall of `#42, #43, #44` is illegible; names read at a glance. Use the name as the link text and the local file path as its target.

## The Map

The map is `.scratch/<effort>/map.md`, the canonical artifact. Its decision tickets are separate files under `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`. The effort directory groups the map and its tickets; no remote issues or labels are created.

The map is an **index**, not a store. It lists the decisions made and points at the tickets that hold their detail; a decision lives in exactly one place, its ticket, so the map never restates it, only gists it and links.

Read `docs/agents/issue-tracker.md`, especially "Wayfinding operations", when present. Otherwise use the local convention in this skill; `setup-project` can establish the shared project documents later. A remote Git repository never changes the local tracker choice.

### The map body

The whole map at low resolution, loaded once per session. Open tickets are **not** duplicated in the map: scan the effort's `issues/` directory and read their metadata to find them. Give the map a descriptive first heading before the sections below.

```markdown
## Outcome

- User and situation: <who needs this and when>
- Desired improvement: <what should change and why>
- Success: <observable evidence that the outcome was achieved>
- Constraints and unacceptable results: <limits and what would make it fail>

## Destination

<what reaching the end of this map looks like: the spec, decision, or change this effort is finding its way to. One or two lines; every session orients to it before choosing a ticket.>

## Notes

<domain; relevant skills; standing preferences; explicitly marked assumptions and choices delegated to the agent>

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [<closed ticket title>](link): <one-line gist of the answer>

## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->
```

### Tickets

Each ticket is identified by its repository-relative path. Give it a descriptive heading and size its question to fit one agent session. For example:

```markdown
# Choose the export format

Type: grilling
State: open
Blocked by: none

## Question

Which export format fits the intended users and downstream tools?

## Outcome link

Users must be able to open the export in their existing analysis tool.
```

Each ticket has a `Type:` value of `research`, `prototype`, `grilling`, or `task` (see [Ticket Types](#ticket-types)). These are decision tickets, so omit implementation triage `Status:` labels such as `ready-for-agent`. Track execution separately in `State: open`, `State: claimed`, or `State: resolved`.

A session **claims** a ticket by saving `State: claimed` before work. Re-read it immediately before claiming and skip tickets already claimed by another session. Local file edits are not an atomic lock; use a single writer for a ticket and coordinate parallel work explicitly.

Write dependencies in `Blocked by:` using ticket numbers within the same effort, or explicit repository-relative paths for other efforts. A ticket is **unblocked** when every referenced ticket has `State: resolved`; missing references remain blockers. The **frontier** is the `State: open` tickets with no unresolved blockers, ordered by ticket number. If no ticket is available but work remains, report the claimed work, missing reference, or dependency cycle instead of declaring completion.

Keep the original question intact. Record the answer under `## Answer` when resolving the ticket (see [Work through the map](#work-through-the-map)). Link research and prototype assets instead of pasting them into the map.

## Ticket Types

Tickets may be **HITL** (a live user decision or reaction is needed) or **AFK** (the agent can resolve them from evidence or delegated choices). For conversation tickets, grilling determines which questions remain HITL after its subagent-first review. Never record a proposed user preference or an agent-generated approval as the user's decision.

- **Research** (AFK): Read documentation, APIs, or local resources to establish facts a decision needs. Use an available research skill; save findings and source links under `.scratch/<effort>/research/` and link them from the ticket. Delegate independent research only when subagents are available and authorized; otherwise research inline. No branch creation or push is required.
- **Prototype** (HITL): Create a cheap, rough artifact for the user to react to when appearance or behavior needs clarification. Use a prototype skill when available, and link the artifact. Resolve through the user's feedback, not merely by building it.
- **Grilling** (HITL or AFK): Conversation, the default. Load [grilling](../grilling/SKILL.md) within the current ticket. Use its reviewed answers for factual or delegated choices, and involve the user only for the remaining material decisions. Record whether the answer came from evidence, an existing user statement, or delegated judgment. Use [domain-modeling](../domain-modeling/SKILL.md) when the ticket settles a domain term or a hard-to-reverse decision.
- **Task** (HITL or AFK): Prerequisite work that unblocks a decision rather than implements the destination. Act within existing authorization; where human action is needed, provide a precise checklist. Record resulting facts and references, not secret values.

Read `docs/agents/domain.md` when present. Grilling and domain-modeling are bundled dependencies: if either is unavailable, ask for it to be installed before starting conversation work. Other helper skills are optional; use the corresponding method above and disclose material limitations.

## Fog of war

The map is _deliberately_ incomplete: don't chart what you can't yet see. Beyond the live tickets lies the **fog of war**: the dim view of decisions and investigations you can tell are coming but can't yet pin down, because they hang on questions still open. Resolving a ticket clears the fog ahead of it, graduating whatever's now specifiable into fresh tickets, one at a time, until the way to the destination is clear and no tickets remain.

The map's **Not yet specified** section is where that dim view is written down: the suspected question, the area to revisit later. It's the undiscovered frontier _toward_ the destination: everything here is in scope, just not sharp enough to ticket. Write as loosely or as fully as the view allows; it doubles as a signpost for collaborators reading where the effort is headed.

**Fog or ticket?** The test is whether you can state the question precisely now, _not_ whether you can answer it now.

- **Ticket when** the question is already sharp, even if it's blocked and you can't act on it yet.
- **Not yet specified when** you can't yet phrase it that sharply. Don't pre-slice the fog into ticket-sized pieces: it's coarser than a ticket, and one patch may graduate into several tickets, or none, once the frontier reaches it.

**Not yet specified** excludes what's already decided (Decisions so far), what's already a live ticket, and what's out of scope (the next section).

## Out of scope

Fog only ever gathers _toward_ the destination. The destination fixes the scope, so work beyond it is **out of scope**: it isn't fog, and it doesn't belong in **Not yet specified**. It gets its own **Out of scope** section on the map: work you've consciously ruled out of _this_ effort. Scope, not sharpness, lands it here.

Out-of-scope work never graduates (the frontier stops at the destination), so it returns only if the destination is redrawn, and then as a fresh effort, not a resumption.

Ruling something out of scope is a scoping act, not a step on the route. When a ticket that already exists turns out to sit past the destination (mis-scoped in while charting, or exposed by a resolution), **set `State: resolved` and record `Resolution: out-of-scope`** (so the ticket leaves the frontier) and leave one line in the **Out of scope** section: the gist plus why it's out of scope, linking that ticket. It stays out of **Decisions so far**, which records the route actually walked; a scope boundary isn't a step on it.

## Invocation

Two modes. Either way, **never resolve more than one ticket per session**, with the exception of research tickets.

### Chart the map

User invokes with a loose idea.

1. **Agree the outcome and destination.** Use [grilling](../grilling/SKILL.md) to understand the intended improvement and observable success. Use its answer-first review before asking the user for missing context. Record what this planning effort must settle or hand off, and reuse prior agreement.
2. **Map the frontier.** Explore **breadth-first**: identify decisions affecting the agreed outcome before diving into one solution. Separate known answers from assumptions, precise questions, and fog. If the route is already clear and small enough for one session, summarize it and continue according to the user's existing request; a map is unnecessary.
3. **Create the map** at `.scratch/<effort>/map.md`: Outcome, Destination, and Notes filled in, Decisions-so-far empty, the fog sketched into **Not yet specified**. This map is the shared planning record; do not add a second brainstorming document or duplicate its questions.
4. **Create the tickets you can specify now** under the effort's `issues/` directory using the next unused numbers. Then fill `Blocked by:` and cross-references in a **second pass**, using real filenames. This separates the frontier from blocked tickets; everything not yet sharp enough stays in **Not yet specified**.
5. **Resolve available research tickets** using the research method above. Claim each ticket before work and save its answer and source links locally. Use parallel research only when supported and authorized.
6. Stop: charting is one session's work; it hand-resolves nothing.

### Work through the map

User invokes with a map path or effort name. Ask for the effort only when ambiguous. A ticket is **optional**: without one, you pick the next decision, not the user.

1. Load the **map**: orient to Outcome and Destination, not every ticket body. For an older map without Outcome, use prior discussion to add it; clarify only consequential gaps.
2. Choose the ticket. If the user named one, use it. Otherwise take the first frontier ticket in order. **Claim it**: save `State: claimed` before any work.
3. Resolve it according to its `Type:` field (see [Ticket Types](#ticket-types)). **Zoom as needed**: read related or resolved tickets on demand, and load available skills named in `## Notes`. Use [grilling](../grilling/SKILL.md) for conversation tickets and connect its result to the outcome criterion. A reviewed fact or delegated choice can resolve the ticket without another confirmation. If a material user decision remains unanswered, keep the ticket unresolved.
4. Record the resolution: append an **Answer** to the ticket, save `State: resolved`, and **append a context pointer** to the map's Decisions-so-far. Record meaningful discussion under `## Comments` when needed.
5. Add newly-surfaced tickets (create-then-wire); graduate any fog the answer has made specifiable, clearing each graduated patch from **Not yet specified** so it lives only as its new ticket. If the answer reveals that a ticket (this one or another) sits beyond the destination, **rule it out of scope** rather than resolving it on the route. If the decision invalidates other parts of the map, update those tickets or resolve them as superseded with a link to their replacement; preserve the decision history. If an answer contradicts Outcome, surface the mismatch and agree any correction before updating affected decisions; do not silently substitute a new goal.

The user may run unblocked tickets in parallel. Re-read files before updates, preserve other sessions' changes, and treat a stale claim or edit conflict as coordination work.

## Handoff

The route is clear when no unresolved decision or in-scope fog prevents planning or delivering the agreed destination. Check decisions against the outcome and its success conditions, not merely the absence of open files. Summarize the outcome, key decision links, constraints, and remaining implementation work once. Hand that record to the next planning or delivery step: when the Destination is a spec, use [to-spec](../to-spec/SKILL.md) with this map as its input. Clarification alone does not establish that the user's outcome has been achieved.
