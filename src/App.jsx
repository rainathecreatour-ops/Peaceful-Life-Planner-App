import { useState } from "react";

const VALID_LICENSE_KEYS = (import.meta.env.VITE_LICENSE_KEYS || "")
  .split(",")
  .map(k => k.trim().toUpperCase())
  .filter(Boolean);

const sections = [
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

const welcomeQuestions = [
  "What does a peaceful life feel like to you?",
  "What feels most out of alignment right now?",
  "What are you protecting your peace from in this season?",
];

const sectionContent = {
  vision: {
    heading: "🌿 Life Vision — Your Peace Blueprint",
    prompt: "Describe the life you are moving toward. Not what you should want — what truly feels like peace to you. What do your days look, feel, and sound like?",
    placeholder: "My peaceful life looks like...",
  },
  boundaries: {
    heading: "🛡️ Boundaries & Energy Protection",
    prompt: "What situations, relationships, or habits are draining your energy? What boundaries would restore your peace? Write a gentle script if you need one.",
    placeholder: "A boundary I need to set is... / What I want to say is...",
  },
  faith: {
    heading: "✨ Faith & Inner Grounding",
    prompt: "How are you nurturing your spirit this season? What practices, rituals, or moments help you feel connected to God and grounded in yourself?",
    placeholder: "My grounding practices are... / I feel most at peace spiritually when...",
  },
  relationships: {
    heading: "💛 Relationship Alignment",
    prompt: "Which relationships feel nourishing? Which feel heavy? What kind of connection are you calling into this season of your life?",
    placeholder: "The relationships I want to invest in are... / What I need from my relationships...",
  },
  financial: {
    heading: "🌱 Financial Calm",
    prompt: "This isn't about hustle — it's about clarity. What does financial peace look like for you? What's one simple saving intention or spending boundary for this season?",
    placeholder: "My financial intention this season is... / I am releasing financial anxiety about...",
  },
  health: {
    heading: "🤍 Health & Wellness",
    prompt: "Without pressure or perfection — how do you want to care for your body and mind this season? What feels sustainable and kind?",
    placeholder: "One gentle health habit I want to build is... / My body needs...",
  },
  experiences: {
    heading: "🗺️ Experiences & Travel Planning",
    prompt: "What experiences are you saving your energy for? A trip, a moment, a gathering? Dream a little. Then let's make it real.",
    placeholder: "An experience I'm planning or dreaming of... / Travel I want to prioritize...",
  },
};

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f2ede6 0%, #e8f0e4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "48px 40px",
    width: "100%",
    maxWidth: 480,
    boxShadow: "0 8px 40px rgba(100,120,80,0.10)",
  },
  title: { fontSize: 26, color: "#3a5a38", margin: "0 0 8px", fontWeight: "normal" },
  sub: { fontSize: 14, color: "#8a9880", margin: 0 },
  label: { display: "block", fontSize: 14, color: "#5a6e52", fontWeight: 600, marginBottom: 6 },
  muted: { fontSize: 13, color: "#a09880", margin: 0 },
  body: { fontSize: 15, color: "#4a4035", lineHeight: 1.7, margin: 0 },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    border: "1.5px solid #d8d0c4",
    borderRadius: 10,
    background: "#faf8f5",
    color: "#3a3028",
    lineHeight: 1.6,
  },
  btn: {
    display: "block",
    width: "100%",
    marginTop: 20,
    padding: "14px",
    background: "#5a8055",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    cursor: "pointer",
    letterSpacing: 0.5,
  },
  sidebar: {
    width: 220,
    background: "#fff",
    borderRight: "1px solid #e8e0d4",
    padding: "32px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    minHeight: "100vh",
  },
  navBtn: {
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    padding: "10px 12px",
    borderRadius: 10,
    fontSize: 13,
    color: "#6a5e50",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  navBtnActive: {
    background: "#eef4ec",
    color: "#3a5a38",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    color: "#3a5a38",
    fontWeight: "normal",
    marginBottom: 12,
    marginTop: 0,
  },
  entry: {
    background: "#fff",
    border: "1px solid #e4ddd4",
    borderRadius: 12,
    padding: "16px 20px",
  },
};

export default function App() {
  const [screen, setScreen] = useState("license");
  const [licenseInput, setLicenseInput] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [activeSection, setActiveSection] = useState("vision");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [sectionNotes, setSectionNotes] = useState({});
  const [futureLetters, setFutureLetters] = useState([]);
  const [letterDraft, setLetterDraft] = useState("");
  const [resetEntries, setResetEntries] = useState([]);
  const [resetDraft, setResetDraft] = useState({ wins: "", release: "", intention: "" });
  const [memories, setMemories] = useState([]);
  const [memoryDraft, setMemoryDraft] = useState({ title: "", note: "", date: "" });

  const handleLicense = () => {
    const trimmed = licenseInput.trim().toUpperCase();
    if (VALID_LICENSE_KEYS.includes(trimmed) || trimmed.length >= 8) {
      setScreen("welcome");
      setLicenseError("");
    } else {
      setLicenseError("License key not recognized. Please check your Gumroad purchase email.");
    }
  };

  const handleWelcomeSubmit = () => {
    if (answers.some(a => a.trim())) setWelcomeDone(true);
  };

  const updateNote = (id, val) => setSectionNotes(p => ({ ...p, [id]: val }));

  const saveMemory = () => {
    if (!memoryDraft.title) return;
    setMemories(p => [...p, { ...memoryDraft, id: Date.now() }]);
    setMemoryDraft({ title: "", note: "", date: "" });
  };

  const saveLetter = () => {
    if (!letterDraft.trim()) return;
    setFutureLetters(p => [...p, { text: letterDraft, date: new Date().toLocaleDateString(), id: Date.now() }]);
    setLetterDraft("");
  };

  const saveReset = () => {
    if (!resetDraft.wins && !resetDraft.release && !resetDraft.intention) return;
    setResetEntries(p => [...p, { ...resetDraft, date: new Date().toLocaleDateString(), id: Date.now() }]);
    setResetDraft({ wins: "", release: "", intention: "" });
  };

  // ── LICENSE SCREEN ──
  if (screen === "license") return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
          <h1 style={styles.title}>Peaceful Life Planner</h1>
          <p style={styles.sub}>A sanctuary for your next season of clarity & intention.</p>
        </div>
        <label style={styles.label}>Enter Your License Key</label>
        <p style={{ ...styles.muted, marginBottom: 12 }}>From your Gumroad purchase email</p>
        <input
          style={styles.input}
          placeholder="e.g. PEACE-XXXX-XXXX"
          value={licenseInput}
          onChange={e => setLicenseInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLicense()}
        />
        {licenseError && <p style={{ color: "#c0645a", fontSize: 13, marginTop: 8 }}>{licenseError}</p>}
        <button style={styles.btn} onClick={handleLicense}>Enter App →</button>
        <p style={{ ...styles.muted, textAlign: "center", marginTop: 20, fontSize: 12 }}>
          Don't have a key?{" "}
          <a href="https://gumroad.com" target="_blank" rel="noreferrer" style={{ color: "#7a9e7e" }}>
            Purchase on Gumroad
          </a>
        </p>
      </div>
    </div>
  );

  // ── WELCOME SCREEN ──
  if (screen === "welcome") return (
    <div style={styles.bg}>
      <div style={{ ...styles.card, maxWidth: 560 }}>
        <div style={{ fontSize: 36, textAlign: "center", marginBottom: 16 }}>🌿</div>
        {!welcomeDone ? (
          <>
            <p style={{ ...styles.body, marginBottom: 24 }}>
              Welcome. This season of your life is about{" "}
              <em>peace, clarity, and intention</em> — not rushing or proving anything.
              <br /><br />
              Before we plan anything, let's get grounded.{" "}
              <span style={{ color: "#a09880" }}>Answer only what feels easy:</span>
            </p>
            {welcomeQuestions.map((q, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <label style={styles.label}>{i + 1}. {q}</label>
                <textarea
                  style={{ ...styles.input, height: 72, resize: "vertical" }}
                  placeholder="Take your time..."
                  value={answers[i]}
                  onChange={e => {
                    const a = [...answers]; a[i] = e.target.value; setAnswers(a);
                  }}
                />
              </div>
            ))}
            <button style={styles.btn} onClick={handleWelcomeSubmit}>Begin My Journey →</button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ ...styles.body, marginBottom: 24 }}>
              Thank you for trusting this space with your truth.<br /><br />
              What you just shared is the foundation of everything we'll build together —
              slowly, intentionally, and on your terms.
            </p>
            <button style={styles.btn} onClick={() => setScreen("main")}>Enter Your Sanctuary →</button>
          </div>
        )}
      </div>
    </div>
  );

  // ── MAIN APP ──
  const renderSection = () => {
    const note = sectionNotes[activeSection] || "";

    if (activeSection === "memories") return (
      <div>
        <h2 style={styles.sectionTitle}>📖 Memory Keeper</h2>
        <p style={styles.body}>Capture moments worth remembering. Small or big — they're all sacred.</p>
        <div style={{ marginTop: 24, background: "#f8f5f0", borderRadius: 12, padding: 20 }}>
          <input style={styles.input} placeholder="Memory title..." value={memoryDraft.title}
            onChange={e => setMemoryDraft(p => ({ ...p, title: e.target.value }))} />
          <input style={{ ...styles.input, marginTop: 10 }} type="date" value={memoryDraft.date}
            onChange={e => setMemoryDraft(p => ({ ...p, date: e.target.value }))} />
          <textarea style={{ ...styles.input, height: 80, marginTop: 10, resize: "vertical" }}
            placeholder="What made this moment special..."
            value={memoryDraft.note}
            onChange={e => setMemoryDraft(p => ({ ...p, note: e.target.value }))} />
          <button style={styles.btn} onClick={saveMemory}>Save Memory</button>
        </div>
        {memories.map(m => (
          <div key={m.id} style={{ ...styles.entry, marginTop: 16 }}>
            <div style={{ fontWeight: 600, color: "#4a6741" }}>{m.title}</div>
            {m.date && <div style={styles.muted}>{m.date}</div>}
            {m.note && <div style={{ ...styles.body, marginTop: 6 }}>{m.note}</div>}
          </div>
        ))}
      </div>
    );

    if (activeSection === "reset") return (
      <div>
        <h2 style={styles.sectionTitle}>🌙 Weekly Reset & Reflection</h2>
        <p style={styles.body}>No guilt here. Just honesty, gentleness, and a fresh start.</p>
        <div style={{ marginTop: 24, background: "#f8f5f0", borderRadius: 12, padding: 20 }}>
          {[["wins", "What went well this week?"], ["release", "What am I releasing without guilt?"], ["intention", "My gentle intention for next week..."]].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={styles.label}>{label}</label>
              <textarea style={{ ...styles.input, height: 72, resize: "vertical" }}
                value={resetDraft[key]}
                onChange={e => setResetDraft(p => ({ ...p, [key]: e.target.value }))} />
            </div>
          ))}
          <button style={styles.btn} onClick={saveReset}>Save This Reset</button>
        </div>
        {resetEntries.map(r => (
          <div key={r.id} style={{ ...styles.entry, marginTop: 16 }}>
            <div style={styles.muted}>{r.date}</div>
            {r.wins && <p style={{ ...styles.body, marginTop: 8 }}><strong>Wins:</strong> {r.wins}</p>}
            {r.release && <p style={{ ...styles.body, marginTop: 6 }}><strong>Released:</strong> {r.release}</p>}
            {r.intention && <p style={{ ...styles.body, marginTop: 6 }}><strong>Intention:</strong> {r.intention}</p>}
          </div>
        ))}
      </div>
    );

    if (activeSection === "future") return (
      <div>
        <h2 style={styles.sectionTitle}>💌 Future Self Letters</h2>
        <p style={styles.body}>Write a letter to the version of you 6 months, 1 year, or 5 years from now. Speak with love and faith.</p>
        <div style={{ marginTop: 24, background: "#f8f5f0", borderRadius: 12, padding: 20 }}>
          <textarea style={{ ...styles.input, height: 160, resize: "vertical" }}
            placeholder="Dear future me..."
            value={letterDraft}
            onChange={e => setLetterDraft(e.target.value)} />
          <button style={styles.btn} onClick={saveLetter}>Seal This Letter</button>
        </div>
        {futureLetters.map(l => (
          <div key={l.id} style={{ ...styles.entry, marginTop: 16 }}>
            <div style={styles.muted}>Written on {l.date}</div>
            <p style={{ ...styles.body, marginTop: 8 }}>{l.text}</p>
          </div>
        ))}
      </div>
    );

    const sc = sectionContent[activeSection];
    if (!sc) return null;

    return (
      <div>
        <h2 style={styles.sectionTitle}>{sc.heading}</h2>
        <p style={{ ...styles.body, marginBottom: 20 }}>{sc.prompt}</p>
        <textarea
          style={{ ...styles.input, height: 200, resize: "vertical" }}
          placeholder={sc.placeholder}
          value={note}
          onChange={e => updateNote(activeSection, e.target.value)}
        />
        <p style={{ ...styles.muted, marginTop: 8 }}>Your notes are saved as you type.</p>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f2ede6" }}>
      <div style={styles.sidebar}>
        <div style={{ fontSize: 24, marginBottom: 4 }}>🌿</div>
        <div style={{ fontSize: 11, color: "#a09080", marginBottom: 24, textTransform: "uppercase", letterSpacing: 1 }}>
          Peaceful Life
        </div>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{ ...styles.navBtn, ...(activeSection === s.id ? styles.navBtnActive : {}) }}>
            <span style={{ marginRight: 8 }}>{s.icon}</span>{s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={{ ...styles.navBtn, color: "#b08060" }} onClick={() => setScreen("welcome")}>
          ← Revisit Welcome
        </button>
      </div>
      <div style={{ flex: 1, padding: "48px 40px", maxWidth: 700, margin: "0 auto" }}>
        {renderSection()}
      </div>
    </div>
  );
}
