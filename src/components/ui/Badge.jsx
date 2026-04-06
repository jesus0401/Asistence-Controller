export default function Badge({ text, color }) {
  return (
    <span style={{
      background: `${color}22`, color,
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap",
    }}>
      {text}
    </span>
  );
}
