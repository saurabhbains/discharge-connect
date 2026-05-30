export type PatientStatus = "inpatient" | "staged" | "in_pipeline" | "placed";

export interface Patient {
  id: string;
  ref: string;
  age: number;
  sex: "M" | "F";
  ward: string;
  diag: string;
  needs: string[];
  delay: number;
  priority: number;
  status: PatientStatus;
  placedBy: string | null;
  lat: number;
  lng: number;
}

export interface Home {
  id: string;
  name: string;
  type: string;
  caps: string[];
  lat: number;
  lng: number;
}

export interface ToastItem {
  id: number;
  msg: string;
}
