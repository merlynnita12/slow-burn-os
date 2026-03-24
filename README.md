# Slow Burn OS

**Count what counts.** Your life. Your metrics.

A personal operating system for people who carry too much in their heads. Dump everything. Sort what's in your control. Release what isn't. Focus on what matters. See where your time actually goes.

Built entirely by directing AI, without writing a single line of code.

---

## What it does

Slow Burn OS has five views:

**Today** — Your non-negotiables (the smallest things you can do for yourself today) and your tasks for the day. A check-in counter tracks how many days you've shown up.

**Dump** — Three tabs for three kinds of noise. Tasks (things you can do), Thoughts (things you're carrying), and Blockers (context that shapes your week). Voice input supported.

**Release** — Your thoughts appear as cards. Flick away what's beyond your control. Hold what's in your control. Not all thoughts need a room.

**Focus** — Held thoughts land here with two choices: turn them into a task, or shelf them for 3 days before they disappear. Pick your focus tasks for the week. Last week's reflection surfaces to shape this week's plan.

**Mirror** — See where your time went. How many tasks moved you toward your goals vs. everything else. Weekly non-negotiable grid. Reflection prompts.

---

## Design

- Blue palette (#F0F4FA background, #0F56CE accent)
- Newsreader serif + DM Sans
- 430px mobile-first
- No emojis. Designed icons only.
- No gamification. No streaks. No badges.

---

## Run it locally

```bash
git clone https://github.com/merlynnita12/slow-burn-os.git
cd slow-burn-os
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Data privacy

All data is stored in your browser's localStorage. Nothing is sent to any server. No accounts, no tracking, no analytics. Your data stays on your device.

---

## Documentation

| File | What it is |
|------|-----------|
| docs/Prdv0.3.md | Product Requirements Document with every decision |
| CHANGELOG.md | Every change, every fork in the road, documented |
| docs/SlowBurnOS_ComponentSpec_v0.1.md | Component spec and data schema |

---

## The story

This app was built by a product data analyst with zero coding experience, using Claude (Anthropic) for product thinking and code generation, and Google Antigravity as a code editor.

---

## Tech

- React 18 + Vite
- localStorage (no backend)
- PWA-ready
- Zero dependencies beyond React

---

## Status

V1 in active development. Used daily by the creator. Not yet deployed publicly.

**What works:** Onboarding, all 5 tabs, dump with 3 sub-tabs, release with hold/shelf, focus with weekly planning, mirror with reflection, check-in counter, voice input.

**Coming in V2:** Flick gesture with touch physics, PWA deployment, breathing animations, Firebase backend for cross-device sync.

---

## License

Open source. Use it, fork it, make it yours.

Built by Merlyn Ramanan in Amsterdam.