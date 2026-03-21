# Slow Burn OS

**Count what counts.** Your life. Your metrics.

A mobile-first PWA for people who do a lot — but not enough on their own terms. Not a productivity app. Not a wellness app. A personal operating system for defining and tracking what actually matters to you.

## Status

**V1 Lite** — interactive prototype, localStorage only, no backend.

Built by [Merlyn Ramanan](https://substack.com/@notesmiddle) directing Claude (Anthropic). No code written directly by human. This is intentional and part of the content narrative.

## What It Does

### Two parallel systems:
- **Non-negotiables** — daily anchors tied to life categories (body, mind, spirit, people, growth, rest). "Did I show up for myself today?"
- **Goals + Tasks** — longer-term direction. Tasks get tagged to goals. The app shows you how much of your week was goal-aligned vs. "everything else."

### Four views:
| View | Name | Purpose |
|------|------|---------|
| Today | Today | NNs + today's tasks with goal dots |
| Dump | Dump | Brain dump inbox — zero friction |
| Plan | The Week Ahead | Sprint plan: assign tasks to days, tag to goals |
| Mirror | Mirror | Goal alignment data + weekly reflection |

### Onboarding:
1. "Count what counts." — the hook
2. Interactive tour — four slides showing each tab
3. Pick your non-negotiable categories (start with 2–3)
4. Set your goals with guided SMART prompts (what, how you'll know, by when)

## Design

Light palette. Sage green accent. Newsreader serif + DM Sans. 430px max-width, mobile-first.

Emotional register: "The first ten minutes after you wake up when the light is soft and nothing has gone wrong yet."

See `docs/` for full PRD and Component Spec.

## Project Structure

```
src/
  App.jsx              ← Current app (single-file prototype)

docs/
  SlowBurnOS_PRD_v0.1.docx              ← Product Requirements Document
  SlowBurnOS_ComponentSpec_v0.1.docx     ← Component Spec & Data Schema
  design-directions-archive.jsx           ← Dark vs Light comparison (archived)
  design-direction-b-refined.jsx          ← Light direction refinement (archived)
  slow-burn-os-v1-pre-revision.jsx        ← V1 before onboarding/copy revisions
```

## Key Decisions (see CHANGELOG.md for full log)

- **Light palette** over dark — warm linen, not candlelight
- **Sage green** over gold — growth without pressure
- **"Count what counts"** as onboarding phrase — rhythmic, distinct from Doerr's "Measure What Matters"
- **Categories first, goals second** in onboarding — ground in the present before looking ahead
- **3 guided prompts** instead of single SMART field — what, how you'll know, by when
- **Mandatory-ish goal tagging** — strongly encouraged, not forced. Every planning action surfaces the question: "Is this for your goals?"
- **Week starts Sunday** — plan when your mind is quieter
- **Goals: 3 recommended, max 5** — backed by behavioral research on cognitive overload
- **Unfinished tasks roll back to Dump** — no guilt, no red flags

## Versions Planned

| Version | Storage | Status |
|---------|---------|--------|
| V1 Lite | localStorage | Prototype complete |
| V2 Full | Supabase | Architecture designed, not built |

## Tech Stack (V1)

- React 18 (functional components, hooks)
- Single-file prototype (will be split into components for production)
- localStorage for persistence (schema designed for Supabase migration)
- Web Speech API for voice capture (Chrome/Safari)
- No external dependencies beyond React

## Who It's For

People who are burning out — not because they do too little, but because they do too much, and none of it is measured on their own terms.

- The working mother who runs a household and a job but hasn't done something purely for herself in months
- The corporate professional whose sense of progress is defined by someone else's KPIs
- The person whose tasks have gone from automatic to unconscious and it's eating them alive
- Anyone who needs a space to define their own terms

---

Built by Merlyn Ramanan × Claude (Anthropic), March 2026.
