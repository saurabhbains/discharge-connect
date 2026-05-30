import type { Patient, Home } from "../types";

export function distMiles(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

export function matchPct(p: Patient, h: Home): number {
  return Math.round(p.needs.filter(n => h.caps.includes(n)).length / p.needs.length * 100);
}

export const NHS = {
  blue: "#005EB8",
  darkBlue: "#003087",
  brightBlue: "#0072CE",
  lightBlue: "#41B6E6",
  green: "#007F3B",
  lightGreen: "#78BE20",
  red: "#DA291C",
  orange: "#ED8B00",
  yellow: "#FFB81C",
  white: "#FFFFFF",
  black: "#231F20",
  darkGrey: "#425563",
  midGrey: "#768692",
  paleGrey: "#F0F4F5",
  borderGrey: "#D8DDE0",
} as const;
