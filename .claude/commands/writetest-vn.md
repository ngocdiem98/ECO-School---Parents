---
description: "Write the full test-case document (Vietnamese) from the latest PRD-DOCS.md and the working build"
---

# `/writetest-vn`

Argument: `$ARGUMENTS` — path to the feature's `PRD-DOCS.md`.

## Precondition

Refuse to run until `/build` has completed at least once for this feature.

## Step 1 — Read both sources

- `PRD-DOCS.md` (post-`/build`, including any Update Log corrections).
- The Playwright spec files written during `/build`.

## Step 2 — Generate cases

Copy `templates/TEST-CASE-TEMPLATE-VN.md` to the **same folder
`PRD-DOCS.md` lives in** for this feature, named
`TEST-CASES-{{feature-slug}}.md` — don't resolve a separate path.
Populate it per the template's own "Cách Xây Dựng Test Case" section,
writing every field in Vietnamese (case titles, steps, expected results)
while keeping test IDs and technical field values as-is.

For each case, set `Tự Động` by actually matching it to a real Playwright
test (spec file + test name). Don't mark something automated because it
plausibly should be — only if a real test proves it.

## Step 3 — Fill the coverage summary

Populate the coverage table at the top. Flag any story with zero
negative/edge cases or zero automated cases — that's a real gap.

## Step 4 — Run what's automated, record results

For every case marked `Tự Động: Có`, run its Playwright test now and
record `Đạt`/`Không Đạt` in that case's `Trạng Thái` field.

## Step 5 — Present

Give the operator the file path and the coverage summary table inline (in
Vietnamese). Call out any story with weak coverage by name.

## If the operator wants English instead

Stop and point them to `/writetest-en` rather than translating this file.
