import { useState, useEffect } from "react";
import T from "./constants/theme";
import { authService } from "./api/services";

// Layout
import Sidebar from "./components/layout/Sidebar";
import Navbar  from "./components/layout/Navbar";

// Common
import FontInjector from "./components/common/FontInjector";

// Pages
import Login      from "./pages/Login";
import Dashboard  from "./pages/Dashboard";
import Users      from "./pages/Users";
import Attendance from "./pages/Attendance";
import Fitness    from "./pages/Fitness";
import Nutrition  from "./pages/Nutrition";
import Plans      from "./pages/Plans";
import Billing    from "./pages/Billing";
import Profiles   from "./pages/Profiles";
import Admin      from "./pages/Admin";

// Public (QR)
import QRLanding  from "./pages/public/QRLanding";

export default function App() {
  const [user,     setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("solgym_user")); } catch { return null; }
  });
  const [page,     setPage]     = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [isMob,    setIsMob]    = useState(false);

  const isQRRoute = window.location.search.includes("qr=1");

  useEffect(() => {
    const check = () => {
      const mob = window.innerWidth < 768;
      setIsMob(mob);
      setSideOpen(!mob);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!user || isQRRoute) return;
    authService.me().catch(() => handleLogout());
  }, []); // eslint-disable-line

  const handleLogin = async (email, password) => {
    const res = await authService.login(email, password);
    localStorage.setItem("solgym_token", res.token);
    localStorage.setItem("solgym_user",  JSON.stringify(res.user));
    setUser(res.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("solgym_token");
    localStorage.removeItem("solgym_user");
    setUser(null);
  };

  if (isQRRoute) return (
    <>
      <FontInjector />
      <QRLanding />
    </>
  );

  if (!user) return (
    <>
      <FontInjector />
      <Login onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <FontInjector />
      <div style={{
        display: "flex", height: "100vh",
        background: T.dark1, color: T.text,
        fontFamily: "Nunito, sans-serif", overflow: "hidden",
      }}>
        <Sidebar
          page={page} setPage={setPage}
          open={sideOpen} onClose={() => setSideOpen(false)}
          isMob={isMob} onLogout={handleLogout}
          user={user}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <Navbar
            onMenu={() => setSideOpen(s => !s)}
            onNavigate={setPage}
            user={user}
          />
          <main style={{ flex: 1, overflowY: "auto", padding: isMob ? "14px" : "24px" }}>
            {page === "dashboard"  && <Dashboard  />}
            {page === "usuarios"   && <Users      />}
            {page === "asistencia" && <Attendance />}
            {page === "fitness"    && <Fitness    />}
            {page === "nutricion"  && <Nutrition  />}
            {page === "planes"     && <Plans      />}
            {page === "boletas"    && <Billing    />}
            {page === "perfiles"   && <Profiles   />}
            {page === "admin"      && <Admin      />}
          </main>
        </div>
      </div>
    </>
  );
}
