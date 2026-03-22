# SLOW BURN OS — Product Requirements Document

**Living document — updated as decisions are made**

---

| | |
|---|---|
| **Owner** | Merlyn Ramanan (Notes from the Middle / Decoding Stories, Substack) |
| **Role** | Senior Product Data Analyst, Amsterdam |
| **Build method** | AI-directed — no code written directly by human |
| **Status** | V1 Lite — feature-locked, moving to design |
| **Last updated** | March 22, 2026 |
| **Document version** | 0.3 — feature-locked draft |

---

## 1. What this is

Slow Burn OS is a personal operating system — a mobile-first PWA designed to help people take control of their own metrics of growth. It is not a productivity app. It is not a wellness app. It is a tool for people who do a lot, measure themselves against someone else's standards, and have lost track of what actually matters to them.

**The core belief:** You don't need to do more. You need to know what's worth doing — and measure that instead.

**Tagline:** Count what counts.

**Subtitle:** Your life. Your metrics.

---

## 2. Who it's for

People who are burning out — not because they do too little, but because they do too much, and none of it is measured on their own terms.

- **The housewife or working mother** who does everything for everyone else and hasn't done something purely for herself in months
- **The corporate professional** whose sense of progress is defined by someone else's KPIs
- **The person on autopilot** whose tasks have gone from automatic to unconscious and it's eating them alive
- **Anyone under societal pressure** who needs a space to define their own terms

**Common thread:** Strong, capable, busy. Not fragile. Lost in other people's definitions. The app is a mirror, not a crutch.

---

## 3. Product philosophy

### 3.1 Core principles

**Start small.** Guide people to begin with 2–3 categories. Adding more should feel like growth, not setup.

**Your metrics, not theirs.** Every metric is self-defined. No external benchmarks, no leaderboards, no comparison.

**The smallest thing is a win.** One non-negotiable completed should feel meaningful. The app never implies you should be doing more.

**Prodding, not pushing.** Helpful, non-invasive, no pressure. No nag, no streak-shame.

**Confront, then support.** Ask the hard question (what truly matters to you?) then make it easy to act on the answer.

### 3.2 What this is NOT

- Not a productivity app
- Not a habit tracker — no streaks, no punishment for missing a day
- Not a therapy app — a mirror, not a doctor
- Not a social app — no sharing, no comparison

---

## 4. Two parallel systems

### Non-negotiables (NNs)
- Daily anchors tied to life categories (body, mind, spirit, people, growth, rest)
- Your daily FLOOR — the smallest thing that still counts as a win
- Example: "Text one person I care about"
- Measured daily: did you show up?
- Do NOT connect to goals

### Goals + Tasks
- Longer-term direction — what you're building toward over weeks or months
- Example: "Rebuild my social life after moving cities"
- Tasks get tagged to goals when entered in Dump
- Completion data feeds the Mirror
- 3 goals recommended, max 5 (research-backed)

### Goal setup — three guided prompts:
1. "What's the goal?" — title
2. "How will you know you've done it?" — measurable outcome
3. "By when?" — target date

### Goal colour palette (auto-assigned):
| Goal 1 | Goal 2 | Goal 3 | Goal 4 | Goal 5 |
|--------|--------|--------|--------|--------|
| Sage green | Dusty blue | Warm clay | Muted plum | Quiet teal |

Untagged tasks labelled "Other" throughout.

---

## 5. App architecture

### Five tabs:

| Tab | Name | Purpose |
|-----|------|---------|
| Today | Today | NNs + daily pick + tasks + check-in counter |
| Dump | Dump | Three sub-tabs: Tasks / Thoughts / Blockers |
| Release | Release | Flick-away thoughts: Hold / Release / Skip |
| Focus | Focus | Weekly narrowing from "mine" pool + blocker check-in |
| Mirror | Mirror | Daily check-in + weekly goal alignment + reflection |

### No emojis anywhere. Proper icons or typography only.

---

## 6. Dump view

Three sub-tabs within Dump:

### Tasks
- Input: thing to do + goal tag (dropdown showing user's goals + "Other") + deadline
- Tasks with deadlines surface based on urgency + goal alignment
- If a task sits unselected for 3 weeks, flagged at weekly check-in: "This has been here 3 weeks. Keep or let it go?"
- Visual relief: as user dumps more items, background gradually shifts from slightly warm/tense to cool/open — the feeling of unloading

### Thoughts
- Input: what's on your mind. No tags, no deadlines. Raw text.
- Thoughts flow into Release (flick-away sorting)

### Blockers
- Input: what's affecting your capacity this week
- Not actionable — purely context for the app
- Used in Focus to adjust load recommendations
- Used in Mirror for blocker-aware validation at end of week

### First-time guidance:
Each sub-tab shows a one-line description the first few times:
- Tasks: "Things you could do"
- Thoughts: "Things on your mind"
- Blockers: "Things affecting your week"

---

## 7. Release view

### Mechanic:
Thoughts from Dump appear as cards, one at a time, full focus.

**Flick away (any direction) = Release.** Card flies off screen with momentum. The app exhales — background softens, space opens. The breathing metaphor: each release is a breath out.

**Tap and pull toward you = Hold.** Card settles into held area. The app inhales — subtle contraction, warmth.

**Pause / "not now" button = Skip.** Skipped thoughts reappear for up to two more sessions, then archive quietly.

### Breathing mechanic (V1 must-have):
The Release screen has a subtle ambient rhythm — like the Headspace breathing exercise. Each flick-away triggers an exhale animation. Each hold triggers an inhale. Over a full session, the cumulative effect transforms the screen from dense to open.

### Post-session:
- If 5+ items released: anxiety validation message. Example: "You just let go of [n] things that aren't yours to carry. That's not avoidance — that's choosing where your energy goes."
- Pattern-based validation over time: if the app detects consistently heavy Release sessions, deeper acknowledgement

### Held thoughts:
Next time user opens the app, gentle prompt per held thought: "You held this: '[thought text].' Want to turn it into something you can do?" Two options: "Yes, make it a task" / "Just holding it is enough."

### "Not mine" items:
Disappear immediately on release. Gone. The act of flicking IS the letting go.

---

## 8. Focus view

### Weekly narrowing. Happens Sunday evening.

**Step 1: Blocker check-in.**
"Before you pick your focus — anything affecting your week?"
User enters blockers (or skips). These inform the recommendation.

**Step 2: Pick your focus.**
Shows all "mine" tasks from Dump, goal-aligned first, then most recent.

Science-backed recommendation: "Research shows 3–5 tasks per week leads to the best follow-through. More than that and things start slipping."

User picks their own number. App remembers preference.

### Adaptive load:
- Light week (few blockers): "Looks like a clear week. Want to stretch and take on a couple more goal tasks?"
- Heavy week (multiple blockers): "You've got a lot going on. Maybe pick fewer and give yourself room."
- Health blocker: "Take care of yourself first. Even one task this week is enough."

### Consistency recognition:
If user completes Focus items consistently (3+ weeks in a row):
1. Acknowledge: "You've been showing up consistently."
2. Energy check: "How's your energy? Feeling stretched or do you have room?"
3. Offer: "Want to add one more to your focus this week?"

### Unfinished Focus items:
Roll back to the "mine" pool at end of week. No guilt messaging.

---

## 9. Today view

### Check-in counter (top):
- Counts days with at least one NN completed (cumulative, NOT a streak — only goes up)
- Format: "[n] days. You keep choosing yourself."

### Non-negotiables:
- One card per selected category with icon (no emoji — designed icon), label, category name
- Tap to complete. Gentle glow animation on completion (sage green pulse, 0.6s)
- Status text:
  - Zero done: "These are yours. Not anyone else's."
  - Partial: "[n] of [total]. Your pace, your terms."
  - All done: "You showed up for yourself today."
  - All-done message: "Small steps still move you forward."

### Daily pick:
- "What are you picking up today?" — shows Focus items
- Goal-aligned items shown first, then most recent
- If nothing is goal-aligned: "None of these are for your goals. Pick one and give it just 10 minutes."
- User taps to add to today

### Tasks:
- Goal colour dot(s) or grey "other" dot on each task
- Goal alignment indicator: "[n] of [total] for your goals"
- Tap to mark done
- Empty state: "Nothing planned for today. That's okay too."

### First-time prompt:
"You're set up. When you're ready, head to Dump and get what's in your head out." With button pointing to Dump.

---

## 10. Mirror view

### Two modes:

### Daily mode (opens from evening notification):
- Today's summary: NNs completed, tasks done, what was released today
- Validation message
- Check-in counter update

### Weekly mode (Sunday / anytime):
**Goal alignment breakdown:**
- Tasks by goal vs. untagged "Other"
- Time per goal if durations were logged
- "This week: [n] tasks moved you toward your goals. [m] were for everything else."

**Blocker-aware validation:**
- Heavy blockers + delivered: "You had [x] things working against you and still showed up [n] times. That's not just productivity — that's resilience."
- Heavy blockers + didn't deliver: "Tough week. [Blocker] alone would have been enough to slow anyone down. The fact that you're here checking in matters."

**Stale task check:**
- Tasks unselected for 3+ weeks: "This has been here 3 weeks. Keep or let it go?"

**Neglected goal nudge:**
- If a goal got 0 tasks: "'[Goal name]' didn't get attention this week. Want to carry something for it into next week?"

**NN summary:**
- 7-day grid showing completion per day. No streak count, no percentage.

**Weekly reflection prompts:**
- "What went well this week?"
- "What could be better?"
- "How did your goals feel this week?"
- Auto-saves. Placeholder: "Take your time..."

---

## 11. Onboarding

### Flow:

**Screen 1: Splash.**
"SLOW BURN OS" / "Count what counts." / "Your life. Your metrics." / [Begin]
Light palette. Animated — visual metaphor using light (see Section 14).

**Screen 2: Tour.**
Four slides with animated mockups + one-line descriptions:
1. Today: "Your day starts here. Check off your non-negotiables and see what's planned."
2. Dump: "Brain full? Dump it here. No structure needed — just get it out."
3. Release: "Flick away what isn't yours. Hold what is."
4. Mirror: "See where your time actually went. Not as judgement — as clarity."

Skip always visible. Final slide: "Let's set up."

**Screen 3: Distinction.**
Side-by-side: NN vs. Goal.

| | Non-negotiable | Goal |
|---|---|---|
| What it is | Your daily floor | Your direction |
| How it works | If you do nothing else today but this, it's a win | Something you're building toward over weeks or months |
| Example | "Text one person I care about" | "Rebuild my social life after moving cities" |
| Measured | Daily — did you show up? | Over time — are you moving closer? |

Closing: "Your non-negotiable can be small. That's the point. Your goal can be ambitious. That's also the point."

[Got it]

**Screen 4: Categories + NNs.**
"Where do you want to show up?" — pick 1–6, label each.
One screen per action. Progress bar at top.

**Screen 5: Goals.**
"Now, where do you want to go?" — three prompts per goal.
Science-backed note: "Most people start with 2 or 3."

**End:** "You're ready. Come back tomorrow morning and we'll start."

### Tour re-showing:
- First use: auto during onboarding
- Visits 2–5: "Need a refresher?"
- After: available in Settings

---

## 12. Settings

- Edit NN labels and categories
- Edit goals (title, measure, date, pause/complete)
- Add new goals (max 5 active)
- Daily check-in reminder: time picker. Copy: "End of day. Count what counted." Push notification.
- Replay tour
- Delete everything: two-step in-app confirmation. Lists what will be erased. "This cannot be undone." [Erase everything] → "Are you sure?" → [Cancel] / [Yes, erase it all]

---

## 13. Task-goal tagging

- Tagging happens when entering a task in Dump — dropdown shows user's goals + "Other"
- Strongly encouraged, not mandatory
- Tasks can be tagged to multiple goals
- Goal dots visible on every task in every view
- "Other" shown with grey dot everywhere

---

## 14. Design system

### Visual metaphor: Light
"The first ten minutes after you wake up when the light is soft and nothing has gone wrong yet."

- **Dump:** Screen slightly dim. As you unload, light fills the space. Like curtains opening.
- **Release:** Flicking away shadows. Each release lets more light in.
- **Focus:** Ambient light narrows to a directed beam.
- **Mirror:** Full, even light. Everything visible. Nothing hidden.

### Animation reference:
Dola app onboarding (Mobbin reference). Quality bar: smooth transitions between screens, animated visual metaphors, one idea per screen, generous spacing. All within the light palette — no dark splash screens.

### Colour tokens:
```
bg:          #F6F2EC    warm linen
card:        #FFFFFF    surfaces
cardDone:    #F2F6F3    completed
border:      #E6E0D6    default borders
borderDone:  #C4D8CC    completed borders
accent:      #5A856B    sage green
accentSoft:  rgba(90,133,107,0.08)
text:        #2A2622    primary text
textSoft:    #736D64    secondary
textMuted:   #B0A99E    placeholder
untagged:    #C4BBAF    "other" indicator
danger:      #B05A5A    destructive
```

### Goal colours:
Sage green, Dusty blue (#7B8AB5), Warm clay (#B5885A), Muted plum (#8B6B8A), Quiet teal (#5A8A8A)

### Typography:
- Primary: Newsreader (serif), fallback Georgia
- Meta: DM Sans (sans-serif)
- No emojis anywhere — designed icons only
- Max width: 430px, mobile-first

### Interactions:
- Transitions: 0.35s cubic-bezier(0.4, 0, 0.2, 1)
- NN completion: sage green glow pulse (0.6s)
- Release: breathing inhale/exhale tied to hold/flick
- Release flick: card flies with momentum in flick direction
- No confetti, no streaks
- Empty states: warm, never imply failure

---

## 15. Tone of voice

Direct, warm, never performative. Names what happened. Trusts the user to feel it.

### Today:
- Zero NNs: "These are yours. Not anyone else's."
- Partial: "[n] of [total]. Your pace, your terms."
- All done: "You showed up for yourself today."
- All-NNs message: "Small steps still move you forward."
- Check-in counter: "[n] days. You keep choosing yourself."
- No tasks: "Nothing planned for today. That's okay too."
- Goal nudge: "None of these are for your goals. Pick one and give it just 10 minutes."

### Dump:
- Tasks heading: "Things you could do"
- Thoughts heading: "Things on your mind"
- Blockers heading: "Things affecting your week"
- Input placeholder: "What's on your mind?"
- Empty: "Your mind is clear. For now."

### Release:
- Post-session (5+ released): "You let go of [n] things that aren't yours to carry. That's not avoidance — that's choosing where your energy goes."
- Held thought prompt: "You held this: '[text].' Want to turn it into something you can do?"
- Held but not actionable: "Just holding it is enough."

### Focus:
- Blocker prompt: "Before you pick your focus — anything affecting your week?"
- Light week: "Looks like a clear week. Want to stretch?"
- Heavy week: "You've got a lot going on. Maybe pick fewer."
- Recommendation: "Research shows 3–5 tasks per week leads to the best follow-through."

### Mirror:
- Daily: "Today you showed up for [n] non-negotiables. You completed [n] tasks. You let go of [n] things."
- Weekly alignment: "This week: [n] tasks moved you toward your goals. [m] were for everything else."
- Heavy + delivered: "You had [x] things working against you and still showed up. That's resilience."
- Heavy + didn't: "Tough week. The fact that you're here checking in matters."
- Stale task: "This has been here 3 weeks. Keep or let it go?"
- Neglected goal: "'[Goal]' didn't get attention this week. Want to carry something into next week?"
- Reflection: "What went well?" / "What could be better?" / "How did your goals feel?"

### Notification:
- "End of day. Count what counted."

### Settings:
- Reminder: "We'll send a gentle nudge at your chosen time."
- Delete: "This will permanently erase all your data." / "This cannot be undone."

---

## 16. Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| Mar 12 | Light palette over dark | Matches "quiet space" framing |
| Mar 12 | Sage green accent | Growth without pressure |
| Mar 12 | "Count what counts" | Rhythmic, distinct from Doerr |
| Mar 12 | Name stays | "Slow burn" = gradual, enduring |
| Mar 12 | Target user reframed | Strong-but-lost, not fragile |
| Mar 22 | Subtitle: "Your life. Your metrics." | Invitation, not diagnosis |
| Mar 22 | Tour replaces framing statement | Show don't tell |
| Mar 22 | Categories first, goals second | Ground in present first |
| Mar 22 | Three guided goal prompts | SMART without saying SMART |
| Mar 22 | NN vs Goal distinction screen | Side-by-side with real example |
| Mar 22 | Dump split: Tasks/Thoughts/Blockers | Different types need different flows |
| Mar 22 | Release tab with flick mechanic | Therapeutic gesture, not UI convention |
| Mar 22 | Hold/Release labels | Emotional, tactile |
| Mar 22 | Breathing mechanic in Release | Inhale on hold, exhale on release |
| Mar 22 | Focus replaces Week Ahead | Weekly narrowing, not sprint planning |
| Mar 22 | User-chosen Focus number | Science-backed rec of 3–5 |
| Mar 22 | Sunday evening planning | Plan when mind is quiet |
| Mar 22 | Blockers inform adaptive load | App adjusts recommendations based on context |
| Mar 22 | Blocker-aware validation in Mirror | Acknowledges difficulty, not just output |
| Mar 22 | 3-week stale task flag | "Keep or let go?" — no guilt |
| Mar 22 | Consistency → energy check → offer more | Earned growth, not auto-increase |
| Mar 22 | Tasks get deadline + goal tag in Dump | Enables urgency + alignment sorting |
| Mar 22 | Held thoughts → optional task conversion | Gentle, not forced |
| Mar 22 | Skipped thoughts reappear 2x then archive | Gives space without creating limbo |
| Mar 22 | Check-in counter: cumulative, not streak | "You keep choosing yourself" |
| Mar 22 | NN glow animation | Subtle sage pulse on completion |
| Mar 22 | "Not mine" items disappear immediately | The flick IS the letting go |
| Mar 22 | Anxiety validation: immediate + pattern-based | Sees the person, not just the data |
| Mar 22 | Daily Mirror from evening notification | "End of day. Count what counted." |
| Mar 22 | No emojis | Designed icons only. No AI aesthetic. |
| Mar 22 | Light as visual metaphor | Morning light filling the space |
| Mar 22 | Animation quality from Dola reference | Polish, spacing, one idea per screen |
| Mar 22 | Onboarding ends before first dump | "Come back tomorrow morning" |
| Mar 22 | End-of-day reminder in Settings | User-chosen time, push notification |
| Mar 22 | Two-step delete confirmation | In-app, not browser dialog |

---

## 17. Open questions

1. Flick-away vs. swipe direction — prototype both in Stitch
2. Category icons — need designed icons to replace emojis
3. Specific light animations for each view — to be designed in Stitch
4. Goal colour exact values — may shift based on final design
5. V2 backend: Firebase (via AI Studio) or Supabase?

---

## 18. Version plan

| Version | Storage | Status |
|---------|---------|--------|
| V1 Lite | localStorage | Feature-locked, moving to design |
| V2 Full | Firebase or Supabase | Architecture planned |

V2 adds: auth, cloud sync, monthly/quarterly Mirror, data export, end-of-year report, AI task extraction from voice.

---

*Prepared by Merlyn Ramanan × Claude (Anthropic), March 2026.*
*Living document. Updated as decisions are made.*