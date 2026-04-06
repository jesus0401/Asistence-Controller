import { useState, useRef } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { PLANS_CATALOG } from "../constants/mockData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

/* ─── Helpers ─────────────────────────────────────── */
const padNum  = n => String(n).padStart(3, "0");
const nowDate = () => new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
const nowTime = () => new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

const PAYMENT_METHODS = ["Efectivo", "Yape", "Plin", "Transferencia", "Tarjeta débito", "Tarjeta crédito"];
const CONCEPTS = ["Membresía Mensual", "Membresía Trimestral", "Membresía Semestral", "Membresía Anual", "Inscripción", "Clases personalizadas", "Otro"];

/* ─── Initial mock receipts ───────────────────────── */
const MOCK_RECEIPTS = [
  { id: 1,  number: "001", client: "Carlos Pérez",   concept: "Membresía Mensual",    amount: 70,  method: "Efectivo",  date: "25/03/2025", time: "08:20", status: "Emitida" },
  { id: 2,  number: "002", client: "Ana Gómez",      concept: "Membresía Trimestral", amount: 185, method: "Yape",      date: "24/03/2025", time: "10:15", status: "Emitida" },
  { id: 3,  number: "003", client: "Luis Torres",    concept: "Membresía Mensual",    amount: 70,  method: "Plin",      date: "23/03/2025", time: "07:50", status: "Emitida" },
  { id: 4,  number: "004", client: "María Ruiz",     concept: "Membresía Anual",      amount: 600, method: "Transferencia", date: "22/03/2025", time: "11:30", status: "Emitida" },
  { id: 5,  number: "005", client: "Laura Silva",    concept: "Clases personalizadas", amount: 120, method: "Efectivo", date: "21/03/2025", time: "09:00", status: "Anulada" },
];

/* ─── Print styles injected into head ─────────────── */
function injectPrintStyles() {
  if (document.getElementById("boleta-print-styles")) return;
  const style = document.createElement("style");
  style.id = "boleta-print-styles";
  style.innerHTML = `
    @media print {
      body > * { display: none !important; }
      #boleta-printable { display: block !important; }
      #boleta-printable { position: fixed; top: 0; left: 0; width: 100%; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── Boleta Preview Component ────────────────────── */
function BoletaPreview({ receipt, gymName = "SOLGYM 2829", gymRuc = "20123456789", gymAddress = "Av. Principal 2829, Lima", printRef }) {
  const planPrice = PLANS_CATALOG.find(p => receipt.concept?.includes(p.name))?.price ?? `S/. ${receipt.amount?.toFixed(2)}`;
  const igv = (receipt.amount * 0.18).toFixed(2);
  const subtotal = (receipt.amount - +igv).toFixed(2);

  return (
    <div ref={printRef} id="boleta-printable" style={{
      background: "#fff", color: "#111", fontFamily: "Nunito, sans-serif",
      maxWidth: "360px", margin: "0 auto", padding: "24px",
      border: "1px solid #ddd", borderRadius: "12px",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: "2px solid #F5B800", paddingBottom: "14px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
          <svg width="24" height="24" viewBox="0 0 44 44" fill="none">
            <rect x="2" y="16" width="10" height="12" rx="3" fill="#F5B800"/>
            <rect x="32" y="16" width="10" height="12" rx="3" fill="#F5B800"/>
            <rect x="12" y="19" width="20" height="6" rx="3" fill="#F5B800"/>
          </svg>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "26px", letterSpacing: "3px", color: "#F5B800" }}>{gymName}</span>
        </div>
        <p style={{ margin: "2px 0", fontSize: "11px", color: "#555" }}>RUC: {gymRuc}</p>
        <p style={{ margin: "2px 0", fontSize: "11px", color: "#555" }}>{gymAddress}</p>
        <div style={{ marginTop: "10px", background: "#F5B800", borderRadius: "6px", padding: "4px 0" }}>
          <p style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: "18px", letterSpacing: "2px", color: "#000" }}>
            BOLETA DE VENTA ELECTRÓNICA
          </p>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: "800", color: "#000" }}>B001-{padNum(receipt.number)}</p>
        </div>
      </div>

      {/* Date & payment */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px", fontSize: "12px" }}>
        <div>
          <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>FECHA</p>
          <p style={{ color: "#111", margin: 0, fontWeight: "600" }}>{receipt.date}</p>
        </div>
        <div>
          <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>HORA</p>
          <p style={{ color: "#111", margin: 0, fontWeight: "600" }}>{receipt.time}</p>
        </div>
        <div>
          <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>MEDIO DE PAGO</p>
          <p style={{ color: "#111", margin: 0, fontWeight: "600" }}>{receipt.method}</p>
        </div>
        <div>
          <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>ESTADO</p>
          <p style={{ color: receipt.status === "Anulada" ? "#ef4444" : "#16a34a", margin: 0, fontWeight: "700" }}>{receipt.status}</p>
        </div>
      </div>

      {/* Client */}
      <div style={{ background: "#f9f9f9", borderRadius: "8px", padding: "10px 12px", marginBottom: "14px" }}>
        <p style={{ color: "#888", margin: "0 0 2px", fontSize: "10px", fontWeight: "700" }}>CLIENTE</p>
        <p style={{ color: "#111", margin: 0, fontWeight: "700", fontSize: "14px" }}>{receipt.client}</p>
      </div>

      {/* Items */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "14px", fontSize: "12px" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #F5B800" }}>
            <th style={{ textAlign: "left", padding: "6px 4px", color: "#555", fontWeight: "700", fontSize: "10px" }}>DESCRIPCIÓN</th>
            <th style={{ textAlign: "center", padding: "6px 4px", color: "#555", fontWeight: "700", fontSize: "10px" }}>CANT.</th>
            <th style={{ textAlign: "right", padding: "6px 4px", color: "#555", fontWeight: "700", fontSize: "10px" }}>PRECIO</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <td style={{ padding: "8px 4px", color: "#111", fontWeight: "600" }}>{receipt.concept}</td>
            <td style={{ padding: "8px 4px", textAlign: "center", color: "#555" }}>1</td>
            <td style={{ padding: "8px 4px", textAlign: "right", color: "#111", fontWeight: "700" }}>S/. {(+receipt.amount).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "4px" }}>
          <span>Subtotal (sin IGV):</span><span>S/. {subtotal}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#555", marginBottom: "8px" }}>
          <span>IGV (18%):</span><span>S/. {igv}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", background: "#F5B800", borderRadius: "6px", padding: "8px 12px" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "16px", letterSpacing: "1px" }}>TOTAL A PAGAR:</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "20px", letterSpacing: "1px" }}>S/. {(+receipt.amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "16px", textAlign: "center", borderTop: "1px dashed #ddd", paddingTop: "12px" }}>
        <p style={{ color: "#888", fontSize: "10px", margin: "0 0 4px" }}>Representación impresa de Boleta de Venta Electrónica</p>
        <p style={{ color: "#888", fontSize: "10px", margin: 0 }}>Autorizado por SUNAT — Serie B001</p>
        <p style={{ color: "#F5B800", fontSize: "12px", fontWeight: "700", margin: "8px 0 0" }}>¡Gracias por tu preferencia! 💪</p>
      </div>
    </div>
  );
}

/* ─── New Receipt Form ────────────────────────────── */
function NewReceiptModal({ users, nextNumber, onClose, onSave }) {
  const [form, setForm] = useState({
    client: users[0]?.name ?? "",
    concept: "Membresía Mensual",
    amount: "70",
    method: "Efectivo",
    notes: "",
  });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Auto-fill amount when concept matches a plan
  const handleConcept = e => {
    const val = e.target.value;
    const plan = PLANS_CATALOG.find(p => val.includes(p.name));
    setForm(prev => ({ ...prev, concept: val, amount: plan ? plan.price.replace("S/. ", "") : prev.amount }));
  };

  const preview = {
    number: nextNumber,
    client: form.client,
    concept: form.concept,
    amount: +form.amount || 0,
    method: form.method,
    date: nowDate(),
    time: nowTime(),
    status: "Emitida",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px", overflowY: "auto" }}>
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Form */}
        <div style={{ ...card, flex: "1", minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px", letterSpacing: "1px" }}>NUEVA BOLETA</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Cliente</label>
              <select value={form.client} onChange={set("client")}
                style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}
              >
                {users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                <option value="Cliente externo">Cliente externo</option>
              </select>
            </div>

            <div>
              <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Concepto</label>
              <select value={form.concept} onChange={handleConcept}
                style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}
              >
                {CONCEPTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Monto (S/.)" type="number" value={form.amount} onChange={set("amount")} placeholder="70" />
              <div>
                <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Método de pago</label>
                <select value={form.method} onChange={set("method")}
                  style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <Input label="Notas (opcional)" value={form.notes} onChange={set("notes")} placeholder="Observaciones adicionales" />

            {/* Monto preview */}
            {form.amount && (
              <div style={{ background: T.yellowGlow, border: `1px solid ${T.yellow}44`, borderRadius: "10px", padding: "14px", textAlign: "center" }}>
                <p style={{ color: T.textMute, fontSize: "10px", margin: "0 0 4px", letterSpacing: "1px" }}>TOTAL A COBRAR</p>
                <p style={{ color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "36px", margin: 0, letterSpacing: "2px" }}>
                  S/. {(+form.amount).toFixed(2)}
                </p>
                <p style={{ color: T.textMute, fontSize: "10px", margin: "4px 0 0" }}>{form.method}</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
            <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
            <Btn onClick={() => { onSave(preview); onClose(); }} disabled={!form.client || !form.amount || +form.amount <= 0} full>
              ✅ Emitir boleta
            </Btn>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          <p style={{ color: T.textMute, fontSize: "11px", letterSpacing: "1px", margin: "0 0 10px", fontWeight: "700" }}>VISTA PREVIA</p>
          <BoletaPreview receipt={preview} />
        </div>
      </div>
    </div>
  );
}

/* ─── Main Billing Page ───────────────────────────── */
export default function Billing({ users = [] }) {
  const [receipts,    setReceipts]    = useState(MOCK_RECEIPTS);
  const [showNew,     setShowNew]     = useState(false);
  const [viewing,     setViewing]     = useState(null);  // receipt to preview/print
  const [search,      setSearch]      = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const printRef = useRef(null);

  const nextNumber = receipts.length + 1;

  const filtered = receipts.filter(r => {
    const q = search.toLowerCase();
    const matchQ = r.client.toLowerCase().includes(q) || r.concept.toLowerCase().includes(q) || r.number.includes(q);
    const matchS  = filterStatus === "all" || r.status === filterStatus;
    return matchQ && matchS;
  });

  const totalEmitidas = receipts.filter(r => r.status === "Emitida").reduce((s, r) => s + r.amount, 0);
  const totalMes      = receipts.filter(r => r.status === "Emitida").length;
  const totalAnuladas = receipts.filter(r => r.status === "Anulada").length;

  const saveReceipt = receipt => {
    setReceipts(prev => [{ ...receipt, id: Date.now() }, ...prev]);
    setViewing(receipt);
  };

  const annulReceipt = id => {
    setReceipts(prev => prev.map(r => r.id === id ? { ...r, status: "Anulada" } : r));
    if (viewing?.id === id) setViewing(v => ({ ...v, status: "Anulada" }));
  };

  const handlePrint = () => {
    injectPrintStyles();
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>BOLETAS DE VENTA</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Emite y gestiona comprobantes de pago</p>
        </div>
        <Btn onClick={() => setShowNew(true)}>🧾 Nueva boleta</Btn>
      </div>

      {/* Summary stats */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {[
          { label: "Total cobrado (mes)",    value: `S/. ${totalEmitidas.toFixed(2)}`, color: T.yellow,   icon: "💰" },
          { label: "Boletas emitidas",       value: totalMes,                           color: T.success,  icon: "🧾" },
          { label: "Boletas anuladas",       value: totalAnuladas,                      color: T.danger,   icon: "❌" },
          { label: "Último comprobante",     value: `B001-${padNum(receipts[0]?.number ?? 0)}`, color: T.info, icon: "📋" },
        ].map(s => (
          <div key={s.label} style={{ ...card, flex: "1", minWidth: "140px", borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: T.textSub, fontSize: "11px", margin: 0 }}>{s.label}</p>
                <p style={{ color: T.text, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", margin: "4px 0 0", letterSpacing: "1px" }}>{s.value}</p>
              </div>
              <span style={{ fontSize: "22px", opacity: 0.8 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Left: list */}
        <div style={{ flex: "2", minWidth: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Filters */}
          <div style={{ ...card, padding: "14px 18px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente, concepto..."
                style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 12px 9px 32px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}
                onFocus={e => e.target.style.borderColor = T.yellow} onBlur={e => e.target.style.borderColor = T.border}
              />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              style={{ background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 14px", color: T.text, fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
            >
              <option value="all">Todos</option>
              <option value="Emitida">Emitidas</option>
              <option value="Anulada">Anuladas</option>
            </select>
            <span style={{ color: T.textSub, fontSize: "12px" }}>{filtered.length} boletas</span>
          </div>

          {/* Receipts table */}
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
                    style={{ borderBottom: `1px solid ${T.border}`, cursor: "pointer", transition: "background 0.12s", background: viewing?.id === r.id ? T.yellowGlow : "transparent" }}
                    onClick={() => setViewing(r)}
                    onMouseEnter={e => { if (viewing?.id !== r.id) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                    onMouseLeave={e => { if (viewing?.id !== r.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "13px" }}>B001-{padNum(r.number)}</span>
                      <p style={{ color: T.textMute, fontSize: "10px", margin: "1px 0 0" }}>{r.date}</p>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Avatar name={r.client} size={26} />
                        <span style={{ color: T.text, fontSize: "12px" }}>{r.client}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.textSub, fontSize: "12px", maxWidth: "140px" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{r.concept}</span>
                    </td>
                    <td style={{ padding: "12px 14px", color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "15px" }}>
                      S/. {r.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 14px", color: T.textSub, fontSize: "11px" }}>{r.method}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge text={r.status} color={r.status === "Emitida" ? T.success : T.danger} />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: "5px" }} onClick={e => e.stopPropagation()}>
                        <Btn size="sm" variant="ghost" onClick={() => setViewing(r)}>Ver</Btn>
                        {r.status === "Emitida" && (
                          <Btn size="sm" variant="danger" onClick={() => annulReceipt(r.id)}>Anular</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>Sin boletas que mostrar</div>
            )}
          </div>
        </div>

        {/* Right: preview panel */}
        <div style={{ flex: "1", minWidth: "280px" }}>
          {viewing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "sticky", top: "0" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn variant="ghost" onClick={handlePrint} full>🖨️ Imprimir</Btn>
                {viewing.status === "Emitida" && (
                  <Btn variant="danger" onClick={() => annulReceipt(viewing.id)}>Anular</Btn>
                )}
              </div>
              <BoletaPreview receipt={viewing} printRef={printRef} />
            </div>
          ) : (
            <div style={{ ...card, textAlign: "center", padding: "40px 20px" }}>
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🧾</p>
              <p style={{ color: T.textMute, fontSize: "13px", margin: 0 }}>Selecciona una boleta para ver el detalle</p>
              <div style={{ marginTop: "16px" }}>
                <Btn variant="ghost" onClick={() => setShowNew(true)} full>+ Emitir nueva boleta</Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New receipt modal */}
      {showNew && (
        <NewReceiptModal
          users={users}
          nextNumber={nextNumber}
          onClose={() => setShowNew(false)}
          onSave={saveReceipt}
        />
      )}
    </div>
  );
}