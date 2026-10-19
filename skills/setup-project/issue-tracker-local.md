# Issue tracker: Local Markdown

Issues and specs for this repo live as markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`, never a single combined tickets file
- Triage state is recorded as a `Status:` line near the top of each issue file (only when triage is configured; see `docs/agents/triage-labels.md` for the role strings)
- Execution state is a separate `State:` line: `open`, `claimed`, or `resolved`.
- Allocate the next unused ticket number. Resolve bare numbers within the feature; ask when the feature is ambiguous.
- Comments and conversation history append to the bottom of the file under a `## Comments` heading

## When a skill says "publish to the issue tracker"

Write specs to `spec.md` and individual tickets to `issues/<NN>-<slug>.md` under `.scratch/<feature-slug>/`, creating directories as needed.

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
