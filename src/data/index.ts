import type { Patient, Home } from "../types";

export const INITIAL_PATIENTS: Patient[] = [
  { id:"PT-001", ref:"Patient A", age:78, sex:"F", ward:"D4 · Cardiology",    diag:"Heart failure",             needs:["Nursing care","Cardiac monitoring","Physiotherapy"],        delay:6, priority:94, status:"staged",    placedBy:null, lat:51.4967, lng:-0.0780 },
  { id:"PT-002", ref:"Patient B", age:84, sex:"M", ward:"C1 · Orthopaedics",  diag:"Hip fracture (post-op)",    needs:["Nursing care","Dementia support","Mobility"],                delay:9, priority:91, status:"staged",    placedBy:null, lat:51.4751, lng:-0.1672 },
  { id:"PT-003", ref:"Patient C", age:88, sex:"F", ward:"B2 · Gen. Medicine",  diag:"UTI with delirium",         needs:["Nursing care","Dementia support","Continence care"],         delay:7, priority:88, status:"staged",    placedBy:null, lat:51.4868, lng:-0.0972 },
  { id:"PT-004", ref:"Patient D", age:79, sex:"F", ward:"C1 · Orthopaedics",  diag:"Fractured wrist + frailty", needs:["Nursing care","Falls prevention","Physiotherapy"],           delay:5, priority:81, status:"staged",    placedBy:null, lat:51.4630, lng:-0.1132 },
  { id:"PT-005", ref:"Patient E", age:65, sex:"M", ward:"B2 · Gen. Medicine",  diag:"COPD exacerbation",         needs:["Respiratory care","Physiotherapy"],                          delay:4, priority:78, status:"staged",    placedBy:null, lat:51.4736, lng:-0.0880 },
  { id:"PT-006", ref:"Patient F", age:72, sex:"M", ward:"A1 · Surgical",       diag:"Post-op hip replacement",   needs:["Physiotherapy","Mobility","Wound care"],                     delay:3, priority:72, status:"staged",    placedBy:null, lat:51.4743, lng:-0.0373 },
  { id:"PT-007", ref:"Patient G", age:71, sex:"F", ward:"D4 · Cardiology",    diag:"Stroke",                    needs:["Stroke rehab","Speech therapy","Physiotherapy"],             delay:2, priority:65, status:"staged",    placedBy:null, lat:51.4755, lng:-0.1214 },
  { id:"PT-008", ref:"Patient H", age:67, sex:"M", ward:"D4 · Cardiology",    diag:"Atrial fibrillation",       needs:["Cardiac monitoring","Medication management"],                delay:1, priority:55, status:"staged",    placedBy:null, lat:51.4888, lng:-0.1075 },
  { id:"PT-009", ref:"Patient I", age:55, sex:"M", ward:"B2 · Gen. Medicine",  diag:"Pneumonia (acute)",         needs:["Respiratory care","Medication management"],                  delay:0, priority:0,  status:"inpatient", placedBy:null, lat:51.4820, lng:-0.0960 },
  { id:"PT-010", ref:"Patient J", age:69, sex:"F", ward:"A1 · Surgical",       diag:"Post-op bowel resection",   needs:["Nursing care","Wound care","Medication management"],         delay:0, priority:0,  status:"inpatient", placedBy:null, lat:51.4690, lng:-0.1050 },
];

export const HOMES: Home[] = [
  { id:"CH-01", name:"St Raphael's Rehab Centre",  type:"Rehabilitation", caps:["Stroke rehab","Speech therapy","Physiotherapy","Mobility","Wound care","Falls prevention"],                          lat:51.4756, lng:-0.0875 },
  { id:"CH-02", name:"Southwark Rehab Unit",        type:"Rehabilitation", caps:["Physiotherapy","Mobility","Falls prevention","Wound care","Stroke rehab","Medication management"],                   lat:51.4707, lng:-0.0622 },
  { id:"CH-03", name:"Lambeth Bridge Rehab",        type:"Rehabilitation", caps:["Stroke rehab","Speech therapy","Physiotherapy","Cardiac monitoring","Respiratory care","Continence care"],            lat:51.4612, lng:-0.1198 },
  { id:"CH-04", name:"Guy's Step-Down Unit",        type:"Rehabilitation", caps:["Nursing care","Physiotherapy","Mobility","Wound care","Medication management","Falls prevention","Dementia support"], lat:51.5036, lng:-0.0877 },
];
