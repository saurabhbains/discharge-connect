import { useState, useRef } from "react";
import type { Patient } from "../types";
import { NHS } from "../lib/utils";
import { PriorityTag, DelayTag, StatusTag, NHSButton } from "./atoms";

type Filter = "all" | "staged" | "pool" | "placed";

interface Props {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  onToast: (msg: string) => void;
}

export function HospitalScreen({ patients, setPatients, onToast }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const dragId = useRef<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);

  const staged = patients.filter(p => p.status === "staged").length;
  const inPool  = patients.filter(p => p.status === "in_pipeline").length;
  const placed  = patients.filter(p => p.status === "placed").length;

  const filtered = patients.filter(p =>
    filter === "all"    ? true :
    filter === "staged" ? p.status === "staged" :
    filter === "pool"   ? p.status === "in_pipeline" :
                          p.status === "placed"
  );

  const onDragStart = (id: string) => { dragId.current = id; };
  const onDragOver  = (e: React.DragEvent, id: string) => { e.preventDefault(); setDropId(id); };
  const onDragEnd   = () => { dragId.current = null; setDropId(null); };
  const onDrop = (targetId: string) => {
    const from = dragId.current;
    if (!from || from === targetId) { setDropId(null); return; }
    setPatients(prev => {
      const arr = [...prev];
      const fi = arr.findIndex(p => p.id === from);
      const ti = arr.findIndex(p => p.id === targetId);
      const [item] = arr.splice(fi, 1);
      arr.splice(ti, 0, item);
      return arr;
    });
    setDropId(null);
  };

  const addOne = (pid: string) => {
    setPatients(p => p.map(x => x.id === pid ? { ...x, status: "in_pipeline" } : x));
    const pat = patients.find(p => p.id === pid);
    if (pat) onToast(`${pat.ref} is now waiting for a match`);
  };

  const addAll = () => {
    setPatients(p => p.map(x => x.status === "staged" ? { ...x, status: "in_pipeline" } : x));
    onToast(`All ${staged} ready-to-discharge patients added to match pool`);
  };

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all",    label: "All Patients",    count: patients.length },
    { key: "staged", label: "Ready For Match", count: staged },
    { key: "pool",   label: "Awaiting Match",  count: inPool },
    { key: "placed", label: "Matched",         count: placed },
  ];

  return (
    <div style={{ padding: "24px 28px" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "All Patients",    val: patients.length, color: NHS.darkBlue, border: NHS.blue },
          { label: "Ready For Match", val: staged,           color: NHS.blue,     border: NHS.blue },
          { label: "Awaiting Match",  val: inPool,           color: NHS.orange,   border: NHS.orange },
          { label: "Matched",         val: placed,           color: NHS.green,    border: NHS.green },
        ].map(s => (
          <div key={s.label} style={{ background: NHS.white, borderRadius: 4, border: `1px solid ${NHS.borderGrey}`, borderLeft: `4px solid ${s.border}`, padding: "14px 18px" }}>
            <div style={{ fontSize: 12, color: NHS.midGrey, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1, fontFamily: "monospace" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", borderBottom: `2px solid ${NHS.borderGrey}`, marginBottom: 20, gap: 0, flexWrap: "wrap" }}>
        {tabs.map(({ key, label, count }) => {
          const active = filter === key;
          return (
            <button key={key} onClick={() => setFilter(key)} style={{
              fontSize: 14, padding: "10px 20px", fontWeight: active ? 700 : 400,
              color: active ? NHS.blue : NHS.darkGrey, background: "transparent", border: "none",
              cursor: "pointer", borderBottom: active ? `4px solid ${NHS.blue}` : "4px solid transparent",
              marginBottom: -2, fontFamily: "Arial,sans-serif", display: "flex", alignItems: "center", gap: 8,
            }}>
              {label}
              <span style={{ fontSize: 12, padding: "1px 7px", borderRadius: 12, fontFamily: "monospace", fontWeight: 700, background: active ? NHS.blue : NHS.paleGrey, color: active ? NHS.white : NHS.midGrey }}>{count}</span>
            </button>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 12, color: NHS.midGrey, alignSelf: "center", paddingRight: 8 }}>⠿ drag to reorder</span>
      </div>

      {/* Pool banner */}
      {filter === "pool" && (
        <div style={{ background: "#E8F0F9", borderLeft: `4px solid ${NHS.blue}`, padding: "10px 16px", marginBottom: 16, fontSize: 14, color: NHS.darkBlue, borderRadius: "0 4px 4px 0" }}>
          {inPool > 0
            ? `${inPool} patient${inPool !== 1 ? "s" : ""} awaiting a facility match — visible to all registered rehab facilities`
            : "No patients waiting — add ready patients using the buttons below"}
        </div>
      )}

      {/* Table */}
      <div style={{ background: NHS.white, border: `1px solid ${NHS.borderGrey}`, borderRadius: 4, overflow: "hidden", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial,sans-serif" }}>
          <thead>
            <tr style={{ background: NHS.paleGrey, borderBottom: `2px solid ${NHS.borderGrey}` }}>
              <th style={{ width: 28, padding: "10px 6px" }} />
              {["Patient", "Diagnosis", "Care needs", "Delay", "Priority", "Status", ""].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, color: NHS.darkGrey, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={8} style={{ textAlign: "center", padding: "32px", color: NHS.midGrey, fontSize: 14 }}>No patients in this view</td></tr>
              : filtered.map((p, i) => {
                const canDrag = p.status !== "placed" && p.status !== "inpatient";
                const isTarget = dropId === p.id;
                return (
                  <tr key={p.id} className="fade-in"
                    draggable={canDrag}
                    onDragStart={() => canDrag && onDragStart(p.id)}
                    onDragOver={(e) => canDrag && onDragOver(e, p.id)}
                    onDragEnd={onDragEnd}
                    onDrop={() => onDrop(p.id)}
                    style={{
                      borderBottom: `1px solid ${NHS.borderGrey}`,
                      background: isTarget ? "#E8F0F9" : i % 2 === 1 ? NHS.paleGrey : NHS.white,
                      opacity: p.status === "placed" ? 0.65 : 1,
                      borderTop: isTarget ? `2px solid ${NHS.blue}` : "none",
                      transition: "background .1s",
                    }}>
                    <td style={{ padding: "10px 6px", textAlign: "center" }}>
                      {canDrag && <span style={{ cursor: "grab", color: NHS.borderGrey, fontSize: 14, userSelect: "none" }}>⠿</span>}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: NHS.black }}>
                        <span style={{ fontFamily: "monospace", fontSize: 11, color: NHS.borderGrey, marginRight: 6 }}>{String(patients.findIndex(pp => pp.id === p.id) + 1).padStart(2, "0")}</span>
                        {p.ref}
                      </div>
                      <div style={{ fontSize: 12, color: NHS.midGrey, marginTop: 2 }}>{p.age}{p.sex} · {p.ward}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 14, color: NHS.black }}>{p.diag}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {p.needs.map(n => (
                          <span key={n} style={{ fontSize: 11, background: NHS.paleGrey, color: NHS.darkGrey, padding: "2px 7px", borderRadius: 4, border: `1px solid ${NHS.borderGrey}` }}>{n}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px" }}><DelayTag d={p.delay} /></td>
                    <td style={{ padding: "10px 12px" }}><PriorityTag v={p.priority} /></td>
                    <td style={{ padding: "10px 12px" }}><StatusTag status={p.status} placedBy={p.placedBy} /></td>
                    <td style={{ padding: "10px 12px" }}>
                      {p.status === "staged"      && <NHSButton small variant="add" onClick={() => addOne(p.id)}>+ Add to pool</NHSButton>}
                      {p.status === "in_pipeline" && <span style={{ fontSize: 12, color: NHS.orange, fontWeight: 600 }}>✓ Awaiting match</span>}
                      {p.status === "inpatient"   && <span style={{ fontSize: 12, color: NHS.midGrey }}>—</span>}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Add all */}
      {staged > 0 && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NHSButton onClick={addAll}>⬆ Add all {staged} ready patient{staged !== 1 ? "s" : ""} to waiting match</NHSButton>
        </div>
      )}
    </div>
  );
}
