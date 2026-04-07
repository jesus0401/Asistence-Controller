import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { membersService, plansService } from "../api/services";
import Avatar    from "../components/ui/Avatar";
import Badge     from "../components/ui/Badge";
import Btn       from "../components/ui/Btn";
import UserModal from "../modals/UserModal";

const PAGE_SIZE = 15;
const API = import.meta.env.VITE_API_URL || "https://asistence-controller-backend.onrender.com/api";
const planColor = p => ({ Mensual: T.yellow, Trimestral: T.info, Semestral: "#A78BFA", Anual: T.success }[p] || T.textSub);

const getMembershipStatus = (u) => {
  if (u.status === "INACTIVO") return { text: "Inactivo", color: T.danger };
  if (!u.endDate) return { text: "Sin plan", color: T.textMute };
  const days = u.daysLeft;
  if (days < 0)  return { text: "Vencida",    color: T.danger  };
  if (days === 0) return { text: "Vence hoy", color: T.warning };
  if (days <= 7)  return { text: `${days}d`,  color: T.warning };
  return { text: "Activo", color: T.success };
};

export default function Users() {
  const [members,    setMembers]    = useState([]);
  const [plans,      setPlans]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [search,     setSearch]     = useState("");
  const [planF,      setPlanF]      = useState("Todos");
  const [statusF,    setStatusF]    = useState("ACTIVO");  // ← filtro estado
  const [modal,      setModal]      = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null); // ← confirmar toggle

  const load = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([membersService.getAll(), plansService.getAll()]);
      setMembers(m); setPlans(p);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // Reset página al cambiar filtros
  const resetPage = () => setPage(1);

  const filtered = members.filter(u => {
    const q = search.toLowerCase();
    const matchQ = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchP = planF === "Todos" || u.plan === planF;
    const matchS = statusF === "Todos" || u.status === statusF;
    return matchQ && matchP && matchS;
  });

  const saveUser = async (form) => {
    try {
      if (form.id) {
        await membersService.update(form.id, {
          name:      form.name,
          email:     form.email,
          phone:     form.phone     || null,
          birthDate: form.birthDate || null,
        });
        if (form.planId && form.startDate && form.endDate) {
          await fetch(`${API}/members/${form.id}/membership`, {
            method:  "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("solgym_token")}` },
            body: JSON.stringify({ planId: form.planId, startDate: form.startDate, endDate: form.endDate }),
          });
        }
      } else {
        await membersService.create({
          name:      form.name,
          email:     form.email,
          phone:     form.phone     || null,
          birthDate: form.birthDate || null,
          planId:    form.planId    || null,
          startDate: form.startDate || null,
          endDate:   form.endDate   || null,
        });
      }
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  const toggleStatus = async (u) => {
    try {
      const newStatus = u.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      await membersService.update(u.id, { name: u.name, email: u.email, phone: u.phone, status: newStatus });
      setConfirmToggle(null);
      await load();
    } catch (e) { alert("Error: " + e.message); }
  };

  const activos   = members.filter(m => m.status === "ACTIVO").length;
  const inactivos = members.filter(m => m.status === "INACTIVO").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>GESTIÓN DE USUARIOS</h2>
          <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>{activos} activos · {inactivos} inactivos</p>
        </div>
        <Btn onClick={() => setModal("new")}>+ Nuevo Usuario</Btn>
      </div>

      {/* Filters */}
      <div style={{ ...card, display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", padding: "14px 18px" }}>
        <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px" }}>🔍</span>
          <input value={search} onChange={e => { setSearch(e.target.value); resetPage(); }} placeholder="Buscar por nombre o email..."
            style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 12px 9px 32px", color: T.text, fontSize: "12px", outline: "none", fontFamily: "Nunito, sans-serif" }}
            onFocus={e => e.target.style.borderColor = T.yellow} onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        {/* Filtro por estado */}
        <div style={{ display: "flex", background: T.dark3, borderRadius: "8px", border: `1px solid ${T.border}`, overflow: "hidden" }}>
          {[
            { val: "ACTIVO",   label: `Activos (${activos})`     },
            { val: "INACTIVO", label: `Inactivos (${inactivos})`  },
            { val: "Todos",    label: `Todos (${members.length})` },
          ].map(opt => (
            <button key={opt.val} onClick={() => { setStatusF(opt.val); resetPage(); }}
              style={{ background: statusF === opt.val ? T.yellow : "transparent", color: statusF === opt.val ? "#000" : T.textSub, border: "none", padding: "8px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Filtro por plan */}
        <select value={planF} onChange={e => { setPlanF(e.target.value); resetPage(); }}
          style={{ background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "9px 14px", color: T.text, fontSize: "12px", outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
          <option value="Todos">Todos los planes</option>
          {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>

        <span style={{ color: T.textSub, fontSize: "12px" }}>{filtered.length} resultados</span>
      </div>

      {loading && <div style={{ ...card, textAlign: "center", color: T.textMute, padding: "40px" }}>Cargando miembros...</div>}
      {error   && <div style={{ ...card, textAlign: "center", color: T.danger,   padding: "20px" }}>{error}</div>}

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
              {paginated.map(u => {
                const memStatus = getMembershipStatus(u);
                return (
                  <tr key={u.id}
                    style={{ borderBottom: `1px solid ${T.border}`, transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Avatar name={u.name} size={32} />
                        <div>
                          <p style={{ color: u.status === "INACTIVO" ? T.textMute : T.text, margin: 0, fontSize: "13px", fontWeight: "600" }}>{u.name}</p>
                          <p style={{ color: T.textMute, margin: "1px 0 0", fontSize: "11px" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px", color: T.textSub, fontSize: "12px" }}>{u.phone ?? "—"}</td>
                    <td style={{ padding: "13px 16px" }}>
                      {u.plan
                        ? <Badge text={u.plan} color={planColor(u.plan)} />
                        : <span style={{ color: T.textMute, fontSize: "12px" }}>Sin plan</span>}
                    </td>
                    <td style={{ padding: "13px 16px", color: u.daysLeft !== null && u.daysLeft <= 7 ? T.warning : T.textSub, fontSize: "12px", fontWeight: u.daysLeft !== null && u.daysLeft <= 7 ? "700" : "400" }}>
                      {u.endDate ? new Date(u.endDate).toLocaleDateString("es-PE", { timeZone: "UTC" }) : "—"}
                      {u.daysLeft !== null && u.daysLeft <= 7 && u.daysLeft >= 0 && ` (${u.daysLeft}d)`}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div onClick={() => setConfirmToggle(u)} title={u.status === "ACTIVO" ? "Clic para desactivar" : "Clic para activar"}
                        style={{ cursor: "pointer", display: "inline-block" }}>
                        <Badge text={memStatus.text} color={memStatus.color} />
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Btn size="sm" variant="ghost" onClick={() => setModal(u)}>Editar</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div style={{ padding: "40px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>No se encontraron usuarios</div>
          )}
        </div>
      )}


      {/* Paginado */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderTop: `1px solid ${T.border}` }}>
          <span style={{ color: T.textMute, fontSize: "12px" }}>
            Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: page === 1 ? T.dark3 : T.dark4, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "6px 12px", color: page === 1 ? T.textMute : T.text, cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "Nunito, sans-serif" }}>
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, idx, arr) => (
              <span key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ color: T.textMute, fontSize: "12px", padding: "0 4px" }}>...</span>}
                <button onClick={() => setPage(p)}
                  style={{ background: page === p ? T.yellow : T.dark3, border: `1px solid ${page === p ? T.yellow : T.border}`, borderRadius: "6px", padding: "6px 10px", color: page === p ? "#000" : T.textSub, cursor: "pointer", fontSize: "12px", fontWeight: page === p ? "700" : "400", fontFamily: "Nunito, sans-serif", minWidth: "32px" }}>
                  {p}
                </button>
              </span>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ background: page === totalPages ? T.dark3 : T.dark4, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "6px 12px", color: page === totalPages ? T.textMute : T.text, cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: "12px", fontFamily: "Nunito, sans-serif" }}>
              Siguiente →
            </button>
          </div>
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

      {/* Confirmar activar/desactivar */}
      {confirmToggle && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "28px", maxWidth: "360px", textAlign: "center" }}>
            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>{confirmToggle.status === "ACTIVO" ? "⛔" : "✅"}</p>
            <p style={{ color: T.text, fontSize: "16px", fontWeight: "700", margin: "0 0 8px" }}>
              {confirmToggle.status === "ACTIVO" ? "¿Desactivar usuario?" : "¿Activar usuario?"}
            </p>
            <p style={{ color: T.textSub, fontSize: "13px", margin: "0 0 6px" }}>
              <strong style={{ color: T.yellow }}>{confirmToggle.name}</strong>
            </p>
            <p style={{ color: T.textMute, fontSize: "12px", margin: "0 0 24px" }}>
              {confirmToggle.status === "ACTIVO"
                ? "El usuario no podrá registrar asistencia ni aparecer en búsquedas."
                : "El usuario podrá registrar asistencia y aparecer en búsquedas nuevamente."}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="outline" onClick={() => setConfirmToggle(null)} full>Cancelar</Btn>
              <Btn variant={confirmToggle.status === "ACTIVO" ? "danger" : "primary"} onClick={() => toggleStatus(confirmToggle)} full>
                {confirmToggle.status === "ACTIVO" ? "Desactivar" : "Activar"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
