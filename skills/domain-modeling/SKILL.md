---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a GLOSSARY.md, or recording or editing an ADR.
license: MIT
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. Reading `GLOSSARY.md` for vocabulary is a consumer habit covered by `docs/agents/domain.md`; this skill is for changing the model.

## File structure

Find the layout in `docs/agents/domain.md` when present. Otherwise infer it: a root `GLOSSARY-MAP.md` means multiple contexts, each with its own `GLOSSARY.md` and optional `docs/adr/`; system-wide ADRs stay in the root `docs/adr/`. Most repos have a single context: one root `GLOSSARY.md` and `docs/adr/`.

Create files lazily: only when you have something to write. If no `GLOSSARY.md` exists, create one when the first term is resolved. If no `docs/adr/` exists, create it when the first ADR is needed.

## During the session

Ask every user-facing question below through the [grilling skill](../grilling/SKILL.md), so evidence in the code and existing decisions is checked before the user is asked.

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in `GLOSSARY.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update GLOSSARY.md inline

When a term is resolved, update `GLOSSARY.md` right there. Capture each term as it is resolved. Use the format in [GLOSSARY-FORMAT.md](./GLOSSARY-FORMAT.md).

`GLOSSARY.md` holds only domain language, free of implementation details. Specs, scratch notes, and implementation decisions belong elsewhere.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

## Within a wayfinder ticket

The glossary and ADRs are the single source of truth for terms and durable decisions. When a ticket's answer settles a term or warrants an ADR, write it there and link it from the ticket's **Answer** in one line, keeping the detail in the glossary or ADR.

## Attribution

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling) under the MIT License; see [LICENSE](./LICENSE).
