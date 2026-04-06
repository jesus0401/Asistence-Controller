import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { attendanceService, membersService } from "../api/services";
import Select  from "../components/ui/Select";
import Btn     from "../components/ui/Btn";
import Avatar  from "../components/ui/Avatar";
import Badge   from "../components/ui/Badge";
import QRCode  from "../components/common/QRCode";

export default function Attendance() {
  const [members,  setMembers]  = useState([]);
  const [history,  setHistory]  = useState([]);
  const [selected, setSelected] = useState("");
  const [ok,       setOk]       = useState(false);
  const [tab,      setTab]      = useState("manual");
  const [loading,  setLoading]  = useState(false);

  const load = async () => {
    const [m, h] = await Promise.all([membersService.getAll(), attendanceService.getAll()]);
    setMembers(m);
    setHistory(h);
  };

  useEffect(() => { load(); }, []);

  const confirm = async () => {
    const member = members.find(u => u.name === selected);
    if (!member) return;
    setLoading(true);
    try {
      await attendanceService.register(member.id, "manual");
      setOk(true);
      await load();
      setTimeout(() => { setOk(false); setSelected(""); }, 3000);
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = members.find(u => u.name === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>CONTROL DE ASISTENCIA</h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Registra y monitorea la asistencia de los miembros</p>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Registration */}
        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <div style={{ display: "flex", gap: "0", marginBottom: "20px", background: T.dark3, borderRadius: "8px", padding: "3px" }}>
            {[["manual", "✍️ Manual"], ["qr", "📱 Código QR"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ flex: 1, background: tab === id ? T.yellow : "transparent", color: tab === id ? "#000" : T.textSub, border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700", transition: "all 0.2s", fontFamily: "Nunito, sans-serif" }}>
                {label}
              </button>
            ))}
          </div>

          {tab === "qr" ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: T.textSub, fontSize: "13px", marginBottom: "20px" }}>Muestra este QR a los miembros para registrar asistencia</p>
              <div style={{ background: "#fff", padding: "16px", borderRadius: "12px", display: "inline-block", marginBottom: "16px" }}>
                <QRCode />
              </div>
              <p style={{ color: T.yellow, fontSize: "12px", fontWeight: "700", margin: 0 }}>
                {window.location.origin}/?qr=1
              </p>
              <p style={{ color: T.textMute, fontSize: "11px", margin: "6px 0 16px" }}>Escanea → busca tu nombre → valida correo → confirma</p>
              <Btn variant="ghost" full onClick={() => window.open("/?qr=1", "_blank")}>
                🔗 Abrir página QR
              </Btn>
            </div>
          ) : ok ? (
            <div style={{ background: "rgba(74,222,128,0.08)", border: `1px solid ${T.success}44`, borderRadius: "10px", padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
              <p style={{ color: T.success, fontWeight: "700", margin: 0, fontSize: "16px" }}>¡Asistencia registrada!</p>
              <p style={{ color: T.textSub, margin: "6px 0 0", fontSize: "13px" }}>Bienvenido/a, {selected}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Select label="Nombre del miembro" value={selected} onChange={e => setSelected(e.target.value)}
                options={["", ...members.map(u => u.name)]} />
              {selectedUser && (
                <div style={{ background: T.dark3, borderRadius: "8px", padding: "14px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar name={selectedUser.name} size={44} />
                  <div>
                    <p style={{ color: T.text, margin: 0, fontWeight: "700", fontSize: "14px" }}>{selectedUser.name}</p>
                    <p style={{ color: T.textSub, margin: "3px 0 6px", fontSize: "11px" }}>Plan: {selectedUser.plan} · {selectedUser.daysLeft}d restantes</p>
                    {selectedUser.daysLeft <= 7 && <Badge text={`⚠️ Vence en ${selectedUser.daysLeft} días`} color={T.warning} />}
                  </div>
                </div>
              )}
              <Btn onClick={confirm} disabled={!selected || loading} full style={{ padding: "14px", fontSize: "14px" }}>
                {loading ? "Registrando..." : "CONFIRMAR ASISTENCIA"}
              </Btn>
            </div>
          )}
        </div>

        {/* History */}
        <div style={{ ...card, flex: "2", minWidth: "280px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h3 style={{ color: T.text, margin: 0, fontSize: "15px", fontWeight: "700" }}>Historial de Asistencias</h3>
            <span style={{ color: T.textMute, fontSize: "11px" }}>{history.length} registros</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "420px", overflowY: "auto" }}>
            {history.map((a, i) => (
              <div key={a.id ?? i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: i === 0 ? T.yellowGlow : T.dark3, border: `1px solid ${i === 0 ? T.yellow + "44" : "transparent"}`, borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Avatar name={a.member?.name ?? "?"} size={30} color={i === 0 ? T.yellow : T.textSub} />
                  <span style={{ color: T.text, fontSize: "13px" }}>{a.member?.name}</span>
                  {i === 0 && <span style={{ background: T.yellow, color: "#000", fontSize: "9px", fontWeight: "800", padding: "2px 6px", borderRadius: "10px" }}>NUEVO</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: T.yellow, fontSize: "12px", margin: 0, fontWeight: "700" }}>
                    {new Date(a.entryTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p style={{ color: T.textMute, fontSize: "10px", margin: "1px 0 0" }}>
                    {new Date(a.entryTime).toLocaleDateString("es-PE")}
                  </p>
                </div>
              </div>
            ))}
            {history.length === 0 && <p style={{ color: T.textMute, fontSize: "13px", textAlign: "center" }}>Sin registros</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
