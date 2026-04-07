import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { plansService, membersService } from "../api/services";
import Avatar from "../components/ui/Avatar";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";

const planColor = p => ({ Mensual: T.yellow, Trimestral: T.info, Semestral: "#A78BFA", Anual: T.success }[p] || T.textSub);

export default function Plans() {
  const [plans,   setPlans]   = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([plansService.getAll(), membersService.getAll()])
      .then(([p, m]) => { setPlans(p); setMembers(m); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: T.textMute }}>Cargando planes...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>GESTIÓN DE PLANES</h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Administra los planes de membresía del gimnasio</p>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {plans.map(p => {
          const count = members.filter(m => m.plan === p.name).length;
          const color = planColor(p.name);
          return (
            <div key={p.id} style={{ ...card, flex: "1", minWidth: "180px", borderTop: `3px solid ${color}` }}>
              <div style={{ marginBottom: "12px" }}><Badge text={p.name} color={color} /></div>
              <p style={{ color: T.text, fontSize: "28px", fontWeight: "400", margin: "0 0 2px", fontFamily: "Bebas Neue, sans-serif" }}>
                S/. {Number(p.price).toFixed(2)}
              </p>
              <p style={{ color: T.textSub, fontSize: "12px", margin: "0 0 14px" }}>por {p.durationDays} días</p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "12px" }}>
                <p style={{ color: T.textMute, fontSize: "10px", margin: 0 }}>MIEMBROS</p>
                <p style={{ color: T.text, fontSize: "20px", fontWeight: "400", margin: "2px 0 0", fontFamily: "Bebas Neue, sans-serif" }}>{count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...card, overflowX: "auto", padding: "0" }}>
        <div style={{ padding: "18px 18px 14px" }}>
          <h3 style={{ color: T.text, margin: 0, fontSize: "15px", fontWeight: "700" }}>Usuarios por Plan</h3>
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
              return (
                <tr key={u.id} style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Avatar name={u.name} size={28} />
                      <span style={{ color: T.text, fontSize: "13px" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {u.plan ? <Badge text={u.plan} color={planColor(u.plan)} /> : <span style={{ color: T.textMute }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 16px", color: T.textSub, fontSize: "12px" }}>
                    {plan ? `S/. ${Number(plan.price).toFixed(2)}` : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", color: u.daysLeft !== null && u.daysLeft <= 7 ? T.warning : T.textSub, fontSize: "12px", fontWeight: u.daysLeft !== null && u.daysLeft <= 7 ? "700" : "400" }}>
                    {u.endDate ? new Date(u.endDate).toLocaleDateString("es-PE", { timeZone: "UTC" }) : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge text={u.daysLeft !== null && u.daysLeft <= 7 ? "Por vencer" : "Activo"} color={u.daysLeft !== null && u.daysLeft <= 7 ? T.warning : T.success} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Btn size="sm" variant="ghost">Renovar</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {members.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>Sin miembros</div>}
      </div>
    </div>
  );
}