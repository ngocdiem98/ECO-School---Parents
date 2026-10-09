# Plan → Build → Write Test

**New here? Read `INTRODUCTION.md` first** — it explains the whole flow and
what each command does. This file covers setup and file-structure details
for whoever's maintaining this `.claude/` folder.

## Setup

Drop `.claude/` and `templates/` into your project root (or merge into an
existing `.claude/` — no name collisions expected: `plan-en`, `plan-vn`,
`build`, `writetest-en`, `writetest-vn`).

## File structure

```
.claude/commands/
  plan-en.md / plan-vn.md         → each a complete, separate generation pass
  build.md                        → language-agnostic; edits whatever PRD-DOCS.md already exists in
  writetest-en.md / writetest-vn.md
.claude/skills/ba-document/
  SKILL.md                        → the method: role, 4-pillar structure, Mermaid safety rules
  PRD-DOCS-TEMPLATE-VN.md         → structural reference, Vietnamese
  PRD-DOCS-TEMPLATE-EN.md         → structurally identical, English
templates/
  TEST-CASE-TEMPLATE-EN.md
  TEST-CASE-TEMPLATE-VN.md
INTRODUCTION.md                   → start here — the flow, and what each command produces
```

## Language architecture

Each language is a **complete, separate generation pass** against its own
template — not a translation of the other's output. `SKILL.md`'s own
embedded template skeleton (§4) and `PRD-DOCS-TEMPLATE-VN.md` both hardcode
Vietnamese in their metadata header. `/plan-vn` uses that default as-is.
`/plan-en` explicitly overrides it — the command file says so directly,
pointing to `PRD-DOCS-TEMPLATE-EN.md` instead. If you ever edit `SKILL.md`
itself, keep that override instruction in `plan-en.md` in sync with
whatever the skill's default becomes.

`/build` doesn't get a language variant — it doesn't create a document
from scratch, it edits whatever `PRD-DOCS.md` already exists in, and
writes corrections back in that same language.

Output filenames don't carry a language suffix (`PRD-DOCS.md`, not
`PRD-DOCS-EN.md`) — the command you ran already decided the language. If
you want both languages kept side by side for the same feature, say so and
the output path convention can change to suffix by language instead.
