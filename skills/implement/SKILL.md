---
name: implement
description: Implement an effort's to-tickets tickets on an integration branch, dispatching weaker implementer subagents in parallel worktrees, verifying every merge, then running one final review. Use when the user asks to implement planned tickets.
---

# Implement

The goal is every ticket of an effort implemented on a single **integration branch**, each verified by you, followed by one review of the whole change. You are the orchestrator. Implementers make no design decisions; every decision they surface comes back to you.

The tickets under `.scratch/<effort>/tickets/` are not a list of steps. They are a **task graph** with blocking relationships, so there is always a **frontier** of tickets ready to be grabbed (see "Implementation ticket operations" in `docs/agents/issue-tracker.md` when present).

Communication to and from subagents should be sparse. Communicate primarily through **context pointers**: to the spec, tickets, and previous commits. Don't duplicate information already available via pointers.

## The ledger

The ticket files are the ledger. Your context may be compacted mid-run, so the record lives on disk: each ticket's `State:`, `Branch:`, and `## Result`, plus `git log`. Trust them over your own recollection. A ticket with `State: resolved` is done even if you don't remember doing it. Update a ticket in the same step as the merge or ruling it records.

## Models and stops

Dispatch implementers on a weaker, faster model and the final reviewer on the most capable available model. Name the model explicitly on every dispatch: an omitted model inherits the session's. If the host cannot choose models, say so once.

Four things stop you to ask the user, and only these: an irreversible or destructive operation; a security-sensitive action; a side effect outside the integration branch and its worktrees that norms say to ask about first (merging into a shared branch, pushing, publishing); and a ticket set so broken that every path forward is a guess. Otherwise keep going without check-ins.

## Rulings

When an implementer reports a ticket it cannot follow, decide: make the smallest change to the ticket that satisfies the spec, and append to its `## Result` a line `Ruling: <finding> — <decision and why> — <cost if wrong>`. If the ruling changes an interface, update every ticket that consumes it. Then dispatch the ticket again. Changing a ticket without a ruling line is a decision made in secret.

When an implementer reports code it could not make pass, diagnose it with the [diagnosing-bugs skill](../diagnosing-bugs/SKILL.md) in that worktree. Then fix it there as one focused change, or amend the ticket with a ruling and dispatch it again.

## Steps

1. **Read the task graph.** Read the tickets and the spec or issue they link. Resume from the ledger: skip resolved tickets. A claimed ticket with no running implementer is stale; inspect its branch, then continue it or reset it to `State: open`.

2. **Create the integration branch** `implement/<effort>` from the current branch, or check it out when it already exists.

3. **Dispatch the frontier.** For each frontier ticket, set `State: claimed` and `Branch: <branch>`, then dispatch an **implementer subagent** in the background, in its own worktree on its own branch based on the integration branch tip. Use the host's worktree isolation when available; otherwise create it with `git worktree add`. Give the implementer only pointers: the ticket path and its worktree. Each implementer:
   - confirms its worktree is based on the integration branch before starting, and resets onto it if not;
   - follows the ticket's implementer rules, loading the [tdd skill](../tdd/SKILL.md) to build it;
   - merges the integration branch tip into its own branch before reporting done;
   - reports the commands it ran with their results, or what blocks it.

4. **Verify each report before merging.** Treat the report as unverified claims. For a blocked ticket, make a ruling. For a done ticket, check with evidence from this session:
   - the diff stays within the ticket's Placement and its tests;
   - every test the ticket names exists and keeps the ticket's assertions and expected values; compare them with the ticket;
   - the ticket's test command and the full check pass on its branch, and you read their output.

   If any check fails, the ticket is not done: send it back with the failing output, or make a ruling. When all pass, merge the branch into the integration branch, re-run the full check if the integration branch moved since, and append to the ticket's `## Result` a line `complete (commits <base>..<head>, <command> → <result>)`, then set `State: resolved`.

5. **Advance the frontier.** When a merge resolves a ticket's last blocker, dispatch implementers for the newly unblocked tickets.

6. **Run the final review** once every ticket is resolved, with the [review-change skill](../review-change/SKILL.md) from the integration branch's base. It records the review in `.scratch/<effort>/review.md`.

7. **Fix in one pass.** A reviewer can lack context, so verify each finding before acting on it:
   - Check it against the code, the spec, the ruling lines, and the ADRs. Investigate every unclear finding before writing any fix ticket; findings can be related.
   - For a suggestion to build something more completely, check that the code is actually used; unused code is a candidate for removal instead.
   - A finding that conflicts with a decision the user made is a stop: ask the user.

   Re-grade each finding by its effect on a person using the software, not by the reviewer's label or by whether the spec mentions the input. Then:
   - **Critical and Important:** write each as a fix ticket in `tickets/` with the next unused number, starting with a test that reproduces the finding, and implement them through steps 3 to 5. If no failing test can reproduce a finding, it does not stand: record a ruling instead.
   - **Minor:** list them under "Deferred minors" in `review.md`; they do not enter the fix pass.
   - **Not fixing a Critical or Important finding** is a ruling, recorded in `review.md` with why the code stands and its cost if wrong.

   There is no second review: each fix's failing-then-passing test and the green full check are its verification.

8. **Finish.** Write the merge summary with the [pr skill](../pr/SKILL.md). Report the integration branch, the summary's path, every ruling line from the tickets and `review.md` under "Rulings I made", and the deferred minors. Leave merging into the main branch to the user. Remove the implementer worktrees and their merged branches.
