import { useState, useEffect, type ReactNode, type CSSProperties } from "react";
import { NHS } from "../lib/utils";

export function PriorityTag({ v }: { v: number }) {
  const [bg, color] = v >= 80 ? ["#FAECED", NHS.red] : v >= 60 ? ["#FEF5E7", NHS.orange] : ["#F0F4F5", NHS.midGrey];
  return (
    <span style={{ background: bg, color, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 4, border: `1px solid ${color}40`, fontFamily: "monospace" }}>
      {v}
    </span>
  );
}

export function DelayTag({ d }: { d: number }) {
  return (
    <span style={{ color: d >= 7 ? NHS.red : d >= 4 ? NHS.orange : NHS.green, fontWeight: 700, fontFamily: "monospace", fontSize: 13 }}>
      {d}d
    </span>
  );
}

export function MatchTag({ pct }: { pct: number }) {
  const [bg, color] = pct >= 80 ? ["#E8F4EE", NHS.green] : pct >= 50 ? ["#FEF5E7", NHS.orange] : ["#FAECED", NHS.red];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, border: `1px solid ${color}40` }}>
      {pct}% match
    </span>
  );
}

export function NeedTag({ n, matched }: { n: string; matched: boolean }) {
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap",
      background: matched ? "#E8F4EE" : NHS.paleGrey,
      color: matched ? NHS.green : NHS.darkGrey,
      border: matched ? `1px solid ${NHS.green}50` : `1px solid ${NHS.borderGrey}`,
      fontWeight: matched ? 500 : 400,
    }}>
      {matched ? "✓ " : ""}{n}
    </span>
  );
}

export function StatusTag({ status, placedBy }: { status: string; placedBy: string | null }) {
  if (status === "inpatient")   return <span style={{ fontSize: 12, background: NHS.paleGrey, color: NHS.midGrey, border: `1px solid ${NHS.borderGrey}`, padding: "3px 10px", borderRadius: 4, fontWeight: 500 }}>Inpatient</span>;
  if (status === "staged")      return <span style={{ fontSize: 12, background: "#E8F0F9", color: NHS.blue, border: `1px solid ${NHS.blue}40`, padding: "3px 10px", borderRadius: 4, fontWeight: 500 }}>Ready to be Discharged</span>;
  if (status === "in_pipeline") return <span style={{ fontSize: 12, background: "#FEF5E7", color: NHS.orange, border: `1px solid ${NHS.orange}40`, padding: "3px 10px", borderRadius: 4, fontWeight: 500 }}>Awaiting Match</span>;
  return <span style={{ fontSize: 12, background: "#E8F4EE", color: NHS.green, border: `1px solid ${NHS.green}40`, padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}>✓ Matched · {placedBy}</span>;
}

interface NHSButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "add";
  small?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export function NHSButton({ onClick, children, variant = "primary", small, disabled, style }: NHSButtonProps) {
  const base: CSSProperties = {
    fontFamily: "Arial,sans-serif", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 4, border: "none", transition: "background .15s", display: "inline-flex",
    alignItems: "center", gap: 6, fontSize: small ? 13 : 14, padding: small ? "6px 14px" : "10px 20px",
    opacity: disabled ? 0.5 : 1,
  };
  const styles = {
    primary:   { background: NHS.green,   color: "#fff" },
    secondary: { background: NHS.white,   color: NHS.blue, border: `2px solid ${NHS.blue}` },
    ghost:     { background: "transparent", color: NHS.blue, border: `1px solid ${NHS.borderGrey}` },
    add:       { background: "#E8F0F9",   color: NHS.blue, border: `1px solid ${NHS.blue}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...styles[variant], ...style }}>
      {children}
    </button>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 2600);
    const t2 = setTimeout(onDone, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className={out ? "toast-out" : "toast-in"} style={{
      position: "fixed", top: 16, right: 16, zIndex: 9999, background: NHS.darkBlue,
      color: "#fff", padding: "12px 18px", borderRadius: 4, fontSize: 14,
      boxShadow: "0 4px 16px rgba(0,0,0,.25)", display: "flex", alignItems: "center",
      gap: 10, maxWidth: 320, borderLeft: `4px solid ${NHS.lightGreen}`,
    }}>
      <span style={{ color: NHS.lightGreen, fontSize: 16, fontWeight: 700 }}>✓</span>
      {message}
    </div>
  );
}
