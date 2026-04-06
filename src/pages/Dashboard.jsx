import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import T from "../constants/theme";
import { card } from "../constants/theme";
import { membersService, attendanceService, plansService } from "../api/services";
import StatCard from "../components/common/StatCard";
import Avatar   from "../components/ui/Avatar";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", fontSize: "12px" }}>
      <p style={{ color: T.text, margin: "0 0 4px", fontWeight: "700" }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color, margin: "2px 0" }}>{p.name}: {p.value}</p>)}
    </div>
  );
}

export default function Dashboard() {
  const [members,    setMembers]    = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [todayList,  setTodayList]  = useState([]);
  const [stats,      setStats]      = useState([]);
  const [plans,      setPlans]      = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    Promise.all([
      membersService.getAll(),
      attendanceService.getToday(),
      attendanceService.getStats(),
      plansService.getAll(),
    ]).then(([m, today, statsData, p]) => {
      setMembers(m);
      setTodayCount(today.count);
      setTodayList(today.records.slice(0, 6));
      setStats(statsData);
      setPlans(p);
    }).finally(() => setLoading(false));
  }, []);

  const expiring = members.filter(u => u.daysLeft !== null && u.daysLeft <= 7);

  const PIE_COLORS = [T.yellow, "#888888", "#444444", "#2A2A2A"];
  const plansPie = plans.map((p, i) => ({
    name: p.name,
    value: members.filter(m => m.plan === p.name).length,
    color: PIE_COLORS[i] ?? T.textMute,
  })).filter(p => p.value > 0);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: T.textMute, fontSize: "14px" }}>Cargando dashboard...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Stats */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <StatCard title="Total Usuarios"    value={members.length}                                    icon="👥" color={T.yellow}  sub="Miembros registrados"  />
        <StatCard title="Usuarios Activos"  value={members.filter(u => u.status === "ACTIVO").length} icon="✅" color={T.success} sub="Membresías vigentes"    />
        <StatCard title="Por Vencer"        value={expiring.length}                                   icon="⚠️" color={T.warning} sub="Próximos 7 días"        />
        <StatCard title="Asistencias Hoy"   value={todayCount}                                        icon="📅" color={T.info}    sub="Registradas hoy"        />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ ...card, flex: "2", minWidth: "280px" }}>
          <h3 style={{ color: T.text, margin: "0 0 20px", fontSize: "15px", fontWeight: "700" }}>Asistencias — últimos 7 días</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.dark4} />
              <XAxis dataKey="date" stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 11 }} />
              <YAxis stroke={T.textMute} tick={{ fill: T.textSub, fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke={T.yellow} strokeWidth={2.5} dot={{ fill: T.yellow, r: 4 }} name="Asistencias" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...card, flex: "1", minWidth: "220px" }}>
          <h3 style={{ color: T.text, margin: "0 0 16px", fontSize: "15px", fontWeight: "700" }}>Planes Activos</h3>
          {plansPie.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={plansPie} dataKey="value" cx="50%" cy="50%" outerRadius={72} innerRadius={38}>
                    {plansPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: T.dark2, border: `1px solid ${T.border}`, borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px" }}>
                {plansPie.map(p => (
                  <div key={p.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
                    <span style={{ color: T.textSub, fontSize: "11px" }}>{p.name}: {p.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: T.textMute, fontSize: "13px" }}>Sin datos</p>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <h3 style={{ color: T.text, margin: "0 0 14px", fontSize: "15px", fontWeight: "700" }}>Ingresos de hoy</h3>
          {todayList.length === 0
            ? <p style={{ color: T.textMute, fontSize: "13px" }}>Sin registros por ahora</p>
            : todayList.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Avatar name={a.member?.name ?? "?"} size={26} />
                  <span style={{ color: T.text, fontSize: "13px" }}>{a.member?.name}</span>
                </div>
                <span style={{ color: T.textSub, fontSize: "12px" }}>
                  {new Date(a.entryTime).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))
          }
        </div>

        <div style={{ ...card, flex: "1", minWidth: "260px" }}>
          <h3 style={{ color: T.text, margin: "0 0 14px", fontSize: "15px", fontWeight: "700" }}>Membresías por vencer</h3>
          {expiring.length === 0
            ? <p style={{ color: T.textMute, fontSize: "13px" }}>Ninguna por ahora 🎉</p>
            : expiring.map((u, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: T.dark3, borderRadius: "8px", borderLeft: `3px solid ${u.daysLeft <= 3 ? T.danger : T.warning}`, marginBottom: "6px" }}>
                <span style={{ color: T.text, fontSize: "13px" }}>{u.name}</span>
                <span style={{ color: u.daysLeft <= 3 ? T.danger : T.warning, fontSize: "12px", fontWeight: "700" }}>
                  {u.daysLeft <= 0 ? "¡Venció!" : `${u.daysLeft}d`}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
