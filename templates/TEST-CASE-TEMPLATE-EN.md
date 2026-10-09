# Test Cases: {{feature_name}}

> Source spec: `PRD-DOCS.md` ({{doc_version_or_date}})
> Source automation: Playwright specs under `{{e2e_test_path}}`

## Coverage Summary

| User Story | Total Cases | Happy Path | Negative/Edge | Automated | Manual |
|---|---|---|---|---|---|
| `US-{{MODULE}}-001` | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} |

*(One row per user story in `PRD-DOCS.md`. Every story needs at least
one happy-path case and at least one negative/edge case — a story with
zero negative cases is a gap, not a clean pass.)*

---

## `US-{{MODULE}}-001`: {{Story name}}

### TC-{{MODULE}}-001-01 — {{Short, specific title}}

| Field | Value |
|---|---|
| **Related** | `US-{{MODULE}}-001` / AC `{{X.Y}}` / `BR-{{MODULE}}-{{NNN}}` (if applicable) |
| **Type** | Happy path / Negative / Boundary / Security / Performance |
| **Priority** | Critical / High / Medium / Low |
| **Preconditions** | {{State the system/data must be in before this test runs}} |
| **Automated** | Yes — `{{playwright spec file}}::{{test name}}` / No — manual |

**Steps**

1. {{Action}}
2. {{Action}}
3. {{Action}}

**Test Data**

| Field | Value |
|---|---|
| {{field}} | {{value used}} |

**Expected Result**

{{Exactly what should be observed — states the pass condition
unambiguously, matching the AC's documented behavior word for word where
possible.}}

**Actual Result**

{{Filled in at execution time. For automated cases, this is the Playwright
run's actual output/assertion result, not re-typed by hand.}}

**Status**

`Not Run` / `Pass` / `Fail` / `Blocked`

---

*(Repeat one `### TC-{{MODULE}}-{{story}}-{{seq}}` block per test case.
Numbering: `TC-<MODULE>-<story-number>-<sequence>`, e.g. `TC-AUTH-001-01`,
`TC-AUTH-001-02`. Group all cases under their owning `## US-` heading so
the doc stays navigable by story, matching `PRD-DOCS.md`'s structure.)*

## How to derive cases (used by `/writetest`)

For each user story in `PRD-DOCS.md`:

1. One happy-path case per AC row in the story's Acceptance Criteria
   Summary table.
2. One negative/edge case per item in the story's "Xử Lý Ngoại Lệ & Báo
   Lỗi" (Exception & Error Handling) step.
3. One boundary case per numeric/length constraint in the story's
   "Validation Rules" step (e.g. min/max length, threshold comparisons).
4. One case per relevant row in the State Transition Table where this
   story triggers or is affected by a state change.
5. One case per Golden Business Rule (`BR-{{MODULE}}-{{NNN}}`) that
   constrains this story's behavior.
6. Cross-check against the actual Playwright suite from `/build` — mark
   `Automated: Yes` with the exact spec/test name wherever a case is
   already covered, `No` where it's documented but not yet automated (e.g.
   manual/exploratory, visual, or deliberately out of automation scope).
