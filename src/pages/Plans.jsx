import T from "../constants/theme";
import { card } from "../constants/theme";
import { PLANS_CATALOG } from "../constants/mockData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";

const planColor = p => ({ Mensual: T.yellow, Trimestral: T.info, Semestral: "#A78BFA", Anual: T.success }[p] || T.textSub);

export default function Plans({ users }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>
            GESTIÓN DE PLANES
          </h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>
            Administra los planes de membresía del gimnasio
          </p>
        </div>
        <Btn>+ Nuevo Plan</Btn>
      </div>

      {/* Plan cards */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {PLANS_CATALOG.map(p => {
          const count = users.filter(u => u.plan === p.name).length;
          return (
            <div key={p.name} style={{ ...card, flex: "1", minWidth: "180px", borderTop: `3px solid ${p.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <Badge text={p.name} color={p.color} />
                <button style={{ background: "none", border: "none", color: T.textMute, cursor: "pointer", fontSize: "14px" }}>⋮</button>
              </div>
              <p style={{ color: T.text, fontSize: "28px", fontWeight: "400", margin: "0 0 2px", fontFamily: "Bebas Neue, sans-serif" }}>{p.price}</p>
              <p style={{ color: T.textSub, fontSize: "12px", margin: "0 0 14px" }}>por {p.duration}</p>
              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: T.textMute, fontSize: "10px", margin: 0 }}>MIEMBROS</p>
                  <p style={{ color: T.text, fontSize: "20px", fontWeight: "400", margin: "2px 0 0", fontFamily: "Bebas Neue, sans-serif" }}>{count}</p>
                </div>
                <Btn size="sm" variant="ghost">Editar</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users by plan */}
      <div style={{ ...card, overflowX: "auto", padding: "0" }}>
        <div style={{ padding: "18px 18px 14px" }}>
          <h3 style={{ color: T.text, margin: 0, fontSize: "15px", fontWeight: "700" }}>Usuarios por Plan</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["USUARIO", "PLAN", "PRECIO", "VENCE", "ESTADO", "ACCIONES"].map(h => (
                <th key={h} style={{ color: T.textMute, fontSize: "10px", textAlign: "left", padding: "12px 16px", fontWeight: "700", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const plan = PLANS_CATALOG.find(p => p.name === u.plan);
              return (
                <tr key={u.id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Avatar name={u.name} size={28} />
                      <span style={{ color: T.text, fontSize: "13px" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}><Badge text={u.plan} color={planColor(u.plan)} /></td>
                  <td style={{ padding: "12px 16px", color: T.textSub, fontSize: "12px" }}>{plan?.price}</td>
                  <td style={{ padding: "12px 16px", color: u.daysLeft <= 7 ? T.warning : T.textSub, fontSize: "12px", fontWeight: u.daysLeft <= 7 ? "700" : "400" }}>
                    {u.end}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge text={u.daysLeft <= 7 ? "Por vencer" : "Activo"} color={u.daysLeft <= 7 ? T.warning : T.success} />
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Btn size="sm" variant="ghost">Renovar</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
