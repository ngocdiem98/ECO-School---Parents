# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`eduparents` is a pixel-mockup of a parent-facing school app (Vietnamese UI, "EDU Parent"), rendered as a single Next.js page inside a fake iPhone frame. There is no backend, no router and no real data. The app lives in `web/`; a sibling project, **eduteachers**, is not in this repo and is only referenced in code comments as the pattern source.

The repo root also holds the original vanilla prototype (`index.html`, `scripts/app.js`, `styles/main.css`). It is the reference `web/` is being ported from. Screens not yet rebuilt in `web/` still exist only there.

`reference/` is the spec source: screenshots plus `prd.md`, `screens.md` and `flows.md`. Read them before building a screen that doesn't exist in `web/` yet. They are written in Vietnamese and describe only what appears in the screenshots.

## Commands

Run everything from `web/`. The lockfile is `pnpm-lock.yaml`. pnpm is not installed globally on every machine, so `npx pnpm@9 …` works. `.claude/launch.json` starts the dev server with `npm run dev` instead.

```bash
cd web
pnpm install --frozen-lockfile
pnpm dev                 # next dev -p 3100  → http://localhost:3100
pnpm build               # next build
npx tsc --noEmit         # the real type check
```

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so **`next build` does not type-check**. Run `npx tsc --noEmit` yourself.
- `pnpm lint` is broken: the script is `eslint .` but ESLint is not a dependency.
- There is no test runner and there are no tests.
- `web/.claude/settings.json` is a second, nested settings file, separate from the repo-root `.claude/settings.json`. Both deny `git commit` and `git push` for Claude.

## Architecture

**Navigation** is a single `useState<Screen>` switch in `web/app/page.tsx`, with no router library. The page also draws the phone chrome (`.device-frame`, status bar, `.screen-root`, `#overlay-root`).
- The app opens on the **ECO Me home** (`eco-me/eco-home-screen.tsx`): wallet card, 7 service tiles plus "Xem thêm" (`eco-services` = "Danh sách dịch vụ", all 20 education services), and the student list. "ECO Phụ huynh" opens the original Home (`home`, `ParentsHomeScreen`), which has a ‹ back to ECO Me. The service catalogue is `eco-me/services.ts`; only services with an `intent` (or `ecoParent`) are interactive, the rest are disabled placeholders. Wallet actions, search and bell are inert.
- Launching a student-scoped service goes through `shared/use-service-launcher.tsx` (`useServiceLauncher`, `eligibleStudents`): 2+ eligible students → picker sheet, exactly 1 → straight in. Use it for any new service entry point.
- `activeStudentId` is shared by every screen after Home.
- `returnScreen` stands in for the vanilla app's navigation stack (`App.back()`). Every service screen (Fee, Topup, Báo vắng, Bài tập, Kết quả học tập, Phiếu bé ngoan, Hóa đơn) can be entered from ECO Me home, the service list, ECO Phụ huynh Home or the Học sinh screen, and its back button returns to whichever it came from. Link student and Hướng dẫn use it too. Học sinh has its own `studentOrigin`, because features opened from it overwrite `returnScreen` with `'student'`.
- When adding a feature screen, add it to the `Screen` union, add it to `serviceNav` in `page.tsx` and the `ServiceNav` interface, and give it an `intent` in `eco-me/services.ts` (plus the Home grid and `StudentScreen` if it belongs there).

**Features** are self-contained folders under `web/components/parents/<feature>/`. Each has an `index.tsx` (`XxxApp`) that owns the feature's inner screen state and renders sub-screens such as `fee-lookup-screen.tsx` or `homework-submit-screen.tsx`. Many `index.tsx` files carry a comment naming the matching function in `scripts/app.js` (for example `App.startFee()`). Read that function when behaviour is unclear.

**Data** comes from `web/lib/mock-data.ts`, the single source of truth for types and mock data. It deliberately mirrors `STUDENTS` in `scripts/app.js`. Screens read from `MOCK_STUDENTS` and mutate it in place, so state persists until a page reload. Only 3 students exist, and feature gating depends on which one is selected:
- `vy`: mầm non, healthy z-score, `supportsTopUp`, no linked invoice.
- `khoa`: phổ thông, elevated z-score, has invoices, homework, absences and results.
- `lam`: mầm non, underweight z-score.

Gating helpers and flags are `isMamNonStudent` (checks whether `school` contains "Mầm non"), `supportsTopUp`, `hasLinkedInvoice` and `results: null`. Phiếu bé ngoan and its calendar are Mầm non only, and Nạp điểm is only for `supportsTopUp` students. Test any gated change against all three students.

**Overlays**: bottom sheets and dialogs must render through `shared/overlay-portal.tsx` (`OverlayPortal`). It portals into `#overlay-root`, a sibling of the scrollable `.screen-root`, and locks body scroll. An inline `.sheet` is `position:absolute` against `.screen-root`, so it scrolls away with the page. Use the existing `.scrim` / `.sheet` classes.

**Styling** is all hand-written plain CSS in `web/app/globals.css`. It does `@import 'tailwindcss'` and has Tailwind/shadcn deps (`components/ui/button.tsx`, `components.json`), but screens do not use utility classes. The design tokens at the top of `globals.css` are ported verbatim from `styles/main.css`. If you change a token or shared class, change it in both files while the vanilla app still exists. **Exception: the web app has its own ECO Me brand theme** (Yellow `#FFCC33` / Blue `#0070CE` / Cobalt `#005CAF` / Navy `#002C54`, from the "Logo Guideline ver2.4" PDF). The brand tokens sit in `:root` and the colour overrides are one block at the end of `globals.css` ("ECO Me brand theme"); the vanilla app stays monochrome, so the two intentionally differ in colour. Yellow is the primary-action colour (`.btn-primary`), blue is selection/links/active states, navy is headers. Body text stays black/white per the guideline, and the iPhone frame stays black. The donut colours live in `SEGMENT_COLORS` in `bill-overview-screen.tsx`.

**Hóa đơn** (`components/parents/hoa-don/`) has no vanilla counterpart. It was built from design screenshots: list (entry screen), then Thông tin hóa đơn, then Xác nhận giao dịch, then Kết quả giao dịch (`bill-result-screen.tsx`, from a screenshot: "Trang chủ" calls `onGoHome`, "Giao dịch mới" returns to the Chưa thanh toán tab). The Đã thanh toán tab starts with a row "Xem tổng quan hóa đơn đã đóng" that opens `bill-overview-screen.tsx` (back returns to that tab). Tổng quan is derived entirely from `student.bills` at render time. Summary, donut and counts are scoped to the school year of today's date (Aug→Jul); the total amount and the donut count paid items only, while the bill count is paid + unpaid; "Đã thanh toán" counts fully paid bills and "Chưa thanh toán" bills with any open item, so the two add up to the total. Donut categories are inferred from item names (`Học phí…`, `Tiền ăn…`, else the name itself); a category under 5% of the total folds into "Khác" (whose bottom sheet lists them), and at most 4 segments are shown. The month chart covers the last 5 calendar months within that school year, placed by billing period (`Bill.year`/`month`, not payment date), and hides months with no paid items. No month is preselected; tapping a bar lists that month's paid items, grouped into collapsible bills when the month has more than one. The Aug–Oct 2026 mock bills (5 in school year 2026-27: 3 fully paid, one of them without VAT, 1 partly paid, 1 unpaid) exist so it has data when opened in Oct 2026. "Xem hóa đơn ›" (shown only on fully paid bills with `hasVat`) opens `bill-invoice-pdf-screen.tsx`, an iframe on the static sample `web/public/invoices/<bill.id>.pdf` with back and download in the top bar; each `hasVat` bill needs its own PDF there. The "Số tiền còn lại: … Thanh toán ngay ›" row on a partly paid bill (Đã thanh toán tab) skips the select screen and goes straight to Xác nhận giao dịch with the bill's open items. It uses its own `Student.bills` model (per-item `paid` flags), separate from `invoices`, which only drives Đóng học phí. A bill with some items paid appears in both tabs. Only `khoa` has bills, so the Home picker lists only students with `bills.length > 0`, and Home skips the picker when only one student qualifies. On Kết quả giao dịch the promo cards and "Chia sẻ" are inert.

**Health card** (`student-screen.tsx`): BMI-for-age z-score bands drive the colour chips, the "Gợi ý cho ba mẹ" advice sheet (`Z_SCORE_ADVICE`, `zScoreTrendLine`) and the history sheet. `healthHistory[0]` must stay equal to `heightCm`, `weightKg` and `zScore`, because the trend line compares entries `[0]` and `[1]`. The advice is intentionally generic and defers dosing and menus to a doctor, so keep it that way.

## Not yet ported from the vanilla app

These are inert placeholders in the Next.js Home grid: Lịch sử chi tiêu, Thời khoá biểu, Theo dõi điểm danh, and page 2 of the icon grid except Phiếu bé ngoan and Hóa đơn (Học bạ số, Thực đơn, Hoạt động, Dặn thuốc, Bảng tin, Nhật ký chăm sóc). Their screenshots are already in `reference/`.

## PRD / test-case workflow toolkit (unrelated to app code)

`.claude/commands/` (`plan-*`, `build`, `writetest-*`), `.claude/skills/ba-document/` and `templates/` are a portable BA-spec and test-case workflow, described in `WORKFLOW-README.md`. They are not part of the app. No `PRD-DOCS.md` exists yet. To document the already-built UI, use `/plan-old-vn` rather than hand-writing one. `WORKFLOW-README.md` tells readers to start with `INTRODUCTION.md`, which does not exist in the repo. Write it or drop that line.

## Repo state

The repo this was handed off from had git history, but this working copy has no `.git`. `HANDOFF.md` documents the committed history, plus the uncommitted work: the "Gợi ý cho ba mẹ" feature and the workflow toolkit above.
