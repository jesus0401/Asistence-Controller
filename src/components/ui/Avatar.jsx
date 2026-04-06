import T from "../../constants/theme";

export default function Avatar({ name, size = 36, color = T.yellow }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}22`, border: `1px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color, fontWeight: "700", fontSize: size * 0.38, flexShrink: 0,
      fontFamily: "Bebas Neue, sans-serif",
    }}>
      {name?.[0] ?? "?"}
    </div>
  );
}
