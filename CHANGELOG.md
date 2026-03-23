# CHANGELOG — Slow Burn OS

## v0.3.0 — March 22, 2026 (Feature Lock)

### Major architecture changes
- **Dump split into three sub-tabs:** Tasks / Thoughts / Blockers. Different input types need different flows.
- **Release tab added:** Flick-away mechanic for sorting thoughts. Hold (pull toward you) / Release (flick any direction) / Skip. Cards appear one at a time. Breathing metaphor: inhale on hold, exhale on release.
- **Focus replaces The Week Ahead:** Weekly narrowing — pick your items from the "mine" pool. User-chosen number with science-backed recommendation of 3–5. Happens Sunday evening.
- **Mirror gains daily mode:** Evening notification opens Mirror showing daily summary. Weekly mode shows full goal alignment + blocker-aware validation.
- **Five tabs:** Today / Dump / Release / Focus / Mirror

### New features
- **Blockers system:** Users input what's affecting their capacity. Not tasks — context. App uses blockers to adjust Focus recommendations and validate at end of week.
- **Task deadlines:** Every task expects a deadline. Enables urgency-based prioritisation alongside goal alignment.
- **Goal tagging at dump time:** Dropdown shows user's goals + "Other" when entering a task.
- **3-week stale task flag:** Tasks unselected for 3 weeks get surfaced at weekly check-in: "Keep or let it go?"
- **Adaptive load in Focus:** Light week = stretch suggestion. Heavy week = lighten suggestion. Health blocker = permission to do less.
- **Consistency recognition:** After 3+ weeks of completing Focus items, app acknowledges, checks energy, offers to increase load.
- **Held thought conversion:** Next app open, gentle prompt: "Want to turn this into something you can do?" with "Just holding it is enough" option.
- **Skipped thoughts:** Reappear for 2 more sessions, then archive quietly.
- **Anxiety validation:** Immediate after heavy Release sessions (5+ items). Pattern-based over time for consistent heavy releasers.
- **Daily pick on Today:** Each morning, choose from Focus list. Goal-aligned shown first. 10-minute nudge if nothing is goal-aligned.
- **End-of-day Mirror:** Notification → daily summary → validation.
- **Blocker-aware weekly validation:** Heavy week + delivered = resilience acknowledgement. Heavy week + didn't = compassion.

### Design changes
- **No emojis anywhere.** Designed icons only.
- **Visual metaphor: Light.** Morning light filling the space. Dump starts dim, brightens as you unload. Release flicks away shadows. Focus narrows light. Mirror shows full even light.
- **Animation reference:** Dola app onboarding (Mobbin). Quality bar: smooth transitions, animated metaphors, one idea per screen, generous spacing. All within light palette.
- **Breathing mechanic in Release:** Inhale/exhale tied to hold/flick gestures. Cumulative visual transformation over a session.
- **Visual relief in Dump:** Background shifts from warm/tense to cool/open as items are added.
- **Flick mechanic:** Any direction = release (flies off with momentum). Pull toward = hold. Not left/right — the gesture IS the meaning.
- **NN glow:** Sage green pulse on completion (0.6s).

### Copy changes
- **Onboarding ends before first dump:** "You're ready. Come back tomorrow morning and we'll start."
- **First-time Today prompt:** "You're set up. When you're ready, head to Dump and get what's in your head out."
- **Dump sub-tab descriptions:** "Things you could do" / "Things on your mind" / "Things affecting your week"
- **Release post-session:** "You let go of [n] things that aren't yours to carry. That's not avoidance — that's choosing where your energy goes."
- **Focus blocker prompt:** "Before you pick your focus — anything affecting your week?"
- **Notification:** "End of day. Count what counted."
- **Mirror heavy + delivered:** "You had [x] things working against you and still showed up. That's resilience."
- **Mirror heavy + didn't:** "Tough week. The fact that you're here checking in matters."

### Decisions
- Hold / Release as swipe labels (emotional, tactile)
- Tasks / Thoughts / Blockers as dump tab names (plain, clear)
- Onboarding order: splash → tour → distinction → categories → goals → "come back tomorrow"
- Blockers asked at start of week in Focus, not daily
- "Not mine" items disappear immediately (the flick IS the letting go)
- Check-in counter: cumulative days with at least 1 NN completed
- Counter copy: "[n] days. You keep choosing yourself."
- Reminder: user-chosen time, "End of day. Count what counted."
- Two-step in-app delete confirmation (no window.confirm)
- Light as visual metaphor (not flame, not water)
- Flick mechanic to be prototyped in Stitch (both directions tested)

---

## v0.2.0 — March 22, 2026

### Changes from v0.1
- Subtitle changed: "Your life. Your metrics." (was too on-the-nose)
- Screen 2 changed from framing statement to interactive tour
- Onboarding reordered: categories first, then goals
- SMART goals replaced with three guided prompts
- NN vs Goal distinction screen added with relationship example
- Goal tagging strongly encouraged, not mandatory
- Multiple goals per task allowed
- Estimated + actual duration, both optional
- Check-in counter added (cumulative, not streak)
- NN glow animation added
- End-of-day reminder in Settings
- Two-step delete confirmation

---

## v0.1.0 — March 2026 (Initial prototype)

- Original design decisions documented
- Light palette, sage green, Newsreader serif
- Four views: Today, Dump, The Week Ahead, Mirror
- PRD v0.1 and Component Spec created
- GitHub repo created: slow-burn-os (merlynramanan)