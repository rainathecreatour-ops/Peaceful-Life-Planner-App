import { useState } from "react";
import { S } from "./styles";
import { VALID_LICENSE_KEYS, SECTIONS, SECTION_CONTENT, STORAGE_KEY, todayStr } from "./constants";
import Journal from "./Journal";
import Financial from "./Financial";

const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
        {!wDone ? (
          <>
            <p style={{ ...S.body, marginBottom: 20 }}>Welcome. This season is about <em>peace, clarity, and intention</em>.<br /><br /><span style={{ color: "#a09880" }}>Answer only what feels easy:</span></p>
            {welcomeQs.map((q, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={S.label}>{i + 1}. {q}</label>
                <textarea style={{ ...S.input, height: 64, resize: "vertical" }} placeholder="Take your time..."
                  value={wAnswers[i]} onChange={e => { const a = [...wAnswers]; a[i] = e.target.value; setWAnswers(a); }} />
              </div>
            ))}
            <button style={S.btn} onClick={() => { if (wAnswers.some(a => a.trim())) setWDone(true); }}>Begin My Journey →</button>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <p style={{ ...S.body, marginBottom: 20 }}>Thank you for trusting this space. What you shared is the foundation of everything we'll build — slowly, intentionally, on your terms.</p>
            <button style={S.btn} onClick={() => setScreen("main")}>Enter Your Sanctuary →</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSection = () => {
    if (active === "journal") return <Journal db={db} persist={persist} />;
    if (active === "financial") return <Financial db={db} persist={persist} />;

    if (active === "memories") {
      const memories = get("memories", []);
      const [draft, setDraft] = useState({ title: "", note: "", date: todayStr() });
      return (
        <div>
          <h2 style={S.sTitle}>📖 Memory Keeper</h2>
          <div style={S.card2}>
            <input style={S.input} placeholder="Memory title..." value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} />
            <input type="date" style={{ ...S.input, marginTop: 8 }} value={draft.date} onChange={e => setDraft(p => ({ ...p, date: e.target.value }))} />
            <textarea style={{ ...S.input, height: 80, marginTop: 8, resize: "vertical" }} placeholder="What made this moment special..."
              value={draft.note} onChange={e => setDraft(p => ({ ...p, note: e.target.value }))} />
            <button style={{ ...S.btnSm, marginTop: 10 }} onClick={() => { if (!draft.title) return; persist({ ...db, memories: [...memories, { ...draft, id: Date.now() }] }); setDraft({ title: "", note: "", date: todayStr() }); }}>Save Memory</button>
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

    if (active === "reset") {
      const entries = get("resets", []);
      const [draft, setDraft] = useState({ wins: "", release: "", intention: "" });
      return (
        <div>
          <h2 style={S.sTitle}>🌙 Weekly Reset & Reflection</h2>
          <div style={S.card2}>
            {[["wins", "What went well this week?"], ["release", "What am I releasing without guilt?"], ["intention", "My gentle intention for next week..."]].map(([k, l]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <label style={S.label}>{l}</label>
                <textarea style={{ ...S.input, height: 64, resize: "vertical" }} value={draft[k]}
                  onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <button style={S.btnSm} onClick={() => { if (!draft.wins && !draft.release && !draft.intention) return; persist({ ...db, resets: [...entries, { ...draft, date: todayStr(), id: Date.now() }] }); setDraft({ wins: "", release: "", intention: "" }); }}>Save This Reset</button>
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

    if (active === "future") {
      const letters = get("letters", []);
      const [draft, setDraft] = useState("");
      return (
        <div>
          <h2 style={S.sTitle}>💌 Future Self Letters</h2>
          <div style={S.card2}>
            <textarea style={{ ...S.input, height: 160, resize: "vertical" }} placeholder="Dear future me..."
              value={draft} onChange={e => setDraft(e.target.value)} />
            <button style={{ ...S.btnSm, marginTop: 10 }} onClick={() => { if (!draft.trim()) return; persist({ ...db, letters: [...letters, { text: draft, date: todayStr(), id: Date.now() }] }); setDraft(""); }}>Seal This Letter</button>
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

    const sc = SECTION_CONTENT[active];
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
        {SECTIONS.map(s => (
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
