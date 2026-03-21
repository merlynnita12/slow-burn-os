import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// SLOW BURN OS — V1 Lite (Revised Flow)
// ═══════════════════════════════════════════════════════════════

// ── Design Tokens ──
const T = {
  bg: "#F6F2EC",
  card: "#FFFFFF",
  cardDone: "#F2F6F3",
  border: "#E6E0D6",
  borderDone: "#C4D8CC",
  accent: "#5A856B",
  accentSoft: "rgba(90,133,107,0.08)",
  accentHover: "rgba(90,133,107,0.15)",
  text: "#2A2622",
  textSoft: "#736D64",
  textMuted: "#B0A99E",
  check: "#5A856B",
  danger: "#B05A5A",
  dangerSoft: "rgba(176,90,90,0.08)",
  untagged: "#C4BBAF",
};

const GOAL_COLORS = ["#5A856B", "#7B8AB5", "#B5885A", "#8B6B8A", "#5A8A8A"];

const CATEGORIES = [
  { id: "body", label: "Body", icon: "\u{1F3C3}", defaultNN: "Morning movement" },
  { id: "mind", label: "Mind", icon: "\u{1F9E0}", defaultNN: "Deep work block" },
  { id: "spirit", label: "Spirit", icon: "\u{1F56F}\u{FE0F}", defaultNN: "Morning stillness" },
  { id: "people", label: "People", icon: "\u{1F91D}", defaultNN: "Connect with someone I love" },
  { id: "growth", label: "Growth", icon: "\u{1F331}", defaultNN: "Work on my craft" },
  { id: "rest", label: "Rest", icon: "\u{1F319}", defaultNN: "Evening wind-down" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Helpers ──
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const ls = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const getWeekSunday = (d = new Date()) => {
  const dt = new Date(d); dt.setDate(dt.getDate() - dt.getDay()); dt.setHours(0, 0, 0, 0);
  return dt.toISOString().split("T")[0];
};
const getTodayStr = () => new Date().toISOString().split("T")[0];
const getTodayDayIdx = () => new Date().getDay();
const formatDate = (s) => new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
const getWeekDates = (sun) => {
  const b = new Date(sun + "T12:00:00");
  return DAYS.map((_, i) => { const d = new Date(b); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0]; });
};

// ── Fonts ──
const font = "'Newsreader', Georgia, 'Times New Roman', serif";
const fontMeta = "'DM Sans', system-ui, -apple-system, sans-serif";

// ── Shared Styles ──
const cardStyle = (done) => ({
  background: done ? T.cardDone : T.card,
  border: "1px solid " + (done ? T.borderDone : T.border),
  borderRadius: 14, padding: "16px 18px", marginBottom: 10,
  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer",
});
const btnPrimary = {
  background: T.accent, color: "#fff", border: "none", borderRadius: 10,
  padding: "12px 24px", fontFamily: fontMeta, fontSize: 13, fontWeight: 500,
  cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.2s ease",
};
const btnSecondary = {
  ...btnPrimary, background: "transparent", color: T.accent, border: "1px solid " + T.border,
};
const inputStyle = {
  width: "100%", boxSizing: "border-box", background: T.card,
  border: "1px solid " + T.border, borderRadius: 10, padding: "12px 14px",
  fontFamily: font, fontSize: 15, color: T.text, outline: "none",
};
const labelStyle = {
  fontFamily: fontMeta, fontSize: 10, color: T.textMuted,
  letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px 0",
};

// ── Micro Components ──
const Check = ({ checked, size = 22 }) => (
  <div style={{
    width: size, height: size, borderRadius: 7, flexShrink: 0,
    border: "1.5px solid " + (checked ? T.check : T.border),
    background: checked ? T.accentSoft : "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
  }}>
    {checked && <svg width={size * 0.55} height={size * 0.45} viewBox="0 0 12 10" fill="none">
      <path d="M1 5L4.5 8.5L11 1.5" stroke={T.check} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>}
  </div>
);

const GoalDots = ({ goalIds, goals, showLabel }) => {
  if (goalIds.length === 0) return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.untagged }} />
      {showLabel && <span style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted }}>other</span>}
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {goalIds.map(gid => {
        const g = goals.find(x => x.id === gid);
        return g ? <div key={gid} style={{ width: 8, height: 8, borderRadius: "50%", background: g.colour }} title={g.title} /> : null;
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// TOUR
// ═══════════════════════════════════════════════════════════════
const Tour = ({ onDone }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      tab: "Today",
      icon: "\u25C9",
      color: T.accent,
      mockup: (
        <div style={{ padding: 16 }}>
          <div style={{ background: T.card, borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, border: "1.5px solid " + T.borderDone, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke={T.check} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <span style={{ fontSize: 14 }}>{"\u{1F3C3}"}</span>
            <span style={{ fontFamily: font, fontSize: 13, color: T.text }}>Morning movement</span>
          </div>
          <div style={{ background: T.card, borderRadius: 10, padding: "12px 14px", marginBottom: 8, border: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, border: "1.5px solid " + T.border }} />
            <span style={{ fontSize: 14 }}>{"\u{1F9E0}"}</span>
            <span style={{ fontFamily: font, fontSize: 13, color: T.text }}>Deep work block</span>
          </div>
          <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
          <div style={{ background: T.card, borderRadius: 10, padding: "10px 14px", border: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOAL_COLORS[0] }} />
            <span style={{ fontFamily: font, fontSize: 12, color: T.text }}>Write Substack draft</span>
            <span style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted, marginLeft: "auto" }}>30m</span>
          </div>
        </div>
      ),
      copy: "Your day starts here. Check off your non-negotiables and see what\u2019s planned.",
    },
    {
      tab: "Dump",
      icon: "\u270E",
      color: "#7B8AB5",
      mockup: (
        <div style={{ padding: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, background: T.card, borderRadius: 10, padding: "10px 14px", border: "1px solid " + T.border }}>
              <span style={{ fontFamily: font, fontSize: 13, color: T.textMuted }}>What's on your mind?</span>
            </div>
            <div style={{ ...btnPrimary, padding: "10px 14px", fontSize: 16, display: "flex", alignItems: "center" }}>+</div>
          </div>
          {["Call the accountant", "Research flight prices", "Outline chapter 3"].map((t, i) => (
            <div key={i} style={{ background: T.card, borderRadius: 10, padding: "10px 14px", marginBottom: 6, border: "1px solid " + T.border }}>
              <span style={{ fontFamily: font, fontSize: 12, color: T.text }}>{t}</span>
            </div>
          ))}
        </div>
      ),
      copy: "Brain full? Dump it here. No structure needed \u2014 just get it out.",
    },
    {
      tab: "The Week Ahead",
      icon: "\u25A6",
      color: "#B5885A",
      mockup: (
        <div style={{ padding: 16 }}>
          {["Mon", "Tue", "Wed"].map((d, i) => (
            <div key={d} style={{ marginBottom: 10 }}>
              <p style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>{d}</p>
              {i === 0 && (
                <div style={{ background: T.card, borderRadius: 10, padding: "10px 14px", border: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOAL_COLORS[0] }} />
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: GOAL_COLORS[1] }} />
                  <span style={{ fontFamily: font, fontSize: 12, color: T.text }}>Research flight prices</span>
                </div>
              )}
              {i === 1 && (
                <div style={{ background: T.card, borderRadius: 10, padding: "10px 14px", border: "1px solid " + T.border, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.untagged }} />
                  <span style={{ fontFamily: font, fontSize: 12, color: T.text }}>Call the accountant</span>
                </div>
              )}
              {i === 2 && <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, fontStyle: "italic", margin: 0, paddingLeft: 4 }}>\u2014</p>}
            </div>
          ))}
        </div>
      ),
      copy: "Plan your week. Every task gets tagged \u2014 is it for your goals, or for everything else?",
    },
    {
      tab: "Mirror",
      icon: "\u21BB",
      color: "#8B6B8A",
      mockup: (
        <div style={{ padding: 16 }}>
          <p style={{ fontFamily: font, fontSize: 13, color: T.text, margin: "0 0 12px", lineHeight: 1.5 }}>
            This week: <strong>6</strong> tasks moved you toward your goals. <strong>3</strong> were for everything else.
          </p>
          {[{ c: GOAL_COLORS[0], n: "Launch Substack", ct: 4 }, { c: GOAL_COLORS[1], n: "Get healthier", ct: 2 }, { c: T.untagged, n: "Other things", ct: 3 }].map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.c }} />
              <span style={{ fontFamily: fontMeta, fontSize: 12, color: T.text, flex: 1 }}>{g.n}</span>
              <span style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft }}>{g.ct}</span>
            </div>
          ))}
        </div>
      ),
      copy: "See where your time actually went. Not as judgement \u2014 as clarity.",
    },
  ];

  const s = slides[slide];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? 20 : 6, height: 6, borderRadius: 3,
              background: i === slide ? s.color : T.border,
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Tab label */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: fontMeta, fontSize: 11, color: s.color, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
            {s.icon} {s.tab}
          </span>
        </div>

        {/* Mockup */}
        <div style={{
          background: T.bg, borderRadius: 20, border: "1px solid " + T.border,
          overflow: "hidden", marginBottom: 20,
          boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        }}>
          {s.mockup}
        </div>

        {/* Copy */}
        <p style={{ fontFamily: font, fontSize: 16, fontStyle: "italic", color: T.text, textAlign: "center", lineHeight: 1.6, margin: "0 0 32px", padding: "0 12px" }}>
          {s.copy}
        </p>

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          {slide < slides.length - 1 ? (
            <>
              <button onClick={onDone} style={{ ...btnSecondary, padding: "10px 20px" }}>Skip</button>
              <button onClick={() => setSlide(slide + 1)} style={{ ...btnPrimary, padding: "10px 24px" }}>Next</button>
            </>
          ) : (
            <button onClick={onDone} style={{ ...btnPrimary, padding: "12px 32px" }}>Let\u2019s set up</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ONBOARDING (Categories first, then Goals)
// ═══════════════════════════════════════════════════════════════
const Onboarding = ({ onComplete }) => {
  const [phase, setPhase] = useState("splash"); // splash → tour → categories → goals
  const [selCats, setSelCats] = useState([]);
  const [nnLabels, setNnLabels] = useState({});
  const [goals, setGoals] = useState([{ id: uid(), title: "", measure: "", targetDate: "" }]);
  const [fadeIn, setFadeIn] = useState(true);

  const transition = (next) => {
    setFadeIn(false);
    setTimeout(() => { setPhase(next); setFadeIn(true); }, 300);
  };

  const toggleCat = (id) => setSelCats(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const addGoal = () => { if (goals.length < 5) setGoals([...goals, { id: uid(), title: "", measure: "", targetDate: "" }]); };
  const updateGoal = (i, f, v) => { const g = [...goals]; g[i] = { ...g[i], [f]: v }; setGoals(g); };
  const removeGoal = (i) => { if (goals.length > 1) setGoals(goals.filter((_, j) => j !== i)); };

  const finish = () => {
    const validGoals = goals.filter(g => g.title.trim()).map((g, i) => ({
      id: g.id, title: g.title.trim(), measure: g.measure.trim(), targetDate: g.targetDate,
      colour: GOAL_COLORS[i % GOAL_COLORS.length], createdAt: getTodayStr(), status: "active",
    }));
    const setup = {
      categories: selCats,
      nnLabels: { ...Object.fromEntries(CATEGORIES.map(c => [c.id, c.defaultNN])), ...nnLabels },
      nnCount: selCats.length, weekStart: "sunday", createdAt: getTodayStr(),
    };
    onComplete(setup, validGoals);
  };

  const animStyle = { opacity: fadeIn ? 1 : 0, transform: fadeIn ? "translateY(0)" : "translateY(12px)", transition: "all 0.3s ease" };

  // ── Splash ──
  if (phase === "splash") return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", ...animStyle }}>
        <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 40 }}>Slow Burn OS</p>
        <h1 style={{ fontFamily: font, fontSize: 38, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 12px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          Count what counts.
        </h1>
        <p style={{ fontFamily: fontMeta, fontSize: 14, color: T.textSoft, margin: "0 0 56px", letterSpacing: "0.01em" }}>
          Your life. Your metrics.
        </p>
        <button onClick={() => transition("tour")} style={btnPrimary}>Begin</button>
      </div>
    </div>
  );

  // ── Tour ──
  if (phase === "tour") return <Tour onDone={() => transition("categories")} />;

  // ── Categories ──
  if (phase === "categories") return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, ...animStyle }}>
        <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 6px" }}>
          Where do you want to show up?
        </h2>
        <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft, margin: "0 0 24px", lineHeight: 1.5 }}>
          These are your daily anchors. Start with 2 or 3 \u2014 you can always add more.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {CATEGORIES.map(cat => {
            const sel = selCats.includes(cat.id);
            return (
              <div key={cat.id} onClick={() => toggleCat(cat.id)} style={{
                padding: "16px 14px", borderRadius: 14, textAlign: "center", cursor: "pointer",
                background: sel ? T.accentSoft : T.card,
                border: "1.5px solid " + (sel ? T.accent : T.border),
                transition: "all 0.25s ease",
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{cat.icon}</div>
                <p style={{ fontFamily: fontMeta, fontSize: 12, color: sel ? T.accent : T.textSoft, margin: 0, fontWeight: sel ? 600 : 400 }}>{cat.label}</p>
              </div>
            );
          })}
        </div>

        {selCats.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={labelStyle}>Your non-negotiables</p>
            {selCats.map(cid => {
              const cat = CATEGORIES.find(c => c.id === cid);
              return (
                <div key={cid} style={{ marginBottom: 10 }}>
                  <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textSoft, margin: "0 0 4px" }}>
                    {cat.icon} {cat.label} \u2014 what\u2019s one thing that\u2019s just for you?
                  </p>
                  <input placeholder={cat.defaultNN} value={nnLabels[cid] || ""} onChange={e => setNnLabels({ ...nnLabels, [cid]: e.target.value })} style={inputStyle} />
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => transition("goals")} disabled={selCats.length === 0} style={{ ...btnPrimary, width: "100%", opacity: selCats.length > 0 ? 1 : 0.4 }}>Continue</button>
      </div>
    </div>
  );

  // ── Goals ──
  if (phase === "goals") return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, ...animStyle }}>
        <h2 style={{ fontFamily: font, fontSize: 24, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 6px" }}>
          Now, where do you want to go?
        </h2>
        <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft, margin: "0 0 24px", lineHeight: 1.5 }}>
          Set 2 or 3 goals. These are your direction \u2014 you\u2019ll tag your tasks to them.
        </p>

        {goals.map((g, i) => (
          <div key={g.id} style={{ marginBottom: 16, padding: 16, background: T.card, borderRadius: 14, border: "1px solid " + T.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: GOAL_COLORS[i % GOAL_COLORS.length], flexShrink: 0 }} />
              <p style={{ ...labelStyle, margin: 0 }}>Goal {i + 1}</p>
              {goals.length > 1 && <button onClick={() => removeGoal(i)} style={{ marginLeft: "auto", background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>&times;</button>}
            </div>
            <input placeholder="What\u2019s the goal?" value={g.title} onChange={e => updateGoal(i, "title", e.target.value)} style={{ ...inputStyle, marginBottom: 8 }} />
            <input placeholder="How will you know you\u2019ve done it?" value={g.measure} onChange={e => updateGoal(i, "measure", e.target.value)} style={{ ...inputStyle, marginBottom: 8, fontSize: 13 }} />
            <input type="date" value={g.targetDate} onChange={e => updateGoal(i, "targetDate", e.target.value)} style={{ ...inputStyle, fontSize: 13, color: g.targetDate ? T.text : T.textMuted }} />
          </div>
        ))}

        {goals.length < 5 && <button onClick={addGoal} style={{ ...btnSecondary, width: "100%", marginBottom: 16 }}>+ Add another goal</button>}
        <button onClick={finish} disabled={!goals.some(g => g.title.trim())} style={{ ...btnPrimary, width: "100%", opacity: goals.some(g => g.title.trim()) ? 1 : 0.4 }}>Let\u2019s go</button>
      </div>
    </div>
  );

  return null;
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
const MainApp = ({ setup, goals: initGoals, onReset }) => {
  const [tab, setTab] = useState("today");
  const [tasks, setTasks] = useState(() => ls("sb3-tasks") || []);
  const [goals, setGoals] = useState(initGoals);
  const [nnDone, setNnDone] = useState(() => ls("sb3-nn-" + getTodayStr()) || {});
  const [dumpInput, setDumpInput] = useState("");
  const [reflection, setReflection] = useState(() => ls("sb3-reflection-" + getWeekSunday()) || { wentWell: "", improve: "", goalCheck: "" });
  const [planningTask, setPlanningTask] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTourPrompt, setShowTourPrompt] = useState(false);
  const [showTour, setShowTour] = useState(false);

  const weekSunday = getWeekSunday();
  const weekDates = getWeekDates(weekSunday);
  const todayIdx = getTodayDayIdx();
  const todayStr = getTodayStr();

  // Tour re-show logic: visits 2-5
  useEffect(() => {
    const meta = ls("sb3-meta") || {};
    const visits = (meta.visitCount || 0) + 1;
    lsSet("sb3-meta", { ...meta, visitCount: visits, lastLogin: todayStr });
    if (visits >= 2 && visits <= 5) setShowTourPrompt(true);
  }, []);

  // Persist
  useEffect(() => { lsSet("sb3-tasks", tasks); }, [tasks]);
  useEffect(() => { lsSet("sb3-nn-" + todayStr, nnDone); }, [nnDone, todayStr]);
  useEffect(() => { lsSet("sb3-reflection-" + weekSunday, reflection); }, [reflection, weekSunday]);
  useEffect(() => { lsSet("sb3-goals", goals); }, [goals]);

  const updateTask = (id, up) => setTasks(p => p.map(t => t.id === id ? { ...t, ...up } : t));
  const deleteTask = (id) => setTasks(p => p.filter(t => t.id !== id));
  const toggleNN = (catId) => setNnDone(p => ({ ...p, [catId]: !p[catId] }));

  const addDumpTask = () => {
    if (!dumpInput.trim()) return;
    setTasks(p => [{ id: uid(), text: dumpInput.trim(), goalIds: [], status: "dump", day: null, weekOf: null, estimatedMinutes: null, actualMinutes: null, createdAt: todayStr, completedAt: null, addedFrom: "manual" }, ...p]);
    setDumpInput("");
  };

  const dumpTasks = tasks.filter(t => t.status === "dump");
  const todayTasks = tasks.filter(t => (t.status === "planned" || t.status === "today") && t.day === todayIdx && t.weekOf === weekSunday);
  const weekTasks = tasks.filter(t => (t.status === "planned" || t.status === "today") && t.weekOf === weekSunday);
  const doneTasks = tasks.filter(t => t.status === "done" && t.weekOf === weekSunday);

  const nnCount = setup.categories.filter(c => nnDone[c]).length;
  const nnTotal = setup.categories.length;
  const statusText = nnCount === 0 ? "These are yours. Not anyone else\u2019s."
    : nnCount === nnTotal ? "You showed up for yourself today."
    : nnCount + " of " + nnTotal + ". Your pace, your terms.";

  // Goal alignment for Today
  const todayGoalAligned = todayTasks.filter(t => t.goalIds.length > 0).length;
  const todayTotal = todayTasks.length;

  const tabs = [
    { id: "today", icon: "\u25C9", label: "Today" },
    { id: "dump", icon: "\u270E", label: "Dump" },
    { id: "week", icon: "\u25A6", label: "Plan" },
    { id: "mirror", icon: "\u21BB", label: "Mirror" },
  ];

  // ── Planning Modal ──
  const PlanModal = ({ task, onClose }) => {
    const [day, setDay] = useState(task.day != null ? task.day : todayIdx);
    const [selGoals, setSelGoals] = useState(task.goalIds || []);
    const [notForGoal, setNotForGoal] = useState(false);
    const [est, setEst] = useState(task.estimatedMinutes || "");

    const toggleGoal = (gid) => {
      setNotForGoal(false);
      setSelGoals(p => p.includes(gid) ? p.filter(x => x !== gid) : [...p, gid]);
    };

    const save = () => {
      updateTask(task.id, {
        day, goalIds: notForGoal ? [] : selGoals, estimatedMinutes: est || null,
        status: "planned", weekOf: weekSunday,
      });
      onClose();
    };

    const noGoalsSelected = selGoals.length === 0 && !notForGoal;

    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, background: T.bg, borderRadius: "20px 20px 0 0", padding: "24px 24px 36px" }}>
          <p style={{ fontFamily: font, fontSize: 16, color: T.text, margin: "0 0 16px" }}>{task.text}</p>

          <p style={labelStyle}>Assign to day</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {DAYS.map((d, i) => (
              <button key={i} onClick={() => setDay(i)} style={{
                ...btnSecondary, padding: "7px 10px", fontSize: 11,
                background: day === i ? T.accent : T.card, color: day === i ? "#fff" : T.textSoft,
                border: day === i ? "1px solid " + T.accent : "1px solid " + T.border,
              }}>{d} {formatDate(weekDates[i])}</button>
            ))}
          </div>

          <p style={labelStyle}>Is this for a goal?</p>
          {noGoalsSelected && (
            <p style={{ fontFamily: font, fontSize: 12, fontStyle: "italic", color: T.accent, margin: "-4px 0 10px" }}>
              Tag it to a goal \u2014 or mark it as \u201Cother.\u201D This is how you see where your time goes.
            </p>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {goals.filter(g => g.status === "active").map(g => (
              <button key={g.id} onClick={() => toggleGoal(g.id)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 10, fontSize: 12, fontFamily: fontMeta,
                background: selGoals.includes(g.id) ? g.colour + "20" : T.card,
                border: "1.5px solid " + (selGoals.includes(g.id) ? g.colour : T.border),
                color: selGoals.includes(g.id) ? g.colour : T.textSoft,
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.colour }} />
                {g.title}
              </button>
            ))}
          </div>
          <button onClick={() => { setNotForGoal(!notForGoal); setSelGoals([]); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 10, fontSize: 12, fontFamily: fontMeta,
            background: notForGoal ? T.untagged + "20" : T.card,
            border: "1.5px solid " + (notForGoal ? T.untagged : T.border),
            color: notForGoal ? T.textSoft : T.textMuted,
            cursor: "pointer", marginBottom: 16, transition: "all 0.2s ease",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.untagged }} />
            Not for a goal
          </button>

          <p style={labelStyle}>Estimated duration (optional)</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[15, 30, 60, 120].map(m => (
              <button key={m} onClick={() => setEst(est === m ? "" : m)} style={{
                ...btnSecondary, padding: "7px 14px", fontSize: 12,
                background: est === m ? T.accent : T.card, color: est === m ? "#fff" : T.textSoft,
                border: est === m ? "1px solid " + T.accent : "1px solid " + T.border,
              }}>{m < 60 ? m + "m" : (m / 60) + "h"}</button>
            ))}
          </div>

          <button onClick={save} style={{ ...btnPrimary, width: "100%" }}>Plan it</button>
        </div>
      </div>
    );
  };

  // ── Tour overlay ──
  if (showTour) return <Tour onDone={() => { setShowTour(false); setShowTourPrompt(false); }} />;

  // ── Settings ──
  if (showSettings) return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: font, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: T.text, margin: 0 }}>Settings</h2>
        <button onClick={() => setShowSettings(false)} style={{ background: "none", border: "none", fontSize: 24, color: T.textSoft, cursor: "pointer" }}>&times;</button>
      </div>
      <p style={labelStyle}>Your goals</p>
      {goals.map(g => (
        <div key={g.id} style={{ ...cardStyle(false), display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: g.colour, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: 14, color: T.text, margin: 0 }}>{g.title}</p>
            {g.measure && <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{g.measure}</p>}
          </div>
        </div>
      ))}
      <button onClick={() => setShowTour(true)} style={{ ...btnSecondary, width: "100%", marginTop: 24 }}>Replay tour</button>
      <div style={{ marginTop: 40, padding: 20, background: T.dangerSoft, borderRadius: 14, border: "1px solid rgba(176,90,90,0.15)" }}>
        <p style={{ fontFamily: font, fontSize: 14, color: T.danger, margin: "0 0 8px", fontWeight: 500 }}>Start over</p>
        <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft, margin: "0 0 16px" }}>This will erase all your data.</p>
        <button onClick={() => { if (window.confirm("This will erase all your data. Are you sure?")) onReset(); }} style={{ ...btnSecondary, borderColor: T.danger, color: T.danger }}>Erase everything</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", paddingBottom: 80 }}>

      {/* Tour re-show prompt */}
      {showTourPrompt && (
        <div style={{ margin: "0 20px", padding: "12px 16px", background: T.accentSoft, borderRadius: 12, display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
          <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.accent, margin: 0, flex: 1 }}>Need a refresher on how things work?</p>
          <button onClick={() => setShowTour(true)} style={{ ...btnPrimary, padding: "6px 14px", fontSize: 11 }}>Show tour</button>
          <button onClick={() => setShowTourPrompt(false)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 14 }}>&times;</button>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Slow Burn OS</p>
        <button onClick={() => setShowSettings(true)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16, padding: 4 }}>{"\u2699"}</button>
      </div>

      {/* ── TODAY ── */}
      {tab === "today" && (
        <div style={{ padding: "8px 20px 24px" }}>
          <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", margin: "16px 0 6px" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 6px", letterSpacing: "-0.015em" }}>Your day</h1>
          <p style={{ fontFamily: font, fontSize: 14, color: T.textSoft, margin: "0 0 24px", lineHeight: 1.5 }}>{statusText}</p>

          <p style={labelStyle}>Non-negotiables</p>
          {setup.categories.map(catId => {
            const cat = CATEGORIES.find(c => c.id === catId);
            const done = nnDone[catId];
            const label = setup.nnLabels[catId] || cat.defaultNN;
            return (
              <div key={catId} onClick={() => toggleNN(catId)} style={{ ...cardStyle(done), display: "flex", alignItems: "center", gap: 14 }}>
                <Check checked={done} />
                <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: font, fontSize: 15, margin: "0 0 2px", opacity: done ? 0.5 : 1, transition: "opacity 0.3s" }}>{label}</p>
                  <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cat.label}</p>
                </div>
              </div>
            );
          })}

          {nnCount === nnTotal && nnTotal > 0 && (
            <div style={{ marginTop: 4, marginBottom: 16, padding: 16, borderRadius: 14, background: T.accentSoft, border: "1px solid " + T.borderDone, textAlign: "center" }}>
              <p style={{ fontFamily: font, fontSize: 14, fontStyle: "italic", color: T.accent, margin: 0 }}>Small steps still move you forward.</p>
            </div>
          )}

          {/* Goal alignment indicator */}
          {todayTotal > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "20px 0 12px", padding: "10px 14px", background: T.card, borderRadius: 10, border: "1px solid " + T.border }}>
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: T.border, overflow: "hidden" }}>
                <div style={{ width: (todayGoalAligned / todayTotal * 100) + "%", height: "100%", background: T.accent, borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
              <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textSoft, margin: 0, whiteSpace: "nowrap" }}>
                {todayGoalAligned} of {todayTotal} for your goals
              </p>
            </div>
          )}

          {todayTasks.length > 0 && (
            <>
              <p style={{ ...labelStyle, marginTop: 8 }}>Tasks</p>
              {todayTasks.map(t => {
                const done = t.status === "done";
                return (
                  <div key={t.id} onClick={() => updateTask(t.id, { status: done ? "planned" : "done", completedAt: done ? null : todayStr })}
                    style={{ ...cardStyle(done), display: "flex", alignItems: "center", gap: 12 }}>
                    <Check checked={done} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: font, fontSize: 14, margin: "0 0 4px", opacity: done ? 0.5 : 1, transition: "opacity 0.3s" }}>{t.text}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <GoalDots goalIds={t.goalIds} goals={goals} showLabel />
                        {t.estimatedMinutes && <p style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted, margin: 0 }}>{t.estimatedMinutes}m</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {todayTasks.length === 0 && (
            <p style={{ fontFamily: font, fontSize: 14, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 24 }}>Nothing planned for today. That\u2019s okay too.</p>
          )}
        </div>
      )}

      {/* ── DUMP ── */}
      {tab === "dump" && (
        <div style={{ padding: "8px 20px 24px" }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "16px 0 6px" }}>Dump</h1>
          <p style={{ fontFamily: font, fontSize: 14, color: T.textSoft, margin: "0 0 24px" }}>Get it out of your head.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <input value={dumpInput} onChange={e => setDumpInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addDumpTask()} placeholder="What\u2019s on your mind?" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addDumpTask} style={{ ...btnPrimary, padding: "12px 16px" }}>+</button>
          </div>
          {dumpTasks.length === 0 && <p style={{ fontFamily: font, fontSize: 14, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 24 }}>Your mind is clear. For now.</p>}
          {dumpTasks.map(t => (
            <div key={t.id} style={{ ...cardStyle(false), display: "flex", alignItems: "center", gap: 12, cursor: "default" }}>
              <p style={{ fontFamily: font, fontSize: 14, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
              <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 14, padding: 4 }}>&times;</button>
            </div>
          ))}
        </div>
      )}

      {/* ── WEEK AHEAD ── */}
      {tab === "week" && (
        <div style={{ padding: "8px 20px 24px" }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "16px 0 6px" }}>The week ahead</h1>
          <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft, margin: "0 0 24px" }}>{formatDate(weekDates[0])} \u2014 {formatDate(weekDates[6])}</p>

          {dumpTasks.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <p style={labelStyle}>From your dump ({dumpTasks.length})</p>
              {dumpTasks.map(t => (
                <div key={t.id} style={{ ...cardStyle(false), display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
                  <p style={{ fontFamily: font, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
                  <button onClick={() => setPlanningTask(t)} style={{ ...btnPrimary, padding: "6px 14px", fontSize: 11 }}>Plan</button>
                </div>
              ))}
            </div>
          )}

          {DAYS.map((dayName, dayIdx) => {
            const dayTasks = weekTasks.filter(t => t.day === dayIdx);
            const isToday = dayIdx === todayIdx;
            return (
              <div key={dayIdx} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <p style={{ ...labelStyle, margin: 0, color: isToday ? T.accent : T.textMuted, fontWeight: isToday ? 700 : 400 }}>{dayName} {formatDate(weekDates[dayIdx])}</p>
                  {isToday && <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />}
                </div>
                {dayTasks.length === 0 && <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, fontStyle: "italic", margin: "0 0 4px", paddingLeft: 4 }}>\u2014</p>}
                {dayTasks.map(t => (
                  <div key={t.id} style={{ ...cardStyle(t.status === "done"), display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "default" }}>
                    <GoalDots goalIds={t.goalIds} goals={goals} showLabel />
                    <p style={{ fontFamily: font, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
                    {t.estimatedMinutes && <p style={{ fontFamily: fontMeta, fontSize: 10, color: T.textMuted, margin: 0 }}>{t.estimatedMinutes}m</p>}
                    <button onClick={() => updateTask(t.id, { status: "dump", day: null, weekOf: null, goalIds: [], estimatedMinutes: null })}
                      style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 12 }}>{"\u21A9"}</button>
                  </div>
                ))}
              </div>
            );
          })}

          {dumpTasks.length === 0 && weekTasks.length === 0 && (
            <p style={{ fontFamily: font, fontSize: 14, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 24 }}>Nothing planned yet. Dump some tasks first.</p>
          )}
        </div>
      )}

      {/* ── MIRROR ── */}
      {tab === "mirror" && (
        <div style={{ padding: "8px 20px 24px" }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "16px 0 6px" }}>Mirror</h1>
          <p style={{ fontFamily: fontMeta, fontSize: 12, color: T.textSoft, margin: "0 0 24px" }}>Week of {formatDate(weekDates[0])} \u2014 {formatDate(weekDates[6])}</p>

          <p style={labelStyle}>Where your time went</p>
          {(() => {
            const allDone = tasks.filter(t => t.status === "done" && t.weekOf === weekSunday);
            if (allDone.length === 0) return <p style={{ fontFamily: font, fontSize: 14, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginBottom: 24 }}>No completed tasks this week yet.</p>;

            const gc = {}; let ut = 0; const gm = {}; let um = 0;
            allDone.forEach(t => {
              const m = t.actualMinutes || t.estimatedMinutes || 0;
              if (t.goalIds.length === 0) { ut++; um += m; }
              else t.goalIds.forEach(gid => { gc[gid] = (gc[gid] || 0) + 1; gm[gid] = (gm[gid] || 0) + m; });
            });
            const tagged = allDone.length - ut;

            return (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontFamily: font, fontSize: 15, color: T.text, margin: "0 0 16px", lineHeight: 1.5 }}>
                  This week: <strong>{tagged}</strong> task{tagged !== 1 ? "s" : ""} moved you toward your goals. <strong>{ut}</strong> {ut === 1 ? "was" : "were"} for everything else.
                </p>
                {goals.filter(g => gc[g.id]).map(g => (
                  <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: g.colour, flexShrink: 0 }} />
                    <p style={{ fontFamily: fontMeta, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{g.title}</p>
                    <p style={{ fontFamily: fontMeta, fontSize: 13, color: T.textSoft, margin: 0 }}>{gc[g.id]}</p>
                    {gm[g.id] > 0 && <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, margin: 0 }}>{gm[g.id]}m</p>}
                  </div>
                ))}
                {ut > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.untagged, flexShrink: 0 }} />
                    <p style={{ fontFamily: fontMeta, fontSize: 13, color: T.textSoft, margin: 0, flex: 1 }}>Other things</p>
                    <p style={{ fontFamily: fontMeta, fontSize: 13, color: T.textSoft, margin: 0 }}>{ut}</p>
                    {um > 0 && <p style={{ fontFamily: fontMeta, fontSize: 11, color: T.textMuted, margin: 0 }}>{um}m</p>}
                  </div>
                )}
              </div>
            );
          })()}

          <p style={labelStyle}>Non-negotiables this week</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {DAYS.map((d, i) => {
              const dayNn = ls("sb3-nn-" + weekDates[i]) || {};
              const completed = setup.categories.filter(c => dayNn[c]).length;
              const isToday = i === todayIdx;
              return (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ fontFamily: fontMeta, fontSize: 10, color: isToday ? T.accent : T.textMuted, margin: "0 0 6px", fontWeight: isToday ? 700 : 400 }}>{d}</p>
                  <div style={{
                    width: "100%", paddingBottom: "100%", borderRadius: 8, position: "relative",
                    background: completed === 0 ? T.border : completed === setup.categories.length ? T.accent : T.accentHover,
                    transition: "background 0.3s ease",
                  }}>
                    {completed > 0 && (
                      <p style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontMeta, fontSize: 11, color: completed === setup.categories.length ? "#fff" : T.accent, margin: 0 }}>{completed}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={labelStyle}>Weekly reflection</p>
          {[
            { key: "wentWell", prompt: "What went well this week?" },
            { key: "improve", prompt: "What could be better?" },
            { key: "goalCheck", prompt: "How did your goals feel this week?" },
          ].map(({ key, prompt }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: font, fontSize: 13, fontStyle: "italic", color: T.textSoft, margin: "0 0 6px" }}>{prompt}</p>
              <textarea value={reflection[key]} onChange={e => setReflection(p => ({ ...p, [key]: e.target.value }))} style={{ ...inputStyle, minHeight: 80, resize: "vertical", lineHeight: 1.5 }} placeholder="Take your time..." />
            </div>
          ))}
        </div>
      )}

      {planningTask && <PlanModal task={planningTask} onClose={() => setPlanningTask(null)} />}

      {/* ── NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, display: "flex", justifyContent: "space-around",
        padding: "10px 20px 22px", borderTop: "1px solid " + T.border, background: T.bg, zIndex: 50,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", textAlign: "center", padding: "4px 8px", position: "relative",
          }}>
            {tab === t.id && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.accent }} />}
            <div style={{ fontSize: 17, color: tab === t.id ? T.accent : T.textMuted, marginBottom: 2 }}>{t.icon}</div>
            <div style={{ fontFamily: fontMeta, fontSize: 10, color: tab === t.id ? T.accent : T.textMuted, letterSpacing: "0.02em" }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function SlowBurnOS() {
  const [setup, setSetup] = useState(() => ls("sb3-setup"));
  const [goals, setGoals] = useState(() => ls("sb3-goals") || []);

  const handleComplete = (s, g) => {
    lsSet("sb3-setup", s); lsSet("sb3-goals", g);
    lsSet("sb3-meta", { onboardingComplete: true, lastLogin: getTodayStr(), currentWeek: getWeekSunday(), visitCount: 1 });
    setSetup(s); setGoals(g);
  };

  const handleReset = () => {
    Object.keys(localStorage).filter(k => k.startsWith("sb3-")).forEach(k => localStorage.removeItem(k));
    setSetup(null); setGoals([]);
  };

  if (!setup) return <Onboarding onComplete={handleComplete} />;
  return <MainApp setup={setup} goals={goals} onReset={handleReset} />;
}
