---
name: grilling
description: Clarify the outcome behind an idea or stress-test a plan by working its decision tree, using a subagent to attempt each question before asking the user.
---

# Grilling

Reach a shared understanding of the user's intended outcome. Map this as a **design tree**: every decision branches into the decisions that depend on it.

Work the tree in **rounds**. The **frontier** contains decisions whose prerequisites are settled. Process the whole frontier as one batch, sending each proposed question through the answer-first review below before showing it to the user. Present all remaining independent user questions together, then wait for their answers and recompute the frontier. Questions that depend on an unsettled answer belong to a later round.

For a small request, use this skill directly without creating a wayfinder map. When called by wayfinder, use its current ticket and map as the record. Do not start a second discovery process or repeat questions already settled.

## Before every question: attempt, review, then route

1. Form the current batch of independent candidate questions that would materially improve the outcome. Include the relevant user statements, existing decisions, constraints, and evidence sources. Skip questions already answered. Apply steps 2 through 5 to each candidate; independent subagent attempts may run in parallel within the host's limits.
2. **Dispatch a subagent before asking that question.** Use [subagent-prompt.md](./subagent-prompt.md), scoped to this one question. The subagent may inspect relevant sources and propose an answer; it must not interview the user, spawn more agents, edit the project, or make commitments. This includes follow-up clarification questions; if the question changes materially, review it again.
3. **Review the answer yourself.** Check its evidence against the actual request and project. Accept it only if it addresses the question, fits the known outcome and constraints, and leaves no material unsupported assumption. Agreement between two agents or a confident score is not evidence.
4. Route the result:
   - **Supported fact:** show the concise answer and its essential evidence, then continue.
   - **Routine choice delegated to the agent:** show the chosen default and brief reason, then continue. Treat the user's request to handle simple details as delegation of reversible implementation details consistent with the known outcome.
   - **Unresolved fact:** inspect or research it; do not ask the user to retrieve information available to the agent.
   - **Material user decision:** ask the remaining question with the best supported recommendation. New goals, personal preferences, budget commitments, or meaningful trade-offs need the user's input unless already explicitly settled or delegated.
5. Update the tree with the basis of the answer: observed fact, prior user statement, delegated choice, or still proposed. A subagent's guess is never a user statement, and cannot supply an approval or consent.

A candidate answer that fails review does not automatically become a user question. Correct it or obtain missing evidence first. If the only missing information belongs to the user, ask precisely for that gap. Avoid repeated speculative attempts when no new evidence is available.

If subagents are unavailable, state that limitation once and use the same evidence-based routing yourself. Do not claim an independent review occurred.

## Ask for the real outcome

- When consequential intent remains unclear, form a candidate question about an actual situation: "Walk me through the last time you needed this." Identify the person, problem, and desired change before treating a requested feature as the goal.
- Use the user's vocabulary. Prefer an open question when exploring intent; offer a short set of options when they need help choosing.
- Explore observable success, constraints, what is excluded, and what would make the result unacceptable. Ask which decisions they want to make and which they delegate.
- Briefly play back your understanding for correction. Mark your interpretations and suggested defaults as yours; preserve what the user actually said.
- Use a concrete example or rough prototype when words do not settle behavior. Ask only about remaining consequential uncertainty, not every imaginable branch.

These methods guide candidate questions; they do not bypass the subagent review.

## Present a round

Show accepted answers or defaults briefly, then present every remaining independent user question in one numbered batch. Give each question a short title, its question body, and a recommended answer when supported. Phrase recommendations so a short response can accept them, while keeping proposals distinct from known user preferences.

For example:

> Use the project's existing CSV writer; its tests already cover quoted fields.
>
> **Q1 - Row selection:** Should exports include only the visible rows?
>
> Recommendation: match the current filters, so the file reflects what the user sees.
>
> **Q2 - Personal fields:** Should the export include customer email addresses?
>
> Recommendation: omit them unless the intended workflow needs them.

These are illustrative questions, not mandatory topics; the first answer needs actual project evidence. The user can respond to the batch by number or accept all recommendations in one reply. Group related questions when useful, but do not deliberately turn independent questions into a one-at-a-time interview.

Wait for the batch's user decisions before asking dependent questions in the next round. A factual investigation still in progress blocks only its dependent questions; other reviewed, independent questions can form the current batch. If no user question remains, state the reviewed result and continue authorized work without ceremonial confirmation.

## Finish

Stop clarifying when no material unresolved branch prevents the requested outcome or the current handoff. Summarize the outcome and essential decisions once. Preserve genuinely pending user choices; do not invent answers to empty the tree. Continue within existing authorization, or return the result to wayfinder for its normal ticket resolution and handoff.
