import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { profilesService } from "../api/services";
import Avatar  from "../components/ui/Avatar";
import Badge   from "../components/ui/Badge";
import Btn     from "../components/ui/Btn";
import Input   from "../components/ui/Input";
import Select  from "../components/ui/Select";

const ROLES = [
  { id: "SUPERADMIN", label: "Super Admin", color: T.yellow,  icon: "👑", desc: "Acceso total al sistema.", perms: ["Dashboard","Usuarios","Asistencia","Fitness","Nutrición","Planes","Boletas","Perfiles","Administración"] },
  { id: "ADMIN",      label: "Administrador",color: T.info,   icon: "🛡️", desc: "Gestión operativa completa.", perms: ["Dashboard","Usuarios","Asistencia","Fitness","Nutrición","Planes","Boletas"] },
  { id: "ENTRENADOR", label: "Entrenador",   color: T.success, icon: "🏋️", desc: "Fitness, rutinas y asistencia.", perms: ["Dashboard","Usuarios (ver)","Asistencia","Fitness","Nutrición"] },
  { id: "RECEPCION",  label: "Recepción",    color: "#A78BFA", icon: "🗂️", desc: "Asistencia y boletas.", perms: ["Dashboard","Asistencia","Boletas"] },
];

const roleInfo = id => ROLES.find(r => r.id === id) ?? ROLES[2];

function ProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState(profile ? { ...profile, password: "" } : { name: "", email: "", phone: "", role: "ENTRENADOR", status: "ACTIVO", password: "" });
  const [tab,  setTab]  = useState("datos");
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const role = roleInfo(form.role);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
      <div style={{ ...card, width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px" }}>{profile ? "EDITAR PERFIL" : "NUEVO PERFIL"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
        </div>
        <div style={{ display: "flex", background: T.dark3, borderRadius: "8px", padding: "3px", marginBottom: "20px" }}>
          {[["datos","📝 Datos"],["permisos","🔐 Permisos"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: tab === id ? T.yellow : "transparent", color: tab === id ? "#000" : T.textSub, border: "none", borderRadius: "6px", padding: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "Nunito, sans-serif" }}>{label}</button>
          ))}
        </div>
        {tab === "datos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="Nombre completo" value={form.name}  onChange={set("name")}  placeholder="Nombre" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Correo"    value={form.email} onChange={set("email")} placeholder="correo@solgym.com" />
              <Input label="Teléfono" value={form.phone ?? ""} onChange={set("phone")} placeholder="999-000-1111" />
            </div>
            {!profile && <Input label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />}
            <Select label="Rol" value={form.role} onChange={set("role")} options={ROLES.map(r => r.id)} />
            <div style={{ background: `${role.color}11`, border: `1px solid ${role.color}33`, borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "20px" }}>{role.icon}</span>
                <span style={{ color: role.color, fontWeight: "700", fontSize: "14px" }}>{role.label}</span>
              </div>
              <p style={{ color: T.textSub, fontSize: "12px", margin: "0 0 10px" }}>{role.desc}</p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {role.perms.map(p => <span key={p} style={{ background: `${role.color}22`, color: role.color, fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px" }}>{p}</span>)}
              </div>
            </div>
            <Select label="Estado" value={form.status} onChange={set("status")} options={["ACTIVO", "INACTIVO", "SUSPENDIDO"]} />
          </div>
        )}
        {tab === "permisos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ROLES.map(r => (
              <div key={r.id} onClick={() => setForm(p => ({ ...p, role: r.id }))}
                style={{ background: form.role === r.id ? `${r.color}11` : T.dark3, border: `1px solid ${form.role === r.id ? r.color + "44" : T.border}`, borderRadius: "10px", padding: "14px 16px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "18px" }}>{r.icon}</span>
                  <span style={{ color: r.color, fontWeight: "700", fontSize: "13px" }}>{r.label}</span>
                  {form.role === r.id && <span style={{ background: r.color, color: "#000", fontSize: "9px", fontWeight: "800", padding: "2px 8px", borderRadius: "10px", marginLeft: "auto" }}>SELECCIONADO</span>}
                </div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {r.perms.map(p => <span key={p} style={{ background: `${r.color}18`, color: r.color, fontSize: "10px", padding: "1px 7px", borderRadius: "8px" }}>{p}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
          <Btn onClick={() => onSave(form)} disabled={!form.name || !form.email || (!profile && !form.password)} full>
            {profile ? "Guardar cambios" : "Crear perfil"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

export default function Profiles() {
  const [profiles,   setProfiles]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [search,     setSearch]     = useState("");
  const [delConfirm, setDelConfirm] = useState(null);

  const load = async () => {
    try { const p = await profilesService.getAll(); setProfiles(p); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)) &&
      (filterRole === "all" || p.role === filterRole);
  });

  const saveProfile = async (form) => {
    try {
      if (form.id) await profilesService.update(form.id, form);
      else         await profilesService.create(form);
      setModal(null); await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  const toggleStatus = async (p) => {
    try {
      await profilesService.update(p.id, { ...p, status: p.status === "ACTIVO" ? "INACTIVO" : "ACTIVO" });
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><p style={{ color: T.textMute }}>Cargando perfiles...</p></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>GESTIÓN DE PERFILES</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Usuarios del sistema, roles y permisos</p>
        </div>
        <Btn onClick={() => setModal("new")}>+ Nuevo perfil</Btn>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {ROLES.map(r => (
          <div key={r.id} onClick={() => setFilterRole(prev => prev === r.id ? "all" : r.id)}
            style={{ ...card, flex: "1", minWidth: "130px", borderTop: `3px solid ${r.color}`, cursor: "pointer", opacity: filterRole !== "all" && filterRole !== r.id ? 0.5 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px" }}>{r.icon}</span>
              <span style={{ color: r.color, fontSize: "28px", fontFamily: "Bebas Neue, sans-serif" }}>{profiles.filter(p => p.role === r.id).length}</span>
            </div>
            <p style={{ color: r.color, fontSize: "11px", fontWeight: "700", margin: 0 }}>{r.label}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, padding: "14px 18px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o correo..."
            style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 12px 9px 32px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}
            onFocus={e => e.target.style.borderColor = T.yellow} onBlur={e => e.target.style.borderColor = T.border} />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          style={{ background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 14px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
          <option value="all">Todos los roles</option>
          {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      <div style={{ ...card, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["PERFIL", "ROL", "TELÉFONO", "ESTADO", ""].map(h => (
                <th key={h} style={{ color: T.textMute, fontSize: "10px", textAlign: "left", padding: "14px 16px", fontWeight: "700", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const r = roleInfo(p.role);
              return (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={p.name} size={34} color={r.color} />
                      <div>
                        <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "600" }}>{p.name}</p>
                        <p style={{ color: T.textMute, margin: "1px 0 0", fontSize: "11px" }}>{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{r.icon}</span><Badge text={r.label} color={r.color} />
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", color: T.textSub, fontSize: "12px" }}>{p.phone ?? "—"}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <Badge text={p.status} color={p.status === "ACTIVO" ? T.success : T.danger} />
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Btn size="sm" variant="ghost" onClick={() => setModal(p)}>Editar</Btn>
                      <Btn size="sm" variant="outline" onClick={() => toggleStatus(p)}>
                        {p.status === "ACTIVO" ? "Desactivar" : "Activar"}
                      </Btn>
                      {p.role !== "SUPERADMIN" && <Btn size="sm" variant="danger" onClick={() => setDelConfirm(p.id)}>🗑</Btn>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>No se encontraron perfiles</div>}
      </div>

      {modal && <ProfileModal profile={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={saveProfile} />}

      {delConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ ...card, maxWidth: "340px", textAlign: "center" }}>
            <p style={{ color: T.text, fontSize: "16px", fontWeight: "700", margin: "0 0 8px" }}>¿Eliminar perfil?</p>
            <p style={{ color: T.textSub, fontSize: "13px", margin: "0 0 24px" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="outline" onClick={() => setDelConfirm(null)} full>Cancelar</Btn>
              <Btn variant="danger" onClick={async () => { await profilesService.remove(delConfirm); setDelConfirm(null); await load(); }} full>Eliminar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}