---
description: "Docs only - generate PRD-DOCS.md in Vietnamese"
---

# `/plan-vn`

Argument: `$ARGUMENTS` — a feature idea, a rough description, a wireframe
image, or a pointer to existing notes. Can be given in English or
Vietnamese — the *output document* is Vietnamese either way.

## Rule

This command produces exactly **one file**: `PRD-DOCS.md`, in
professional Vietnamese. No code, no scaffolding, no dependencies
installed, no test files. That's `/build`'s job, after this doc is
approved.

## Steps

1. Apply the `ba-document` skill (`.claude/skills/ba-document/SKILL.md`)
   using `.claude/skills/ba-document/PRD-DOCS-TEMPLATE-VN.md` as the
   structural reference — this is the skill's native language, no
   overrides needed. Follow the skill's method exactly: role, the
   4-pillar structure, and Mermaid syntax-safety rules.
2. **Output path is fixed for this project — don't run the skill's generic
   §2.2 inference.** This project already has a `docs/` folder at its
   root. Save to `docs/prd-docs/<feature-slug>/PRD-DOCS.md`. Always anchor
   under this project's existing `docs/`, never elsewhere, even if a
   different structure seems plausible.
3. If the input is thin, apply the skill's own §5 policy: reasonable
   industry-standard defaults, assumptions stated in §1.1, don't
   interrogate the operator with a long question list.
4. Before presenting, run the skill's own §6 Quality Gate Checklist. Fix
   silently before showing the operator.
5. Present the file path and a short list (3–5 bullets, in the language
   the operator is chatting in) of the assumptions made.
6. Gate: don't suggest `/build` until the operator has reviewed this doc.
   Edits go in place — don't create a second version file.

## If this feature already has code

Stop and use `/plan-old-vn` instead. This command assumes there's no
implementation yet — running it against an already-built feature means
it'll guess at behavior instead of reading what's actually there.

## If the operator wants English instead

Stop and point them to `/plan-en` — don't translate mid-command. Each
language is a distinct, complete generation pass against its own template,
not a translation of the other.
