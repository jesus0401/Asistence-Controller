import { useState } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import Toggle from "../components/ui/Toggle";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";

const INITIAL_REMINDERS = [
  { label: "Email — 7 días antes de vencer",  on: true  },
  { label: "Email — 3 días antes de vencer",  on: true  },
  { label: "Email — 1 día antes de vencer",   on: false },
  { label: "WhatsApp — 3 días antes",         on: false },
  { label: "WhatsApp — 1 día antes",          on: true  },
];

const REPORTS = [
  { label: "Usuarios activos",              fmt: "Excel" },
  { label: "Asistencias del mes",           fmt: "PDF"   },
  { label: "Membresías por vencer",         fmt: "Excel" },
  { label: "Ingresos del mes",              fmt: "PDF"   },
  { label: "Historial completo asistencia", fmt: "Excel" },
];

const ADMINS = [
  { name: "Super Admin", email: "super@solgym.com", role: "super", color: T.yellow },
  { name: "Admin",       email: "admin@solgym.com", role: "admin",  color: T.info  },
];

export default function Admin() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const toggle = i => setReminders(prev => prev.map((r, j) => j === i ? { ...r, on: !r.on } : r));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>
          ADMINISTRACIÓN
        </h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>
          Configuración del sistema, reportes y accesos
        </p>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Reminders */}
        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <h3 style={{ color: T.text, margin: "0 0 18px", fontSize: "15px", fontWeight: "700" }}>🔔 Recordatorios Automáticos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reminders.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: T.dark3, borderRadius: "8px" }}>
                <span style={{ color: T.textSub, fontSize: "13px", flex: 1, marginRight: "12px" }}>{r.label}</span>
                <Toggle on={r.on} onChange={() => toggle(i)} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px" }}>
            <Btn full>📨 Enviar recordatorios ahora</Btn>
          </div>
          <p style={{ color: T.textMute, fontSize: "11px", margin: "10px 0 0", textAlign: "center" }}>
            Integración con SendGrid (email) y Twilio (WhatsApp)
          </p>
        </div>

        {/* Reports */}
        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <h3 style={{ color: T.text, margin: "0 0 18px", fontSize: "15px", fontWeight: "700" }}>📊 Generar Reportes</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {REPORTS.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: T.dark3, borderRadius: "8px" }}>
                <span style={{ color: T.textSub, fontSize: "13px" }}>{r.label}</span>
                <Btn size="sm" variant={r.fmt === "Excel" ? "ghost" : "danger"}>
                  {r.fmt === "Excel" ? "📗" : "📕"} {r.fmt}
                </Btn>
              </div>
            ))}
          </div>
        </div>

        {/* Access management */}
        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <h3 style={{ color: T.text, margin: "0 0 18px", fontSize: "15px", fontWeight: "700" }}>🔐 Gestión de Accesos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ADMINS.map((u, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: T.dark3, borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar name={u.name} size={36} color={u.color} />
                  <div>
                    <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "600" }}>{u.name}</p>
                    <p style={{ color: T.textMute, margin: "1px 0 0", fontSize: "11px" }}>{u.email}</p>
                  </div>
                </div>
                <Badge text={u.role.toUpperCase()} color={u.color} />
              </div>
            ))}
            <Btn variant="ghost" full>+ Agregar administrador</Btn>
          </div>

          <div style={{ marginTop: "20px", padding: "14px", background: T.dark3, borderRadius: "8px", borderLeft: `3px solid ${T.warning}` }}>
            <p style={{ color: T.warning, fontSize: "11px", fontWeight: "700", margin: "0 0 4px" }}>IMPORTAR DESDE EXCEL</p>
            <p style={{ color: T.textSub, fontSize: "12px", margin: "0 0 10px" }}>
              Sube tu archivo Excel con los usuarios existentes para migrarlos a la base de datos
            </p>
            <Btn variant="ghost" size="sm">📂 Seleccionar archivo .xlsx</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
