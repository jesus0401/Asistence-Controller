import T from "../../constants/theme";
import NAV from "../../constants/navigation";

export default function Sidebar({ page, setPage, open, onClose, isMob, onLogout }) {
  return (
    <>
      {isMob && open && (
        <div
          onClick={onClose}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 40 }}
        />
      )}
      <div style={{
        width: open ? "230px" : (isMob ? "0" : "68px"),
        minWidth: open ? "230px" : (isMob ? "0" : "68px"),
        background: T.dark2, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", transition: "all 0.28s ease",
        overflow: "hidden", zIndex: 50,
        position: isMob ? "fixed" : "relative",
        top: 0, left: 0, height: isMob ? "100vh" : undefined,
      }}>
        {/* Logo */}
        <div style={{
          padding: "0 16px", height: "64px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: "10px",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "8px",
            background: T.yellowGlow, border: `1px solid ${T.yellow}44`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: "18px" }}>🏋️</span>
          </div>
          {open && (
            <span style={{
              color: T.yellow, fontFamily: "Bebas Neue, sans-serif",
              fontSize: "22px", letterSpacing: "2px", whiteSpace: "nowrap",
            }}>
              SOLGYM
            </span>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {NAV.map(item => {
            const active = page === item.id;
            return (
              <div
                key={item.id}
                onClick={() => { setPage(item.id); if (isMob) onClose(); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "11px 14px", borderRadius: "8px", cursor: "pointer", marginBottom: "2px",
                  background: active ? T.yellowGlow : "transparent",
                  borderLeft: `3px solid ${active ? T.yellow : "transparent"}`,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{item.icon}</span>
                {open && (
                  <span style={{
                    color: active ? T.yellow : T.textSub,
                    fontSize: "13px", fontWeight: active ? "700" : "500", whiteSpace: "nowrap",
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${T.border}` }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "8px", cursor: "pointer" }}
            onClick={onLogout}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ fontSize: "17px", flexShrink: 0 }}>🚪</span>
            {open && <span style={{ color: T.danger, fontSize: "13px", fontWeight: "500" }}>Cerrar sesión</span>}
          </div>
        </div>
      </div>
    </>
  );
}
