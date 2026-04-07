import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { plansService, membersService } from "../api/services";
import Avatar from "../components/ui/Avatar";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import Input  from "../components/ui/Input";

const planColor = p => ({ Mensual: T.yellow, Trimestral: T.info, Semestral: "#A78BFA", Anual: T.success }[p] || T.textSub);

/* ── Modal crear/editar plan ── */
function PlanModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(
    plan
      ? { name: plan.name, price: String(plan.price), durationDays: String(plan.durationDays), description: plan.description ?? "" }
      : { name: "", price: "", durationDays: "", description: "" }
  );
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
      <div style={{ ...card, width: "100%", maxWidth: "420px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px", letterSpacing: "1px" }}>
            {plan ? "EDITAR PLAN" : "NUEVO PLAN"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Input label="Nombre del plan" value={form.name} onChange={set("name")} placeholder="Ej: Mensual, Trimestral..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Precio (S/.)" type="number" value={form.price} onChange={set("price")} placeholder="70" />
            <Input label="Duración (días)" type="number" value={form.durationDays} onChange={set("durationDays")} placeholder="30" />
          </div>
          <Input label="Descripción (opcional)" value={form.description} onChange={set("description")} placeholder="Descripción del plan" />

          {/* Preview */}
          {form.name && form.price && (
            <div style={{ background: T.dark3, borderRadius: "10px", padding: "14px", border: `1px solid ${planColor(form.name)}44` }}>
              <p style={{ color: T.textMute, fontSize: "10px", margin: "0 0 6px", letterSpacing: "1px" }}>VISTA PREVIA</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Badge text={form.name} color={planColor(form.name)} />
                  <p style={{ color: T.text, fontFamily: "Bebas Neue, sans-serif", fontSize: "24px", margin: "6px 0 0" }}>S/. {Number(form.price).toFixed(2)}</p>
                  {form.durationDays && <p style={{ color: T.textSub, fontSize: "12px", margin: "2px 0 0" }}>por {form.durationDays} días</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
          <Btn onClick={() => onSave(form)} disabled={!form.name || !form.price || !form.durationDays} full>
            {plan ? "Guardar cambios" : "Crear plan"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function Plans() {
  const [plans,      setPlans]      = useState([]);
  const [members,    setMembers]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);   // null | "new" | plan obj
  const [delConfirm, setDelConfirm] = useState(null);

  const load = async () => {
    const [p, m] = await Promise.all([plansService.getAll(), membersService.getAll()]);
    setPlans(p); setMembers(m);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const savePlan = async (form) => {
    try {
      const data = { name: form.name, price: +form.price, durationDays: +form.durationDays, description: form.description || null };
      if (modal?.id) await plansService.update(modal.id, data);
      else            await plansService.create(data);
      setModal(null);
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  const deletePlan = async (id) => {
    try {
      await plansService.update(id, { active: false });
      setDelConfirm(null);
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: T.textMute }}>Cargando planes...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>GESTIÓN DE PLANES</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Administra los planes de membresía del gimnasio</p>
        </div>
        <Btn onClick={() => setModal("new")}>+ Nuevo Plan</Btn>
      </div>

      {/* Plan cards */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {plans.map(p => {
          const count = members.filter(m => m.plan === p.name).length;
          const color = planColor(p.name);
          return (
            <div key={p.id} style={{ ...card, flex: "1", minWidth: "180px", borderTop: `3px solid ${color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <Badge text={p.name} color={color} />
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => setModal(p)}
                    style={{ background: "none", border: "none", color: T.textMute, cursor: "pointer", fontSize: "14px" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.yellow}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMute}>
                    ✏️
                  </button>
                  <button onClick={() => setDelConfirm(p)}
                    style={{ background: "none", border: "none", color: T.textMute, cursor: "pointer", fontSize: "14px" }}
                    onMouseEnter={e => e.currentTarget.style.color = T.danger}
                    onMouseLeave={e => e.currentTarget.style.color = T.textMute}>
                    🗑
                  </button>
                </div>
              </div>
              <p style={{ color: T.text, fontSize: "28px", fontWeight: "400", margin: "0 0 2px", fontFamily: "Bebas Neue, sans-serif" }}>
                S/. {Number(p.price).toFixed(2)}
              </p>
              <p style={{ color: T.textSub, fontSize: "12px", margin: "0 0 14px" }}>por {p.durationDays} días</p>
              {p.description && <p style={{ color: T.textMute, fontSize: "11px", margin: "0 0 14px" }}>{p.description}</p>}
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: T.textMute, fontSize: "10px", margin: 0 }}>MIEMBROS ACTIVOS</p>
                  <p style={{ color: T.text, fontSize: "20px", fontWeight: "400", margin: "2px 0 0", fontFamily: "Bebas Neue, sans-serif" }}>{count}</p>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => setModal(p)}>Editar</Btn>
              </div>
            </div>
          );
        })}

        {/* Agregar nuevo plan card */}
        <div onClick={() => setModal("new")}
          style={{ ...card, flex: "1", minWidth: "180px", borderTop: `3px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px dashed ${T.border}`, background: "transparent", gap: "8px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.yellow; e.currentTarget.style.background = T.yellowGlow; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;  e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ fontSize: "28px", color: T.textMute }}>+</span>
          <p style={{ color: T.textMute, fontSize: "13px", margin: 0 }}>Nuevo plan</p>
        </div>
      </div>

      {/* Tabla usuarios por plan */}
      <div style={{ ...card, overflowX: "auto", padding: "0" }}>
        <div style={{ padding: "18px 18px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: T.text, margin: 0, fontSize: "15px", fontWeight: "700" }}>Usuarios por Plan</h3>
          <span style={{ color: T.textMute, fontSize: "12px" }}>{members.length} miembros en total</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["USUARIO", "PLAN", "PRECIO", "VENCE", "ESTADO", ""].map(h => (
                <th key={h} style={{ color: T.textMute, fontSize: "10px", textAlign: "left", padding: "12px 16px", fontWeight: "700", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(u => {
              const plan = plans.find(p => p.name === u.plan);
              const vencida = u.daysLeft !== null && u.daysLeft <= 0;
              const porVencer = u.daysLeft !== null && u.daysLeft > 0 && u.daysLeft <= 7;
              return (
                <tr key={u.id} style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Avatar name={u.name} size={28} />
                      <div>
                        <p style={{ color: T.text, margin: 0, fontSize: "13px" }}>{u.name}</p>
                        <p style={{ color: T.textMute, margin: 0, fontSize: "11px" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {u.plan ? <Badge text={u.plan} color={planColor(u.plan)} /> : <span style={{ color: T.textMute }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 16px", color: T.textSub, fontSize: "12px" }}>
                    {plan ? `S/. ${Number(plan.price).toFixed(2)}` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", color: vencida ? T.danger : porVencer ? T.warning : T.textSub, fontSize: "12px", fontWeight: (vencida || porVencer) ? "700" : "400" }}>
                    {u.endDate ? new Date(u.endDate).toLocaleDateString("es-PE", { timeZone: "UTC" }) : "—"}
                    {porVencer && ` (${u.daysLeft}d)`}
                    {vencida && " ¡Venció!"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge
                      text={vencida ? "Vencida" : porVencer ? "Por vencer" : "Activo"}
                      color={vencida ? T.danger : porVencer ? T.warning : T.success}
                    />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Btn size="sm" variant="ghost">Renovar</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {members.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>Sin miembros registrados</div>}
      </div>

      {/* Modal crear/editar */}
      {modal && (
        <PlanModal
          plan={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={savePlan}
        />
      )}

      {/* Confirmar eliminar */}
      {delConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ ...card, maxWidth: "360px", textAlign: "center" }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>⚠️</p>
            <p style={{ color: T.text, fontSize: "16px", fontWeight: "700", margin: "0 0 8px" }}>¿Eliminar plan "{delConfirm.name}"?</p>
            <p style={{ color: T.textSub, fontSize: "13px", margin: "0 0 6px" }}>
              Este plan tiene <strong style={{ color: T.yellow }}>{members.filter(m => m.plan === delConfirm.name).length} miembros</strong> activos.
            </p>
            <p style={{ color: T.textMute, fontSize: "12px", margin: "0 0 24px" }}>Los miembros existentes no se verán afectados.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="outline" onClick={() => setDelConfirm(null)} full>Cancelar</Btn>
              <Btn variant="danger" onClick={() => deletePlan(delConfirm.id)} full>Eliminar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
