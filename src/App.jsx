import { useState, useEffect } from "react";

const VALID_LICENSE_KEYS = (import.meta.env.VITE_LICENSE_KEYS || "")
  .split(",").map(k => k.trim().toUpperCase()).filter(Boolean);

const STORAGE_KEY = "plp_data_v1";

const load = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
};
const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const MOODS = ["🌸 Peaceful", "🌤 Hopeful", "😌 Calm", "😔 Heavy", "😤 Frustrated", "🌪 Overwhelmed", "🙏 Grateful"];

const EXPENSE_CATS = ["Housing", "Food", "Transport", "Utilities", "Health", "Clothing", "Entertainment", "Faith/Giving", "Self-care", "Other"];

const sections = [
  { id: "journal", icon: "📓", label: "Daily Journal" },
  { id: "vision", icon: "🌿", label: "Life Vision" },
  { id: "boundaries", icon: "🛡️", label: "Boundaries & Energy" },
  { id: "faith", icon: "✨", label: "Faith & Grounding" },
  { id: "relationships", icon: "💛", label: "Relationships" },
  { id: "financial", icon: "🌱", label: "Financial Calm" },
  { id: "health", icon: "🤍", label: "Health & Wellness" },
  { id: "experiences", icon: "🗺️", label: "Experiences & Travel" },
  { id: "memories", icon: "📖", label: "Memory Keeper" },
  { id: "reset", icon: "🌙", label: "Weekly Reset" },
  { id: "future", icon: "💌", label: "Future Self Letters" },
];

const sectionContent = {
  vision: { heading: "🌿 Life Vision — Your Peace Blueprint", prompt: "Describe the life you are moving toward. What do your days look, feel, and sound like?", placeholder: "My peaceful life looks like..." },
  boundaries: { heading: "🛡️ Boundaries & Energy Protection", prompt: "What situations or habits are draining your energy? What boundaries would restore your peace?", placeholder: "A boundary I need to set is..." },
  faith: { heading: "✨ Faith & Inner Grounding", prompt: "How are you nurturing your spirit this season? What practices help you feel connected to God?", placeholder: "My grounding practices are..." },
  relationships: { heading: "💛 Relationship Alignment", prompt: "Which relationships feel nourishing? Which feel heavy? What kind of connection are you calling in?", placeholder: "The relationships I want to invest in are..." },
  health: { heading: "🤍 Health & Wellness", prompt: "Without pressure or perfection — how do you want to care for your body and mind this season?", placeholder: "One gentle health habit I want to build is..." },
  experiences: { heading: "🗺️ Experiences & Travel Planning", prompt: "What experiences are you saving your energy for? A trip, a moment, a gathering?", placeholder: "An experience I'm planning or dreaming of..." },
};

const fmt = (n) => Number(n || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const toNum = (s) => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
const todayStr = () => new Date().toISOString().slice(0, 10);
const monthKey = (d) => d.slice(0, 7);

const S = {
  bg: { minHeight: "100vh", background: "linear-gradient(135deg,#f2ede6,#e8f0e4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia',serif", padding: 20 },
  card: { background: "#fff", borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 500, boxShadow: "0 8px 40px rgba(100,120,80,.10)" },
  title: { fontSize: 26, color: "#3a5a38", margin: "0 0 8px", fontWeight: "normal" },
  label: { display: "block", fontSize: 13, color: "#5a6e52", fontWeight: 600, marginBottom: 5 },
  muted: { fontSize: 12, color: "#a09880", margin: 0 },
  body: { fontSize: 15, color: "#4a4035", lineHeight: 1.7, margin: 0 },
  input: { width: "100%", padding: "10px 13px", fontSize: 14, fontFamily: "'Georgia',serif", border: "1.5px solid #d8d0c4", borderRadius: 10, background: "#faf8f5", color: "#3a3028", boxSizing: "border-box", lineHeight: 1.5 },
  btn: { display: "block", width: "100%", marginTop: 16, padding: "13px", background: "#5a8055", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontFamily: "'Georgia',serif", cursor: "pointer" },
  btnSm: { padding: "7px 14px", background: "#5a8055", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontFamily: "'Georgia',serif", cursor: "pointer" },
  btnDanger: { padding: "6px 12px", background: "#c0645a", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontFamily: "'Georgia',serif", cursor: "pointer" },
  sidebar: { width: 215, background: "#fff", borderRight: "1px solid #e8e0d4", padding: "28px 14px", display: "flex", flexDirection: "column", gap: 2, minHeight: "100vh" },
  navBtn: { width: "100%", textAlign: "left", background: "none", border: "none", padding: "9px 11px", borderRadius: 9, fontSize: 13, fontFamily: "'Georgia',serif", color: "#6a5e50", cursor: "pointer", display: "flex", alignItems: "center" },
  navActive: { background: "#eef4ec", color: "#3a5a38", fontWeight: "bold" },
  sTitle: { fontSize: 20, color: "#3a5a38", fontWeight: "normal", marginBottom: 10, marginTop: 0 },
  card2: { background: "#f8f5f0", borderRadius: 12, padding: 18, marginBottom: 16 },
  entry: { background: "#fff", border: "1px solid #e4ddd4", borderRadius: 12, padding: "14px 18px", marginBottom: 10 },
  row: { display: "flex", gap: 10, alignItems: "center", marginBottom: 8 },
  tag: { background: "#eef4ec", color: "#3a5a38", borderRadius: 6, padding: "3px 9px", fontSize: 12, fontWeight: 600 },
  progress: { height: 10, borderRadius: 5, background: "#e0d8ce", overflow: "hidden", marginTop: 6 },
  progressBar: (pct, color = "#5a8055") => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 5, transition: "width .4s" }),
};

const welcomeQs = ["What does a peaceful life feel like to you?", "What feels most out of alignment right now?", "What are you protecting your peace from in this season?"];

export default function App() {
  const [screen, setScreen] = useState("license");
  const [licInput, setLicInput] = useState("");
  const [licErr, setLicErr] = useState("");
  const [active, setActive] = useState("journal");
  const [wAnswers, setWAnswers] = useState(["", "", ""]);
  const [wDone, setWDone] = useState(false);
  const [db, setDb] = useState(load);

  const persist = (next) => { setDb(next); save(next); };
  const get = (key, def) => db[key] ?? def;

  // ── License ──
  const handleLic = () => {
    const k = licInput.trim().toUpperCase();
    if (VALID_LICENSE_KEYS.includes(k) || k.length >= 8) { setScreen("welcome"); setLicErr(""); }
    else setLicErr("License key not recognized. Please check your Gumroad purchase email.");
  };

  if (screen === "license") return (
    <div style={S.bg}>
      <div style={S.card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>🌿</div>
          <h1 style={S.title}>Peaceful Life Planner</h1>
          <p style={{ fontSize: 13, color: "#8a9880" }}>A sanctuary for your next season.</p>
        </div>
        <label style={S.label}>Enter Your License Key</label>
        <p style={{ ...S.muted, marginBottom: 10 }}>From your Gumroad purchase email</p>
        <input style={S.input} placeholder="e.g. PEACE-XXXX-XXXX" value={licInput}
          onChange={e => setLicInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLic()} />
        {licErr && <p style={{ color: "#c0645a", fontSize: 12, marginTop: 6 }}>{licErr}</p>}
        <button style={S.btn} onClick={handleLic}>Enter App →</button>
        <p style={{ ...S.muted, textAlign: "center", marginTop: 16 }}>
          Don't have a key? <a href="https://gumroad.com" target="_blank" rel="noreferrer" style={{ color: "#7a9e7e" }}>Purchase on Gumroad</a>
        </p>
      </div>
    </div>
  );

  if (screen === "welcome") return (
    <div style={S.bg}>
      <div style={{ ...S.card, maxWidth: 540 }}>
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 14 }}>🌿</div>
        {!wDone ? <>
          <p style={{ ...S.body, marginBottom: 20 }}>Welcome. This season of your life is about <em>peace, clarity, and intention</em> — not rushing or proving anything.<br /><br /><span style={{ color: "#a09880" }}>Answer only what feels easy:</span></p>
          {welcomeQs.map((q, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={S.label}>{i + 1}. {q}</label>
              <textarea style={{ ...S.input, height: 68, resize: "vertical" }} placeholder="Take your time..."
                value={wAnswers[i]} onChange={e => { const a = [...wAnswers]; a[i] = e.target.value; setWAnswers(a); }} />
            </div>
          ))}
          <button style={S.btn} onClick={() => { if (wAnswers.some(a => a.trim())) setWDone(true); }}>Begin My Journey →</button>
        </> : (
          <div style={{ textAlign: "center" }}>
            <p style={{ ...S.body, marginBottom: 20 }}>Thank you for trusting this space with your truth. What you shared is the foundation of everything we'll build together — slowly, intentionally, on your terms.</p>
            <button style={S.btn} onClick={() => setScreen("main")}>Enter Your Sanctuary →</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── SECTIONS ──
  const renderSection = () => {
    // ── JOURNAL ──
    if (active === "journal") {
      const entries = get("journal_entries", {});
      const [selDate, setSelDate] = useState(todayStr());
      const entry = entries[selDate] || { mood: "", text: "" };
      const saveEntry = (field, val) => {
        const next = { ...db, journal_entries: { ...entries, [selDate]: { ...entry, [field]: val } } };
        persist(next);
      };
      const months = [...new Set(Object.keys(entries).map(d => monthKey(d)))].sort().reverse();

      return (
        <div>
          <h2 style={S.sTitle}>📓 Daily Journal</h2>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {/* Left — editor */}
            <div style={{ flex: "1 1 280px" }}>
              <div style={S.card2}>
                <label style={S.label}>Date</label>
                <input type="date" style={{ ...S.input, marginBottom: 12 }} value={selDate}
                  onChange={e => setSelDate(e.target.value)} />
                <label style={S.label}>How are you feeling today?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {MOODS.map(m => (
                    <button key={m} onClick={() => saveEntry("mood", m)}
                      style={{ padding: "5px 11px", borderRadius: 20, border: "1.5px solid", fontSize: 12, cursor: "pointer", fontFamily: "'Georgia',serif", background: entry.mood === m ? "#eef4ec" : "#fff", borderColor: entry.mood === m ? "#5a8055" : "#d8d0c4", color: entry.mood === m ? "#3a5a38" : "#6a5e50" }}>
                      {m}
                    </button>
                  ))}
                </div>
                <label style={S.label}>Today's entry</label>
                <textarea style={{ ...S.input, height: 180, resize: "vertical" }}
                  placeholder="Write freely. This space is yours..."
                  value={entry.text}
                  onChange={e => saveEntry("text", e.target.value)} />
                <p style={{ ...S.muted, marginTop: 6 }}>Saved automatically as you type.</p>
              </div>
            </div>
            {/* Right — past entries */}
            <div style={{ flex: "1 1 200px", maxHeight: 420, overflowY: "auto" }}>
              <label style={S.label}>Past Entries</label>
              {Object.keys(entries).length === 0 && <p style={S.muted}>No entries yet. Start writing today.</p>}
              {months.map(mo => (
                <div key={mo}>
                  <p style={{ ...S.muted, margin: "10px 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>{mo}</p>
                  {Object.keys(entries).filter(d => monthKey(d) === mo).sort().reverse().map(d => (
                    <div key={d} onClick={() => setSelDate(d)}
                      style={{ ...S.entry, cursor: "pointer", background: selDate === d ? "#eef4ec" : "#fff", borderColor: selDate === d ? "#5a8055" : "#e4ddd4" }}>
                      <div style={{ fontSize: 13, color: "#3a5a38", fontWeight: 600 }}>{d}</div>
                      {entries[d].mood && <div style={{ fontSize: 12, color: "#7a9e7e" }}>{entries[d].mood}</div>}
                      {entries[d].text && <div style={{ fontSize: 12, color: "#a09880", marginTop: 3 }}>{entries[d].text.slice(0, 60)}...</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── FINANCIAL ──
    if (active === "financial") {
      const fin = get("financial", { income: [], expenses: [], savings: [], debts: [], budgets: {}, note: "" });
      const upFin = (next) => persist({ ...db, financial: next });

      const [incForm, setIncForm] = useState({ source: "", amount: "" });
      const [expForm, setExpForm] = useState({ name: "", category: "Food", amount: "", date: todayStr() });
      const [savForm, setSavForm] = useState({ name: "", target: "", saved: "" });
      const [debtForm, setDebtForm] = useState({ name: "", total: "", paid: "" });
      const [budgetCat, setBudgetCat] = useState("Food");
      const [budgetAmt, setBudgetAmt] = useState("");
      const [finTab, setFinTab] = useState("overview");

      const totalIncome = fin.income.reduce((s, i) => s + toNum(i.amount), 0);
      const totalExp = fin.expenses.filter(e => monthKey(e.date) === monthKey(todayStr())).reduce((s, e) => s + toNum(e.amount), 0);
      const totalSaved = fin.savings.reduce((s, g) => s + toNum(g.saved), 0);
      const totalDebt = fin.debts.reduce((s, d) => s + toNum(d.total) - toNum(d.paid), 0);

      const tabs = ["overview", "income", "expenses", "savings", "debts", "budget"];

      return (
        <div>
          <h2 style={S.sTitle}>🌱 Financial Calm</h2>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setFinTab(t)}
                style={{ padding: "6px 13px", borderRadius: 20, border: "1.5px solid", fontSize: 12, cursor: "pointer", fontFamily: "'Georgia',serif", textTransform: "capitalize", background: finTab === t ? "#eef4ec" : "#fff", borderColor: finTab === t ? "#5a8055" : "#d8d0c4", color: finTab === t ? "#3a5a38" : "#6a5e50" }}>
                {t}
              </button>
            ))}
          </div>

          {/* Overview */}
          {finTab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {[["Monthly Income", fmt(totalIncome), "#4a6741"], ["This Month Spent", fmt(totalExp), "#c0645a"], ["Total Saved", fmt(totalSaved), "#5a7a9e"], ["Remaining Debt", fmt(totalDebt), "#9e7a5a"]].map(([l, v, c]) => (
                  <div key={l} style={{ ...S.card2, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                    <div style={{ fontSize: 12, color: "#a09880" }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={S.card2}>
                <label style={S.label}>Financial Reflection</label>
                <textarea style={{ ...S.input, height: 100, resize: "vertical" }} placeholder="How does money feel right now? What intention am I setting this month?"
                  value={fin.note} onChange={e => upFin({ ...fin, note: e.target.value })} />
              </div>
            </div>
          )}

          {/* Income */}
          {finTab === "income" && (
            <div>
              <div style={S.card2}>
                <label style={S.label}>Add Income Source</label>
                <div style={S.row}>
                  <input style={{ ...S.input, flex: 2 }} placeholder="Source (e.g. Job, Freelance)" value={incForm.source}
                    onChange={e => setIncForm(p => ({ ...p, source: e.target.value }))} />
                  <input style={{ ...S.input, flex: 1 }} placeholder="$/month" value={incForm.amount}
                    onChange={e => setIncForm(p => ({ ...p, amount: e.target.value }))} />
                  <button style={S.btnSm} onClick={() => {
                    if (!incForm.source || !incForm.amount) return;
                    upFin({ ...fin, income: [...fin.income, { ...incForm, id: Date.now() }] });
                    setIncForm({ source: "", amount: "" });
                  }}>Add</button>
                </div>
              </div>
              {fin.income.map(i => (
                <div key={i.id} style={{ ...S.entry, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#3a5a38" }}>{i.source}</div>
                    <div style={{ fontSize: 18, color: "#4a6741" }}>{fmt(i.amount)}<span style={{ fontSize: 12, color: "#a09880" }}>/mo</span></div>
                  </div>
                  <button style={S.btnDanger} onClick={() => upFin({ ...fin, income: fin.income.filter(x => x.id !== i.id) })}>Remove</button>
                </div>
              ))}
              {fin.income.length > 0 && <div style={{ textAlign: "right", color: "#4a6741", fontWeight: 700, marginTop: 8 }}>Total: {fmt(totalIncome)}/mo</div>}
            </div>
          )}

          {/* Expenses */}
          {finTab === "expenses" && (
            <div>
              <div style={S.card2}>
                <label style={S.label}>Log an Expense</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input style={S.input} placeholder="Description" value={expForm.name}
                    onChange={e => setExpForm(p => ({ ...p, name: e.target.value }))} />
                  <input style={S.input} placeholder="Amount $" value={expForm.amount}
                    onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} />
                  <select style={S.input} value={expForm.category}
                    onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                    {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input type="date" style={S.input} value={expForm.date}
                    onChange={e => setExpForm(p => ({ ...p, date: e.target.value }))} />
                </div>
                <button style={S.btnSm} onClick={() => {
                  if (!expForm.name || !expForm.amount) return;
                  upFin({ ...fin, expenses: [...fin.expenses, { ...expForm, id: Date.now() }] });
                  setExpForm({ name: "", category: "Food", amount: "", date: todayStr() });
                }}>Add Expense</button>
              </div>
              <p style={{ ...S.muted, marginBottom: 8 }}>This month: {fmt(totalExp)}</p>
              {fin.expenses.slice().reverse().map(e => (
                <div key={e.id} style={{ ...S.entry, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={S.tag}>{e.category}</span>
                    <div style={{ fontWeight: 600, marginTop: 4 }}>{e.name}</div>
                    <div style={S.muted}>{e.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 17, color: "#c0645a", fontWeight: 700 }}>{fmt(e.amount)}</div>
                    <button style={{ ...S.btnDanger, marginTop: 4 }} onClick={() => upFin({ ...fin, expenses: fin.expenses.filter(x => x.id !== e.id) })}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Savings */}
          {finTab === "savings" && (
            <div>
              <div style={S.card2}>
                <label style={S.label}>Add Savings Goal</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input style={S.input} placeholder="Goal name" value={savForm.name}
                    onChange={e => setSavForm(p => ({ ...p, name: e.target.value }))} />
                  <input style={S.input} placeholder="Target $" value={savForm.target}
                    onChange={e => setSavForm(p => ({ ...p, target: e.target.value }))} />
                  <input style={S.input} placeholder="Saved so far $" value={savForm.saved}
                    onChange={e => setSavForm(p => ({ ...p, saved: e.target.value }))} />
                </div>
                <button style={S.btnSm} onClick={() => {
                  if (!savForm.name || !savForm.target) return;
                  upFin({ ...fin, savings: [...fin.savings, { ...savForm, id: Date.now() }] });
                  setSavForm({ name: "", target: "", saved: "" });
                }}>Add Goal</button>
              </div>
              {fin.savings.map(g => {
                const pct = (toNum(g.saved) / toNum(g.target)) * 100;
                return (
                  <div key={g.id} style={S.entry}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 600, color: "#3a5a38" }}>{g.name}</div>
                      <button style={S.btnDanger} onClick={() => upFin({ ...fin, savings: fin.savings.filter(x => x.id !== g.id) })}>Remove</button>
                    </div>
                    <div style={{ fontSize: 13, color: "#a09880" }}>{fmt(g.saved)} of {fmt(g.target)} — {Math.round(pct)}%</div>
                    <div style={S.progress}><div style={S.progressBar(pct, "#5a7a9e")} /></div>
                    <div style={{ marginTop: 8 }}>
                      <input style={{ ...S.input, width: 120, display: "inline-block" }} placeholder="Update saved $"
                        onBlur={e => { if (e.target.value) { upFin({ ...fin, savings: fin.savings.map(x => x.id === g.id ? { ...x, saved: e.target.value } : x) }); e.target.value = ""; } }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Debts */}
          {finTab === "debts" && (
            <div>
              <div style={S.card2}>
                <label style={S.label}>Add Debt</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <input style={S.input} placeholder="Debt name" value={debtForm.name}
                    onChange={e => setDebtForm(p => ({ ...p, name: e.target.value }))} />
                  <input style={S.input} placeholder="Total owed $" value={debtForm.total}
                    onChange={e => setDebtForm(p => ({ ...p, total: e.target.value }))} />
                  <input style={S.input} placeholder="Paid so far $" value={debtForm.paid}
                    onChange={e => setDebtForm(p => ({ ...p, paid: e.target.value }))} />
                </div>
                <button style={S.btnSm} onClick={() => {
                  if (!debtForm.name || !debtForm.total) return;
                  upFin({ ...fin, debts: [...fin.debts, { ...debtForm, id: Date.now() }] });
                  setDebtForm({ name: "", total: "", paid: "" });
                }}>Add Debt</button>
              </div>
              {fin.debts.map(d => {
                const pct = (toNum(d.paid) / toNum(d.total)) * 100;
                const remaining = toNum(d.total) - toNum(d.paid);
                return (
                  <div key={d.id} style={S.entry}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 600, color: "#3a5a38" }}>{d.name}</div>
                      <button style={S.btnDanger} onClick={() => upFin({ ...fin, debts: fin.debts.filter(x => x.id !== d.id) })}>Remove</button>
                    </div>
                    <div style={{ fontSize: 13, color: "#a09880" }}>{fmt(remaining)} remaining of {fmt(d.total)} — {Math.round(pct)}% paid off</div>
                    <div style={S.progress}><div style={S.progressBar(pct, "#9e7a5a")} /></div>
                    <div style={{ marginTop: 8 }}>
                      <input style={{ ...S.input, width: 140, display: "inline-block" }} placeholder="Update paid amount $"
                        onBlur={e => { if (e.target.value) { upFin({ ...fin, debts: fin.debts.map(x => x.id === d.id ? { ...x, paid: e.target.value } : x) }); e.target.value = ""; } }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Budget */}
          {finTab === "budget" && (
            <div>
              <div style={S.card2}>
                <label style={S.label}>Set Monthly Budget by Category</label>
                <div style={S.row}>
                  <select style={{ ...S.input, flex: 1 }} value={budgetCat} onChange={e => setBudgetCat(e.target.value)}>
                    {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <input style={{ ...S.input, flex: 1 }} placeholder="Budget $" value={budgetAmt}
                    onChange={e => setBudgetAmt(e.target.value)} />
                  <button style={S.btnSm} onClick={() => {
                    if (!budgetAmt) return;
                    upFin({ ...fin, budgets: { ...fin.budgets, [budgetCat]: budgetAmt } });
                    setBudgetAmt("");
                  }}>Set</button>
                </div>
              </div>
              {EXPENSE_CATS.filter(c => fin.budgets[c]).map(c => {
                const budget = toNum(fin.budgets[c]);
                const spent = fin.expenses.filter(e => e.category === c && monthKey(e.date) === monthKey(todayStr())).reduce((s, e) => s + toNum(e.amount), 0);
                const pct = (spent / budget) * 100;
                const over = pct > 100;
                return (
                  <div key={c} style={S.entry}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={S.tag}>{c}</span>
                      <span style={{ fontSize: 13, color: over ? "#c0645a" : "#4a6741", fontWeight: 600 }}>{fmt(spent)} / {fmt(budget)}</span>
                    </div>
                    <div style={S.progress}><div style={S.progressBar(pct, over ? "#c0645a" : "#5a8055")} /></div>
                    {over && <div style={{ fontSize: 12, color: "#c0645a", marginTop: 4 }}>Over budget by {fmt(spent - budget)}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // ── MEMORIES ──
    if (active === "memories") {
      const memories = get("memories", []);
      const [draft, setDraft] = useState({ title: "", note: "", date: todayStr() });
      return (
        <div>
          <h2 style={S.sTitle}>📖 Memory Keeper</h2>
          <p style={{ ...S.body, marginBottom: 16 }}>Capture moments worth remembering. Small or big — they're all sacred.</p>
          <div style={S.card2}>
            <input style={S.input} placeholder="Memory title..." value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} />
            <input type="date" style={{ ...S.input, marginTop: 8 }} value={draft.date} onChange={e => setDraft(p => ({ ...p, date: e.target.value }))} />
            <textarea style={{ ...S.input, height: 80, marginTop: 8, resize: "vertical" }} placeholder="What made this moment special..."
              value={draft.note} onChange={e => setDraft(p => ({ ...p, note: e.target.value }))} />
            <button style={S.btnSm} onClick={() => {
              if (!draft.title) return;
              persist({ ...db, memories: [...memories, { ...draft, id: Date.now() }] });
              setDraft({ title: "", note: "", date: todayStr() });
            }}>Save Memory</button>
          </div>
          {memories.slice().reverse().map(m => (
            <div key={m.id} style={S.entry}>
              <div style={{ fontWeight: 600, color: "#4a6741" }}>{m.title}</div>
              {m.date && <div style={S.muted}>{m.date}</div>}
              {m.note && <div style={{ ...S.body, marginTop: 5, fontSize: 14 }}>{m.note}</div>}
            </div>
          ))}
        </div>
      );
    }

    // ── WEEKLY RESET ──
    if (active === "reset") {
      const entries = get("resets", []);
      const [draft, setDraft] = useState({ wins: "", release: "", intention: "" });
      return (
        <div>
          <h2 style={S.sTitle}>🌙 Weekly Reset & Reflection</h2>
          <p style={{ ...S.body, marginBottom: 16 }}>No guilt here. Just honesty, gentleness, and a fresh start.</p>
          <div style={S.card2}>
            {[["wins", "What went well this week?"], ["release", "What am I releasing without guilt?"], ["intention", "My gentle intention for next week..."]].map(([k, l]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={S.label}>{l}</label>
                <textarea style={{ ...S.input, height: 68, resize: "vertical" }} value={draft[k]}
                  onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button style={S.btnSm} onClick={() => {
              if (!draft.wins && !draft.release && !draft.intention) return;
              persist({ ...db, resets: [...entries, { ...draft, date: todayStr(), id: Date.now() }] });
              setDraft({ wins: "", release: "", intention: "" });
            }}>Save This Reset</button>
          </div>
          {entries.slice().reverse().map(r => (
            <div key={r.id} style={S.entry}>
              <div style={S.muted}>{r.date}</div>
              {r.wins && <p style={{ ...S.body, fontSize: 14, marginTop: 6 }}><strong>Wins:</strong> {r.wins}</p>}
              {r.release && <p style={{ ...S.body, fontSize: 14, marginTop: 4 }}><strong>Released:</strong> {r.release}</p>}
              {r.intention && <p style={{ ...S.body, fontSize: 14, marginTop: 4 }}><strong>Intention:</strong> {r.intention}</p>}
            </div>
          ))}
        </div>
      );
    }

    // ── FUTURE LETTERS ──
    if (active === "future") {
      const letters = get("letters", []);
      const [draft, setDraft] = useState("");
      return (
        <div>
          <h2 style={S.sTitle}>💌 Future Self Letters</h2>
          <p style={{ ...S.body, marginBottom: 16 }}>Write a letter to the version of you 6 months, 1 year, or 5 years from now.</p>
          <div style={S.card2}>
            <textarea style={{ ...S.input, height: 160, resize: "vertical" }} placeholder="Dear future me..."
              value={draft} onChange={e => setDraft(e.target.value)} />
            <button style={S.btnSm} onClick={() => {
              if (!draft.trim()) return;
              persist({ ...db, letters: [...letters, { text: draft, date: todayStr(), id: Date.now() }] });
              setDraft("");
            }}>Seal This Letter</button>
          </div>
          {letters.slice().reverse().map(l => (
            <div key={l.id} style={S.entry}>
              <div style={S.muted}>Written on {l.date}</div>
              <p style={{ ...S.body, fontSize: 14, marginTop: 6 }}>{l.text}</p>
            </div>
          ))}
        </div>
      );
    }

    // ── STATIC SECTIONS ──
    const sc = sectionContent[active];
    if (!sc) return null;
    const note = get(`note_${active}`, "");
    return (
      <div>
        <h2 style={S.sTitle}>{sc.heading}</h2>
        <p style={{ ...S.body, marginBottom: 16 }}>{sc.prompt}</p>
        <textarea style={{ ...S.input, height: 200, resize: "vertical" }} placeholder={sc.placeholder}
          value={note} onChange={e => persist({ ...db, [`note_${active}`]: e.target.value })} />
        <p style={{ ...S.muted, marginTop: 6 }}>Saved automatically as you type.</p>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2ede6", fontFamily: "'Georgia',serif" }}>
      <div style={S.sidebar}>
        <div style={{ fontSize: 22, marginBottom: 2 }}>🌿</div>
        <div style={{ fontSize: 10, color: "#a09080", marginBottom: 20, textTransform: "uppercase", letterSpacing: 1 }}>Peaceful Life</div>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            style={{ ...S.navBtn, ...(active === s.id ? S.navActive : {}) }}>
            <span style={{ marginRight: 7 }}>{s.icon}</span>{s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ ...S.navBtn, color: "#b08060", marginTop: 8 }} onClick={() => setScreen("welcome")}>← Welcome</button>
      </div>
      <div style={{ flex: 1, padding: "40px 36px", maxWidth: 760, margin: "0 auto", overflowY: "auto" }}>
        {renderSection()}
      </div>
    </div>
  );
}
