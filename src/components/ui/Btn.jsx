import { useState } from "react";
import T from "../../constants/theme";

const STYLES = {
  primary: { bg: T.yellow,           fg: "#000",     hoverBg: T.yellowHov },
  ghost:   { bg: T.yellowGlow,       fg: T.yellow,   hoverBg: "rgba(245,184,0,0.25)" },
  danger:  { bg: "rgba(248,113,113,0.15)", fg: T.danger, hoverBg: "rgba(248,113,113,0.25)" },
  outline: { bg: "transparent",      fg: T.textSub,  hoverBg: T.dark3 },
};

export default function Btn({ children, onClick, variant = "primary", size = "md", disabled, full, style: extraStyle }) {
  const [hov, setHov] = useState(false);
  const s = STYLES[variant];
  const pad = size === "sm" ? "6px 12px" : "11px 20px";

  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? s.hoverBg : s.bg, color: s.fg,
        border: variant === "outline" ? `1px solid ${T.border}` : "none",
        borderRadius: "8px", padding: pad, cursor: disabled ? "not-allowed" : "pointer",
        fontSize: size === "sm" ? "12px" : "13px", fontWeight: "700",
        letterSpacing: "0.3px", whiteSpace: "nowrap",
        opacity: disabled ? 0.5 : 1, transition: "background 0.15s",
        fontFamily: "Nunito, sans-serif",
        width: full ? "100%" : undefined,
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}
