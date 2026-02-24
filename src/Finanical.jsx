import { useState } from "react";
import { S } from "./styles";
import { EXPENSE_CATS, todayStr, monthKey, fmt, toNum } from "./constants";

export default function Financial({ db, persist }) {
  const fin = db.financial || { income: [], expenses: [], savings: [], debts: [], budgets: {}, note: "" };
  const upFin = (next) => persist({ ...db, financial: next });

  const [incForm, setIncForm] = useState({ source: "", amount: "" });
  const [expForm, setExpForm] = useState({ name: "", category: "Food", amount: "", date: todayStr() });
  const [savForm, setSavForm] = useState({ name: "", target: "", saved: "" });
  const [debtForm, setDebtForm] = useState({ name: "", total: "", paid: "" });
  const [budgetCat, setBudgetCat] = useState("Food");
  const [budgetAmt, setBudgetAmt] = useState("");
  const [tab, setTab] = useState("overview");

  const totalIncome = fin.income.reduce((s, i) => s + toNum(i.amount), 0);
  const totalExp = fin.expenses.filter(e => monthKey(e.date) === monthKey(todayStr())).reduce((s, e) => s + toNum(e.amount), 0);
  const totalSaved = fin.savings.reduce((s, g) => s + toNum(g.saved), 0);
  const totalDebt = fin.debts.reduce((s, d) => s + toNum(d.total) - toNum(d.paid), 0);
  const tabs = ["overview", "income", "expenses", "savings", "debts", "budget"];

  return (
    <div>
      <h2 style={S.sTitle}>🌱 Financial Calm</h2>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "6px 13px", borderRadius: 20, border: "1.5px solid", fontSize: 12, cursor: "pointer", fontFamily: "'Georgia',serif", textTransform: "capitalize", background: tab === t ? "#eef4ec" : "#fff", borderColor: tab === t ? "#5a8055" : "#d8d0c4", color: tab === t ? "#3a5a38" : "#6a5e50" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
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
            <textarea style={{ ...S.input, height: 100, resize: "vertical" }}
              placeholder="How does money feel right now? What intention am I setting this month?"
              value={fin.note} onChange={e => upFin({ ...fin, note: e.target.value })} />
          </div>
        </div>
      )}

      {tab === "income" && (
        <div>
          <div style={S.card2}>
            <label style={S.label}>Add Income Source</label>
            <div style={S.row}>
              <input style={{ ...S.input, flex: 2 }} placeholder="Source (e.g. Job, Freelance)" value={incForm.source} onChange={e => setIncForm(p => ({ ...p, source: e.target.value }))} />
              <input style={{ ...S.input, flex: 1 }} placeholder="$/month" value={incForm.amount} onChange={e => setIncForm(p => ({ ...p, amount: e.target.value }))} />
              <button style={S.btnSm} onClick={() => { if (!incForm.source || !incForm.amount) return; upFin({ ...fin, income: [...fin.income, { ...incForm, id: Date.now() }] }); setIncForm({ source: "", amount: "" }); }}>Add</button>
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

      {tab === "expenses" && (
        <div>
          <div style={S.card2}>
            <label style={S.label}>Log an Expense</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={S.input} placeholder="Description" value={expForm.name} onChange={e => setExpForm(p => ({ ...p, name: e.target.value }))} />
              <input style={S.input} placeholder="Amount $" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} />
              <select style={S.input} value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="date" style={S.input} value={expForm.date} onChange={e => setExpForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <button style={S.btnSm} onClick={() => { if (!expForm.name || !expForm.amount) return; upFin({ ...fin, expenses: [...fin.expenses, { ...expForm, id: Date.now() }] }); setExpForm({ name: "", category: "Food", amount: "", date: todayStr() }); }}>Add Expense</button>
          </div>
          <p style={{ ...S.muted, marginBottom: 8 }}>This month: {fmt(totalExp)}</p>
          {fin.expenses.slice().reverse().map(e => (
            <div key={e.id} style={{ ...S.entry, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><span style={S.tag}>{e.category}</span><div style={{ fontWeight: 600, marginTop: 4 }}>{e.name}</div><div style={S.muted}>{e.date}</div></div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 17, color: "#c0645a", fontWeight: 700 }}>{fmt(e.amount)}</div>
                <button style={{ ...S.btnDanger, marginTop: 4 }} onClick={() => upFin({ ...fin, expenses: fin.expenses.filter(x => x.id !== e.id) })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "savings" && (
        <div>
          <div style={S.card2}>
            <label style={S.label}>Add Savings Goal</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={S.input} placeholder="Goal name" value={savForm.name} onChange={e => setSavForm(p => ({ ...p, name: e.target.value }))} />
              <input style={S.input} placeholder="Target $" value={savForm.target} onChange={e => setSavForm(p => ({ ...p, target: e.target.value }))} />
              <input style={S.input} placeholder="Saved so far $" value={savForm.saved} onChange={e => setSavForm(p => ({ ...p, saved: e.target.value }))} />
            </div>
            <button style={S.btnSm} onClick={() => { if (!savForm.name || !savForm.target) return; upFin({ ...fin, savings: [...fin.savings, { ...savForm, id: Date.now() }] }); setSavForm({ name: "", target: "", saved: "" }); }}>Add Goal</button>
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
                <input style={{ ...S.input, width: 140, marginTop: 8 }} placeholder="Update saved $"
                  onBlur={e => { if (e.target.value) { upFin({ ...fin, savings: fin.savings.map(x => x.id === g.id ? { ...x, saved: e.target.value } : x) }); e.target.value = ""; } }} />
              </div>
            );
          })}
        </div>
      )}

      {tab === "debts" && (
        <div>
          <div style={S.card2}>
            <label style={S.label}>Add Debt</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={S.input} placeholder="Debt name" value={debtForm.name} onChange={e => setDebtForm(p => ({ ...p, name: e.target.value }))} />
              <input style={S.input} placeholder="Total owed $" value={debtForm.total} onChange={e => setDebtForm(p => ({ ...p, total: e.target.value }))} />
              <input style={S.input} placeholder="Paid so far $" value={debtForm.paid} onChange={e => setDebtForm(p => ({ ...p, paid: e.target.value }))} />
            </div>
            <button style={S.btnSm} onClick={() => { if (!debtForm.name || !debtForm.total) return; upFin({ ...fin, debts: [...fin.debts, { ...debtForm, id: Date.now() }] }); setDebtForm({ name: "", total: "", paid: "" }); }}>Add Debt</button>
          </div>
          {fin.debts.map(d => {
            const pct = (toNum(d.paid) / toNum(d.total)) * 100;
            return (
              <div key={d.id} style={S.entry}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600, color: "#3a5a38" }}>{d.name}</div>
                  <button style={S.btnDanger} onClick={() => upFin({ ...fin, debts: fin.debts.filter(x => x.id !== d.id) })}>Remove</button>
                </div>
                <div style={{ fontSize: 13, color: "#a09880" }}>{fmt(toNum(d.total) - toNum(d.paid))} remaining — {Math.round(pct)}% paid</div>
                <div style={S.progress}><div style={S.progressBar(pct, "#9e7a5a")} /></div>
                <input style={{ ...S.input, width: 160, marginTop: 8 }} placeholder="Update paid amount $"
                  onBlur={e => { if (e.target.value) { upFin({ ...fin, debts: fin.debts.map(x => x.id === d.id ? { ...x, paid: e.target.value } : x) }); e.target.value = ""; } }} />
              </div>
            );
          })}
        </div>
      )}

      {tab === "budget" && (
        <div>
          <div style={S.card2}>
            <label style={S.label}>Set Monthly Budget by Category</label>
            <div style={S.row}>
              <select style={{ ...S.input, flex: 1 }} value={budgetCat} onChange={e => setBudgetCat(e.target.value)}>
                {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input style={{ ...S.input, flex: 1 }} placeholder="Budget $" value={budgetAmt} onChange={e => setBudgetAmt(e.target.value)} />
              <button style={S.btnSm} onClick={() => { if (!budgetAmt) return; upFin({ ...fin, budgets: { ...fin.budgets, [budgetCat]: budgetAmt } }); setBudgetAmt(""); }}>Set</button>
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
