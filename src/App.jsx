import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// SLOW BURN OS — V1 (Blue Palette, Full Features)
// ═══════════════════════════════════════════════════════════════

// Stable input — local state only, syncs to parent on blur
const StableInput = ({ initialValue, onCommit, placeholder, style, type }) => {
  const [val, setVal] = useState(initialValue || "");
  const ref = useRef(null);
  // Only update from parent if we're not focused
  useEffect(() => {
    if (document.activeElement !== ref.current) setVal(initialValue || "");
  }, [initialValue]);
  return <input
    ref={ref}
    type={type || "text"}
    value={val}
    placeholder={placeholder}
    style={style}
    onChange={e => setVal(e.target.value)}
    onBlur={() => onCommit(val)}
  />;
};

const StableTextarea = ({ initialValue, onCommit, placeholder, style }) => {
  const [val, setVal] = useState(initialValue || "");
  const ref = useRef(null);
  useEffect(() => {
    if (document.activeElement !== ref.current) setVal(initialValue || "");
  }, [initialValue]);
  return <textarea
    ref={ref}
    value={val}
    placeholder={placeholder}
    style={style}
    onChange={e => setVal(e.target.value)}
    onBlur={() => onCommit(val)}
  />;
};

// SVG mic icon (no emoji)
const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const startVoice = (onResult) => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Voice input is not supported in this browser. Try Chrome or Safari.');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const r = new SR();
  r.lang = 'en-US';
  r.interimResults = false;
  r.onresult = e => onResult(e.results[0][0].transcript);
  r.start();
};

const T = { bg: "#F0F4FA", card: "#FFFFFF", cardDone: "#E8F0F8", border: "#D0DAE8", borderDone: "#A8C4E0", accent: "#0F56CE", accentSoft: "rgba(15,86,206,0.08)", accentLight: "#D4E3F8", secondary: "#545F71", tertiary: "#6B5778", tertiarySoft: "rgba(107,87,120,0.08)", text: "#1A1C20", textSoft: "#44474E", textMuted: "#8E9099", untagged: "#B8BCC6", danger: "#BA1A1A", dangerSoft: "rgba(186,26,26,0.06)", surface: "#F8FAFD", surfaceDim: "#E4E7ED" };
const GOAL_COLORS = ["#0F56CE", "#6B5778", "#3A7D6E", "#8B6B3D", "#5A7A8A"];
const CATEGORIES = [
  { id: "body", label: "Body", icon: "⚡", defaultNN: "Morning movement" },
  { id: "mind", label: "Mind", icon: "◈", defaultNN: "Deep work block" },
  { id: "spirit", label: "Spirit", icon: "✦", defaultNN: "Morning stillness" },
  { id: "people", label: "People", icon: "◎", defaultNN: "Connect with someone I love" },
  { id: "growth", label: "Growth", icon: "↑", defaultNN: "Work on my craft" },
  { id: "rest", label: "Rest", icon: "◌", defaultNN: "Evening wind-down" },
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const f = "'Newsreader',Georgia,serif";
const fm = "'DM Sans',system-ui,sans-serif";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const ls = k => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const getWeekSunday = (d = new Date()) => { const dt = new Date(d); dt.setDate(dt.getDate() - dt.getDay()); dt.setHours(0, 0, 0, 0); return dt.toISOString().split("T")[0] };
const today = () => new Date().toISOString().split("T")[0];
const dayIdx = () => new Date().getDay();
const fmtDate = s => new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
const weekDates = sun => { const b = new Date(sun + "T12:00:00"); return DAYS.map((_, i) => { const d = new Date(b); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0] }) };
const countCheckIns = () => { let c = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("sb3-nn-")) { try { const v = JSON.parse(localStorage.getItem(k)); if (v && Object.values(v).some(x => x === true)) c++ } catch { } } } return c };
const daysAgo = d => { const ms = Date.now() - new Date(d + "T12:00:00").getTime(); return Math.floor(ms / 86400000) };
const expiryDate = (fromDate) => { const d = new Date(fromDate + "T12:00:00"); d.setDate(d.getDate() + 3); return d.toISOString().split("T")[0] };

// Styles
const btn = (primary, full, small) => ({ background: primary ? T.accent : "transparent", color: primary ? "#fff" : T.accent, border: primary ? "none" : "1px solid " + T.border, borderRadius: 10, padding: small ? "8px 16px" : "12px 24px", fontFamily: fm, fontSize: small ? 12 : 13, fontWeight: 500, cursor: "pointer", letterSpacing: "0.02em", transition: "all 0.2s ease", ...(full ? { width: "100%", boxSizing: "border-box" } : { display: "inline-block" }), textAlign: "center" });
const inp = { width: "100%", boxSizing: "border-box", background: T.card, border: "1px solid " + T.border, borderRadius: 10, padding: "12px 14px", fontFamily: f, fontSize: 15, color: T.text, outline: "none" };
const lbl = { fontFamily: fm, fontSize: 10, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" };
const crd = done => ({ background: done ? T.cardDone : T.card, border: "1px solid " + (done ? T.borderDone : T.border), borderRadius: 14, padding: "14px 16px", marginBottom: 8, transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", cursor: "pointer" });

const Check = ({ on, sz = 20 }) => <div style={{ width: sz, height: sz, borderRadius: 6, flexShrink: 0, border: "1.5px solid " + (on ? T.accent : T.border), background: on ? T.accentSoft : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s ease" }}>{on && <svg width={sz * .55} height={sz * .45} viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}</div>;

const Dot = ({ color, sz = 8 }) => <div style={{ width: sz, height: sz, borderRadius: "50%", background: color, flexShrink: 0 }} />;

const Nav = ({ active, onTab }) => {
  const tabs = [{ id: "today", icon: "◉", l: "Today" }, { id: "dump", icon: "✎", l: "Dump" }, { id: "release", icon: "↗", l: "Release" }, { id: "focus", icon: "◎", l: "Focus" }, { id: "mirror", icon: "↻", l: "Mirror" }];
  return <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, display: "flex", justifyContent: "space-around", padding: "8px 12px 24px", borderTop: "1px solid " + T.border, background: T.bg, zIndex: 50 }}>
    {tabs.map(t => <div key={t.id} onClick={() => onTab(t.id)} style={{ textAlign: "center", position: "relative", cursor: "pointer", padding: "4px 6px" }}>
      {active === t.id && <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.accent }} />}
      <div style={{ fontSize: 15, color: active === t.id ? T.accent : T.textMuted, marginBottom: 1 }}>{t.icon}</div>
      <div style={{ fontFamily: fm, fontSize: 9, color: active === t.id ? T.accent : T.textMuted, letterSpacing: "0.02em" }}>{t.l}</div>
    </div>)}
  </div>;
};

// ═══════════════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════════════
const Onboarding = ({ onComplete }) => {
  const [ph, setPh] = useState("splash");
  const [tourSlide, setTourSlide] = useState(0);
  const [cats, setCats] = useState([]);
  const [nnL, setNnL] = useState({});
  const [goals, setGoals] = useState([{ id: uid(), title: "", measure: "", targetDate: "" }]);
  const [fade, setFade] = useState(true);
  const go = n => { setFade(false); setTimeout(() => { setPh(n); setFade(true) }, 250) };
  const anim = { opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(10px)", transition: "all 0.25s ease" };
  const togCat = id => setCats(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const addG = () => { if (goals.length < 5) setGoals([...goals, { id: uid(), title: "", measure: "", targetDate: "" }]) };
  const updG = (i, k, v) => { const g = [...goals]; g[i] = { ...g[i], [k]: v }; setGoals(g) };
  const rmG = i => { if (goals.length > 1) setGoals(goals.filter((_, j) => j !== i)) };
  const finish = () => {
    const vg = goals.filter(g => g.title.trim()).map((g, i) => ({ ...g, title: g.title.trim(), measure: g.measure.trim(), colour: GOAL_COLORS[i % GOAL_COLORS.length], createdAt: today(), status: "active" }));
    const setup = { categories: cats, nnLabels: { ...Object.fromEntries(CATEGORIES.map(c => [c.id, c.defaultNN])), ...nnL }, nnCount: cats.length, weekStart: "sunday", createdAt: today() };
    onComplete(setup, vg);
  };

  const tourData = [
    { tab: "Today", color: T.accent, copy: "Your day starts here. Check off your non-negotiables and see what's planned." },
    { tab: "Dump", color: "#545F71", copy: "Brain full? Dump it here. No structure needed — just get it out." },
    { tab: "Release", color: "#6B5778", copy: "Flick away what isn't yours. Hold what is." },
    { tab: "Mirror", color: "#3A7D6E", copy: "See where your time actually went. Not as judgement — as clarity." },
  ];

  const W = ({ children }) => <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}><div style={{ width: "100%", maxWidth: 400, ...anim }}>{children}</div></div>;

  if (ph === "splash") return <W>
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <p style={{ fontFamily: fm, fontSize: 11, color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 40 }}>Slow Burn OS</p>
      <div style={{ width: 100, height: 100, borderRadius: "50%", margin: "0 auto 40px", background: "radial-gradient(circle,rgba(15,86,206,0.15) 0%,rgba(15,86,206,0.03) 70%,transparent 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 50, height: 50, borderRadius: "50%", background: "radial-gradient(circle,rgba(15,86,206,0.25) 0%,rgba(15,86,206,0.05) 100%)" }} />
      </div>
      <h1 style={{ fontFamily: f, fontSize: 34, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 10px", letterSpacing: "-0.02em" }}>Count what counts.</h1>
      <p style={{ fontFamily: fm, fontSize: 14, color: T.textSoft, margin: "0 0 48px" }}>Your life. Your metrics.</p>
      <button onClick={() => go("tour")} style={btn(true)}>Begin</button>
    </div>
  </W>;

  if (ph === "tour") {
    const s = tourData[tourSlide];
    return <W>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        {tourData.map((_, i) => <div key={i} style={{ width: i === tourSlide ? 20 : 5, height: 5, borderRadius: 3, background: i === tourSlide ? s.color : T.border, transition: "all 0.3s" }} />)}
      </div>
      <p style={{ fontFamily: fm, fontSize: 11, color: s.color, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", fontWeight: 600, marginBottom: 16 }}>{s.tab}</p>
      <div style={{ background: T.surface, borderRadius: 16, border: "1px solid " + T.border, padding: 20, marginBottom: 24, minHeight: 200, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
        <p style={{ fontFamily: fm, fontSize: 13, color: T.textMuted, textAlign: "center", fontStyle: "italic" }}>[ {s.tab} view mockup ]</p>
      </div>
      <p style={{ fontFamily: f, fontSize: 16, fontStyle: "italic", color: T.text, textAlign: "center", lineHeight: 1.6, margin: "0 0 32px", padding: "0 8px" }}>{s.copy}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {tourSlide < tourData.length - 1 ? <>
          <button onClick={() => go("distinction")} style={btn(false)}>Skip</button>
          <button onClick={() => setTourSlide(tourSlide + 1)} style={btn(true)}>Next</button>
        </> : <button onClick={() => go("distinction")} style={btn(true)}>Let's set up</button>}
      </div>
    </W>;
  }

  if (ph === "distinction") return <W>
    <h2 style={{ fontFamily: f, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 4px" }}>Two things to set up.</h2>
    <p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: "0 0 20px" }}>They work together, but they're different.</p>
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      <div style={{ flex: 1, padding: 14, background: T.card, borderRadius: 14, border: "1px solid " + T.border }}>
        <Dot color={T.accent} /><p style={{ fontFamily: fm, fontSize: 9, color: T.accent, letterSpacing: "0.08em", textTransform: "uppercase", margin: "8px 0 6px", fontWeight: 600 }}>Non-negotiable</p>
        <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.text, margin: "0 0 6px" }}>Your daily floor</p>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, margin: "0 0 12px", lineHeight: 1.4 }}>If you do nothing else today but this, it's still a win.</p>
        <div style={{ padding: "8px 10px", background: T.accentSoft, borderRadius: 8 }}><p style={{ fontFamily: f, fontSize: 12, color: T.text, margin: 0 }}>"Text one person I care about"</p></div>
        <p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, fontStyle: "italic", margin: "10px 0 0" }}>Measured daily</p>
      </div>
      <div style={{ flex: 1, padding: 14, background: T.card, borderRadius: 14, border: "1px solid " + T.border }}>
        <Dot color={T.tertiary} /><p style={{ fontFamily: fm, fontSize: 9, color: T.tertiary, letterSpacing: "0.08em", textTransform: "uppercase", margin: "8px 0 6px", fontWeight: 600 }}>Goal</p>
        <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.text, margin: "0 0 6px" }}>Your direction</p>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, margin: "0 0 12px", lineHeight: 1.4 }}>Something you're building toward over weeks or months.</p>
        <div style={{ padding: "8px 10px", background: T.tertiarySoft, borderRadius: 8 }}><p style={{ fontFamily: f, fontSize: 12, color: T.text, margin: 0 }}>"Rebuild my social life"</p></div>
        <p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, fontStyle: "italic", margin: "10px 0 0" }}>Measured over time</p>
      </div>
    </div>
    <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textSoft, textAlign: "center", lineHeight: 1.5, margin: "0 0 20px" }}>Your non-negotiable can be small. That's the point.<br />Your goal can be ambitious. That's also the point.</p>
    <button onClick={() => go("categories")} style={btn(true, true)}>Got it</button>
  </W>;

  if (ph === "categories") return <W>
    <div style={{ height: 3, background: T.border, borderRadius: 2, marginBottom: 20 }}><div style={{ width: "50%", height: "100%", background: T.accent, borderRadius: 2 }} /></div>
    <h2 style={{ fontFamily: f, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 4px" }}>Where do you want to show up?</h2>
    <p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: "0 0 20px", lineHeight: 1.5 }}>These are your daily anchors. Start with 2 or 3.</p>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
      {CATEGORIES.map(c => {
        const s = cats.includes(c.id); return <div key={c.id} onClick={() => togCat(c.id)} style={{ padding: "14px 8px", borderRadius: 12, textAlign: "center", cursor: "pointer", background: s ? T.accentSoft : T.card, border: "1.5px solid " + (s ? T.accent : T.border), transition: "all 0.2s" }}>
          <div style={{ fontSize: 18, marginBottom: 4, color: s ? T.accent : T.textMuted }}>{c.icon}</div>
          <p style={{ fontFamily: fm, fontSize: 11, color: s ? T.accent : T.textSoft, margin: 0, fontWeight: s ? 600 : 400 }}>{c.label}</p>
        </div>
      })}
    </div>
    {cats.length > 0 && <div style={{ marginBottom: 20 }}>
      <p style={lbl}>Your non-negotiables</p>
      {cats.map(cid => {
        const c = CATEGORIES.find(x => x.id === cid); return <div key={cid} style={{ marginBottom: 8 }}>
          <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, margin: "0 0 4px" }}>{c.icon} {c.label} — what's one thing that's just for you?</p>
          <StableInput placeholder={c.defaultNN} initialValue={nnL[cid] || ""} onCommit={v => setNnL(prev => ({ ...prev, [cid]: v }))} style={inp} />
        </div>
      })}
    </div>}
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => go("distinction")} style={btn(false, false)}>Back</button>
      <button onClick={() => go("goals")} disabled={!cats.length} style={{ ...btn(true, true), opacity: cats.length ? 1 : 0.4 }}>Continue</button>
    </div>
  </W>;

  if (ph === "goals") return <W>
    <div style={{ height: 3, background: T.border, borderRadius: 2, marginBottom: 20 }}><div style={{ width: "80%", height: "100%", background: T.accent, borderRadius: 2 }} /></div>
    <h2 style={{ fontFamily: f, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 4px" }}>Now, where do you want to go?</h2>
    <p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: "0 0 20px", lineHeight: 1.5 }}>Set 2 or 3 goals. These are your direction.</p>
    {goals.map((g, i) => <div key={g.id} style={{ marginBottom: 12, padding: 14, background: T.card, borderRadius: 14, border: "1px solid " + T.border }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Dot color={GOAL_COLORS[i % GOAL_COLORS.length]} sz={10} />
        <span style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>Goal {i + 1}</span>
        {goals.length > 1 && <span onClick={() => rmG(i)} style={{ marginLeft: "auto", color: T.textMuted, cursor: "pointer", fontSize: 14 }}>×</span>}
      </div>
      <StableInput placeholder="What's the goal?" initialValue={g.title} onCommit={v => updG(i, "title", v)} style={{ ...inp, marginBottom: 6 }} />
      <StableInput placeholder="How will you know you've done it?" initialValue={g.measure} onCommit={v => updG(i, "measure", v)} style={{ ...inp, marginBottom: 6, fontSize: 13 }} />
      <StableInput type="date" initialValue={g.targetDate} onCommit={v => updG(i, "targetDate", v)} style={{ ...inp, fontSize: 13, color: g.targetDate ? T.text : T.textMuted }} />
    </div>)}
    {goals.length < 5 && <button onClick={addG} style={{ ...btn(false, true), marginBottom: 12 }}>+ Add another goal</button>}
    <p style={{ fontFamily: fm, fontSize: 11, color: T.textMuted, textAlign: "center", fontStyle: "italic", margin: "0 0 16px" }}>Most people start with 2 or 3.</p>
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={() => go("categories")} style={btn(false)}>Back</button>
      <button onClick={finish} disabled={!goals.some(g => g.title.trim())} style={{ ...btn(true, true), opacity: goals.some(g => g.title.trim()) ? 1 : 0.4 }}>Let's go</button>
    </div>
  </W>;
  return null;
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
const App = ({ setup, goals: initG, onReset }) => {
  const [tab, setTab] = useState("today");
  const [tasks, setTasks] = useState(() => ls("sb3-tasks") || []);
  const [goals] = useState(initG);
  const [nnDone, setNnDone] = useState(() => ls("sb3-nn-" + today()) || {});
  const [dumpInput, setDumpInput] = useState("");
  const [dumpTab, setDumpTab] = useState("tasks");
  const [thoughtInput, setThoughtInput] = useState("");
  const [thoughts, setThoughts] = useState(() => ls("sb3-thoughts") || []);
  const [blockerInput, setBlockerInput] = useState("");
  const [blockers, setBlockers] = useState(() => ls("sb3-blockers") || []);
  const [releaseIdx, setReleaseIdx] = useState(0);
  const [held, setHeld] = useState(() => ls("sb3-held") || []);
  const [shelf, setShelf] = useState(() => ls("sb3-shelf") || []);
  const [focusItems, setFocusItems] = useState(() => ls("sb3-focus") || []);
  const [todayPicks, setTodayPicks] = useState(() => ls("sb3-todaypicks-" + today()) || []);
  const [reflection, setReflection] = useState(() => ls("sb3-reflection-" + getWeekSunday()) || { wentWell: "", improve: "", goalCheck: "" });
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [checkIns, setCheckIns] = useState(countCheckIns);
  const [goalTag, setGoalTag] = useState("");
  const [deadline, setDeadline] = useState("");
  const [releasedCount, setReleasedCount] = useState(0);
  const [convertingHeld, setConvertingHeld] = useState(null);
  const [convertText, setConvertText] = useState("");
  const [convertGoal, setConvertGoal] = useState("");

  const ws = getWeekSunday(), wd = weekDates(ws), ti = dayIdx(), ts = today();
  const nnCount = setup.categories.filter(c => nnDone[c]).length, nnTotal = setup.categories.length;

  // Persist
  useEffect(() => { lsSet("sb3-tasks", tasks) }, [tasks]);
  useEffect(() => { lsSet("sb3-nn-" + ts, nnDone); setCheckIns(countCheckIns()) }, [nnDone]);
  useEffect(() => { lsSet("sb3-thoughts", thoughts) }, [thoughts]);
  useEffect(() => { lsSet("sb3-blockers", blockers) }, [blockers]);
  useEffect(() => { lsSet("sb3-held", held) }, [held]);
  useEffect(() => { lsSet("sb3-shelf", shelf) }, [shelf]);
  useEffect(() => { lsSet("sb3-focus", focusItems) }, [focusItems]);
  useEffect(() => { lsSet("sb3-todaypicks-" + ts, todayPicks) }, [todayPicks]);
  useEffect(() => { lsSet("sb3-reflection-" + ws, reflection) }, [reflection]);

  // Auto-expire shelf items older than 3 days
  useEffect(() => { setShelf(prev => prev.filter(s => s.expiresAt >= ts)) }, [ts]);

  const addTask = () => { if (!dumpInput.trim()) return; setTasks(p => [{ id: uid(), text: dumpInput.trim(), goalIds: goalTag ? [goalTag] : [], status: "dump", deadline: deadline || null, createdAt: ts, completedAt: null }, ...p]); setDumpInput(""); setGoalTag(""); setDeadline("") };
  const addThought = () => { if (!thoughtInput.trim()) return; setThoughts(p => [{ id: uid(), text: thoughtInput.trim(), createdAt: ts }, ...p]); setThoughtInput("") };
  const addBlocker = () => { if (!blockerInput.trim()) return; setBlockers(p => [{ id: uid(), text: blockerInput.trim(), weekOf: ws }, ...p]); setBlockerInput("") };
  const toggleNN = c => setNnDone(p => ({ ...p, [c]: !p[c] }));
  const toggleFocus = id => setFocusItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleTodayPick = id => setTodayPicks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const completeTask = id => setTasks(p => p.map(t => t.id === id ? { ...t, status: t.status === "done" ? "dump" : "done", completedAt: t.status === "done" ? null : ts } : t));

  // Release actions
  const handleRelease = () => { if (!unsortedThoughts.length) return; setReleasedCount(c => c + 1); setThoughts(p => p.filter(x => x.id !== unsortedThoughts[0].id)) };
  const handleHold = () => { if (!unsortedThoughts.length) return; const t = unsortedThoughts[0]; setHeld(p => [...p, { id: t.id, text: t.text, heldAt: ts }]); setThoughts(p => p.filter(x => x.id !== t.id)) };
  const handleSkip = () => { if (!unsortedThoughts.length) return; setThoughts(p => p.filter(x => x.id !== unsortedThoughts[0].id)) };
  const shelfHeld = h => { setShelf(p => [...p, { ...h, shelvedAt: ts, expiresAt: expiryDate(ts) }]); setHeld(p => p.filter(x => x.id !== h.id)) };
  const convertHeldToTask = () => { if (!convertText.trim() || !convertingHeld) return; setTasks(p => [{ id: uid(), text: convertText.trim(), goalIds: convertGoal ? [convertGoal] : [], status: "dump", deadline: null, createdAt: ts, completedAt: null }, ...p]); setHeld(p => p.filter(x => x.id !== convertingHeld.id)); setConvertingHeld(null); setConvertText(""); setConvertGoal("") };

  const unsortedThoughts = thoughts.filter(t => !held.some(h => h.id === t.id));
  const statusText = nnCount === 0 ? "These are yours. Not anyone else's." : nnCount === nnTotal ? "You showed up for yourself today." : nnCount + " of " + nnTotal + ". Your pace, your terms.";
  const focusTasks = tasks.filter(t => focusItems.includes(t.id));
  const todayTasksList = focusTasks.filter(t => todayPicks.includes(t.id));
  const goalAligned = todayTasksList.filter(t => t.goalIds.length > 0).length;

  // ── Settings ──
  if (showSettings) return <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", padding: "20px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontFamily: f, fontSize: 20, fontWeight: 400, fontStyle: "italic", color: T.text, margin: 0 }}>Settings</h2>
      <span onClick={() => setShowSettings(false)} style={{ fontSize: 20, color: T.textSoft, cursor: "pointer" }}>×</span>
    </div>
    <p style={lbl}>Your goals</p>
    {goals.map(g => <div key={g.id} style={{ ...crd(false), display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
      <Dot color={g.colour} sz={10} /><div style={{ flex: 1 }}><p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0 }}>{g.title}</p>{g.measure && <p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, margin: "2px 0 0" }}>{g.measure}</p>}</div>
    </div>)}
    <div style={{ marginTop: 32, padding: 16, background: T.dangerSoft, borderRadius: 14, border: "1px solid rgba(186,26,26,0.1)" }}>
      <p style={{ fontFamily: f, fontSize: 13, color: T.danger, margin: "0 0 4px", fontWeight: 500 }}>Delete everything</p>
      <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, margin: "0 0 12px", lineHeight: 1.5 }}>Tasks, goals, reflections, check-ins ({checkIns} days), all settings. This cannot be undone.</p>
      {!confirmDel ? <button onClick={() => setConfirmDel(true)} style={{ ...btn(false), borderColor: T.danger, color: T.danger }}>Erase everything</button>
        : <div style={{ display: "flex", gap: 8 }}><button onClick={() => setConfirmDel(false)} style={btn(false)}>Cancel</button><button onClick={onReset} style={{ ...btn(true), background: T.danger }}>Yes, erase it all</button></div>}
    </div>
  </div>;

  return <div style={{ minHeight: "100vh", background: T.bg, maxWidth: 430, margin: "0 auto", paddingBottom: 76 }}>
    {/* Header */}
    <div style={{ padding: "12px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ fontFamily: fm, fontSize: 9, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Slow Burn OS</p>
      <span onClick={() => setShowSettings(true)} style={{ fontSize: 14, color: T.textMuted, cursor: "pointer" }}>⚙</span>
    </div>

    {/* ══ TODAY ══ */}
    {tab === "today" && <div style={{ padding: "4px 20px 20px" }}>
      {checkIns > 0 && <div style={{ padding: "8px 14px", background: T.accentSoft, borderRadius: 8, marginBottom: 10, marginTop: 8 }}>
        <p style={{ fontFamily: fm, fontSize: 12, color: T.accent, margin: 0 }}><strong>{checkIns}</strong> day{checkIns !== 1 ? "s" : ""}. You keep choosing yourself.</p>
      </div>}
      <p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", margin: "12px 0 4px" }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
      <h1 style={{ fontFamily: f, fontSize: 26, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "0 0 4px" }}>Your day</h1>
      <p style={{ fontFamily: f, fontSize: 13, color: T.textSoft, margin: "0 0 20px" }}>{statusText}</p>

      <p style={lbl}>Non-negotiables</p>
      {setup.categories.map(cid => {
        const c = CATEGORIES.find(x => x.id === cid), done = nnDone[cid], label = setup.nnLabels[cid] || c.defaultNN;
        return <div key={cid} onClick={() => toggleNN(cid)} style={{ ...crd(done), display: "flex", alignItems: "center", gap: 12 }}>
          <Check on={done} /><span style={{ fontSize: 16, color: done ? T.accent : T.textMuted, flexShrink: 0 }}>{c.icon}</span>
          <div><p style={{ fontFamily: f, fontSize: 14, color: T.text, margin: "0 0 1px", opacity: done ? 0.5 : 1 }}>{label}</p><p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.label}</p></div>
        </div>
      })}

      {nnCount === nnTotal && nnTotal > 0 && <div style={{ padding: 14, borderRadius: 12, background: T.accentSoft, border: "1px solid " + T.borderDone, textAlign: "center", marginTop: 4, marginBottom: 8 }}>
        <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.accent, margin: 0 }}>Small steps still move you forward.</p>
      </div>}

      {/* Daily pick */}
      {focusItems.length > 0 && <>
        {todayTasksList.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 10px", padding: "8px 12px", background: T.card, borderRadius: 8, border: "1px solid " + T.border }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: T.border, overflow: "hidden" }}><div style={{ width: todayTasksList.length > 0 ? (goalAligned / todayTasksList.length * 100) + "%" : "0%", height: "100%", background: T.accent, borderRadius: 2, transition: "width 0.4s" }} /></div>
          <p style={{ fontFamily: fm, fontSize: 10, color: T.textSoft, margin: 0, whiteSpace: "nowrap" }}>{goalAligned} of {todayTasksList.length} for your goals</p>
        </div>}

        <p style={{ ...lbl, marginTop: 16 }}>Today's tasks</p>
        {focusTasks.filter(t => t.status !== "done").map(t => {
          const picked = todayPicks.includes(t.id);
          return <div key={t.id} style={{ ...crd(false), display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => picked ? completeTask(t.id) : toggleTodayPick(t.id)}>
            {picked ? <Check on={false} /> : <div style={{ width: 20, height: 20, borderRadius: 6, border: "1px dashed " + T.border, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, color: T.textMuted }}>+</span></div>}
            <div style={{ flex: 1 }}><p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: "0 0 2px" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {t.goalIds.map(gid => { const g = goals.find(x => x.id === gid); return g ? <Dot key={gid} color={g.colour} /> : null })}
                {t.goalIds.length === 0 && <><Dot color={T.untagged} /><span style={{ fontFamily: fm, fontSize: 9, color: T.textMuted }}>other</span></>}
              </div>
            </div>
            {!picked && <span style={{ fontFamily: fm, fontSize: 10, color: T.accent }}>pick</span>}
          </div>
        })}

        {/* Done tasks */}
        {todayTasksList.filter(t => tasks.find(x => x.id === t.id)?.status === "done").length > 0 && <>
          {tasks.filter(t => todayPicks.includes(t.id) && t.status === "done").map(t =>
            <div key={t.id} style={{ ...crd(true), display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
              <Check on={true} /><p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0, opacity: 0.5 }}>{t.text}</p>
            </div>
          )}
        </>}
      </>}

      {focusItems.length === 0 && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 20 }}>Nothing in focus yet. Dump some tasks, then head to Focus.</p>}
    </div>}

    {/* ══ DUMP ══ */}
    {tab === "dump" && <div style={{ padding: "4px 20px 20px" }}>
      <h1 style={{ fontFamily: f, fontSize: 26, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "12px 0 4px" }}>Dump</h1>
      <p style={{ fontFamily: f, fontSize: 13, color: T.textSoft, margin: "0 0 16px" }}>Get it out of your head.</p>
      <div style={{ display: "flex", gap: 0, marginBottom: 16, background: T.surface, borderRadius: 10, padding: 3, border: "1px solid " + T.border }}>
        {["tasks", "thoughts", "blockers"].map(t => <div key={t} onClick={() => setDumpTab(t)} style={{ flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 8, background: dumpTab === t ? T.accent : "transparent", color: dumpTab === t ? "#fff" : T.textMuted, fontFamily: fm, fontSize: 11, fontWeight: dumpTab === t ? 600 : 400, cursor: "pointer", textTransform: "capitalize" }}>{t}</div>)}
      </div>

      {dumpTab === "tasks" && <>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <input value={dumpInput} onChange={e => setDumpInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="What needs doing?" style={{ ...inp, flex: 1 }} />
          <button onClick={() => startVoice(t => setDumpInput(t))} style={{ ...btn(false), padding: "10px 12px", display: "flex", alignItems: "center" }} title="Voice input"><MicIcon /></button>
          <button onClick={addTask} style={{ ...btn(true), padding: "12px 16px", fontSize: 18, lineHeight: 1 }}>+</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <select value={goalTag} onChange={e => setGoalTag(e.target.value)} style={{ ...inp, flex: 1, fontSize: 12, padding: "8px 10px", fontFamily: fm }}>
            <option value="">Tag to goal</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
            <option value="">Other</option>
          </select>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={{ ...inp, width: 130, fontSize: 12, padding: "8px 10px" }} />
        </div>
        {tasks.filter(t => t.status === "dump").length === 0 && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 16 }}>Your mind is clear. For now.</p>}
        {tasks.filter(t => t.status === "dump").map(t => <div key={t.id} style={{ ...crd(false), display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
          <Dot color={t.goalIds.length > 0 ? (goals.find(g => g.id === t.goalIds[0])?.colour || T.untagged) : T.untagged} />
          <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
          {t.deadline && <span style={{ fontFamily: fm, fontSize: 10, color: T.textMuted }}>{fmtDate(t.deadline)}</span>}
          <span onClick={() => setTasks(p => p.filter(x => x.id !== t.id))} style={{ color: T.textMuted, cursor: "pointer", fontSize: 12 }}>×</span>
        </div>)}
      </>}

      {dumpTab === "thoughts" && <>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={thoughtInput} onChange={e => setThoughtInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addThought()} placeholder="What's on your mind?" style={{ ...inp, flex: 1 }} />
          <button onClick={() => startVoice(t => setThoughtInput(t))} style={{ ...btn(false), padding: "10px 12px", display: "flex", alignItems: "center" }} title="Voice input"><MicIcon /></button>
          <button onClick={addThought} style={{ ...btn(true), padding: "12px 16px", fontSize: 18, lineHeight: 1 }}>+</button>
        </div>
        {thoughts.length === 0 && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 16 }}>Nothing weighing on you? Good.</p>}
        {thoughts.map(t => <div key={t.id} style={{ ...crd(false), cursor: "default" }}>
          <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0 }}>{t.text}</p>
        </div>)}
        {unsortedThoughts.length > 0 && <p style={{ fontFamily: fm, fontSize: 11, color: T.accent, textAlign: "center", marginTop: 12, cursor: "pointer" }} onClick={() => setTab("release")}>{unsortedThoughts.length} thought{unsortedThoughts.length !== 1 ? "s" : ""} to sort →</p>}
      </>}

      {dumpTab === "blockers" && <>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, margin: "0 0 12px", fontStyle: "italic" }}>Things affecting your week — not tasks, just context.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={blockerInput} onChange={e => setBlockerInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addBlocker()} placeholder="What's going on?" style={{ ...inp, flex: 1 }} />
          <button onClick={() => startVoice(t => setBlockerInput(t))} style={{ ...btn(false), padding: "10px 12px", display: "flex", alignItems: "center" }} title="Voice input"><MicIcon /></button>
          <button onClick={addBlocker} style={{ ...btn(true), padding: "12px 16px", fontSize: 18, lineHeight: 1 }}>+</button>
        </div>
        {blockers.filter(b => b.weekOf === ws).map(b => <div key={b.id} style={{ ...crd(false), cursor: "default" }}>
          <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0 }}>{b.text}</p>
        </div>)}
      </>}
    </div>}

    {/* ══ RELEASE ══ */}
    {tab === "release" && <div style={{ padding: "4px 20px", height: "calc(100vh - 76px)", display: "flex", flexDirection: "column" }}>
      <h1 style={{ fontFamily: f, fontSize: 26, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "12px 0 4px" }}>Release</h1>
      <p style={{ fontFamily: f, fontSize: 13, color: T.textSoft, margin: "0 0 4px" }}>Not all thoughts need a room.</p>
      <p style={{ fontFamily: fm, fontSize: 12, color: T.textMuted, margin: "0 0 8px" }}>{unsortedThoughts.length} thought{unsortedThoughts.length !== 1 ? "s" : ""} to sort</p>

      {unsortedThoughts.length > 0 ? <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,rgba(15,86,206,0.06) 0%,transparent 70%)" }} />
        <div style={{ width: 300, padding: "32px 24px 20px", background: T.card, borderRadius: 18, border: "1px solid " + T.border, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.05)", position: "relative", zIndex: 2 }}>
          <p style={{ fontFamily: f, fontSize: 17, color: T.text, margin: "0 0 28px", lineHeight: 1.5 }}>{unsortedThoughts[0]?.text}</p>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 8px" }}>
            <div onClick={handleHold} style={{ cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontFamily: fm, fontSize: 16, color: T.accent }}>←</span>
              <p style={{ fontFamily: fm, fontSize: 10, color: T.accent, margin: "2px 0 0" }}>Hold</p>
            </div>
            <div onClick={handleSkip} style={{ cursor: "pointer", textAlign: "center" }}>
              <span style={{ fontFamily: fm, fontSize: 16, color: T.textMuted }}>↑</span>
              <p style={{ fontFamily: fm, fontSize: 10, color: T.textMuted, margin: "2px 0 0" }}>Skip</p>
            </div>
            <div onClick={handleRelease} style={{ cursor: "pointer", textAlign: "right" }}>
              <span style={{ fontFamily: fm, fontSize: 16, color: T.tertiary }}>→</span>
              <p style={{ fontFamily: fm, fontSize: 10, color: T.tertiary, margin: "2px 0 0" }}>Release</p>
            </div>
          </div>
        </div>
      </div>
        : <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 20px" }}>
          {releasedCount > 0 ? <p style={{ fontFamily: f, fontSize: 15, fontStyle: "italic", color: T.accent, lineHeight: 1.6, margin: 0 }}>
            You let go of {releasedCount} thing{releasedCount !== 1 ? "s" : ""}. That's not avoidance. That's choosing where your energy goes.
          </p>
            : <p style={{ fontFamily: f, fontSize: 14, fontStyle: "italic", color: T.textMuted }}>Nothing to sort. Your mind is clear.</p>}
        </div>}
    </div>}

    {/* ══ FOCUS ══ */}
    {tab === "focus" && <div style={{ padding: "4px 20px 20px" }}>
      <h1 style={{ fontFamily: f, fontSize: 26, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "12px 0 4px" }}>Focus</h1>
      <p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: "0 0 20px" }}>{fmtDate(wd[0])} — {fmtDate(wd[6])}</p>

      {/* ── Last week's reflection ── */}
      {(() => {
        const lastSun = new Date(ws + "T12:00:00"); lastSun.setDate(lastSun.getDate() - 7); const lastWs = lastSun.toISOString().split("T")[0]; const lr = ls("sb3-reflection-" + lastWs);
        if (!lr || (!lr.wentWell && !lr.improve && !lr.goalCheck)) return null;
        return <div style={{ padding: 14, background: T.tertiarySoft, borderRadius: 14, border: "1px solid rgba(107,87,120,0.12)", marginBottom: 16 }}>
          <p style={{ fontFamily: fm, fontSize: 10, color: T.tertiary, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Last week you reflected</p>
          {lr.improve && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.text, margin: "0 0 6px", lineHeight: 1.5 }}>Could be better: <em>"{lr.improve}"</em></p>}
          {lr.goalCheck && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.text, margin: "0 0 6px", lineHeight: 1.5 }}>Goals felt: <em>"{lr.goalCheck}"</em></p>}
          {lr.wentWell && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.text, margin: 0, lineHeight: 1.5 }}>Went well: <em>"{lr.wentWell}"</em></p>}
          <p style={{ fontFamily: fm, fontSize: 11, color: T.tertiary, margin: "10px 0 0" }}>Let this shape your focus for the week.</p>
        </div>
      })()}

      {/* ── Held thoughts ── */}
      {held.length > 0 && <>
        <p style={lbl}>Held thoughts</p>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, fontStyle: "italic", margin: "-4px 0 10px" }}>These are in your control. Turn them into a task, or shelf them for later.</p>
        {held.map(h => <div key={h.id} style={{ ...crd(false), cursor: "default" }}>
          <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: "0 0 8px" }}>{h.text}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={() => { setConvertingHeld(h); setConvertText(h.text) }} style={{ ...btn(true, false, true), padding: "5px 12px", fontSize: 10 }}>Add a task</button>
            <button onClick={() => shelfHeld(h)} style={{ ...btn(false, false, true), padding: "5px 12px", fontSize: 10 }}>Shelf it</button>
          </div>
        </div>)}
        {/* Convert inline form */}
        {convertingHeld && <div style={{ padding: 14, background: T.card, borderRadius: 14, border: "1.5px solid " + T.accent, marginBottom: 12 }}>
          <p style={{ fontFamily: fm, fontSize: 10, color: T.accent, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Convert to task</p>
          <input value={convertText} onChange={e => setConvertText(e.target.value)} style={{ ...inp, marginBottom: 6 }} />
          <select value={convertGoal} onChange={e => setConvertGoal(e.target.value)} style={{ ...inp, fontSize: 12, padding: "8px 10px", fontFamily: fm, marginBottom: 8 }}>
            <option value="">Tag to goal</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setConvertingHeld(null); setConvertText("") }} style={btn(false, false, true)}>Cancel</button>
            <button onClick={convertHeldToTask} style={btn(true, false, true)}>Add</button>
          </div>
        </div>}
      </>}

      {/* ── The Shelf ── */}
      {shelf.length > 0 && <>
        <p style={{ ...lbl, marginTop: held.length > 0 ? 16 : 0 }}>The Shelf</p>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.textSoft, fontStyle: "italic", margin: "-4px 0 10px" }}>Parked for 3 days. No pressure. Then they disappear.</p>
        {shelf.map(s => {
          const remaining = 3 - daysAgo(s.shelvedAt); return <div key={s.id} style={{ ...crd(false), cursor: "default", opacity: remaining <= 1 ? 0.6 : 1 }}>
            <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: "0 0 4px" }}>{s.text}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: fm, fontSize: 10, color: T.textMuted }}>Shelved {daysAgo(s.shelvedAt)} day{daysAgo(s.shelvedAt) !== 1 ? "s" : ""} ago</span>
              <span style={{ fontFamily: fm, fontSize: 10, color: remaining <= 1 ? T.danger : T.tertiary }}>{remaining <= 0 ? "expires today" : remaining + "d left"}</span>
            </div>
          </div>
        })}
      </>}

      {/* ── Blockers ── */}
      {blockers.filter(b => b.weekOf === ws).length > 0 && <div style={{ padding: 12, background: T.accentSoft, borderRadius: 10, marginBottom: 16, marginTop: (held.length > 0 || shelf.length > 0) ? 16 : 0 }}>
        <p style={{ fontFamily: fm, fontSize: 11, color: T.accent, margin: 0 }}>You noted {blockers.filter(b => b.weekOf === ws).length} blocker{blockers.filter(b => b.weekOf === ws).length !== 1 ? "s" : ""}. Give yourself room this week.</p>
      </div>}

      {/* ── Pick focus tasks ── */}
      <p style={{ ...lbl, marginTop: (held.length > 0 || shelf.length > 0) ? 16 : 0 }}>Pick your focus from your tasks</p>
      <p style={{ fontFamily: fm, fontSize: 11, color: T.textMuted, fontStyle: "italic", margin: "-4px 0 12px" }}>Research shows 3–5 leads to the best follow-through.</p>

      {tasks.filter(t => t.status === "dump").length === 0 && held.length === 0 && shelf.length === 0 && <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginTop: 16 }}>No tasks in your dump yet. Head to Dump first.</p>}

      {/* Goal-aligned first */}
      {goals.map(g => {
        const gTasks = tasks.filter(t => t.status === "dump" && t.goalIds.includes(g.id)); if (!gTasks.length) return null;
        return <div key={g.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Dot color={g.colour} sz={8} /><span style={{ fontFamily: fm, fontSize: 10, color: T.textSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>{g.title}</span></div>
          {gTasks.map(t => {
            const sel = focusItems.includes(t.id); return <div key={t.id} onClick={() => toggleFocus(t.id)} style={{ ...crd(false), display: "flex", alignItems: "center", gap: 10, background: sel ? T.accentSoft : T.card, border: "1px solid " + (sel ? T.accent : T.border) }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, border: "1.5px solid " + (sel ? T.accent : T.border), background: sel ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {sel && <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>}
              </div>
              <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
              {t.deadline && <span style={{ fontFamily: fm, fontSize: 10, color: T.textMuted }}>{fmtDate(t.deadline)}</span>}
            </div>
          })}
        </div>
      })}

      {/* Other tasks */}
      {(() => {
        const other = tasks.filter(t => t.status === "dump" && t.goalIds.length === 0); if (!other.length) return null;
        return <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}><Dot color={T.untagged} sz={8} /><span style={{ fontFamily: fm, fontSize: 10, color: T.textSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>Other</span></div>
          {other.map(t => {
            const sel = focusItems.includes(t.id); return <div key={t.id} onClick={() => toggleFocus(t.id)} style={{ ...crd(false), display: "flex", alignItems: "center", gap: 10, background: sel ? T.accentSoft : T.card, border: "1px solid " + (sel ? T.accent : T.border) }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, border: "1.5px solid " + (sel ? T.accent : T.border), background: sel ? T.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {sel && <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /></svg>}
              </div>
              <p style={{ fontFamily: f, fontSize: 13, color: T.text, margin: 0, flex: 1 }}>{t.text}</p>
            </div>
          })}
        </div>
      })()}

      {focusItems.length > 0 && <p style={{ fontFamily: fm, fontSize: 12, color: T.accent, textAlign: "center", margin: "12px 0" }}>{focusItems.length} selected</p>}
    </div>}

    {/* ══ MIRROR ══ */}
    {tab === "mirror" && <div style={{ padding: "4px 20px 20px" }}>
      <h1 style={{ fontFamily: f, fontSize: 26, fontWeight: 400, fontStyle: "italic", color: T.text, margin: "12px 0 4px" }}>Mirror</h1>
      <p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: "0 0 20px" }}>{fmtDate(wd[0])} — {fmtDate(wd[6])}</p>

      <p style={lbl}>Where your time went</p>
      {(() => {
        const done = tasks.filter(t => t.status === "done"); if (!done.length) return <p style={{ fontFamily: f, fontSize: 13, fontStyle: "italic", color: T.textMuted, textAlign: "center", marginBottom: 20 }}>No completed tasks yet.</p>;
        const gc = {}; let ut = 0; done.forEach(t => { if (!t.goalIds.length) ut++; else t.goalIds.forEach(gid => { gc[gid] = (gc[gid] || 0) + 1 }) }); const tagged = done.length - ut;
        return <div style={{ marginBottom: 20 }}>
          <p style={{ fontFamily: f, fontSize: 14, color: T.text, margin: "0 0 14px", lineHeight: 1.5 }}>This week: <strong>{tagged}</strong> task{tagged !== 1 ? "s" : ""} for your goals. <strong>{ut}</strong> for everything else.</p>
          {goals.filter(g => gc[g.id]).map(g => <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Dot color={g.colour} sz={10} /><p style={{ fontFamily: fm, fontSize: 12, color: T.text, margin: 0, flex: 1 }}>{g.title}</p><p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: 0 }}>{gc[g.id]}</p>
          </div>)}
          {ut > 0 && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Dot color={T.untagged} sz={10} /><p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: 0, flex: 1 }}>Other things</p><p style={{ fontFamily: fm, fontSize: 12, color: T.textSoft, margin: 0 }}>{ut}</p></div>}
        </div>
      })()}

      <p style={lbl}>Non-negotiables this week</p>
      <div style={{ display: "flex", gap: 5, marginBottom: 20 }}>
        {DAYS.map((d, i) => {
          const nn = ls("sb3-nn-" + wd[i]) || {}; const c = setup.categories.filter(x => nn[x]).length; const isT = i === ti;
          return <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontFamily: fm, fontSize: 9, color: isT ? T.accent : T.textMuted, margin: "0 0 4px", fontWeight: isT ? 700 : 400 }}>{d}</p>
            <div style={{ width: "100%", paddingBottom: "100%", borderRadius: 6, position: "relative", background: c === 0 ? T.border : c === nnTotal ? T.accent : T.accentLight }}>
              {c > 0 && <p style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fm, fontSize: 10, color: c === nnTotal ? "#fff" : T.accent, margin: 0 }}>{c}</p>}
            </div>
          </div>
        })}
      </div>

      <p style={lbl}>Weekly reflection</p>
      {[{ k: "wentWell", p: "What went well this week?" }, { k: "improve", p: "What could be better?" }, { k: "goalCheck", p: "How did your goals feel this week?" }].map(({ k, p }) => <div key={k} style={{ marginBottom: 12 }}>
        <p style={{ fontFamily: f, fontSize: 12, fontStyle: "italic", color: T.textSoft, margin: "0 0 4px" }}>{p}</p>
        <StableTextarea initialValue={reflection[k]} onCommit={v => setReflection(prev => ({ ...prev, [k]: v }))} style={{ ...inp, minHeight: 70, resize: "vertical", lineHeight: 1.5 }} placeholder="Take your time..." />
      </div>)}
    </div>}

    <Nav active={tab} onTab={setTab} />
  </div>;
};

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function SlowBurnOS() {
  const [setup, setSetup] = useState(() => ls("sb3-setup"));
  const [goals, setGoals] = useState(() => ls("sb3-goals") || []);
  const handleComplete = (s, g) => { lsSet("sb3-setup", s); lsSet("sb3-goals", g); lsSet("sb3-meta", { onboardingComplete: true, lastLogin: today(), currentWeek: getWeekSunday(), visitCount: 1 }); setSetup(s); setGoals(g) };
  const handleReset = () => { Object.keys(localStorage).filter(k => k.startsWith("sb3-")).forEach(k => localStorage.removeItem(k)); setSetup(null); setGoals([]) };
  if (!setup) return <Onboarding onComplete={handleComplete} />;
  return <App setup={setup} goals={goals} onReset={handleReset} />;
}