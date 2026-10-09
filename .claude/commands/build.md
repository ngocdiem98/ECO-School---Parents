---
description: "Build from the approved PRD-DOCS.md, test e2e with Playwright (happy + unexpected cases), update the doc"
---

# `/build`

Argument: `$ARGUMENTS` — path to the feature's `PRD-DOCS.md` (from `/plan`).

> This is the trimmed version of a much heavier reference workflow. It
> keeps three things: build against a real spec, test the real behavior
> end-to-end, and keep the spec honest afterward. Everything else was
> ceremony for a multi-agent enterprise setup this project doesn't have —
> see the chat for the specific cuts and why.

## Precondition

Refuse to run if `PRD-DOCS.md` doesn't exist or hasn't been approved by
the operator. Don't build against a draft.

## Step 0 — Confirm Playwright is available

Check whether the project already has Playwright set up (a
`@playwright/test` dependency and a `playwright.config.*`). If not:

1. Install it: `npm init playwright@latest` (or `npm install -D
   @playwright/test && npx playwright install` if the project prefers
   manual config over the scaffolding wizard).
2. Confirm it matches the project's actual test runner conventions if one
   already exists (e.g. Jest for unit tests, Playwright for E2E only) —
   don't replace an existing E2E setup, extend it.

Do this once per project, not once per feature — skip this step on repeat
runs where Playwright already works.

## Step 1 — Read the spec, only the spec

Read the target feature's `PRD-DOCS.md` in full: Actor Matrix, Master
Process Flows (swim lane + state machine), every User Story's 6-step AC,
the Data Dictionary, and all Golden Business Rules. This is your only
source of truth for scope — don't infer requirements from similar features
elsewhere in the codebase without checking they actually apply here.

## Step 2 — Implement

Build the feature to satisfy every AC and every Business Rule in the doc,
following the existing codebase's conventions (framework, folder structure,
naming, styling) rather than introducing new patterns. Prefer writing a
failing test before the fix for bugs; prefer red-green-refactor for new
behavior where practical — but this is a working discipline, not a gate
that blocks progress if skipped once.

If you hit a case the doc doesn't cover, don't silently invent behavior:
implement the most reasonable interpretation, then flag it explicitly in
Step 4 so the doc gets corrected — don't let undocumented behavior ship
undocumented.

## Step 3 — E2E test with Playwright

For every User Story, write Playwright tests covering:

- **Happy path** — the AC's documented success flow, using the doc's own
  validation rules and processing logic as the assertions.
- **Unexpected/edge cases** — every case named in the story's "Xử Lý Ngoại
  Lệ & Báo Lỗi" (Exception & Error Handling) step, plus the doc's Golden
  Business Rules that apply to this story (boundary values, invalid input,
  permission denial, concurrent/conflicting state transitions per the
  State Transition Table).

Run the suite. A story isn't done until its tests pass — don't move to the
next story with known-red tests.

## Step 4 — Update the doc

If implementation surfaced anything the doc got wrong, missed, or
under-specified (a business rule that needed refining, an edge case that
didn't exist yet, a state transition that doesn't match reality):

1. Correct the relevant AC / Business Rule / State Transition Table row in
   place so `PRD-DOCS.md` matches what was actually built. **Write the
   correction in whatever language the existing document is already in**
   — check the doc's own metadata/prose before writing, don't default to
   one language. This command doesn't choose the doc's language; `/plan-en`
   or `/plan-vn` already did.
2. Add a short dated note under a `## Update Log` section at the end of the
   file (create it if it doesn't exist yet — append-only, newest on top)
   recording what changed and why, referencing the specific `US-`/`BR-`/AC
   ID touched.

Don't rewrite the whole document to "freshen" it — only the parts that
actually changed.

## Step 5 — Report

Summarize: what was built, Playwright pass/fail counts (happy + edge
cases), and any `PRD-DOCS.md` corrections made. Point to `/writetest-en`
or `/writetest-vn` (matching the doc's language) as the next step for a
full test-case document.
