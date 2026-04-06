import T from "../../constants/theme";

export default function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: "42px", height: "22px", borderRadius: "11px",
        background: on ? T.yellow : "#333", position: "relative",
        cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: "2px", left: on ? "21px" : "2px",
        width: "18px", height: "18px", borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
      }} />
    </div>
  );
}
