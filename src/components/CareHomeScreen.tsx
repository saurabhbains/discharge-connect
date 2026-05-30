import { useState } from "react";
import type { Patient } from "../types";
import { HOMES } from "../data";
import { NHS, matchPct, distMiles } from "../lib/utils";
import { PriorityTag, MatchTag, NeedTag, NHSButton } from "./atoms";

interface Props {
  patients: Patient[];
  onAccept: (pid: string, name: string) => void;
}

export function CareHomeScreen({ patients, onAccept }: Props) {
  const [homeId, setHomeId]   = useState(HOMES[0].id);
  const [beds, setBeds]       = useState<Record<string, number>>({ "CH-01": 3, "CH-02": 2, "CH-03": 4, "CH-04": 1 });
  const [confirming, setConf] = useState<string | null>(null);

  const home      = HOMES.find(h => h.id === homeId)!;
  const availBeds = beds[homeId] ?? 2;

  const pool = [...patients]
    .filter(p => p.status === "in_pipeline" || p.status === "placed")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "in_pipeline" ? -1 : 1;
      return matchPct(b, home) - matchPct(a, home);
    });

  const doAccept = (pid: string) => {
    onAccept(pid, home.name);
    setBeds(p => ({ ...p, [homeId]: Math.max(0, (p[homeId] ?? 2) - 1) }));
    setConf(null);
  };

  return (
    <div style={{ padding: "24px 28px" }}>

      {/* Selector card */}
      <div style={{ background: NHS.white, border: `1px solid ${NHS.borderGrey}`, borderRadius: 4, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center" }}>

          {/* Dropdown */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: NHS.black, marginBottom: 6 }}>Rehab facility</label>
            <select value={homeId} onChange={e => setHomeId(e.target.value)} style={{ width: "100%", fontSize: 14, border: `2px solid ${NHS.darkGrey}`, borderRadius: 4, padding: "8px 10px", color: NHS.black, background: NHS.white, fontFamily: "Arial,sans-serif" }}>
              {HOMES.filter(h => h.type === "Rehabilitation").map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          {/* Beds counter */}
          <div style={{ borderLeft: `1px solid ${NHS.borderGrey}`, paddingLeft: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: NHS.black, marginBottom: 6 }}>Beds available today</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setBeds(p => ({ ...p, [homeId]: Math.max(0, (p[homeId] ?? 2) - 1) }))} style={{ width: 32, height: 32, borderRadius: 4, border: `2px solid ${NHS.borderGrey}`, background: NHS.white, fontSize: 18, color: NHS.darkGrey, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700 }}>−</button>
              <span style={{ fontSize: 32, fontWeight: 700, minWidth: 36, textAlign: "center", fontFamily: "monospace", color: availBeds === 0 ? NHS.red : NHS.green }}>{availBeds}</span>
              <button onClick={() => setBeds(p => ({ ...p, [homeId]: (p[homeId] ?? 2) + 1 }))} style={{ width: 32, height: 32, borderRadius: 4, border: `2px solid ${NHS.borderGrey}`, background: NHS.white, fontSize: 18, color: NHS.darkGrey, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700 }}>+</button>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${NHS.borderGrey}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NHS.black, marginBottom: 8 }}>Registered capabilities</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {home.caps.map(c => (
              <span key={c} style={{ fontSize: 12, background: "#E8F0F9", color: NHS.blue, border: `1px solid ${NHS.blue}40`, padding: "4px 10px", borderRadius: 4, fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* No beds warning */}
      {availBeds === 0 && (
        <div style={{ background: "#FEF5E7", borderLeft: `4px solid ${NHS.yellow}`, padding: "10px 16px", marginBottom: 16, fontSize: 14, color: NHS.black, borderRadius: "0 4px 4px 0" }}>
          <strong>No beds available today</strong> — increase bed count above to accept patients
        </div>
      )}

      {/* Empty state */}
      {pool.length === 0 ? (
        <div style={{ background: NHS.white, border: `2px dashed ${NHS.borderGrey}`, borderRadius: 4, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🏥</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: NHS.black, marginBottom: 8, fontFamily: "Arial,sans-serif" }}>No patients waiting for a match</h2>
          <p style={{ fontSize: 14, color: NHS.midGrey, maxWidth: 300, margin: "0 auto" }}>Switch to the Hospital Ward view and click "Add to pool" to begin.</p>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 14, color: NHS.darkGrey, marginBottom: 14, fontWeight: 500 }}>
            <span style={{ color: NHS.blue, fontWeight: 700 }}>{pool.filter(p => p.status === "in_pipeline").length}</span> patient{pool.filter(p => p.status === "in_pipeline").length !== 1 ? "s" : ""} waiting · ranked by match for {home.name}
          </div>

          {/* Patient cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {pool.map(p => {
              const pct    = matchPct(p, home);
              const placed = p.status === "placed";
              const conf   = confirming === p.id;
              const miles  = distMiles(p.lat, p.lng, home.lat, home.lng);

              return (
                <div key={p.id} className="fade-in" style={{
                  background: NHS.white, borderRadius: 4,
                  border: `1px solid ${NHS.borderGrey}`,
                  borderLeft: placed ? `4px solid ${NHS.green}` : `4px solid ${NHS.blue}`,
                  opacity: placed ? 0.6 : 1,
                  transition: "all .2s",
                  outline: conf ? `3px solid ${NHS.lightBlue}40` : undefined,
                }}>
                  <div style={{ padding: 16 }}>

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: NHS.black }}>{p.ref} · {p.age}{p.sex}</div>
                        <div style={{ fontSize: 12, color: NHS.midGrey, marginTop: 2 }}>{p.ward}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                        {!placed && <MatchTag pct={pct} />}
                        <PriorityTag v={p.priority} />
                      </div>
                    </div>

                    {/* Diagnosis */}
                    <div style={{ fontSize: 14, color: NHS.black, marginBottom: 10, fontWeight: 500 }}>{p.diag}</div>

                    {/* Need tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                      {p.needs.map(n => <NeedTag key={n} n={n} matched={home.caps.includes(n)} />)}
                    </div>

                    {/* Distance */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "7px 10px", background: NHS.paleGrey, borderRadius: 4, border: `1px solid ${NHS.borderGrey}` }}>
                      <span style={{ fontSize: 14 }}>📍</span>
                      <span style={{ fontSize: 12, color: NHS.darkGrey }}>
                        Patient's home is <strong style={{ color: NHS.black }}>{miles} miles</strong> from this facility
                      </span>
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 10, borderTop: `1px solid ${NHS.borderGrey}` }}>
                      {placed ? (
                        <span style={{ fontSize: 13, background: "#E8F4EE", color: NHS.green, border: `1px solid ${NHS.green}40`, padding: "5px 14px", borderRadius: 4, fontWeight: 700 }}>✓ Matched · {p.placedBy}</span>
                      ) : conf ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <NHSButton small variant="ghost" onClick={() => setConf(null)}>Cancel</NHSButton>
                          <NHSButton small onClick={() => doAccept(p.id)}>✓ Confirm match</NHSButton>
                        </div>
                      ) : (
                        <NHSButton small disabled={availBeds === 0} onClick={() => availBeds > 0 && setConf(p.id)}>Accept patient</NHSButton>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
