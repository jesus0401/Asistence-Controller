import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import T from "../constants/theme";
import { card } from "../constants/theme";
import {
  MUSCLE_GROUPS, EXERCISES_CATALOG, DAYS,
  BODY_PARTS_MEASUREMENTS, getIMCCategory, IMC_CATEGORIES,
} from "../constants/fitnessData";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";

/* ─── helpers ─────────────────────────────────────── */
const calcIMC = (kg, cm) => {
  if (!kg || !cm) return null;
  const m = cm / 100;
  return +(kg / (m * m)).toFixed(1);
};

const muscleColor = id => MUSCLE_GROUPS.find(m => m.id === id)?.color || T.textSub;
const muscleLabel = id => MUSCLE_GROUPS.find(m => m.id === id)?.label || id;

/* ─── mock initial data ────────────────────────────── */
const MOCK_METRICS = {
  1: [
    { date: "01/01", weight: 82, height: 175, measurements: { cintura: 90, pecho: 100 } },
    { date: "01/02", weight: 80, height: 175, measurements: { cintura: 88, pecho: 100 } },
    { date: "01/03", weight: 78, height: 175, measurements: { cintura: 86, pecho: 99  } },
  ],
};

/* ═══════════════════════════════════════
   SUB-TAB 1: MÉTRICAS & IMC
═══════════════════════════════════════ */
function MetricsTab({ users }) {
  const [userId, setUserId]     = useState(users[0]?.id ?? null);
  const [metrics, setMetrics]   = useState(MOCK_METRICS);
  const [weight, setWeight]     = useState("");
  const [height, setHeight]     = useState("");
  const [parts, setParts]       = useState({});
  const [saved, setSaved]       = useState(false);

  const user    = users.find(u => u.id === userId);
  const history = metrics[userId] ?? [];
  const imc     = calcIMC(+weight, +height);
  const imcCat  = imc ? getIMCCategory(imc) : null;

  const saveRecord = () => {
    if (!weight || !height) return;
    const record = {
      date: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" }),
      weight: +weight, height: +height,
      measurements: { ...parts },
    };
    setMetrics(prev => ({ ...prev, [userId]: [record, ...(prev[userId] ?? [])] }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setWeight(""); setHeight(""); setParts({});
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* User selector */}
      <div style={{ ...card, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: T.textSub, fontSize: "12px", fontWeight: "700", letterSpacing: "0.8px" }}>CLIENTE</span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {users.map(u => (
              <div key={u.id}
                onClick={() => { setUserId(u.id); setWeight(""); setHeight(""); setParts({}); }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "7px 14px", borderRadius: "8px", cursor: "pointer",
                  background: userId === u.id ? T.yellowGlow : T.dark3,
                  border: `1px solid ${userId === u.id ? T.yellow : T.border}`,
                  transition: "all 0.15s",
                }}
              >
                <Avatar name={u.name} size={22} color={userId === u.id ? T.yellow : T.textMute} />
                <span style={{ color: userId === u.id ? T.yellow : T.textSub, fontSize: "12px", fontWeight: userId === u.id ? "700" : "400" }}>
                  {u.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Input form */}
        <div style={{ ...card, flex: "1", minWidth: "280px" }}>
          <h3 style={{ color: T.text, margin: "0 0 18px", fontFamily: "Bebas Neue, sans-serif", fontSize: "20px", letterSpacing: "1px" }}>
            📏 NUEVO REGISTRO — {user?.name}
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <Input label="Peso (kg)"    type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75" />
            <Input label="Estatura (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
          </div>

          {/* IMC preview */}
          {imc && (
            <div style={{ background: T.dark3, borderRadius: "10px", padding: "14px", marginBottom: "16px", border: `1px solid ${imcCat.color}44` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: T.textMute, fontSize: "10px", margin: 0, letterSpacing: "1px" }}>IMC CALCULADO</p>
                  <p style={{ color: imcCat.color, fontSize: "32px", fontWeight: "400", margin: "2px 0 0", fontFamily: "Bebas Neue, sans-serif" }}>{imc}</p>
                </div>
                <Badge text={imcCat.label} color={imcCat.color} />
              </div>
              {/* IMC bar */}
              <div style={{ marginTop: "10px", height: "6px", borderRadius: "3px", background: T.dark4, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", borderRadius: "3px", background: `linear-gradient(90deg, #60A5FA, #4ADE80, #FBBF24, #F87171)`, width: "100%" }} />
                <div style={{ position: "absolute", top: "-3px", width: "12px", height: "12px", borderRadius: "50%", background: "#fff", border: `2px solid ${imcCat.color}`, transform: "translateX(-50%)", left: `${Math.min(((imc - 10) / 30) * 100, 100)}%`, transition: "left 0.4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ color: T.textMute, fontSize: "9px" }}>10</span>
                <span style={{ color: T.textMute, fontSize: "9px" }}>18.5</span>
                <span style={{ color: T.textMute, fontSize: "9px" }}>25</span>
                <span style={{ color: T.textMute, fontSize: "9px" }}>30</span>
                <span style={{ color: T.textMute, fontSize: "9px" }}>40</span>
              </div>
            </div>
          )}

          {/* Measurements */}
          <p style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 10px", fontWeight: "700" }}>
            Medidas corporales (cm)
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            {BODY_PARTS_MEASUREMENTS.map(bp => (
              <Input
                key={bp.key}
                label={bp.label}
                type="number"
                value={parts[bp.key] ?? ""}
                onChange={e => setParts(prev => ({ ...prev, [bp.key]: e.target.value }))}
                placeholder="cm"
              />
            ))}
          </div>

          {saved ? (
            <div style={{ background: "rgba(74,222,128,0.1)", border: `1px solid ${T.success}44`, borderRadius: "8px", padding: "12px", textAlign: "center", color: T.success, fontWeight: "700" }}>
              ✅ Registro guardado correctamente
            </div>
          ) : (
            <Btn onClick={saveRecord} disabled={!weight || !height} full>
              💾 Guardar registro
            </Btn>
          )}
        </div>

        {/* History & chart */}
        <div style={{ flex: "1.5", minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Weight chart */}
          {history.length >= 2 && (
            <div style={{ ...card }}>
              <h3 style={{ color: T.text, margin: "0 0 14px", fontSize: "14px", fontWeight: "700" }}>📈 Evolución de Peso — {user?.name}</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={[...history].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.dark4} />
                  <XAxis dataKey="date" stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 10 }} />
                  <YAxis stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 10 }} unit="kg" />
                  <Tooltip contentStyle={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="weight" stroke={T.yellow} strokeWidth={2.5} dot={{ fill: T.yellow, r: 4 }} name="Peso (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* History table */}
          <div style={{ ...card, padding: 0 }}>
            <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ color: T.text, margin: 0, fontSize: "14px", fontWeight: "700" }}>Historial de mediciones</h3>
            </div>
            {history.length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>
                Sin registros aún para este cliente
              </div>
            ) : (
              <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {history.map((r, i) => {
                  const rImc = calcIMC(r.weight, r.height);
                  const rCat = rImc ? getIMCCategory(rImc) : null;
                  return (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ color: T.textMute, fontSize: "11px", margin: "0 0 4px" }}>{r.date}</p>
                        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                          <span style={{ color: T.text, fontSize: "13px", fontWeight: "700" }}>{r.weight} kg</span>
                          <span style={{ color: T.textSub, fontSize: "12px" }}>{r.height} cm</span>
                          {rImc && <span style={{ color: rCat.color, fontSize: "12px", fontWeight: "700" }}>IMC: {rImc}</span>}
                        </div>
                        {Object.keys(r.measurements ?? {}).length > 0 && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                            {Object.entries(r.measurements).map(([k, v]) => v ? (
                              <span key={k} style={{ color: T.textMute, fontSize: "10px", background: T.dark3, padding: "2px 8px", borderRadius: "4px" }}>
                                {BODY_PARTS_MEASUREMENTS.find(b => b.key === k)?.label ?? k}: {v}cm
                              </span>
                            ) : null)}
                          </div>
                        )}
                      </div>
                      {rCat && <Badge text={rCat.label} color={rCat.color} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SUB-TAB 2: RUTINAS POR USUARIO
═══════════════════════════════════════ */
function RoutinesTab({ users, routines, setRoutines }) {
  const [userId,   setUserId]   = useState(users[0]?.id ?? null);
  const [activeDay, setActiveDay] = useState("Lunes");
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMuscle, setPickerMuscle] = useState("pecho");

  const user = users.find(u => u.id === userId);
  const userRoutines = routines[userId] ?? {};
  const dayExercises = userRoutines[activeDay] ?? [];

  const addExercise = (exercise) => {
    const item = { ...exercise, sets: 4, reps: 12, rest: 60, uid: Date.now() };
    setRoutines(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] ?? {}),
        [activeDay]: [...(prev[userId]?.[activeDay] ?? []), item],
      },
    }));
    setShowPicker(false);
  };

  const removeExercise = (uid) => {
    setRoutines(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] ?? {}),
        [activeDay]: (prev[userId]?.[activeDay] ?? []).filter(e => e.uid !== uid),
      },
    }));
  };

  const updateExercise = (uid, field, val) => {
    setRoutines(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] ?? {}),
        [activeDay]: (prev[userId]?.[activeDay] ?? []).map(e =>
          e.uid === uid ? { ...e, [field]: +val } : e
        ),
      },
    }));
  };

  const filteredExercises = EXERCISES_CATALOG.filter(e => e.muscle === pickerMuscle);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* User selector */}
      <div style={{ ...card, padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: T.textSub, fontSize: "11px", fontWeight: "700", letterSpacing: "0.8px" }}>CLIENTE</span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {users.map(u => (
              <div key={u.id}
                onClick={() => setUserId(u.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "6px 12px", borderRadius: "8px", cursor: "pointer",
                  background: userId === u.id ? T.yellowGlow : T.dark3,
                  border: `1px solid ${userId === u.id ? T.yellow : T.border}`,
                }}
              >
                <Avatar name={u.name} size={20} color={userId === u.id ? T.yellow : T.textMute} />
                <span style={{ color: userId === u.id ? T.yellow : T.textSub, fontSize: "12px", fontWeight: userId === u.id ? "700" : "400" }}>
                  {u.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {/* Day selector */}
        <div style={{ ...card, flex: "0 0 auto", minWidth: "130px", padding: "14px" }}>
          <p style={{ color: T.textMute, fontSize: "10px", letterSpacing: "0.8px", margin: "0 0 10px", fontWeight: "700" }}>DÍA</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {DAYS.map(day => {
              const count = (userRoutines[day] ?? []).length;
              return (
                <div key={day}
                  onClick={() => setActiveDay(day)}
                  style={{
                    padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
                    background: activeDay === day ? T.yellowGlow : "transparent",
                    border: `1px solid ${activeDay === day ? T.yellow : "transparent"}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span style={{ color: activeDay === day ? T.yellow : T.textSub, fontSize: "13px", fontWeight: activeDay === day ? "700" : "400" }}>
                    {day}
                  </span>
                  {count > 0 && (
                    <span style={{ background: T.yellow, color: "#000", fontSize: "9px", fontWeight: "800", borderRadius: "10px", padding: "1px 6px" }}>
                      {count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Exercises list */}
        <div style={{ ...card, flex: 1, minWidth: "280px", padding: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px", letterSpacing: "1px" }}>
                {activeDay.toUpperCase()} — {user?.name?.split(" ")[0]}
              </h3>
              <p style={{ color: T.textSub, margin: "2px 0 0", fontSize: "12px" }}>
                {dayExercises.length} ejercicio{dayExercises.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Btn onClick={() => setShowPicker(true)}>+ Agregar ejercicio</Btn>
          </div>

          {dayExercises.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: T.textMute, fontSize: "13px", borderRadius: "10px", border: `2px dashed ${T.border}` }}>
              Sin ejercicios para este día.<br />
              <span style={{ color: T.yellow, cursor: "pointer" }} onClick={() => setShowPicker(true)}>+ Añadir ejercicio</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dayExercises.map((ex, i) => (
                <div key={ex.uid} style={{ background: T.dark3, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${T.border}`, display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  {/* Index */}
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: T.yellowGlow, border: `1px solid ${T.yellow}44`, display: "flex", alignItems: "center", justifyContent: "center", color: T.yellow, fontSize: "11px", fontWeight: "800", flexShrink: 0 }}>
                    {i + 1}
                  </div>

                  {/* Name + muscle */}
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "700" }}>{ex.name}</p>
                    <div style={{ display: "flex", gap: "6px", marginTop: "4px", alignItems: "center" }}>
                      <Badge text={muscleLabel(ex.muscle)} color={muscleColor(ex.muscle)} />
                      <Badge text={ex.type} color={T.textMute} />
                    </div>
                  </div>

                  {/* Sets / reps / rest */}
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    {[
                      { field: "sets", label: "Series",  unit: ""   },
                      { field: "reps", label: "Reps",    unit: ""   },
                      { field: "rest", label: "Descanso", unit: "s" },
                    ].map(({ field, label, unit }) => (
                      <div key={field} style={{ textAlign: "center" }}>
                        <p style={{ color: T.textMute, fontSize: "9px", margin: "0 0 3px", letterSpacing: "0.5px" }}>{label.toUpperCase()}</p>
                        <input
                          type="number"
                          value={ex[field]}
                          onChange={e => updateExercise(ex.uid, field, e.target.value)}
                          style={{
                            width: "54px", background: T.dark4, border: `1px solid ${T.border}`,
                            borderRadius: "6px", padding: "5px 6px", color: T.yellow,
                            fontSize: "14px", fontWeight: "700", textAlign: "center",
                            outline: "none", fontFamily: "Bebas Neue, sans-serif",
                          }}
                          onFocus={e => e.target.style.borderColor = T.yellow}
                          onBlur={e  => e.target.style.borderColor = T.border}
                        />
                        {unit && <p style={{ color: T.textMute, fontSize: "9px", margin: "2px 0 0" }}>{unit}</p>}
                      </div>
                    ))}
                  </div>

                  <button onClick={() => removeExercise(ex.uid)}
                    style={{ background: "none", border: "none", color: T.danger, cursor: "pointer", fontSize: "16px", flexShrink: 0, opacity: 0.7 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise picker modal */}
      {showPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ ...card, width: "100%", maxWidth: "600px", maxHeight: "88vh", display: "flex", flexDirection: "column", gap: 0, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px", letterSpacing: "1px" }}>
                SELECCIONAR EJERCICIO
              </h3>
              <button onClick={() => setShowPicker(false)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
            </div>

            {/* Muscle tabs */}
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {MUSCLE_GROUPS.map(mg => (
                <button key={mg.id} onClick={() => setPickerMuscle(mg.id)}
                  style={{
                    background: pickerMuscle === mg.id ? `${mg.color}22` : T.dark3,
                    border: `1px solid ${pickerMuscle === mg.id ? mg.color : T.border}`,
                    borderRadius: "6px", padding: "5px 12px", cursor: "pointer",
                    color: pickerMuscle === mg.id ? mg.color : T.textSub,
                    fontSize: "11px", fontWeight: "600", fontFamily: "Nunito, sans-serif",
                  }}
                >
                  {mg.icon} {mg.label}
                </button>
              ))}
            </div>

            {/* Exercise list */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredExercises.map(ex => {
                const alreadyAdded = dayExercises.some(e => e.id === ex.id);
                return (
                  <div key={ex.id}
                    onClick={() => !alreadyAdded && addExercise(ex)}
                    style={{
                      padding: "14px 20px", borderBottom: `1px solid ${T.border}`,
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: alreadyAdded ? "default" : "pointer",
                      opacity: alreadyAdded ? 0.4 : 1,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => { if (!alreadyAdded) e.currentTarget.style.background = T.dark3; }}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <p style={{ color: T.text, margin: 0, fontSize: "13px", fontWeight: "600" }}>{ex.name}</p>
                      <Badge text={ex.type} color={T.textMute} />
                    </div>
                    {alreadyAdded
                      ? <span style={{ color: T.success, fontSize: "12px" }}>✓ Agregado</span>
                      : <span style={{ color: T.yellow, fontSize: "20px" }}>+</span>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SUB-TAB 3: CATÁLOGO DE EJERCICIOS
═══════════════════════════════════════ */
function ExercisesTab() {
  const [exercises, setExercises] = useState(EXERCISES_CATALOG);
  const [filterMuscle, setFilterMuscle] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newEx, setNewEx] = useState({ name: "", muscle: "pecho", type: "Fuerza" });

  const filtered = filterMuscle === "all" ? exercises : exercises.filter(e => e.muscle === filterMuscle);

  const addExercise = () => {
    if (!newEx.name.trim()) return;
    setExercises(prev => [...prev, { ...newEx, id: Date.now() }]);
    setNewEx({ name: "", muscle: "pecho", type: "Fuerza" });
    setShowForm(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <p style={{ color: T.textSub, margin: 0, fontSize: "13px" }}>{filtered.length} ejercicios en el catálogo</p>
        <Btn onClick={() => setShowForm(true)}>+ Nuevo ejercicio</Btn>
      </div>

      {/* Filter by muscle */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <button onClick={() => setFilterMuscle("all")}
          style={{ background: filterMuscle === "all" ? T.yellow : T.dark3, color: filterMuscle === "all" ? "#000" : T.textSub, border: `1px solid ${filterMuscle === "all" ? T.yellow : T.border}`, borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "Nunito, sans-serif" }}>
          Todos
        </button>
        {MUSCLE_GROUPS.map(mg => (
          <button key={mg.id} onClick={() => setFilterMuscle(mg.id)}
            style={{
              background: filterMuscle === mg.id ? `${mg.color}22` : T.dark3,
              border: `1px solid ${filterMuscle === mg.id ? mg.color : T.border}`,
              borderRadius: "6px", padding: "5px 12px", cursor: "pointer",
              color: filterMuscle === mg.id ? mg.color : T.textSub,
              fontSize: "11px", fontWeight: "600", fontFamily: "Nunito, sans-serif",
            }}
          >
            {mg.icon} {mg.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
        {filtered.map(ex => (
          <div key={ex.id} style={{ ...card, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: T.text, margin: "0 0 6px", fontSize: "13px", fontWeight: "600" }}>{ex.name}</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <Badge text={muscleLabel(ex.muscle)} color={muscleColor(ex.muscle)} />
                <Badge text={ex.type} color={T.textMute} />
              </div>
            </div>
            <button
              onClick={() => setExercises(prev => prev.filter(e => e.id !== ex.id))}
              style={{ background: "none", border: "none", color: T.textMute, cursor: "pointer", fontSize: "14px", opacity: 0.5 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = T.danger; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = T.textMute; }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Add exercise modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ ...card, width: "100%", maxWidth: "420px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>NUEVO EJERCICIO</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Input label="Nombre del ejercicio" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Press con cables" />
              <Select
                label="Grupo muscular"
                value={newEx.muscle}
                onChange={e => setNewEx(p => ({ ...p, muscle: e.target.value }))}
                options={MUSCLE_GROUPS.map(m => m.id)}
              />
              <Select
                label="Tipo"
                value={newEx.type}
                onChange={e => setNewEx(p => ({ ...p, type: e.target.value }))}
                options={["Fuerza", "Aislamiento", "Compuesto", "Peso corporal", "Cardio"]}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Btn variant="outline" onClick={() => setShowForm(false)} full>Cancelar</Btn>
              <Btn onClick={addExercise} disabled={!newEx.name.trim()} full>Guardar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN FITNESS PAGE
═══════════════════════════════════════ */
const TABS = [
  { id: "metricas",   label: "📏 Métricas & IMC"    },
  { id: "rutinas",    label: "🏋️ Rutinas"           },
  { id: "ejercicios", label: "📚 Catálogo ejercicios" },
];

export default function Fitness({ users, routines, setRoutines }) {
  const [tab, setTab] = useState("metricas");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>
          FITNESS & ENTRENAMIENTO
        </h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>
          Métricas corporales, rutinas personalizadas y catálogo de ejercicios
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "4px", background: T.dark2, padding: "4px", borderRadius: "10px", border: `1px solid ${T.border}`, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? T.yellow : "transparent",
              color: tab === t.id ? "#000" : T.textSub,
              border: "none", borderRadius: "7px", padding: "9px 18px",
              cursor: "pointer", fontSize: "12px", fontWeight: "700",
              transition: "all 0.2s", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "metricas"   && <MetricsTab   users={users} />}
      {tab === "rutinas"    && <RoutinesTab   users={users} routines={routines} setRoutines={setRoutines} />}
      {tab === "ejercicios" && <ExercisesTab  />}
    </div>
  );
}
