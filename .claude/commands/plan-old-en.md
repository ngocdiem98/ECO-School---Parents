---
description: "Docs only - write PRD-DOCS.md (English) for an existing feature that already has code but no docs yet"
---

# `/plan-old-en`

Argument: `$ARGUMENTS` — which existing feature to document (a route,
component, or module name/path). Point it at real code, not a
description from memory — that's the whole difference from `/plan-en`.

## Purpose

For a feature that's already built and shipped, with no `PRD-DOCS.md` yet.
This is retrofit documentation, not a spec for new work — it must describe
what the code actually does, not what would be ideal or standard. If the
feature doesn't have code yet, use `/plan-en` instead.

## Rule

Same output contract as `/plan-en`: exactly one file, `PRD-DOCS.md`,
English. No code changes happen here. Afterward, `/build` only adds
Playwright coverage for what's already implemented and fixes doc/code
mismatches it finds — it doesn't rebuild the feature.

## Steps

1. **Check first.** Does `docs/prd-docs/<feature-slug>/PRD-DOCS.md`
   already exist for this feature? If yes, stop and ask the operator
   whether to skip it (already covered) or intentionally regenerate —
   never overwrite silently.
2. **Read the real implementation before writing anything** — the actual
   route/component/module files for this feature (check `app/`,
   `components/`, `lib/`, `design_system/`). This is mandatory, not a
   fallback. Trace what screens/states exist, what the code validates,
   what error states it actually handles, what data it reads and writes.
3. Apply the `ba-document` skill's structure
   (`.claude/skills/ba-document/SKILL.md`) — the same 4-pillar shape
   (Overview & Actor Matrix; Master Process Flows; User Stories with
   6-step AC; Data Dictionary & Golden Business Rules) — but populate
   every section from what Step 2 found, not from best-practice
   assumptions. The skill's §5 "apply industry defaults" policy does
   **not** apply here for anything the code already shows.
4. For anything genuinely not visible in code (a performance target, an
   intent the code doesn't state) — don't invent it. Mark it inline as
   `[NOT VERIFIED — confirm with team]` rather than presenting a guess as
   fact. An honestly incomplete retrofit doc beats a confidently wrong
   one.
5. Use `.claude/skills/ba-document/PRD-DOCS-TEMPLATE-EN.md` for structure
   and header, English throughout, standard BA/ITC terms kept as-is.
6. Output path: `docs/prd-docs/<feature-slug>/PRD-DOCS.md` — same
   convention as `/plan-en`.
7. Before presenting, run the skill's own §6 Quality Gate Checklist, plus
   one addition specific to this command: every AC and Business Rule
   traces back to something actually observed in code, or is explicitly
   marked `[NOT VERIFIED]` — no silent assumptions dressed up as fact.
8. Present the file path, and separately list: (a) what was derived
   directly from code, (b) what's marked `[NOT VERIFIED]` and needs
   confirmation from the team.
9. Gate: after approval, the next step is `/build` — to add Playwright E2E
   coverage for this now-documented feature and correct any doc/code
   mismatches it surfaces — then `/writetest-en`. Not a rebuild.

## If multiple features need retrofitting

Don't try to cover "all features" in one run. First scan the project and
list the candidate features by name, confirm that list with the operator,
then run this command once per feature with its own feature-slug. One
collision-free `PRD-DOCS.md` per feature, not a merged document.

## If the operator wants Vietnamese instead

Stop and point them to `/plan-old-vn` — don't translate mid-command.
