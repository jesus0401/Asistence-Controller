import { useState } from "react";
import T from "../../constants/theme";

export default function Input({ label, value, onChange, placeholder, type = "text", ...rest }) {
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
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: T.dark3, border: `1px solid ${focused ? T.yellow : T.border}`,
          borderRadius: "8px", padding: "10px 14px", color: T.text,
          fontSize: "13px", outline: "none", fontFamily: "Nunito, sans-serif",
          transition: "border-color 0.2s",
        }}
        {...rest}
      />
    </div>
  );
}
