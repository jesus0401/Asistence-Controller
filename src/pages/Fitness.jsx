import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { membersService, metricsService, exercisesService, routinesService } from "../api/services";
import { MUSCLE_GROUPS, BODY_PARTS_MEASUREMENTS, getIMCCategory, DAYS } from "../constants/fitnessData";
import Avatar from "../components/ui/Avatar";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import Input  from "../components/ui/Input";

const calcIMC = (kg, cm) => {
  if (!kg || !cm) return null;
  const m = cm / 100;
  return +(kg / (m * m)).toFixed(1);
};
const muscleColor = id => MUSCLE_GROUPS.find(m => m.id === id)?.color || T.textMute;
const muscleLabel = id => MUSCLE_GROUPS.find(m => m.id === id)?.label || id;
const DAY_MAP = { "Lunes": "LUNES", "Martes": "MARTES", "Miércoles": "MIERCOLES", "Jueves": "JUEVES", "Viernes": "VIERNES", "Sábado": "SABADO" };

/* ══ SELECTOR DE USUARIO con búsqueda ══ */
function UserSelector({ users, userId, onSelect }) {
  const [query,     setQuery]     = useState("");
  const [focused,   setFocused]   = useState(false);
  const [searching, setSearching] = useState(false);
  const [results,   setResults]   = useState([]);
  const [showDrop,  setShowDrop]  = useState(false);

  const selectedUser = users.find(u => u.id === userId);

  // Últimos 5 usuarios (los primeros de la lista)
  const recent = users.slice(0, 5);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    const t = setTimeout(() => {
      const filtered = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered.slice(0, 8));
      setSearching(false);
      setShowDrop(true);
    }, 200);
    return () => clearTimeout(t);
  }, [query, users]);

  const select = (u) => { onSelect(u.id); setQuery(""); setResults([]); setShowDrop(false); };

  return (
    <div style={{ ...card, padding: "16px 20px" }}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Búsqueda */}
        <div style={{ flex: "1", minWidth: "200px", position: "relative" }}>
          <label style={{ color: T.textMute, fontSize: "10px", letterSpacing: "0.8px", fontWeight: "700", display: "block", marginBottom: "6px" }}>BUSCAR CLIENTE</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: T.textMute, fontSize: "13px", pointerEvents: "none" }}>🔍</span>
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
              onFocus={() => setFocused(true)}
              onBlur={() => { setFocused(false); setTimeout(() => setShowDrop(false), 150); }}
              placeholder="Escribe el nombre del cliente..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: T.dark3, border: `1px solid ${focused ? T.yellow : T.border}`,
                borderRadius: "8px", padding: "9px 12px 9px 32px",
                color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {/* Dropdown resultados */}
          {showDrop && query.trim().length >= 2 && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", overflow: "hidden", zIndex: 100 }}>
              {searching ? (
                <div style={{ padding: "12px", textAlign: "center", color: T.textMute, fontSize: "12px" }}>Buscando...</div>
              ) : results.length === 0 ? (
                <div style={{ padding: "12px", textAlign: "center", color: T.textMute, fontSize: "12px" }}>Sin resultados</div>
              ) : results.map(u => (
                <div key={u.id} onMouseDown={() => select(u)}
                  style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background = T.dark3}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Avatar name={u.name} size={26} color={userId === u.id ? T.yellow : T.textMute} />
                  <div>
                    <p style={{ color: T.text, margin: 0, fontSize: "12px", fontWeight: "600" }}>{u.name}</p>
                    <p style={{ color: T.textMute, margin: 0, fontSize: "10px" }}>{u.plan ?? "Sin plan"}</p>
                  </div>
                  {userId === u.id && <span style={{ color: T.yellow, fontSize: "12px", marginLeft: "auto" }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos 5 */}
        <div style={{ flex: "2", minWidth: "200px" }}>
          <label style={{ color: T.textMute, fontSize: "10px", letterSpacing: "0.8px", fontWeight: "700", display: "block", marginBottom: "6px" }}>RECIENTES</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {recent.map(u => (
              <div key={u.id} onClick={() => onSelect(u.id)}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", background: userId === u.id ? T.yellowGlow : T.dark3, border: `1px solid ${userId === u.id ? T.yellow : T.border}`, transition: "all 0.15s" }}>
                <Avatar name={u.name} size={20} color={userId === u.id ? T.yellow : T.textMute} />
                <span style={{ color: userId === u.id ? T.yellow : T.textSub, fontSize: "12px", fontWeight: userId === u.id ? "700" : "400" }}>{u.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usuario seleccionado */}
        {selectedUser && (
          <div style={{ flex: "0 0 auto", background: T.dark3, borderRadius: "10px", padding: "10px 14px", border: `1px solid ${T.yellow}44`, display: "flex", alignItems: "center", gap: "10px" }}>
            <Avatar name={selectedUser.name} size={32} color={T.yellow} />
            <div>
              <p style={{ color: T.yellow, margin: 0, fontSize: "13px", fontWeight: "700" }}>{selectedUser.name}</p>
              <p style={{ color: T.textMute, margin: 0, fontSize: "11px" }}>{selectedUser.plan ?? "Sin plan"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ MÉTRICAS ══ */
function MetricsTab({ users, userId, onSelectUser }) {
  const [metrics, setMetrics] = useState([]);
  const [weight,  setWeight]  = useState("");
  const [height,  setHeight]  = useState("");
  const [parts,   setParts]   = useState({});
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const loadMetrics = async (id) => {
    if (!id) return;
    try { const m = await metricsService.getByMember(id); setMetrics(m); } catch {}
  };

  useEffect(() => { loadMetrics(userId); }, [userId]);

  const user   = users.find(u => u.id === userId);
  const imc    = calcIMC(+weight, +height);
  const imcCat = imc ? getIMCCategory(imc) : null;

  const saveRecord = async () => {
    if (!weight || !height || !userId) return;
    setLoading(true);
    try {
      await metricsService.create({ memberId: userId, weightKg: +weight, heightCm: +height, ...Object.fromEntries(Object.entries(parts).filter(([,v]) => v).map(([k,v]) => [k, +v])) });
      await loadMetrics(userId);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
      setWeight(""); setHeight(""); setParts({});
    } catch (e) { alert("Error: " + e.message); }
    finally { setLoading(false); }
  };

  if (!userId) return (
    <div style={{ ...card, textAlign: "center", padding: "60px 20px", color: T.textMute }}>
      <p style={{ fontSize: "32px", margin: "0 0 12px" }}>👤</p>
      <p style={{ margin: 0 }}>Selecciona un cliente para ver sus métricas</p>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ ...card, flex: "1", minWidth: "280px" }}>
        <h3 style={{ color: T.text, margin: "0 0 18px", fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>📏 NUEVO REGISTRO — {user?.name}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <Input label="Peso (kg)"     type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="75" />
          <Input label="Estatura (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
        </div>
        {imc && (
          <div style={{ background: T.dark3, borderRadius: "10px", padding: "14px", marginBottom: "16px", border: `1px solid ${imcCat.color}44` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: T.textMute, fontSize: "10px", margin: 0 }}>IMC CALCULADO</p>
                <p style={{ color: imcCat.color, fontSize: "32px", fontWeight: "400", margin: "2px 0 0", fontFamily: "Bebas Neue, sans-serif" }}>{imc}</p>
              </div>
              <Badge text={imcCat.label} color={imcCat.color} />
            </div>
          </div>
        )}
        <p style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 10px", fontWeight: "700" }}>Medidas corporales (cm)</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
          {BODY_PARTS_MEASUREMENTS.map(bp => (
            <Input key={bp.key} label={bp.label} type="number" value={parts[bp.key] ?? ""} onChange={e => setParts(p => ({ ...p, [bp.key]: e.target.value }))} placeholder="cm" />
          ))}
        </div>
        {saved
          ? <div style={{ background: "rgba(74,222,128,0.1)", border: `1px solid ${T.success}44`, borderRadius: "8px", padding: "12px", textAlign: "center", color: T.success, fontWeight: "700" }}>✅ Registro guardado</div>
          : <Btn onClick={saveRecord} disabled={!weight || !height || loading} full>{loading ? "Guardando..." : "💾 Guardar registro"}</Btn>
        }
      </div>

      <div style={{ flex: "1.5", minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {metrics.length >= 2 && (
          <div style={{ ...card }}>
            <h3 style={{ color: T.text, margin: "0 0 14px", fontSize: "14px", fontWeight: "700" }}>📈 Evolución de Peso</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={[...metrics].reverse().map(m => ({ date: new Date(m.recordedAt).toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" }), weight: Number(m.weightKg) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.dark4} />
                <XAxis dataKey="date" stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 10 }} />
                <YAxis stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 10 }} unit="kg" />
                <Tooltip contentStyle={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="weight" stroke={T.yellow} strokeWidth={2.5} dot={{ fill: T.yellow, r: 4 }} name="Peso (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ ...card, padding: 0 }}>
          <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${T.border}` }}>
            <h3 style={{ color: T.text, margin: 0, fontSize: "14px", fontWeight: "700" }}>Historial de mediciones</h3>
          </div>
          {metrics.length === 0
            ? <div style={{ padding: "30px", textAlign: "center", color: T.textMute, fontSize: "13px" }}>Sin registros aún</div>
            : <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                {metrics.map((r, i) => {
                  const rImc = calcIMC(Number(r.weightKg), Number(r.heightCm));
                  const rCat = rImc ? getIMCCategory(rImc) : null;
                  return (
                    <div key={i} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <p style={{ color: T.textMute, fontSize: "11px", margin: "0 0 4px" }}>{new Date(r.recordedAt).toLocaleDateString("es-PE")}</p>
                        <div style={{ display: "flex", gap: "14px" }}>
                          <span style={{ color: T.text, fontSize: "13px", fontWeight: "700" }}>{Number(r.weightKg)} kg</span>
                          <span style={{ color: T.textSub, fontSize: "12px" }}>{Number(r.heightCm)} cm</span>
                          {rImc && <span style={{ color: rCat.color, fontSize: "12px", fontWeight: "700" }}>IMC: {rImc}</span>}
                        </div>
                      </div>
                      {rCat && <Badge text={rCat.label} color={rCat.color} />}
                    </div>
                  );
                })}
              </div>
          }
        </div>
      </div>
    </div>
  );
}

/* ══ RUTINAS ══ */
function RoutinesTab({ users, userId, onSelectUser }) {
  const [activeDay,    setActiveDay]    = useState("Lunes");
  const [routines,     setRoutines]     = useState({});
  const [exercises,    setExercises]    = useState([]);
  const [showPicker,   setShowPicker]   = useState(false);
  const [pickerMuscle, setPickerMuscle] = useState("pecho");
  const [saving,       setSaving]       = useState(false);

  const loadRoutines = async (id) => {
    if (!id) return;
    try { const r = await routinesService.getByMember(id); setRoutines(r); } catch {}
  };

  useEffect(() => { exercisesService.getAll().then(setExercises).catch(() => {}); }, []);
  useEffect(() => { loadRoutines(userId); }, [userId]);

  const user         = users.find(u => u.id === userId);
  const apiDay       = DAY_MAP[activeDay] ?? "LUNES";
  const dayExercises = routines[apiDay] ?? [];

  const addExercise = async (exercise) => {
    const newItem     = { ...exercise, sets: 4, reps: 12, rest: 60, uid: Date.now() };
    const updated     = [...dayExercises, newItem];
    const newRoutines = { ...routines, [apiDay]: updated };
    setRoutines(newRoutines);
    setShowPicker(false);
    await saveDay(newRoutines, apiDay);
  };

  const removeExercise = async (uid) => {
    const updated     = dayExercises.filter(e => e.uid !== uid);
    const newRoutines = { ...routines, [apiDay]: updated };
    setRoutines(newRoutines);
    await saveDay(newRoutines, apiDay);
  };

  const updateExercise = (uid, field, val) => {
    const updated     = dayExercises.map(e => e.uid === uid ? { ...e, [field]: +val } : e);
    setRoutines(prev => ({ ...prev, [apiDay]: updated }));
  };

  const saveDay = async (currentRoutines, day) => {
    setSaving(true);
    try {
      const exs = (currentRoutines[day] ?? []).map(e => ({ exerciseId: e.id ?? e.exerciseId, sets: e.sets, reps: e.reps, restSecs: e.rest ?? e.restSecs }));
      await routinesService.saveDay(userId, day, exs);
    } catch (e) { alert("Error al guardar: " + e.message); }
    finally { setSaving(false); }
  };

  const filteredExercises = exercises.filter(e => e.muscleGroup === pickerMuscle);

  if (!userId) return (
    <div style={{ ...card, textAlign: "center", padding: "60px 20px", color: T.textMute }}>
      <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🏋️</p>
      <p style={{ margin: 0 }}>Selecciona un cliente para gestionar su rutina</p>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <div style={{ ...card, flex: "0 0 auto", minWidth: "130px", padding: "14px" }}>
        <p style={{ color: T.textMute, fontSize: "10px", letterSpacing: "0.8px", margin: "0 0 10px", fontWeight: "700" }}>DÍA</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {Object.keys(DAY_MAP).map(day => {
            const count = (routines[DAY_MAP[day]] ?? []).length;
            return (
              <div key={day} onClick={() => setActiveDay(day)}
                style={{ padding: "10px 12px", borderRadius: "8px", cursor: "pointer", background: activeDay === day ? T.yellowGlow : "transparent", border: `1px solid ${activeDay === day ? T.yellow : "transparent"}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: activeDay === day ? T.yellow : T.textSub, fontSize: "13px", fontWeight: activeDay === day ? "700" : "400" }}>{day}</span>
                {count > 0 && <span style={{ background: T.yellow, color: "#000", fontSize: "9px", fontWeight: "800", borderRadius: "10px", padding: "1px 6px" }}>{count}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ ...card, flex: 1, minWidth: "280px", padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>{activeDay.toUpperCase()} — {user?.name?.split(" ")[0]}</h3>
            <p style={{ color: T.textSub, margin: "2px 0 0", fontSize: "12px" }}>{dayExercises.length} ejercicio{dayExercises.length !== 1 ? "s" : ""} {saving ? "· Guardando..." : ""}</p>
          </div>
          <Btn onClick={() => setShowPicker(true)}>+ Agregar</Btn>
        </div>

        {dayExercises.length === 0
          ? <div style={{ padding: "40px 0", textAlign: "center", color: T.textMute, fontSize: "13px", borderRadius: "10px", border: `2px dashed ${T.border}` }}>
              Sin ejercicios.<br /><span style={{ color: T.yellow, cursor: "pointer" }} onClick={() => setShowPicker(true)}>+ Añadir ejercicio</span>
            </div>
          : <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {dayExercises.map((ex, i) => (
                <div key={ex.uid ?? i} style={{ background: T.dark3, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${T.border}`, display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: T.yellowGlow, border: `1px solid ${T.yellow}44`, display: "flex", alignItems: "center", justifyContent: "center", color: T.yellow, fontSize: "11px", fontWeight: "800", flexShrink: 0, fontFamily: "Bebas Neue, sans-serif" }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: "140px" }}>
                    <p style={{ color: T.text, margin: "0 0 5px", fontSize: "13px", fontWeight: "700" }}>{ex.name}</p>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Badge text={muscleLabel(ex.muscle ?? ex.muscleGroup)} color={muscleColor(ex.muscle ?? ex.muscleGroup)} />
                      <Badge text={ex.type ?? ex.exerciseType} color={T.textMute} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    {[{ field: "sets", label: "Series" }, { field: "reps", label: "Reps" }, { field: "rest", label: "Seg" }].map(({ field, label }) => (
                      <div key={field} style={{ textAlign: "center" }}>
                        <p style={{ color: T.textMute, fontSize: "9px", margin: "0 0 3px" }}>{label.toUpperCase()}</p>
                        <input type="number" value={ex[field] ?? 0}
                          onChange={e => updateExercise(ex.uid ?? i, field, e.target.value)}
                          onBlur={() => saveDay({ ...routines, [apiDay]: dayExercises }, apiDay)}
                          style={{ width: "54px", background: T.dark4, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "5px 6px", color: T.yellow, fontSize: "14px", fontWeight: "700", textAlign: "center", outline: "none", fontFamily: "Bebas Neue, sans-serif" }} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => removeExercise(ex.uid ?? i)} style={{ background: "none", border: "none", color: T.danger, cursor: "pointer", fontSize: "16px", flexShrink: 0, opacity: 0.7 }}>🗑</button>
                </div>
              ))}
            </div>
        }
      </div>

      {showPicker && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ ...card, width: "100%", maxWidth: "600px", maxHeight: "88vh", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>SELECCIONAR EJERCICIO</h3>
              <button onClick={() => setShowPicker(false)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
            </div>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {MUSCLE_GROUPS.map(mg => (
                <button key={mg.id} onClick={() => setPickerMuscle(mg.id)}
                  style={{ background: pickerMuscle === mg.id ? `${mg.color}22` : T.dark3, border: `1px solid ${pickerMuscle === mg.id ? mg.color : T.border}`, borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: pickerMuscle === mg.id ? mg.color : T.textSub, fontSize: "11px", fontWeight: "600", fontFamily: "Nunito, sans-serif" }}>
                  {mg.icon} {mg.label}
                </button>
              ))}
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filteredExercises.map(ex => {
                const alreadyAdded = dayExercises.some(e => (e.id ?? e.exerciseId) === ex.id);
                return (
                  <div key={ex.id} onClick={() => !alreadyAdded && addExercise({ ...ex, muscle: ex.muscleGroup, type: ex.exerciseType, exerciseId: ex.id, uid: Date.now() })}
                    style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: alreadyAdded ? "default" : "pointer", opacity: alreadyAdded ? 0.4 : 1 }}
                    onMouseEnter={e => { if (!alreadyAdded) e.currentTarget.style.background = T.dark3; }}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <p style={{ color: T.text, margin: "0 0 4px", fontSize: "13px", fontWeight: "600" }}>{ex.name}</p>
                      <Badge text={ex.exerciseType} color={T.textMute} />
                    </div>
                    {alreadyAdded ? <span style={{ color: T.success, fontSize: "12px" }}>✓ Agregado</span> : <span style={{ color: T.yellow, fontSize: "20px" }}>+</span>}
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

/* ══ CATÁLOGO ══ */
function ExercisesTab() {
  const [exercises,    setExercises]    = useState([]);
  const [filterMuscle, setFilterMuscle] = useState("all");
  const [showForm,     setShowForm]     = useState(false);
  const [newEx,        setNewEx]        = useState({ name: "", muscleGroup: "pecho", exerciseType: "Fuerza" });

  const load = async () => { const e = await exercisesService.getAll(); setExercises(e); };
  useEffect(() => { load(); }, []);

  const filtered = filterMuscle === "all" ? exercises : exercises.filter(e => e.muscleGroup === filterMuscle);

  const addExercise = async () => {
    if (!newEx.name.trim()) return;
    try { await exercisesService.create(newEx); await load(); setNewEx({ name: "", muscleGroup: "pecho", exerciseType: "Fuerza" }); setShowForm(false); }
    catch (e) { alert("Error: " + e.message); }
  };

  const removeExercise = async (id) => {
    try { await exercisesService.remove(id); await load(); }
    catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <p style={{ color: T.textSub, margin: 0, fontSize: "13px" }}>{filtered.length} ejercicios</p>
        <Btn onClick={() => setShowForm(true)}>+ Nuevo ejercicio</Btn>
      </div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <button onClick={() => setFilterMuscle("all")} style={{ background: filterMuscle === "all" ? T.yellow : T.dark3, color: filterMuscle === "all" ? "#000" : T.textSub, border: `1px solid ${filterMuscle === "all" ? T.yellow : T.border}`, borderRadius: "6px", padding: "5px 14px", cursor: "pointer", fontSize: "11px", fontWeight: "700", fontFamily: "Nunito, sans-serif" }}>Todos</button>
        {MUSCLE_GROUPS.map(mg => (
          <button key={mg.id} onClick={() => setFilterMuscle(mg.id)}
            style={{ background: filterMuscle === mg.id ? `${mg.color}22` : T.dark3, border: `1px solid ${filterMuscle === mg.id ? mg.color : T.border}`, borderRadius: "6px", padding: "5px 12px", cursor: "pointer", color: filterMuscle === mg.id ? mg.color : T.textSub, fontSize: "11px", fontWeight: "600", fontFamily: "Nunito, sans-serif" }}>
            {mg.icon} {mg.label}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
        {filtered.map(ex => (
          <div key={ex.id} style={{ ...card, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: T.text, margin: "0 0 6px", fontSize: "13px", fontWeight: "600" }}>{ex.name}</p>
              <div style={{ display: "flex", gap: "6px" }}>
                <Badge text={muscleLabel(ex.muscleGroup)} color={muscleColor(ex.muscleGroup)} />
                <Badge text={ex.exerciseType} color={T.textMute} />
              </div>
            </div>
            <button onClick={() => removeExercise(ex.id)} style={{ background: "none", border: "none", color: T.textMute, cursor: "pointer", fontSize: "14px", opacity: 0.5 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = T.danger; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = T.textMute; }}>✕</button>
          </div>
        ))}
      </div>
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" }}>
          <div style={{ ...card, width: "100%", maxWidth: "420px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "20px" }}>NUEVO EJERCICIO</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: T.textSub, cursor: "pointer", fontSize: "22px" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Input label="Nombre" value={newEx.name} onChange={e => setNewEx(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Press con cables" />
              <div>
                <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Grupo muscular</label>
                <select value={newEx.muscleGroup} onChange={e => setNewEx(p => ({ ...p, muscleGroup: e.target.value }))}
                  style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                  {MUSCLE_GROUPS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: T.textSub, fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Tipo</label>
                <select value={newEx.exerciseType} onChange={e => setNewEx(p => ({ ...p, exerciseType: e.target.value }))}
                  style={{ width: "100%", background: T.dark3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", color: T.text, fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif" }}>
                  {["Fuerza", "Aislamiento", "Compuesto", "Peso corporal", "Cardio"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
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

/* ══ MAIN ══ */
const TABS = [
  { id: "metricas",   label: "📏 Métricas & IMC"      },
  { id: "rutinas",    label: "🏋️ Rutinas"             },
  { id: "ejercicios", label: "📚 Catálogo ejercicios"  },
];

export default function Fitness() {
  const [tab,     setTab]     = useState("metricas");
  const [users,   setUsers]   = useState([]);
  const [userId,  setUserId]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membersService.getAll().then(m => {
      setUsers(m);
      if (m.length > 0) setUserId(m[0].id);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><p style={{ color: T.textMute }}>Cargando...</p></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h2 style={{ color: T.text, margin: 0, fontFamily: "Bebas Neue, sans-serif", fontSize: "28px", letterSpacing: "1px" }}>FITNESS & ENTRENAMIENTO</h2>
        <p style={{ color: T.textSub, margin: "4px 0 0", fontSize: "13px" }}>Métricas corporales, rutinas personalizadas y catálogo de ejercicios</p>
      </div>

      {/* Selector global de usuario */}
      {tab !== "ejercicios" && (
        <UserSelector users={users} userId={userId} onSelect={setUserId} />
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: T.dark2, padding: "4px", borderRadius: "10px", border: `1px solid ${T.border}`, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: tab === t.id ? T.yellow : "transparent", color: tab === t.id ? "#000" : T.textSub, border: "none", borderRadius: "7px", padding: "9px 18px", cursor: "pointer", fontSize: "12px", fontWeight: "700", transition: "all 0.2s", fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "metricas"   && <MetricsTab   users={users} userId={userId} onSelectUser={setUserId} />}
      {tab === "rutinas"    && <RoutinesTab  users={users} userId={userId} onSelectUser={setUserId} />}
      {tab === "ejercicios" && <ExercisesTab />}
    </div>
  );
}
