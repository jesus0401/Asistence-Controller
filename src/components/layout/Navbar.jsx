import T from "../../constants/theme";

export default function Navbar({ onMenu, notifs = 0 }) {
  return (
    <div style={{
      height: "64px", background: T.dark2, borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: "14px", flexShrink: 0,
    }}>
      <button
        onClick={onMenu}
        style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}
      >
        ☰
      </button>

      <div style={{ flex: 1, maxWidth: "300px", position: "relative" }}>
        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px" }}>🔍</span>
        <input
          placeholder="Buscar usuario, plan..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: T.dark3, border: `1px solid ${T.border}`,
            borderRadius: "8px", padding: "8px 12px 8px 32px",
            color: T.text, fontSize: "12px", outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = T.yellow}
          onBlur={e => e.target.style.borderColor = T.border}
        />
      </div>

      <div style={{ flex: 1 }} />

      {/* Notifications */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <span style={{ fontSize: "19px" }}>🔔</span>
        {notifs > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: T.yellow, color: "#000", fontSize: "9px", fontWeight: "800",
            borderRadius: "50%", width: "15px", height: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {notifs}
          </span>
        )}
      </div>

      {/* Admin avatar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        cursor: "pointer", padding: "6px 10px", borderRadius: "8px", background: T.dark3,
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          background: `linear-gradient(135deg,${T.yellow},${T.yellowDim})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#000", fontWeight: "800", fontSize: "13px",
        }}>
          A
        </div>
        <span style={{ color: T.text, fontSize: "13px", fontWeight: "600" }}>Admin</span>
        <span style={{ color: T.textMute, fontSize: "11px" }}>▾</span>
      </div>
    </div>
  );
}
