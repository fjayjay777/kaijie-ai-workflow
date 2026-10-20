# Issue tracker: Local Markdown

Issues, maps, specs, and tickets for this repo live as markdown files in `.scratch/`.

## Conventions

- One effort per directory: `.scratch/<effort>/`, where `<effort>` is a short kebab-case slug for the work. An intake issue, its wayfinder map, its spec, and its implementation tickets share one effort directory.
- The intake issue is `.scratch/<effort>/issue.md`, with `Category:`, `Status:`, and `State:` lines near the top
- The spec is `.scratch/<effort>/spec.md`
- Implementation tickets are one file per ticket at `.scratch/<effort>/tickets/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file. Wayfinder decision tickets stay separate under `issues/`.
- Triage state is recorded as a `Status:` line near the top of the intake issue, spec, and implementation tickets (only when triage is configured; see `docs/agents/triage-labels.md` for the role strings). Wayfinder decision tickets carry no `Status:`.
- Execution state is a separate `State:` line: `open`, `claimed`, or `resolved`.
- `issues/` and `tickets/` each number their own files from `01`. Allocate the next unused number in that directory, and resolve a bare number in a `Blocked by:` line within the directory of the ticket that contains it. Refer across directories or efforts by repository-relative path. Ask when the effort is ambiguous.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Write specs to `spec.md` and implementation tickets to `tickets/<NN>-<slug>.md` under `.scratch/<effort>/`, creating directories as needed.

## When a skill says "fetch the relevant ticket"

Read the file at the referenced path. The user will normally pass the path or the issue number directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a file with one **child** file per ticket.

- **Map**: `.scratch/<effort>/map.md` (the Notes / Decisions-so-far / Fog body).
- **Child ticket**: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`, with the question in the body. A `Type:` line records the ticket type (`research`/`prototype`/`grilling`/`task`); a `State:` line records `open`/`claimed`/`resolved`.
- **Blocking**: a `Blocked by: NN, NN` line near the top. A ticket is unblocked when every listed ticket has `State: resolved`. Missing references remain blockers.
- **Frontier**: scan `.scratch/<effort>/issues/` for files that are open, unblocked, and unclaimed; first by number wins.
- **Claim**: set `State: claimed` and save before any work.
- **Resolve**: append the answer under an `## Answer` heading, set `State: resolved`, then append a context pointer (gist + link) to the map's Decisions-so-far in `map.md`.

## Implementation ticket operations

Used by `to-tickets` and `implement`.

- **Ticket**: `.scratch/<effort>/tickets/NN-<slug>.md`, with `State:` and `Blocked by:` lines near the top.
- **Frontier**: tickets with `State: open` whose blockers in `tickets/` all have `State: resolved`. Frontier tickets may run in parallel, each in its own git worktree.
- **Claim**: set `State: claimed` and add a `Branch:` line naming the implementer's branch.
- **Resolve**: append the completion line and any `Ruling:` lines under `## Result`, then set `State: resolved`. The ticket files are the implementation ledger.
