export interface SimProps {
  waterTemp: number;
  blockTemp: number;
  mat: string;
  mass: number;
  stirring: boolean;
  started: boolean;
  paused: boolean;
}

export interface MaterialProperties {
  specificHeat: number;
  color: Array<number>[3] | string;
  density: number;
}

export const MaterialArray: Array<string> = [
  "Pt (Sample)",
  "A", // Fe
  "B", // Au
  "C", // Cu
  "D", // Ag
  "E", // Pb
];
