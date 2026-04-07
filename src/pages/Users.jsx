import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { membersService, plansService } from "../api/services";
import Avatar    from "../components/ui/Avatar";
import Badge     from "../components/ui/Badge";
import Btn       from "../components/ui/Btn";
import UserModal from "../modals/UserModal";

const planColor = p => ({ Mensual: T.yellow, Trimestral: T.info, Semestral: "#A78BFA", Anual: T.success }[p] || T.textSub);

export default function Users() {
  const [members,    setMembers]    = useState([]);
  const [plans,      setPlans]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [planF,      setPlanF]      = useState("Todos");
  const [modal,      setModal]      = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([membersService.getAll(), plansService.getAll()]);
      setMembers(m);
      setPlans(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = members.filter(u => {
    const q = search.toLowerCase();
    return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (planF === "Todos" || u.plan === planF);
  });

  const saveUser = async (form) => {
    try {
      if (form.id) {
        // Editar — solo datos personales
        await membersService.update(form.id, {
          name:      form.name,
          email:     form.email,
          phone:     form.phone      || null,
          birthDate: form.birthDate  || null,
        });
        // Si hay plan y fechas, crear/actualizar membresía
        if (form.planId && form.startDate && form.endDate) {
          await fetch(
            `${import.meta.env.VITE_API_URL || "https://asistence-controller-backend.onrender.com/api"}/members/${form.id}/membership`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("solgym_token")}` },
              body: JSON.stringify({ planId: form.planId, startDate: form.startDate, endDate: form.endDate }),
            }
          );
        }
      } else {
        // Crear nuevo miembro
        await membersService.create({
          name:      form.name,
          email:     form.email,
          phone:     form.phone      || null,
          birthDate: form.birthDate  || null,
          planId:    form.planId     || null,
          startDate: form.startDate  || null,
          endDate:   form.endDate    || null,
        });
      }
      await load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await membersService.remove(id);
      setDelConfirm(null);
      await load();
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>GESTIÓN DE USUARIOS</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>{members.length} usuarios registrados</p>
        </div>
        <Btn onClick={() => setModal("new")}>+ Nuevo Usuario</Btn>
      </div>

      {/* Filters */}
      <div style={{ ...card, display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", padding: "14px 18px" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
            style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 12px 9px 32px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}
            onFocus={e => e.target.style.borderColor = T.yellow} onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>
        <select value={planF} onChange={e => setPlanF(e.target.value)}
          style={{ background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 14px", color: T.text, fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
        >
          <option value="Todos">Todos</option>
          {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
        <span style={{ color: T.textSub, fontSize: "12px" }}>{filtered.length} resultados</span>
      </div>

      {/* Loading / Error */}
      {loading && <div style={{ ...card, textAlign: "center", color: T.textMute, padding: "40px" }}>Cargando miembros...</div>}
      {error   && <div style={{ ...card, textAlign: "center", color: T.danger,   padding: "20px" }}>{error}</div>}

      {/* Table */}
      {!loading && (
        <div style={{ ...card, overflowX: "auto", padding: "0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["USUARIO", "TELÉFONO", "PLAN", "VENCE", "ESTADO", ""].map(h => (
                  <th key={h} style={{ color: T.textMute, fontSize: "10px", textAlign: "left", padding: "14px 16px", fontWeight: "700", letterSpacing: "0.8px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}
                  style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Avatar name={u.name} size={32} />
                      <div>
                        <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "600" }}>{u.name}</p>
                        <p style={{ color: T.textMute, margin: "1px 0 0", fontSize: "11px" }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", color: T.textSub, fontSize: "12px" }}>{u.phone}</td>
                  <td style={{ padding: "13px 16px" }}>
                    {u.plan ? <Badge text={u.plan} color={planColor(u.plan)} /> : <span style={{ color: T.textMute, fontSize: "12px" }}>Sin plan</span>}
                  </td>
                  <td style={{ padding: "13px 16px", color: u.daysLeft <= 7 ? T.warning : T.textSub, fontSize: "12px", fontWeight: u.daysLeft <= 7 ? "700" : "400" }}>
                    {u.endDate ? new Date(u.endDate).toLocaleDateString("es-PE") : "—"}
                    {u.daysLeft <= 7 && u.daysLeft !== null && ` (${u.daysLeft}d)`}
                  </td>
                  <td style={{ padding: "13px 16px" }}><Badge text={u.status} color={T.success} /></td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Btn size="sm" variant="ghost"  onClick={() => setModal(u)}>Editar</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setDelConfirm(u.id)}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div style={{ padding: "40px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>No se encontraron usuarios</div>
          )}
        </div>
      )}

      {modal && (
        <UserModal
          user={modal === "new" ? null : modal}
          plans={plans}
          onClose={() => setModal(null)}
          onSave={saveUser}
        />
      )}

      {delConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "28px", maxWidth: "340px", textAlign: "center" }}>
            <p style={{ color: T.text, fontSize: "16px", fontWeight: "700", margin: "0 0 8px" }}>¿Eliminar usuario?</p>
            <p style={{ color: T.textSub, fontSize: "13px", margin: "0 0 24px" }}>Esta acción desactivará al miembro.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="outline" onClick={() => setDelConfirm(null)} full>Cancelar</Btn>
              <Btn variant="danger" onClick={() => deleteUser(delConfirm)} full>Eliminar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
