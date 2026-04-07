import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { plansService } from "../api/services";
import Input from "../components/ui/Input";
import Btn   from "../components/ui/Btn";

export default function UserModal({ user, onClose, onSave }) {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Formatear fecha ISO → yyyy-mm-dd para input type=date
  const toInputDate = (val) => {
    if (!val) return "";
    try { return new Date(val).toISOString().split("T")[0]; }
    catch { return ""; }
  };

  const BLANK = { name: "", email: "", phone: "", birthDate: "", planId: "", startDate: "", endDate: "" };

  const [form, setForm] = useState(
    user
      ? {
          name:      user.name       ?? "",
          email:     user.email      ?? "",
          phone:     user.phone      ?? "",
          birthDate: toInputDate(user.birthDate),
          planId:    "",   // se rellena cuando carguen los planes
          startDate: toInputDate(user.startDate),
          endDate:   toInputDate(user.endDate),
        }
      : BLANK
  );

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  // Cargar planes disponibles
  useEffect(() => {
    plansService.getAll().then(p => {
      setPlans(p);
      // Si estamos editando, pre-seleccionar el plan actual
      if (user?.plan) {
        const found = p.find(pl => pl.name === user.plan);
        if (found) setForm(prev => ({ ...prev, planId: String(found.id) }));
      } else if (p.length > 0) {
        setForm(prev => ({ ...prev, planId: String(p[0].id) }));
      }
    }).finally(() => setLoading(false));
  }, []);

  // Auto-calcular fecha fin cuando cambia inicio o plan
  useEffect(() => {
    if (!form.startDate || !form.planId) return;
    const plan = plans.find(p => String(p.id) === form.planId);
    if (!plan) return;
    const start = new Date(form.startDate);
    start.setDate(start.getDate() + plan.durationDays);
    setForm(p => ({ ...p, endDate: start.toISOString().split("T")[0] }));
  }, [form.startDate, form.planId, plans]);

  const handleSave = () => {
    onSave({
      id:         user?.id,
      name:       form.name,
      email:      form.email,
      phone:      form.phone      || null,
      birthDate:  form.birthDate  || null,
      planId:     form.planId     ? +form.planId : null,
      startDate:  form.startDate  || null,
      endDate:    form.endDate    || null,
    });
    onClose();
  };

  const selectedPlan = plans.find(p => String(p.id) === form.planId);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
      <div style={{ ...card, width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px", letterSpacing: "1px" }}>
            {user ? "EDITAR USUARIO" : "NUEVO USUARIO"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px", lineHeight: 1 }}>×</button>
        </div>

        {loading ? (
          <p style={{ color: T.textMute, textAlign: "center", padding: "20px" }}>Cargando...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="Nombre completo" value={form.name}  onChange={set("name")}  placeholder="Carlos Pérez" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Email"    value={form.email} onChange={set("email")} placeholder="correo@gmail.com" />
              <Input label="Teléfono" value={form.phone ?? ""} onChange={set("phone")} placeholder="984-123-4567" />
            </div>
            <Input label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={set("birthDate")} />

            {/* Plan — cargado desde la API */}
            <div>
              <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Plan</label>
              <select value={form.planId} onChange={set("planId")}
                style={{ width: "100%", boxSizing: "border-box", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                <option value="">Sin plan</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — S/. {Number(p.price).toFixed(2)} ({p.durationDays} días)
                  </option>
                ))}
              </select>
            </div>

            {/* Preview precio */}
            {selectedPlan && (
              <div style={{ background: T.dark3, borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: T.textSub, fontSize: "12px" }}>Precio del plan:</span>
                <span style={{ color: T.yellow, fontFamily: "Bebas Neue, sans-serif", fontSize: "18px" }}>S/. {Number(selectedPlan.price).toFixed(2)}</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="Inicio del plan" type="date" value={form.startDate} onChange={set("startDate")} />
              <div>
                <Input label="Fin del plan" type="date" value={form.endDate} onChange={set("endDate")} />
                {form.startDate && form.planId && (
                  <p style={{ color: T.textMute, fontSize: "10px", margin: "4px 0 0" }}>
                    ↑ Calculado automáticamente
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
          <Btn onClick={handleSave} disabled={!form.name || !form.email || loading} full>
            {user ? "Guardar cambios" : "Crear usuario"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
