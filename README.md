# DischargeConnect — NHS Discharge Coordination Demo

> A hackathon demo simulating real-time hospital discharge coordination between NHS ward teams and rehabilitation facilities.

---

## The Problem

Every day, thousands of NHS hospital beds are blocked by patients who are **clinically ready to be discharged** but can't leave because no suitable rehabilitation or care facility has been found. This "delayed transfer of care" costs the NHS an estimated **£1 billion per year** and causes harm to patients through deconditioning and hospital-acquired infections.

The current process is manual — discharge coordinators call facilities one by one, fax referral forms, and wait for callbacks. Rehab facilities have no visibility into who's waiting, and hospitals have no visibility into available beds.

---

## The Solution

**DischargeConnect** is a two-sided coordination platform:

- **Hospital ward view** — discharge coordinators see all patients, triage who is ready to leave, and add them to a real-time matching pool with one click.
- **Rehab facility portal** — admissions teams see the live pool of waiting patients, ranked by care-need match to their specific capabilities, and accept patients directly.

The result: faster placements, fewer phone calls, and beds freed up sooner.

---

## Demo Walkthrough

### 1. Hospital Ward View

- See all 10 patients across four wards with their diagnosis, care needs, delay (days stuck), and priority score
- Patients are colour-coded by urgency (red ≥80, amber ≥60, grey otherwise)
- Drag rows to manually re-prioritise
- Click **"+ Add to pool"** on individual patients, or **"Add all ready patients"** in bulk
- Filter across four tabs: All · Ready For Match · Awaiting Match · Matched

### 2. Care Home Portal

- Select from four real NHS-style rehabilitation facilities
- Adjust live bed availability with +/− controls
- Patients are ranked by **% care-need match** to that facility's registered capabilities
- Matched needs are highlighted green; unmet needs shown grey
- Distance from patient's home location to the facility is calculated and displayed
- Click **"Accept patient"** → confirm → patient is marked as Matched across both views

### 3. Live State Sync

- Both views share the same state — a match confirmed in the care home portal is immediately reflected in the hospital ward table
- Toast notifications confirm every action
- **"↺ Reset demo"** button in the header restores everything to the initial state instantly

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + inline NHS Design System styles |
| Build | Vite with `@tailwindcss/vite` plugin |
| No backend | All state is in-memory — no DB, no API calls |

---

## Project Structure

```
discharge-connect/
├── src/
│   ├── types/
│   │   └── index.ts              # Patient, Home, ToastItem interfaces
│   ├── data/
│   │   └── index.ts              # Seed data — 10 patients, 4 rehab facilities
│   ├── lib/
│   │   └── utils.ts              # distMiles(), matchPct(), NHS colour tokens
│   ├── components/
│   │   ├── atoms.tsx             # Shared UI: PriorityTag, DelayTag, MatchTag,
│   │   │                         #   NeedTag, StatusTag, NHSButton, Toast
│   │   ├── HospitalScreen.tsx    # Ward coordinator view
│   │   └── CareHomeScreen.tsx    # Rehab facility admissions view
│   ├── App.tsx                   # Root — shared state, nav, header
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles + animations
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Patient Status Flow

```
inpatient  →  staged  →  in_pipeline  →  placed
   │              │             │              │
Still under   Clinically    Added to      Matched with
  active       ready —      matching      a facility
 treatment    not yet        pool
              in pool
```

- **Inpatient** — no action available; still receiving active treatment
- **Staged (Ready to Discharge)** — clinical team has cleared them; coordinator can add to pool
- **Awaiting Match (In Pipeline)** — visible to all registered rehab facilities
- **Matched (Placed)** — a facility has accepted; row dims and status turns green

---

## Matching Logic

Each patient has a list of **care needs** (e.g. `Stroke rehab`, `Dementia support`, `Physiotherapy`).  
Each facility has a list of **registered capabilities**.

**Match % = (needs covered by facility) / (total needs) × 100**

Patients in the care home portal are sorted:
1. Awaiting match first, placed patients last
2. Within each group, highest match % to the selected facility first

---

## Key Demo Data

**Patients (8 staged, 2 still inpatient):**

| Patient | Age | Diagnosis | Delay | Priority |
|---|---|---|---|---|
| Patient A | 78F | Heart failure | 6d | 94 |
| Patient B | 84M | Hip fracture (post-op) | 9d | 91 |
| Patient C | 88F | UTI with delirium | 7d | 88 |
| Patient D | 79F | Fractured wrist + frailty | 5d | 81 |
| Patient E | 65M | COPD exacerbation | 4d | 78 |
| Patient F | 72M | Post-op hip replacement | 3d | 72 |
| Patient G | 71F | Stroke | 2d | 65 |
| Patient H | 67M | Atrial fibrillation | 1d | 55 |
| Patient I | 55M | Pneumonia (acute) | — | Inpatient |
| Patient J | 69F | Post-op bowel resection | — | Inpatient |

**Rehab Facilities:**

| Facility | Speciality |
|---|---|
| St Raphael's Rehab Centre | Stroke, physio, mobility, wound care |
| Southwark Rehab Unit | Physio, falls prevention, medication |
| Lambeth Bridge Rehab | Stroke, cardiac, respiratory, continence |
| Guy's Step-Down Unit | Full-spectrum: nursing, dementia, physio |

---

## Running Locally

```bash
git clone https://github.com/saurabhbains/discharge-connect.git
cd discharge-connect
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Built For

NHS hackathon demo — exploring how a lightweight real-time matching layer could reduce delayed transfers of care without requiring deep EHR integration. No patient data is real.
