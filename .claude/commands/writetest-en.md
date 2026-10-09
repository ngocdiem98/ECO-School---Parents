---
description: "Write the full test-case document (English) from the latest PRD-DOCS.md and the working build"
---

# `/writetest-en`

Argument: `$ARGUMENTS` — path to the feature's `PRD-DOCS.md`.

## Precondition

Refuse to run until `/build` has completed at least once for this feature.

## Step 1 — Read both sources

- `PRD-DOCS.md` (post-`/build`, including any Update Log corrections).
- The Playwright spec files written during `/build`.

## Step 2 — Generate cases

Copy `templates/TEST-CASE-TEMPLATE-EN.md` to the **same folder `PRD-DOCS.md`
lives in** for this feature, named `TEST-CASES-{{feature-slug}}.md` —
don't resolve a separate path. Populate it per the template's own "How to
derive cases" section, in English throughout.

For each case, set `Automated` by actually matching it to a real
Playwright test (spec file + test name). Don't mark something automated
because it plausibly should be — only if a real test proves it.

## Step 3 — Fill the coverage summary

Populate the coverage table at the top. Flag any story with zero
negative/edge cases or zero automated cases — that's a real gap.

## Step 4 — Run what's automated, record results

For every case marked `Automated: Yes`, run its Playwright test now and
record the actual `Pass`/`Fail` in that case's Status field.

## Step 5 — Present

Give the operator the file path and the coverage summary table inline.
Call out any story with weak coverage by name.

## If the operator wants Vietnamese instead

Stop and point them to `/writetest-vn` rather than translating this file.
