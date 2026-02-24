import { useState } from "react";
import { S } from "./styles";
import { MOODS, todayStr, monthKey } from "./constants";

export default function Journal({ db, persist }) {
  const entries = db.journal_entries || {};
  const [selDate, setSelDate] = useState(todayStr());
  const entry = entries[selDate] || { mood: "", text: "" };

  const saveEntry = (field, val) => {
    persist({ ...db, journal_entries: { ...entries, [selDate]: { ...entry, [field]: val } } });
  };

  const months = [...new Set(Object.keys(entries).map(d => monthKey(d)))].sort().reverse();

  return (
    <div>
      <h2 style={S.sTitle}>📓 Daily Journal</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
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
              value={entry.text} onChange={e => saveEntry("text", e.target.value)} />
            <p style={{ ...S.muted, marginTop: 6 }}>Saved automatically as you type.</p>
          </div>
        </div>
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
