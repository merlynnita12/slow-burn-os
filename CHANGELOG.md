# CHANGELOG — Slow Burn OS

All decisions and changes tracked in chronological order. This is the decision log for the product.

---

## v0.1.0 — March 2026 (Initial Prototype)

### Design Decisions

- **Light palette chosen over dark**
  - Options: Dark (candlelight notebook), Light (morning light), Both
  - Decision: Light — warm linen background (#F6F2EC)
  - Rationale: Dark felt too intense for the target audience. Light matches the "quiet space for self-definition" framing. Inspired by Headspace warmth and Calm spaciousness, but distinct from both.

- **Sage green accent (#5A856B) chosen over gold (#B48C64)**
  - Rationale: Gold carries ambition energy. Sage green says growth without pressure — alive and unhurried.

- **Newsreader serif as primary font**
  - Fallback: Georgia
  - Meta font: DM Sans (sans-serif)
  - Rationale: Serif typography signals intention and warmth. This is a reflective tool, not a SaaS dashboard.

- **430px max-width, mobile-first**
  - No desktop layout planned for V1.

### Product Decisions

- **Name: Slow Burn OS**
  - Considered reconsidering given the gentler direction
  - Decision: Keep it. "Slow burn" captures building back gradually — not intensity, but something that doesn't go out.
  - Key insight: "This isn't for someone who can't get out of bed. It's for someone who hasn't stopped moving and hasn't asked themselves why or for whom in a long time."

- **Onboarding phrase: "Count what counts"**
  - Options considered: Track what's yours, Define the scorecard, Count what counts, Not everything counts, Measure yours
  - Decision: "Count what counts" — rhythmic, memorable, distinct from Doerr's "Measure What Matters"
  - Lives in: Onboarding Screen 1

- **Subtitle: "Your life. Your metrics."**
  - Original: "A personal operating system for people who do a lot — but not enough for themselves."
  - Revised: "Your life. Your metrics."
  - Rationale: Original was too on the nose — diagnosed the user before they'd said anything. New version is an invitation, not a category.

- **Onboarding order: Categories first, then Goals**
  - Rationale: Non-negotiables are about who you are today. Goals are about where you're going. Ground in the present before looking ahead. Also means the simplest setup step comes first.

- **Interactive tour before setup**
  - Replaces: Framing statement (Screen 2)
  - Format: Four interactive slides showing each tab with mockup + one-line description
  - Re-shows: Auto first time, "Need a refresher?" prompt visits 2–5, available in Settings after that
  - Rationale: Users don't need more poetry after the hook. They need to know how to use the thing.

### Architecture Decisions

- **Four views instead of six**
  - Original: Today, Capture, Retro, Board, Metrics, Badges
  - Revised: Today, Dump, The Week Ahead, Mirror
  - Rationale: Simplified. Every view has a clear job. Metrics and reflection collapse into Mirror. Board is implicit in the Dump → Week → Today flow.

- **Goals + Tasks as parallel system to Non-negotiables**
  - NNs: daily anchors tied to categories. About showing up.
  - Goals: longer-term direction. Tasks get tagged to goals.
  - These stay separate — different purposes, different time horizons.

- **Task-goal tagging: strongly encouraged, not mandatory**
  - Planning modal prominently shows goal tags with "Is this for a goal?" prompt
  - Gentle nudge if nothing selected: "Tag it to a goal — or mark it as 'other.' This is how you see where your time goes."
  - "Not for a goal" is explicit button
  - But user can still plan without choosing — not blocked
  - Rationale: Forcing the choice is the product's philosophy, but blocking the user creates friction that could cause abandonment.

- **Goal alignment indicator on Today view**
  - Progress bar: "3 of 5 for your goals"
  - Factual, not judgemental.

- **Multiple goals per task**
  - Rationale: Reflects reality. "Write Substack post" could serve both a growth goal and a career goal.

- **Estimated + actual duration: both optional**
  - Rationale: Some users want deep tracking. Others just want to check things off. Both are valid. Duration data feeds the Mirror when available.

- **Week starts Sunday**
  - Rationale: Plan when your mind is quieter, not when Monday is already hitting you.

- **3 goals recommended, max 5**
  - Research basis: Behavioral research shows multiple goals competing for the same resources (time, attention, energy) decrease performance. Choice overload research shows too many options impair decision quality. 3 gives enough range without creating resource competition.

- **SMART goals via guided prompts**
  - Instead of: Single "SMART description" text field
  - Three prompts: "What's the goal?" / "How will you know you've done it?" / "By when?"
  - Gets Specific, Measurable, Time-bound without saying SMART. Human language, not corporate.

- **Unfinished tasks roll back to Dump**
  - End of week: planned tasks not completed return to dump status
  - No shame UI, no "you missed 4 tasks" message
  - Just back in the inbox, ready for next week

- **localStorage namespace: sb3-**
  - Distinguishes from original build (sb2-)
  - Designed for clean migration to Supabase in V2

### Tone of Voice

- Zero completions: "These are yours. Not anyone else's."
- Mid-progress: "[n] of [total]. Your pace, your terms."
- All done: "You showed up for yourself today."
- All NNs complete: "Small steps still move you forward."
- Empty dump: "Your mind is clear. For now."
- No tasks planned: "Nothing planned for today. That's okay too."
- Completion feedback: quiet. Soft colour fill. No confetti, no streaks.
- Empty states never imply failure.

---

## Files at this checkpoint

| File | Description |
|------|-------------|
| `src/App.jsx` | Current prototype — all features, revised onboarding |
| `docs/SlowBurnOS_PRD_v0.1.docx` | Product Requirements Document |
| `docs/SlowBurnOS_ComponentSpec_v0.1.docx` | Component Spec & Data Schema |
| `docs/design-directions-archive.jsx` | Dark vs Light comparison (archived) |
| `docs/design-direction-b-refined.jsx` | Light direction with corrected user framing |
| `docs/slow-burn-os-v1-pre-revision.jsx` | V1 before onboarding/copy revisions |
