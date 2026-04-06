import { useState } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Btn from "../components/ui/Btn";

const BLANK = { name: "", email: "", phone: "", born: "", plan: "Mensual", start: "", end: "" };

export default function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState(user ? { ...user } : BLANK);
  const set = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
      <div style={{ ...card, width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "22px", letterSpacing: "1px" }}>
            {user ? "EDITAR USUARIO" : "NUEVO USUARIO"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <Input label="Nombre completo" value={form.name}  onChange={set("name")}  placeholder="Carlos Pérez" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Email"    value={form.email} onChange={set("email")} placeholder="correo@gmail.com" />
            <Input label="Teléfono" value={form.phone} onChange={set("phone")} placeholder="984-123-4567" />
          </div>
          <Input label="Fecha de nacimiento" type="date" value={form.born}  onChange={set("born")} />
          <Select label="Plan" value={form.plan} onChange={set("plan")} options={["Mensual", "Trimestral", "Semestral", "Anual"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Input label="Inicio del plan" type="date" value={form.start} onChange={set("start")} />
            <Input label="Fin del plan"    type="date" value={form.end}   onChange={set("end")} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <Btn variant="outline" onClick={onClose} full>Cancelar</Btn>
          <Btn onClick={() => { onSave(form); onClose(); }} full>Guardar</Btn>
        </div>
      </div>
    </div>
  );
}
