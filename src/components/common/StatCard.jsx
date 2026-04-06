import T from "../../constants/theme";
import { card } from "../../constants/theme";

export default function StatCard({ title, value, icon, color, sub }) {
  return (
    <div style={{ ...card, flex: "1", minWidth: "140px", borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: T.textSub, fontSize: "12px", margin: 0 }}>{title}</p>
          <h2 style={{
            color: T.text, fontSize: "34px", fontWeight: "400",
            margin: "4px 0 0", fontFamily: "Bebas Neue, sans-serif", letterSpacing: "1px",
          }}>
            {value}
          </h2>
        </div>
        <div style={{ fontSize: "24px", opacity: 0.85 }}>{icon}</div>
      </div>
      {sub && <p style={{ color, fontSize: "11px", margin: "6px 0 0", fontWeight: "600" }}>{sub}</p>}
    </div>
  );
}
