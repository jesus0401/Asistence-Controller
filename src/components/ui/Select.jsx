import { useState } from "react";
import T from "../../constants/theme";

export default function Select({ label, value, onChange, options, ...rest }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      {label && (
        <label style={{
          color: T.textSub, fontSize: "11px", letterSpacing: "0.8px",
          textTransform: "uppercase", display: "block", marginBottom: "6px",
        }}>
          {label}
        </label>
      )}
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: T.dark3, border: `1px solid ${focused ? T.yellow : T.border}`,
          borderRadius: "8px", padding: "10px 14px", color: T.text,
          fontSize: "13px", outline: "none", cursor: "pointer",
          fontFamily: "Nunito, sans-serif",
        }}
        {...rest}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
