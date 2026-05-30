import { useState, useCallback, useRef } from "react";
import type { Patient, ToastItem } from "./types";
import { INITIAL_PATIENTS } from "./data";
import { NHS } from "./lib/utils";
import { Toast } from "./components/atoms";
import { HospitalScreen } from "./components/HospitalScreen";
import { CareHomeScreen } from "./components/CareHomeScreen";

type Screen = "hospital" | "carehome";

export default function App() {
  const [screen, setScreen]     = useState<Screen>("hospital");
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [toasts, setToasts]     = useState<ToastItem[]>([]);
  const tid = useRef(0);

  const pushToast   = useCallback((msg: string) => { const id = ++tid.current; setToasts(p => [...p, { id, msg }]); }, []);
  const removeToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);

  const accept = useCallback((pid: string, name: string) => {
    const pat = patients.find(p => p.id === pid);
    setPatients(p => p.map(x => x.id === pid ? { ...x, status: "placed", placedBy: name } : x));
    if (pat) pushToast(`${name} matched with ${pat.ref}`);
  }, [patients, pushToast]);

  const reset = useCallback(() => {
    setPatients(INITIAL_PATIENTS);
    setToasts([]);
    pushToast("Demo reset");
  }, [pushToast]);

  const inPool = patients.filter(p => p.status === "in_pipeline").length;
  const placed = patients.filter(p => p.status === "placed").length;

  return (
    <div style={{ minHeight: "100vh", background: NHS.paleGrey, fontFamily: "Arial,sans-serif", color: NHS.black }}>
      {toasts.map(t => <Toast key={t.id} message={t.msg} onDone={() => removeToast(t.id)} />)}

      {/* NHS Header */}
      <div style={{ background: NHS.blue }}>
        <div style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: NHS.white, padding: "4px 8px", borderRadius: 2 }}>
              <span style={{ color: NHS.blue, fontWeight: 900, fontSize: 17, letterSpacing: -0.5, fontFamily: "Arial,sans-serif", lineHeight: 1 }}>NHS</span>
            </div>
            <div style={{ width: 1, height: 32, background: "rgba(255,255,255,.3)" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: NHS.white, letterSpacing: -0.2 }}>DischargeConnect</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", letterSpacing: 0.3 }}>St Thomas' Hospital Trust</div>
            </div>
          </div>

          <div style={{ display: "flex" }}>
            {([["hospital", "Hospital ward"], ["carehome", "Care home portal"]] as const).map(([s, label]) => (
              <button key={s} onClick={() => setScreen(s)} style={{
                padding: "10px 20px", fontSize: 14, fontWeight: screen === s ? 700 : 400,
                color: NHS.white, background: screen === s ? "rgba(255,255,255,.15)" : "transparent",
                border: "none", cursor: "pointer",
                borderBottom: screen === s ? `4px solid ${NHS.white}` : "4px solid transparent",
                fontFamily: "Arial,sans-serif", transition: "all .15s",
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.85)", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ width: 8, height: 8, background: NHS.lightGreen, borderRadius: "50%", display: "inline-block" }} />
              {inPool} waiting · <span style={{ color: NHS.lightGreen, fontWeight: 700 }}>{placed} matched</span>
            </div>
            <button onClick={reset} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 4, border: "1px solid rgba(255,255,255,.4)", background: "transparent", color: "rgba(255,255,255,.8)", cursor: "pointer", fontFamily: "Arial,sans-serif" }}>↺ Reset demo</button>
          </div>
        </div>
      </div>

      {/* Sub-bar */}
      <div style={{ background: NHS.darkBlue, padding: "6px 24px" }}>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,.7)", letterSpacing: 0.5, textTransform: "uppercase" }}>
          {screen === "hospital" ? "Discharge coordinator view — all ward patients" : "Rehab facility admissions view — select your facility below"}
        </span>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        {screen === "hospital"
          ? <HospitalScreen patients={patients} setPatients={setPatients} onToast={pushToast} />
          : <CareHomeScreen patients={patients} onAccept={accept} />
        }
      </div>
    </div>
  );
}
