---
description: "Docs only - generate PRD-DOCS.md in English"
---

# `/plan-en`

Argument: `$ARGUMENTS` — a feature idea, a rough description, a wireframe
image, or a pointer to existing notes. Can be given in English or
Vietnamese — the *output document* is English either way.

## Rule

This command produces exactly **one file**: `PRD-DOCS.md`, in
professional English. No code, no scaffolding, no dependencies installed,
no test files. That's `/build`'s job, after this doc is approved.

## Steps

1. Apply the `ba-document` skill's **method** (`.claude/skills/ba-document/SKILL.md`)
   — role, the 4-pillar structure (Overview & Actor Matrix; Master Process
   Flows; User Stories with 6-step AC; Data Dictionary & 15–20 Golden
   Business Rules), and the Mermaid syntax-safety rules in the skill's §3
   apply exactly as written, language-independent.
2. **Override the skill's default output language.** The skill's own
   embedded template skeleton (its §4) and `PRD-DOCS-TEMPLATE-VN.md`
   both hardcode Vietnamese in the metadata header — ignore that for this
   command. Instead use `.claude/skills/ba-document/PRD-DOCS-TEMPLATE-EN.md`
   as the structural and header reference. Write every section — headers,
   table content, prose, business rules — in English. Keep standard BA/ITC
   terms as-is (they're already English: `User Story`, `Acceptance
   Criteria`, `MUST`, `RBAC`...).
3. **Output path is fixed for this project — don't run the skill's generic
   §2.2 inference.** This project already has a `docs/` folder at its
   root. Save to `docs/prd-docs/<feature-slug>/PRD-DOCS.md`. Always anchor
   under this project's existing `docs/`, never elsewhere, even if a
   different structure seems plausible.
4. If the input is thin, apply the skill's own §5 policy: reasonable
   industry-standard defaults, assumptions stated in §1.1 (in English),
   don't interrogate the operator with a long question list.
5. Before presenting, run the skill's own §6 Quality Gate Checklist,
   substituting "single file, English" for the checklist's Vietnamese-
   specific wording. Fix silently before showing the operator.
6. Present the file path and a short list (3–5 bullets) of the
   assumptions made.
7. Gate: don't suggest `/build` until the operator has reviewed this doc.
   Edits go in place — don't create a second version file.

## If this feature already has code

Stop and use `/plan-old-en` instead. This command assumes there's no
implementation yet — its only source is the idea/description you give it.
Running it against an already-built feature means it'll guess at behavior
instead of reading what's actually there.

## If the operator wants Vietnamese instead

Stop and point them to `/plan-vn` — don't translate mid-command. Each
language is a distinct, complete generation pass against its own template,
not a translation of the other.
