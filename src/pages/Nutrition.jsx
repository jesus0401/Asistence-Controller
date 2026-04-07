import { useState, useEffect } from "react";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { membersService, nutritionService } from "../api/services";
import Avatar from "../components/ui/Avatar";
import Btn    from "../components/ui/Btn";
import Input  from "../components/ui/Input";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAY_MAP = { "Lunes": "LUNES", "Martes": "MARTES", "Miércoles": "MIERCOLES", "Jueves": "JUEVES", "Viernes": "VIERNES", "Sábado": "SABADO" };

const MEALS = [
  { id: "desayuno", label: "Desayuno",     icon: "🌅", color: "#FBBF24" },
  { id: "media",    label: "Media mañana", icon: "🍎", color: "#4ADE80" },
  { id: "almuerzo", label: "Almuerzo",     icon: "🍽️", color: "#60A5FA" },
  { id: "merienda", label: "Merienda",     icon: "🥤", color: "#A78BFA" },
  { id: "cena",     label: "Cena",         icon: "🌙", color: "#FB923C" },
];

const MACROS = [
  { key: "calorias",  label: "Calorías",  unit: "kcal", color: T.yellow  },
  { key: "proteinas", label: "Proteínas", unit: "g",    color: "#60A5FA" },
  { key: "carbos",    label: "Carbos",    unit: "g",    color: "#FBBF24" },
  { key: "grasas",    label: "Grasas",    unit: "g",    color: "#F87171" },
];

export default function Nutrition() {
  const [users,      setUsers]      = useState([]);
  const [userId,     setUserId]     = useState(null);
  const [nutrition,  setNutrition]  = useState({});
  const [activeDay,  setActiveDay]  = useState("Lunes");
  const [editing,    setEditing]    = useState(null);
  const [editData,   setEditData]   = useState({});
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    membersService.getAll().then(m => {
      setUsers(m);
      if (m.length > 0) setUserId(m[0].id);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!userId) return;
    nutritionService.getByMember(userId).then(n => setNutrition(n)).catch(() => setNutrition({}));
  }, [userId]);

  const apiDay  = DAY_MAP[activeDay] ?? "LUNES";
  const dayPlan = nutrition[apiDay] ?? {};

  const startEdit = (mealId) => {
    setEditing(mealId);
    setEditData({ ...dayPlan[mealId] ?? {} });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await nutritionService.saveMeal(userId, apiDay, editing, editData);
      const updated = await nutritionService.getByMember(userId);
      setNutrition(updated);
      setEditing(null);
    } catch (e) { alert("Error: " + e.message); }
    finally { setSaving(false); }
  };

  const totals = MEALS.reduce((acc, m) => {
    MACROS.forEach(macro => { acc[macro.key] = (acc[macro.key] ?? 0) + (+dayPlan[m.id]?.[macro.key] || 0); });
    return acc;
  }, {});

  const completedMeals = MEALS.filter(m => dayPlan[m.id]?.food?.trim()).length;

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><p style={{ color: T.textMute }}>Cargando...</p></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>PLAN DE ALIMENTACIÓN</h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Dieta personalizada por cliente, día y comida</p>
      </div>

      {/* User selector */}
      <div style={{ ...card, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: T.textSub, fontSize: "11px", fontWeight: "700", letterSpacing: "0.8px" }}>CLIENTE</span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {users.map(u => (
              <div key={u.id} onClick={() => setUserId(u.id)}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 13px", borderRadius: "8px", cursor: "pointer", background: userId === u.id ? T.yellowGlow : T.dark3, border: `1px solid ${userId === u.id ? T.yellow : T.border}` }}>
                <Avatar name={u.name} size={20} color={userId === u.id ? T.yellow : T.textMute} />
                <span style={{ color: userId === u.id ? T.yellow : T.textSub, fontSize: "12px", fontWeight: userId === u.id ? "700" : "400" }}>{u.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Day sidebar */}
        <div style={{ ...card, flex: "0 0 auto", minWidth: "130px", padding: "14px" }}>
          <p style={{ color: T.textMute, fontSize: "10px", letterSpacing: "0.8px", margin: "0 0 10px", fontWeight: "700" }}>DÍA</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {DAYS.map(day => {
              const apiD  = DAY_MAP[day];
              const filled = Object.values(nutrition[apiD] ?? {}).filter(m => m?.food?.trim()).length;
              return (
                <div key={day} onClick={() => setActiveDay(day)}
                  style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", background: activeDay === day ? T.yellowGlow : "transparent", border: `1px solid ${activeDay === day ? T.yellow : "transparent"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: activeDay === day ? T.yellow : T.textSub, fontSize: "13px", fontWeight: activeDay === day ? "700" : "400" }}>{day}</span>
                  {filled > 0 && <span style={{ background: "#4ADE8022", color: "#4ADE80", fontSize: "9px", fontWeight: "800", borderRadius: "10px", padding: "1px 6px" }}>{filled}/{MEALS.length}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Meals */}
        <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Day summary */}
          <div style={{ ...card, padding: "14px 18px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <p style={{ color: T.textMute, fontSize: "10px", margin: 0 }}>DÍA</p>
              <p style={{ color: T.yellow, fontSize: "18px", fontWeight: "400", margin: 0, fontFamily: "Bebas Neue, sans-serif" }}>{activeDay.toUpperCase()}</p>
            </div>
            <div style={{ display: "flex", gap: "1px", flex: 1 }}>
              {MEALS.map(m => <div key={m.id} style={{ flex: 1, height: "6px", background: dayPlan[m.id]?.food?.trim() ? "#4ADE80" : T.dark4, borderRadius: "2px" }} />)}
            </div>
            <span style={{ color: completedMeals === MEALS.length ? T.success : T.textMute, fontSize: "12px", fontWeight: "700" }}>{completedMeals}/{MEALS.length} comidas</span>
            {MACROS.map(macro => totals[macro.key] > 0 && (
              <div key={macro.key} style={{ textAlign: "center" }}>
                <p style={{ color: T.textMute, fontSize: "9px", margin: 0 }}>{macro.label.toUpperCase()}</p>
                <p style={{ color: macro.color, fontSize: "14px", fontWeight: "700", margin: 0, fontFamily: "Bebas Neue, sans-serif" }}>{totals[macro.key]}{macro.unit}</p>
              </div>
            ))}
          </div>

          {MEALS.map(meal => {
            const data   = dayPlan[meal.id] ?? {};
            const filled = !!data.food?.trim();
            return (
              <div key={meal.id} style={{ ...card, padding: "16px 18px", borderLeft: `3px solid ${filled ? meal.color : T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: filled ? "12px" : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{meal.icon}</span>
                    <div>
                      <p style={{ color: meal.color, margin: 0, fontSize: "11px", fontWeight: "700", letterSpacing: "0.8px" }}>{meal.label.toUpperCase()}</p>
                      {!filled && <p style={{ color: T.textMute, margin: "2px 0 0", fontSize: "12px" }}>Sin planificar</p>}
                    </div>
                  </div>
                  <Btn size="sm" variant="ghost" onClick={() => startEdit(meal.id)}>{filled ? "✏️ Editar" : "+ Agregar"}</Btn>
                </div>
                {filled && (
                  <div>
                    <p style={{ color: T.text, margin: "0 0 4px", fontSize: "14px", fontWeight: "600" }}>{data.food}</p>
                    {data.notes && <p style={{ color: T.textSub, margin: "0 0 8px", fontSize: "12px", fontStyle: "italic" }}>"{data.notes}"</p>}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {MACROS.map(macro => data[macro.key] ? (
                        <span key={macro.key} style={{ background: `${macro.color}15`, color: macro.color, padding: "2px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>
                          {macro.label}: {data[macro.key]}{macro.unit}
                        </span>
                      ) : null)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ ...card, width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto" }}>
            {(() => {
              const meal = MEALS.find(m => m.id === editing);
              return (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>{meal?.icon} {meal?.label?.toUpperCase()} — {activeDay}</h3>
                    <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
                    <Input label="Descripción de la comida" value={editData.food ?? ""} onChange={e => setEditData(p => ({ ...p, food: e.target.value }))} placeholder="Ej: Arroz con pollo + ensalada" />
                    <Input label="Notas / indicaciones" value={editData.notes ?? ""} onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))} placeholder="Ej: Sin sal, porción mediana" />
                    <p style={{ color: T.textSub, fontSize: "11px", margin: 0, letterSpacing: "0.8px", fontWeight: "700" }}>MACRONUTRIENTES (opcional)</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {MACROS.map(macro => (
                        <Input key={macro.key} label={`${macro.label} (${macro.unit})`} type="number" value={editData[macro.key] ?? ""} onChange={e => setEditData(p => ({ ...p, [macro.key]: e.target.value }))} placeholder="0" />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                    <Btn variant="outline" onClick={() => setEditing(null)} full>Cancelar</Btn>
                    <Btn onClick={saveEdit} disabled={!editData.food?.trim() || saving} full>{saving ? "Guardando..." : "Guardar"}</Btn>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}