import { useState } from "react";
import T from "../constants/theme";
import Input from "../components/ui/Input";
import Btn   from "../components/ui/Btn";

export default function Login({ onLogin }) {
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pass) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    try { await onLogin(email, pass); }
    catch (e) { setError(e.message || "Usuario o contraseña incorrectos"); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .login-wrap { display: flex; min-height: 100vh; background: #0A0A0A; font-family: Nunito, sans-serif; }
        .login-left { width: 42%; background: linear-gradient(160deg,#1C1400 0%,#0A0A0A 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; position: relative; overflow: hidden; border-right: 1px solid #2E2E2E; }
        .login-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; background: #111111; }
        .login-mobile-logo { display: none; flex-direction: column; align-items: center; margin-bottom: 32px; }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-mobile-logo { display: flex !important; }
          .login-right { padding: 32px 20px; align-items: flex-start; padding-top: 48px; }
        }
      `}</style>

      <div className="login-wrap">
        {/* Panel izquierdo */}
        <div className="login-left">
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle,rgba(245,184,0,0.12) 0%,transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "220px", height: "220px", background: "radial-gradient(circle,rgba(245,184,0,0.08) 0%,transparent 70%)", borderRadius: "50%" }} />
          <div style={{ textAlign: "center", zIndex: 1, maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "14px", marginBottom: "12px" }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <rect x="2"  y="16" width="10" height="12" rx="3" fill={T.yellow} />
                <rect x="32" y="16" width="10" height="12" rx="3" fill={T.yellow} />
                <rect x="12" y="19" width="20" height="6"  rx="3" fill={T.yellow} />
                <rect x="0"  y="18" width="6"  height="8"  rx="2" fill="#C89300" />
                <rect x="38" y="18" width="6"  height="8"  rx="2" fill="#C89300" />
              </svg>
              <h1 style={{ color: T.yellow, fontSize: "48px", fontWeight: "400", margin: 0, fontFamily: "Bebas Neue, sans-serif", letterSpacing: "4px" }}>SOLGYM</h1>
            </div>
            <p style={{ color: T.textMute, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 56px" }}>Sistema de Gestión</p>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "40px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {["Control de asistencia con QR","Gestión de membresías","Recordatorios automáticos","Dashboard con estadísticas"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px", textAlign: "left" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: T.yellowGlow, border: `1px solid ${T.yellow}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: T.yellow }} />
                  </div>
                  <span style={{ color: "#BBBBBB", fontSize: "13px" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="login-right">
          <div style={{ width: "100%", maxWidth: "380px" }}>
            {/* Logo móvil */}
            <div className="login-mobile-logo">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
                  <rect x="2"  y="16" width="10" height="12" rx="3" fill={T.yellow} />
                  <rect x="32" y="16" width="10" height="12" rx="3" fill={T.yellow} />
                  <rect x="12" y="19" width="20" height="6"  rx="3" fill={T.yellow} />
                </svg>
                <span style={{ color: T.yellow, fontSize: "32px", fontFamily: "Bebas Neue, sans-serif", letterSpacing: "3px" }}>SOLGYM</span>
              </div>
              <p style={{ color: T.textMute, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", margin: 0 }}>Sistema de Gestión</p>
            </div>

            <h2 style={{ color: T.text, fontSize: "36px", fontWeight: "400", margin: "0 0 6px", fontFamily: "Bebas Neue, sans-serif", letterSpacing: "2px" }}>BIENVENIDO</h2>
            <p style={{ color: T.textSub, fontSize: "13px", margin: "0 0 36px" }}>Ingresa tus credenciales para acceder al sistema</p>

            {error && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "8px", padding: "12px 16px", color: T.danger, fontSize: "13px", marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input label="Correo electrónico" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} placeholder="correo@solgym.com" onKeyDown={e => e.key === "Enter" && submit()} />
              <Input label="Contraseña" type="password" value={pass} onChange={e => { setPass(e.target.value); setError(""); }} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && submit()} />
              <Btn onClick={submit} disabled={loading} full style={{ marginTop: "8px", padding: "14px", fontSize: "15px", letterSpacing: "1px" }}>
                {loading ? "Ingresando..." : "INICIAR SESIÓN"}
              </Btn>
            </div>

            <div style={{ marginTop: "32px", padding: "14px", background: T.dark2, borderRadius: "8px", border: `1px solid ${T.border}` }}>
              <p style={{ color: T.textMute, fontSize: "11px", margin: "0 0 6px", letterSpacing: "1px" }}>CREDENCIALES DE PRUEBA</p>
              {[
                { role: "Super Admin", email: "super@solgym.com",  pass: "super1234" },
                { role: "Admin",       email: "admin@solgym.com",  pass: "admin1234" },
                { role: "Entrenador",  email: "coach1@solgym.com", pass: "coach1234" },
              ].map(c => (
                <div key={c.role} onClick={() => { setEmail(c.email); setPass(c.pass); setError(""); }}
                  style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", cursor: "pointer", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ color: T.yellow, fontSize: "11px", fontWeight: "700" }}>{c.role}</span>
                  <span style={{ color: T.textMute, fontSize: "11px" }}>{c.email}</span>
                </div>
              ))}
              <p style={{ color: T.textMute, fontSize: "10px", margin: "6px 0 0", textAlign: "center" }}>Clic en cualquier fila para autocompletar</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
