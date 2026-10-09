# eduparents — Handoff

Written 2026-10-05 for continuation by another coding agent. Covers everything
built so far, including work still sitting uncommitted in the working tree.

## What this project is

A pixel-mockup rebuild of a parent-facing school app, as a single Next.js page
inside a fake iPhone frame (`web/app/page.tsx`). It mirrors a sibling project
called **eduteachers** (not in this repo — referenced only in code comments
as a pattern source) and an original vanilla JS/HTML prototype that still
lives alongside it at the repo root (`index.html`, `scripts/app.js`,
`styles/main.css`). The Next.js app under `web/` is the active one; the
vanilla app is the reference it's being ported from, kept only so screens not
yet rebuilt still match pixel-for-pixel.

Reference screenshots and product notes for the original flows are in
`reference/` (PNGs + `prd.md`, `screens.md`, `flows.md`) — read those before
building a screen that doesn't exist yet in `web/`.

**⚠️ `CLAUDE.md` at the repo root is stale** — it says "project is in
early/setup stage with no code yet," which was true at commit `175f2b8`
(Initial commit) but not since `7bae27d` (Next.js scaffold). Update it as
part of this work, or the next agent reading it will be misled.

## Stack

- Next.js 16.2.6 (App Router, Turbopack), React 19, TypeScript 5.7
- Plain CSS (no Tailwind in actual use despite `tailwindcss`/`@tailwindcss/postcss`
  being devDependencies) — all styling is hand-written in `web/app/globals.css`
- `pnpm` (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`)
- No router library — navigation is a single `useState<Screen>` switch in
  `web/app/page.tsx`; no backend, no real data store — everything reads from
  and mutates `MOCK_STUDENTS` in `web/lib/mock-data.ts` in place

Run it:
```
cd web
pnpm install
pnpm dev     # next dev -p 3100
```

## Repo layout (source only, `.next`/`node_modules` excluded)

```
index.html, scripts/app.js, styles/main.css   — original vanilla prototype (reference only)
reference/                                     — screenshots + prd.md/screens.md/flows.md (spec source)
web/
  app/page.tsx        — top-level screen switch + phone-frame chrome
  app/globals.css     — all styling
  components/parents/
    home-screen.tsx           — "Trang chủ": 2-page icon grid + student list
    student-screen.tsx        — "Học sinh" detail: health/BMI card, recent activity
    profile/                  — "Hồ sơ học sinh" (read-only)
    phieu-be-ngoan/            — "Phiếu bé ngoan" (good-behavior card + leaderboard + calendar)
    fee/                       — "Đóng học phí"
    topup/                     — "Nạp điểm vào thẻ"
    absence/                   — "Báo vắng"
    homework/                  — "Bài tập"
    results/                   — "Kết quả học tập"
    link-student/              — "Liên kết học sinh"
    help/                       — in-app guide ("?")
    shared/                     — TopBar/StudentHeader, Dialog, sheets, OverlayPortal
  lib/mock-data.ts     — all mock data + types; single source of truth
```

Only **3 students** exist in mock data: `vy` (mầm non, healthy z-score),
`khoa` (phổ thông, elevated z-score, has invoices/homework/absence/results),
`lam` (mầm non, underweight z-score). Features gated by student type
(`isMamNonStudent`, `supportsTopUp`, `hasLinkedInvoice`) should be exercised
against all three, not just one.

## What's committed (git log, newest first)

- `80bd2b3` Replace BMI/Z-score history columns with a combined metrics column
- `023947d` Replace BMI gauge with BMI-for-age Z-score on student health card
- `37a1a49` Add student profile screen with health/BMI tracking; fix bottom
  sheets so they portal into a sibling overlay layer and lock background
  scroll (previously sheets dragged with the scrolling page)
- `8fc8cd9` Update Phiếu bé ngoan leaderboard/positions and add new Mầm non student (`lam`)
- `ac3e2f0` Add calendar view to Phiếu bé ngoan, restrict it to Mầm non students
- `7bae27d` Scaffold Next.js app for eduparents (mirror eduteachers structure)
- `d563e49` Fix: Báo vắng tab navigation should not push to history stack; UI polish
- `175f2b8` Initial commit

All of the above is merged into `main` and pushed (branch is up to date with
origin).

## What's NOT committed yet (needs review + commit)

### 1. Modified files — new feature: "Gợi ý cho ba mẹ" (parent advice) on the health card

`web/components/parents/student-screen.tsx` and `web/app/globals.css`.

Adds a new row below the Z-score band chips on the student health card
("💡 Gợi ý cho ba mẹ ›"). Tapping it opens a new bottom sheet
(`ZScoreAdviceSheet`) that shows:
- A one-line trend read vs. the previous health-history entry
  (`zScoreTrendLine` — coarse "tăng/giảm/ổn định" comparison of the two most
  recent `healthHistory` entries, threshold `0.15`)
- 3 bullet pointers keyed by Z-score band (`Z_SCORE_ADVICE`: `under` /
  `normal` / `over` / `obese`), intentionally generic (diet variety,
  activity, continued monitoring) rather than prescriptive — the code
  comment is explicit that dosing/menus belong with a doctor, not this app
- A disclaimer line recommending a doctor visit for specific advice

State: `showZScoreAdvice` in `StudentScreen`, parallel to the existing
`showZScoreInfo`. Reuses `OverlayPortal` + the same `.sheet`/`.scrim` CSS
classes as the other bottom sheets.

**Status**: implemented, `tsc --noEmit` passes clean. Not yet manually
verified in a browser by this session, not committed. No automated/E2E test
exists for it.

**Suggested next steps**: smoke-test in the dev server across all 3 mock
students (especially `lam`, who is in the `under` band, and `khoa`, `over`
band) to confirm the advice text and trend line render correctly, then
commit.

### 2. Untracked: a PRD/test-case workflow toolkit (`.claude/commands/`, `.claude/skills/`, `templates/`, `WORKFLOW-README.md`)

This is **tooling, not app code** — a portable Claude Code workflow for
generating business-spec docs (`PRD-DOCS.md`) and test-case docs, meant to be
dropped into any project's `.claude/` folder. It is unrelated to the
eduparents feature set itself.

- `.claude/commands/`: `plan-en.md`, `plan-vn.md`, `plan-old-en.md`,
  `plan-old-vn.md`, `build.md`, `writetest-en.md`, `writetest-vn.md`
- `.claude/skills/ba-document/`: `SKILL.md` (the method) +
  `PRD-DOCS-TEMPLATE-EN.md` / `-VN.md`
- `templates/`: `TEST-CASE-TEMPLATE-EN.md`, `TEST-CASE-TEMPLATE-VN.md`
- `WORKFLOW-README.md`: setup + file-structure notes for this toolkit

**Gap**: `WORKFLOW-README.md` opens with "Read `INTRODUCTION.md` first" —
that file does not exist anywhere in the repo. Either it was never added, or
it's expected to be dropped in alongside this toolkit when it's actually
wired up. Whoever picks this up should either write it or drop the
instruction.

This toolkit does not currently have a `PRD-DOCS.md` to operate on for the
eduparents feature set — none exists in the repo yet. If future work wants
BA-style specs for eduparents' screens, run `/plan-vn` or `/plan-old-vn`
(given the UI is already built, `/plan-old-vn` — docs for existing
code-with-no-docs — is the fitting one) rather than hand-writing one.

**Status**: all four paths are untracked in git; nothing here has been
committed. Decide whether this toolkit belongs in version control for this
repo at all before committing it.

## Known rough edges / things to be aware of

- `web/.claude/settings.json` exists as a *second*, nested Claude Code
  settings file inside `web/` — distinct from the repo-root `.claude/`.
  Don't confuse the two when editing permissions/settings.
- Screens still not ported from the vanilla prototype (vanilla-only, inert
  placeholders in the Next.js home grid): "Lịch sử chi tiêu", "Thời khoá
  biểu", "Theo dõi điểm danh" on page 1 of the icon grid, and everything on
  page 2 except "Phiếu bé ngoan" (Học bạ số, Thực đơn, Hoạt động, Hóa đơn,
  Dặn thuốc, Bảng tin, Nhật ký chăm sóc). Their reference screenshots exist
  in `reference/` already.
- `results: null` (mầm non students) renders an empty state in `ResultsApp`
  — verified only by reading the code, not by running it this session.
- No automated tests exist anywhere in `web/` (no test runner configured).
  Verification so far has been `tsc --noEmit` plus manual/visual checks by
  prior sessions (per commit messages); this session only ran the typecheck.
