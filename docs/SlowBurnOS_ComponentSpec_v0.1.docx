SLOW BURN OS
Component Spec & Data Schema
Version 0.1 — Living document
1. App architecture
Slow Burn OS has two parallel systems that work together but stay separate:
Non-negotiables (NNs) — daily anchors tied to life categories (body, mind, spirit, etc.). These are about showing up for yourself today. They do not connect to goals. They appear in the Today view only.
Goals + Tasks — longer-term direction. Tasks flow from the Dump into the Week Ahead, get tagged to goals, and completion data feeds the Mirror. This is about where you’re going.
The app has four views:
View
Name
Purpose
Time direction
Today
Today
NNs + today’s tasks
Present
Dump
Dump
Brain dump inbox
Timeless
Plan
The week ahead
Sprint plan: assign to days, tag to goals
Forward 7 days
Mirror
Mirror
Goal alignment + weekly reflection
Backward 7 days


1.1 Data flow
The lifecycle of a task:
User brain dumps a thought into Dump. It’s raw text, nothing else.
During weekly planning (The Week Ahead), user pulls tasks from Dump. They assign a day (Sun–Sat) and tag to one or more goals (or leave untagged). Optionally, they add estimated duration.
When the assigned day arrives, the task appears in Today alongside non-negotiables.
User completes the task (optionally logging actual duration). It moves to ‘done’ status.
At week end, Mirror shows: how many tasks were goal-aligned vs. untagged. Time invested per goal (if durations were logged). Weekly reflection prompt.
Unfinished tasks roll back to Dump. No guilt, no red flags. They’re just back in the inbox.
Week starts on Sunday. Users plan on the weekend when their mind is quieter.

2. Data schema
All data is stored in localStorage for V1 (Lite). Schema is designed for clean migration to Supabase in V2. All keys prefixed sb3- (version 3 namespace, distinguishing from original sb2- build).
2.1 Setup object
localStorage key: sb3-setup
Field
Type
Description
categories
string[]
Selected category IDs, e.g. ["body", "mind", "spirit"]
nnLabels
object
Map of categoryId to custom label, e.g. { body: "Morning movement" }
nnCount
number
Number of selected categories (1–6)
weekStart
string
Always "sunday" for V1
createdAt
string
ISO date string of first setup


2.2 Goal object
localStorage key: sb3-goals (JSON array of goal objects)
Recommended: 3 goals. Maximum: 5. Backed by behavioral research on cognitive overload and goal competition for limited resources.
Field
Type
Description
id
string
Unique ID (timestamp-based)
title
string
Short goal name, e.g. "Launch my Substack"
description
string
SMART description — what does success look like?
targetDate
string
ISO date string — when do you want this done?
colour
string
Hex colour for visual tagging (assigned from palette)
createdAt
string
ISO date string
status
string
"active" | "completed" | "paused"


2.3 Task object
localStorage key: sb3-tasks (JSON array of task objects)
Field
Type
Description
id
string
Unique ID (timestamp-based)
text
string
Task description
goalIds
string[]
Array of goal IDs this task serves. Empty array = untagged.
status
string
"dump" | "planned" | "today" | "done"
day
number | null
0=Sun, 1=Mon ... 6=Sat. null when in dump.
weekOf
string | null
ISO date of the Sunday that starts the planned week. null when in dump.
estimatedMinutes
number | null
Optional. Estimated duration in minutes.
actualMinutes
number | null
Optional. Actual duration logged on completion.
createdAt
string
ISO date string
completedAt
string | null
ISO date string when marked done, null otherwise
addedFrom
string
"manual" | "voice" — how the task entered the dump


2.4 Non-negotiable completions
localStorage key: sb3-nn-{dateString} (one key per day, JSON object)
Example key: sb3-nn-2026-03-21
Field
Type
Description
{categoryId}
boolean
true if completed for that date. Key is the category ID (e.g. "body", "mind").

Example value: { "body": true, "spirit": true }

2.5 Weekly reflection
localStorage key: sb3-reflection-{weekOfDate} (one key per week)
Example key: sb3-reflection-2026-03-15 (the Sunday that starts the week)
Field
Type
Description
weekOf
string
ISO date of the Sunday starting this week
wentWell
string
Free text: what went well this week
improve
string
Free text: what could be better
goalCheck
string
Free text: how did your goals feel this week?
createdAt
string
ISO date string


2.6 App metadata
localStorage key: sb3-meta
Field
Type
Description
lastLogin
string
ISO date string of last app open
onboardingComplete
boolean
Whether onboarding has been finished
currentWeek
string
ISO date of current week’s Sunday


3. View specifications
3.0 Onboarding
Shown once on first launch. Four screens, linear flow, no skipping.
Screen 1: "Count what counts." — the phrase, the Slow Burn OS logo/wordmark, and a single "Begin" button. Full screen. Let it breathe. No other elements.
Screen 2: Framing statement. Two to three lines. (Copy being finalized — see PRD Section 7.2 for options under evaluation.) Single "Continue" button.
Screen 3: Set your goals. Prompt: "What do you want to work toward?" User adds up to 5 goals. Each goal has: title (required), description/SMART detail (required), target date (required). Gentle note: "Most people start with 2 or 3. You can always add more later." Each goal is assigned a colour from the palette automatically.
Screen 4: Choose your non-negotiable categories. All six shown (Body, Mind, Spirit, People, Growth, Rest) with icons. User taps to select 1–6. For each selected category, user writes their own non-negotiable label. Prompt per category: "What’s one thing in this area that’s just for you?" Suggestion to start with 2–3. "Done" button completes onboarding.
On completion, writes sb3-setup, sb3-goals, and sb3-meta to localStorage. Navigates to Today view.

3.1 Today
The screen you open at 7am. Two sections, clearly separated.
Section A: Non-negotiables
Displays one card per selected category with the user’s custom NN label.
Tap to toggle completion. Soft colour fill on completion, no animation beyond a gentle transition.
Status text above the cards shifts based on completion count:
0 done: "These are yours. Not anyone else’s."
Partial: "[n] of [total]. Your pace, your terms."
All done: "You showed up for yourself today."
NNs do not connect to goals. They exist in their own space.
Section B: Today’s tasks
Shows tasks with status "today" and day matching today’s day-of-week index (0–6, Sunday=0).
Each task shows: text, goal colour dot(s) for tagged goals (or grey dot if untagged), and optional estimated duration.
Tap to mark done. Optionally log actual duration on completion (small input, not required).
If no tasks are planned for today, empty state: "Nothing planned. That’s okay too."
No ability to add tasks directly to Today. Everything flows through Dump → Week Ahead → Today.

3.2 Dump
Pure inbox. Zero friction. The only job is to get things out of your head.
Single text input at the top. Type and press enter (or tap add). Task is created with status "dump", no goal, no day, no duration.
Voice capture button (microphone icon). Uses Web Speech API (Chrome/Safari). Transcript text becomes a single dump task. For V1, no AI extraction — just raw transcript as one task. (AI extraction is a V2 feature.)
List of all dump tasks below the input, newest first.
Each dump task shows: text only. No metadata, no goal tags, no dates.
Swipe left to delete. No other actions available in this view.
The Dump is not cleared automatically. Tasks stay until the user pulls them into The Week Ahead or deletes them.
Empty state: "Your mind is clear. For now."

3.3 The week ahead
Sprint planning view. This is where intention happens.
Layout
Top section: current week header showing Sunday–Saturday date range.
Below: the Dump backlog (collapsed by default, expandable). Shows count of unplanned tasks.
Main area: 7 day columns (Sun through Sat). Each column shows the day name and date, plus any tasks assigned to that day.
On mobile (primary): horizontal scroll or swipeable day cards rather than 7 simultaneous columns.
Planning actions
Pull from dump: user taps a dump task and assigns it to a day. The task’s status changes from "dump" to "planned".
Tag to goals: when assigning to a day, user can tap one or more goal colour badges to tag. Multiple selection allowed. Can also leave untagged.
Estimated duration: optional input. Quick-select buttons: 15m, 30m, 1h, 2h. Or custom entry.
Move between days: drag or use day-picker to reassign.
Send back to dump: if you change your mind, task goes back to dump status.
End of week behaviour
Tasks with status "planned" that were not completed by Saturday midnight automatically return to dump status. Their day and weekOf fields are cleared.
No shame UI. No "you missed 4 tasks" message. They’re just back in the dump, ready for next week if you want them.

3.4 Mirror
The insight layer. Looks backward at the past week. Two sections.
Section A: Goal alignment
Shows completed tasks for the past week (Sunday–Saturday).
Visual breakdown: tasks by goal. Each goal shows its colour, name, and count of tasks completed. Untagged tasks shown separately with grey indicator and label "Other things".
If durations were logged: also shows total time per goal and total time on untagged tasks.
The key insight is the ratio: "This week: [n] tasks moved you toward your goals. [m] were for everything else."
This is shown factually, not judgementally. No "you should do more goal-aligned tasks." Just: here’s what happened.
Over time (V2): this data compounds into monthly and quarterly views. For V1, weekly only.
Section B: Weekly reflection
Three prompts, each a text area:
"What went well this week?"
"What could be better?"
"How did your goals feel this week?"
Saved automatically as user types (debounced write to localStorage).
Previous weeks’ reflections viewable by scrolling down (reverse chronological).
Section C: NN summary
Separate from goal alignment. Shows non-negotiable completion for the past week.
Simple view: 7 days, each showing which NNs were completed. Colour dots per category.
No streak count, no percentage, no "you missed Tuesday." Just: here’s what you showed up for.

4. Settings
Accessible from a gear icon in the top-right corner of any view. Full-screen overlay.
4.1 Editable settings
Edit non-negotiable labels (per category)
Add or remove categories (1–6)
Edit goals: change title, description, target date, or mark as completed/paused
Add new goals (up to 5 total active)
Start Over: clears all localStorage, returns to onboarding. Requires confirmation ("This will erase all your data. Are you sure?")
4.2 Not editable in V1
Week start day (fixed: Sunday)
Goal colour assignments (auto-assigned from palette)
Export/import data (V2 feature)

5. Design system reference
Full design system is documented in the PRD (Section 6). Key references for component builders:
5.1 Colour tokens
Token
Value
Usage
bg
#F6F2EC
Main background
card
#FFFFFF
Card surfaces
cardDone
#F2F6F3
Completed item bg
border
#E6E0D6
Default borders
borderDone
#C4D8CC
Completed item border
accent
#5A856B
Primary accent (sage green)
accentSoft
rgba(90,133,107,0.08)
Accent fill
text
#2A2622
Primary text
textSoft
#736D64
Secondary text
textMuted
#B0A99E
Placeholder / meta


5.2 Goal colour palette
Goals are auto-assigned colours in order. These are muted, non-competing tones that work on the light background:
Goal 1
Goal 2
Goal 3
Goal 4
Goal 5
#5A856B
#7B8AB5
#B5885A
#8B6B8A
#5A8A8A
Sage green
Dusty blue
Warm clay
Muted plum
Quiet teal


Untagged tasks use #B0A99E (textMuted) as their indicator colour, labelled "Other things" in the Mirror view.
5.3 Typography
Primary font: Newsreader (serif), falling back to Georgia. Used for headings, body text, task names, reflection prompts.
Meta font: DM Sans (sans-serif). Used for labels, tab names, dates, small UI text.
Max width: 430px. Mobile-first. No desktop layout in V1.
Base sizes: 28px headings, 16px body/task text, 12px labels, 11px meta text.
5.4 Interaction patterns
All transitions: 0.35s cubic-bezier(0.4, 0, 0.2, 1). Unhurried.
Tap targets: minimum 44px.
No hover animations (mobile-first). Focus/active states use accent colour border.
Completion feedback: soft background colour shift + checkmark. No confetti, no streaks, no fireworks.
Empty states: always warm, never imply failure.

6. Component inventory
These are the components needed to build V1. Each should be its own file.
Component
Purpose
Used in
App
Root: routing between Onboarding and Main app
Entry
Onboarding
4-screen first-run flow
App
MainApp
Tab container + navigation bar
App
TodayView
NN cards + today’s task list
MainApp
NNCard
Single non-negotiable with toggle
TodayView
TaskCard
Single task with goal dots, completion, optional duration
TodayView, WeekView
DumpView
Brain dump input + task list
MainApp
DumpInput
Text input + voice capture button
DumpView
WeekView
Sprint planning: dump backlog + 7 day columns
MainApp
DayColumn
Single day: date header + task list + drop zone
WeekView
GoalPicker
Multi-select goal tags when assigning a task
WeekView
DurationPicker
Quick-select: 15m, 30m, 1h, 2h, custom
WeekView, TaskCard
MirrorView
Goal alignment data + reflection + NN summary
MainApp
GoalBreakdown
Visual: tasks per goal + untagged count
MirrorView
TimeBreakdown
Visual: time per goal (if durations logged)
MirrorView
ReflectionForm
3 prompts: went well, improve, goal check
MirrorView
NNWeekSummary
7-day NN completion dots
MirrorView
SettingsPanel
Full-screen settings overlay
MainApp
GoalEditor
Edit/add/pause goals
SettingsPanel, Onboarding
NavBar
Bottom tab navigation: Today, Dump, Plan, Mirror
MainApp


7. V2 migration notes
The schema is designed so V1 localStorage maps cleanly to V2 Supabase tables. Key considerations:
sb3-goals → goals table with user_id foreign key
sb3-tasks → tasks table. goalIds becomes a join table (task_goals) for proper relational modelling.
sb3-nn-{date} → nn_completions table with composite unique key (user_id, date, category_id).
sb3-reflection-{date} → reflections table with user_id and week_of.
Migration script on first V2 login: read all localStorage, bulk-insert to Supabase, mark migration complete.
V2 adds: auth (Supabase Auth), real-time sync, monthly/quarterly Mirror views, data export, end-of-year report.

—
Prepared by Merlyn Ramanan × Claude (Anthropic), March 2026.
This is a living document. Updated as decisions are made.
