import { useState, useEffect, useRef } from "react";
import T from "../../constants/theme";
import { membersService } from "../../api/services";

export default function Navbar({ onMenu, onNavigate, notifs = 0, user }) {
  const [query,       setQuery]       = useState("");
  const [results,     setResults]     = useState([]);
  const [searching,   setSearching]   = useState(false);
  const [showSearch,  setShowSearch]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const searchRef  = useRef(null);
  const profileRef = useRef(null);

  // Búsqueda de miembros
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const members = await membersService.getAll({ search: query });
        setResults(members.slice(0, 6));
      } catch {} finally { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  { setShowSearch(false); setQuery(""); setResults([]); }
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("solgym_token");
    localStorage.removeItem("solgym_user");
    window.location.reload();
  };

  const initial = user?.name?.[0]?.toUpperCase() ?? "A";
  const rolLabels = { SUPERADMIN: "Super Admin", ADMIN: "Administrador", ENTRENADOR: "Entrenador", RECEPCION: "Recepción" };
  const rolColor  = { SUPERADMIN: T.yellow, ADMIN: T.info, ENTRENADOR: T.success, RECEPCION: "#A78BFA" };

  return (
    <div style={{
      height: "64px", background: T.dark2, borderBottom: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: "14px", flexShrink: 0,
      position: "relative", zIndex: 100,
    }}>
      <button onClick={onMenu}
        style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "20px", padding: "4px", lineHeight: 1 }}>
        ☰
      </button>

      {/* Buscador */}
      <div ref={searchRef} style={{ flex: 1, maxWidth: "300px", position: "relative" }}>
        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px", pointerEvents: "none" }}>🔍</span>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSearch(true); }}
          onFocus={e => { setShowSearch(true); e.target.style.borderColor = T.yellow; }}
          onBlur={e => e.target.style.borderColor = T.border}
          placeholder="Buscar miembro..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: T.dark3, border: `1px solid ${T.border}`,
            borderRadius: "8px", padding: "8px 12px 8px 32px",
            color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif",
          }}
          
        />

        {/* Resultados */}
        {showSearch && query.trim().length >= 2 && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)", overflow: "hidden", zIndex: 200,
          }}>
            {searching ? (
              <div style={{ padding: "14px", textAlign: "center", color: T.textMute, fontSize: "12px" }}>Buscando...</div>
            ) : results.length === 0 ? (
              <div style={{ padding: "14px", textAlign: "center", color: T.textMute, fontSize: "12px" }}>Sin resultados</div>
            ) : (
              results.map(m => (
                <div key={m.id}
                  onClick={() => { onNavigate?.("usuarios"); setShowSearch(false); setQuery(""); setResults([]); }}
                  style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = T.dark3}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: T.yellowGlow, border: `1px solid ${T.yellow}44`, display: "flex", alignItems: "center", justifyContent: "center", color: T.yellow, fontWeight: "800", fontSize: "12px", flexShrink: 0, fontFamily: "Bebas Neue, sans-serif" }}>
                    {m.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: T.text, margin: 0, fontSize: "12px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</p>
                    <p style={{ color: T.textMute, margin: 0, fontSize: "10px" }}>{m.plan ?? "Sin plan"} · {m.email}</p>
                  </div>
                  {m.daysLeft !== null && m.daysLeft <= 7 && (
                    <span style={{ color: T.warning, fontSize: "10px", fontWeight: "700", flexShrink: 0 }}>⚠️ {m.daysLeft}d</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Notificaciones */}
      <div style={{ position: "relative", cursor: "pointer" }}>
        <span style={{ fontSize: "19px" }}>🔔</span>
        {notifs > 0 && (
          <span style={{
            position: "absolute", top: "-4px", right: "-4px",
            background: T.yellow, color: "#000", fontSize: "9px", fontWeight: "800",
            borderRadius: "50%", width: "15px", height: "15px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{notifs}</span>
        )}
      </div>

      {/* Perfil */}
      <div ref={profileRef} style={{ position: "relative" }}>
        <div onClick={() => setShowProfile(p => !p)}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "6px 10px", borderRadius: "8px", background: showProfile ? T.dark4 : T.dark3 }}
          onMouseEnter={e => e.currentTarget.style.background = T.dark4}
          onMouseLeave={e => e.currentTarget.style.background = showProfile ? T.dark4 : T.dark3}
        >
          <div style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.yellow}, #C89300)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#000", fontWeight: "800", fontSize: "13px", fontFamily: "Bebas Neue, sans-serif",
          }}>{initial}</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ color: T.text, fontSize: "13px", fontWeight: "600" }}>{user?.name?.split(" ")[0] ?? "Admin"}</span>
            <span style={{ color: rolColor[user?.role] ?? T.textMute, fontSize: "10px", fontWeight: "700" }}>{rolLabels[user?.role] ?? "Admin"}</span>
          </div>
          <span style={{ color: T.textMute, fontSize: "11px", marginLeft: "2px" }}>{showProfile ? "▴" : "▾"}</span>
        </div>

        {/* Dropdown */}
        {showProfile && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0, width: "220px",
            background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)", overflow: "hidden", zIndex: 200,
          }}>
            {/* Info usuario */}
            <div style={{ padding: "16px", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg, ${T.yellow}, #C89300)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontWeight: "800", fontSize: "16px", fontFamily: "Bebas Neue, sans-serif" }}>
                  {initial}
                </div>
                <div>
                  <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "700" }}>{user?.name ?? "Admin"}</p>
                  <span style={{ background: `${rolColor[user?.role] ?? T.yellow}22`, color: rolColor[user?.role] ?? T.yellow, fontSize: "9px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>
                    {rolLabels[user?.role] ?? "Admin"}
                  </span>
                </div>
              </div>
              <p style={{ color: T.textMute, margin: 0, fontSize: "11px" }}>{user?.email ?? ""}</p>
              {user?.phone && <p style={{ color: T.textMute, margin: "2px 0 0", fontSize: "11px" }}>📞 {user.phone}</p>}
            </div>

            {/* Opciones */}
            <div style={{ padding: "6px" }}>
              <button onClick={() => { onNavigate?.("perfiles"); setShowProfile(false); }}
                style={{ width: "100%", background: "none", border: "none", color: T.textSub, cursor: "pointer", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontFamily: "Nunito, sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={e => e.currentTarget.style.background = T.dark3}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                👤 Mi perfil
              </button>
              <button onClick={() => { onNavigate?.("perfiles"); setShowProfile(false); }}
                style={{ width: "100%", background: "none", border: "none", color: T.textSub, cursor: "pointer", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontFamily: "Nunito, sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={e => e.currentTarget.style.background = T.dark3}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                🔐 Cambiar contraseña
              </button>
              <div style={{ borderTop: `1px solid ${T.border}`, margin: "4px 0" }} />
              <button onClick={handleLogout}
                style={{ width: "100%", background: "none", border: "none", color: T.danger, cursor: "pointer", padding: "10px 12px", borderRadius: "8px", fontSize: "12px", fontFamily: "Nunito, sans-serif", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                🚪 Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
