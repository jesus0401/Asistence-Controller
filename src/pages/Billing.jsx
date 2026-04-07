import { useState, useEffect, useRef } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { receiptsService, membersService, plansService } from "../api/services";
import Avatar from "../components/ui/Avatar";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import Input  from "../components/ui/Input";

const padNum  = n => String(n).padStart(3, "0");
const nowDate = () => new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
const nowTime = () => new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

const PAYMENT_METHODS = ["Efectivo", "Yape", "Plin", "Transferencia", "Tarjeta débito", "Tarjeta crédito"];
const CONCEPTS = ["Membresía Mensual", "Membresía Trimestral", "Membresía Semestral", "Membresía Anual", "Inscripción", "Clases personalizadas", "Otro"];

const METHOD_MAP = { "Efectivo": "EFECTIVO", "Yape": "YAPE", "Plin": "PLIN", "Transferencia": "TRANSFERENCIA", "Tarjeta débito": "TARJETA_DEBITO", "Tarjeta crédito": "TARJETA_CREDITO" };

function BoletaPreview({ receipt }) {
  const igv      = (receipt.amount * 0.18).toFixed(2);
  const subtotal = (receipt.amount - +igv).toFixed(2);
  return (
    <div style={{ background: "#fff", color: "#111", fontFamily: "Nunito, sans-serif", maxWidth: "360px", margin: "0 auto", padding: "24px", border: "1px solid #ddd", borderRadius: "12px" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #F5B800", paddingBottom: "14px", marginBottom: "14px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "3px", color: "#F5B800", margin: "0 0 4px" }}>SOLGYM 2829</h2>
        <div style={{ marginTop: "10px", background: "#F5B800", borderRadius: "6px", padding: "4px 0" }}>
          <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "2px", color: "#000" }}>BOLETA DE VENTA ELECTRÓNICA</p>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#000" }}>B001-{padNum(receipt.number ?? "000")}</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px", fontSize: "12px" }}>
        <div><p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>FECHA</p><p style={{ color: "#111", margin: 0, fontWeight: "600" }}>{receipt.date ?? nowDate()}</p></div>
        <div><p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>MÉTODO</p><p style={{ color: "#111", margin: 0, fontWeight: "600" }}>{receipt.method ?? receipt.paymentMethod}</p></div>
      </div>
      <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
        <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>CLIENTE</p>
        <p style={{ color: "#111", margin: 0, fontWeight: "700", fontSize: "14px" }}>{receipt.client ?? receipt.clientName}</p>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px", fontSize: "12px" }}>
        <thead><tr style={{ borderBottom: "2px solid #F5B800" }}>
          <th style={{ textAlign: "left", padding: "6px 4px", color: "#555", fontWeight: "700", fontSize: "10px" }}>DESCRIPCIÓN</th>
          <th style={{ textAlign: "right", padding: "6px 4px", color: "#555", fontWeight: "700", fontSize: "10px" }}>PRECIO</th>
        </tr></thead>
        <tbody><tr style={{ borderBottom: "1px solid #eee" }}>
          <td style={{ padding: "8px 4px", color: "#111", fontWeight: "600" }}>{receipt.concept}</td>
          <td style={{ padding: "8px 4px", textAlign: "right", color: "#111", fontWeight: "700" }}>S/. {Number(receipt.amount).toFixed(2)}</td>
        </tr></tbody>
      </table>
      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "4px" }}>
          <span>Subtotal (sin IGV):</span><span>S/. {subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "8px" }}>
          <span>IGV (18%):</span><span>S/. {igv}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", background: "#F5B800", borderRadius: "6px", padding: "8px 12px" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px" }}>TOTAL:</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px" }}>S/. {Number(receipt.amount).toFixed(2)}</span>
        </div>
      </div>
      <div style={{ marginTop: "16px", textAlign: "center", borderTop: "1px dashed #ddd", paddingTop: "12px" }}>
        <p style={{ color: "#F5B800", fontSize: "12px", fontWeight: "700", margin: 0 }}>¡Gracias por tu preferencia! 💪</p>
      </div>
    </div>
  );
}

function NewReceiptModal({ members, plans, nextNumber, onClose, onSave }) {
  const [form, setForm] = useState({ client: members[0]?.name ?? "", memberId: members[0]?.id ?? null, concept: "Membresía Mensual", amount: "70", method: "Efectivo" });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleConcept = e => {
    const val  = e.target.value;
    const plan = plans.find(p => val.includes(p.name));
    setForm(prev => ({ ...prev, concept: val, amount: plan ? Number(plan.price).toFixed(0) : prev.amount }));
  };

  const handleMember = e => {
    const member = members.find(m => m.name === e.target.value);
    setForm(p => ({ ...p, client: e.target.value, memberId: member?.id ?? null }));
  };

  const preview = { number: nextNumber, client: form.client, concept: form.concept, amount: +form.amount || 0, method: form.method, date: nowDate(), status: "Emitida" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ ...card, flex: "1", minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px" }}>NUEVA BOLETA</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Cliente</label>
              <select value={form.client} onChange={handleMember}
                style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                <option value="Cliente externo">Cliente externo</option>
              </select>
            </div>
            <div>
              <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Concepto</label>
              <select value={form.concept} onChange={handleConcept}
                style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                {CONCEPTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Monto (S/.)" type="number" value={form.amount} onChange={set("amount")} placeholder="70" />
              <div>
                <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Método de pago</label>
                <select value={form.method} onChange={set("method")}
                  style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            {form.amount && (
              <div style={{ background: T.yellowGlow, border: `1px solid ${T.yellow}44`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                <p style={{ color: T.textMute, fontSize: "10px", margin: "0 0 4px" }}>TOTAL A COBRAR</p>
                <p style={{ color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "36px", margin: 0 }}>S/. {(+form.amount).toFixed(2)}</p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
            <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
            <Btn onClick={() => onSave(form)} disabled={!form.client || !form.amount || +form.amount <= 0} full>✅ Emitir boleta</Btn>
          </div>
        </div>
        <div style={{ flex: "1", minWidth: "280px" }}>
          <p style={{ color: T.textMute, fontSize: "11px", letterSpacing: "1px", margin: "0 0 10px", fontWeight: "700" }}>VISTA PREVIA</p>
          <BoletaPreview receipt={preview} />
        </div>
      </div>
    </div>
  );
}

export default function Billing() {
  const [receipts,     setReceipts]     = useState([]);
  const [members,      setMembers]      = useState([]);
  const [plans,        setPlans]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [showNew,      setShowNew]      = useState(false);
  const [viewing,      setViewing]      = useState(null);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const load = async () => {
    const [r, m, p] = await Promise.all([receiptsService.getAll(), membersService.getAll(), plansService.getAll()]);
    setReceipts(r); setMembers(m); setPlans(p);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = receipts.filter(r => {
    const q = search.toLowerCase();
    const matchQ = r.clientName?.toLowerCase().includes(q) || r.concept?.toLowerCase().includes(q) || r.number?.includes(q);
    const matchS  = filterStatus === "all" || r.status === filterStatus;
    return matchQ && matchS;
  });

  const totalEmitidas = receipts.filter(r => r.status === "EMITIDA").reduce((s, r) => s + Number(r.amount), 0);

  const saveReceipt = async (form) => {
    try {
      const member = members.find(m => m.name === form.client);
      await receiptsService.create({
        clientName:    form.client,
        memberId:      member?.id ?? null,
        concept:       form.concept,
        amount:        +form.amount,
        paymentMethod: METHOD_MAP[form.method] ?? "EFECTIVO",
      });
      setShowNew(false);
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  const annulReceipt = async (id) => {
    try { await receiptsService.annul(id); await load(); } catch (e) { alert("Error: " + e.message); }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><p style={{ color: T.textMute }}>Cargando boletas...</p></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>BOLETAS DE VENTA</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Emite y gestiona comprobantes de pago</p>
        </div>
        <Btn onClick={() => setShowNew(true)}>🧾 Nueva boleta</Btn>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {[
          { label: "Total cobrado",    value: `S/. ${totalEmitidas.toFixed(2)}`,                              color: T.yellow,  icon: "💰" },
          { label: "Boletas emitidas", value: receipts.filter(r => r.status === "EMITIDA").length,            color: T.success, icon: "🧾" },
          { label: "Boletas anuladas", value: receipts.filter(r => r.status === "ANULADA").length,            color: T.danger,  icon: "❌" },
        ].map(s => (
          <div key={s.label} style={{ ...card, flex: "1", minWidth: "140px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: T.textSub, fontSize: "11px", margin: 0 }}>{s.label}</p>
                <p style={{ color: T.text, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", margin: "4px 0 0" }}>{s.value}</p>
              </div>
              <span style={{ fontSize: "22px" }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "2", minWidth: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ ...card, padding: "14px 18px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente, concepto..."
                style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 12px 9px 32px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}
                onFocus={e => e.target.style.borderColor = T.yellow} onBlur={e => e.target.style.borderColor = T.border} />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 14px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
              <option value="all">Todos</option>
              <option value="EMITIDA">Emitidas</option>
              <option value="ANULADA">Anuladas</option>
            </select>
          </div>

          <div style={{ ...card, padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                  {["N°", "CLIENTE", "CONCEPTO", "MONTO", "MÉTODO", "ESTADO", ""].map(h => (
                    <th key={h} style={{ color: T.textMute, fontSize: "10px", textAlign: "left", padding: "13px 14px", fontWeight: "700", letterSpacing: "0.8px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}
                    style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer", background: viewing?.id === r.id ? T.yellowGlow : "transparent" }}
                    onClick={() => setViewing(r)}
                    onMouseEnter={e => { if (viewing?.id !== r.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if (viewing?.id !== r.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "13px" }}>B001-{padNum(r.number)}</span>
                      <p style={{ color: T.textMute, fontSize: "10px", margin: "1px 0 0" }}>{new Date(r.issuedAt).toLocaleDateString("es-PE")}</p>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Avatar name={r.clientName} size={26} />
                        <span style={{ color: T.text, fontSize: "12px" }}>{r.clientName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.textSub, fontSize: "12px", maxWidth: "140px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{r.concept}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "15px" }}>
                      S/. {Number(r.amount).toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 14px", color: T.textSub, fontSize: "11px" }}>{r.paymentMethod}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge text={r.status} color={r.status === "EMITIDA" ? T.success : T.danger} />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: "5px" }} onClick={e => e.stopPropagation()}>
                        <Btn size="sm" variant="ghost" onClick={() => setViewing(r)}>Ver</Btn>
                        {r.status === "EMITIDA" && <Btn size="sm" variant="danger" onClick={() => annulReceipt(r.id)}>Anular</Btn>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>Sin boletas</div>}
          </div>
        </div>

        <div style={{ flex: "1", minWidth: "280px" }}>
          {viewing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "sticky", top: 0 }}>
              <Btn variant="ghost" onClick={() => window.print()} full>🖨️ Imprimir</Btn>
              <BoletaPreview receipt={{ ...viewing, client: viewing.clientName, method: viewing.paymentMethod, date: new Date(viewing.issuedAt).toLocaleDateString("es-PE") }} />
            </div>
          ) : (
            <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🧾</p>
              <p style={{ color: T.textMute, fontSize: "13px", margin: 0 }}>Selecciona una boleta para ver el detalle</p>
              <div style={{ marginTop: "16px" }}><Btn variant="ghost" onClick={() => setShowNew(true)} full>+ Emitir nueva boleta</Btn></div>
            </div>
          )}
        </div>
      </div>

      {showNew && <NewReceiptModal members={members} plans={plans} nextNumber={receipts.length + 1} onClose={() => setShowNew(false)} onSave={saveReceipt} />}
    </div>
  );
}