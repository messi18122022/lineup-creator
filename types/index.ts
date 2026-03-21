export interface Player {
  id: number;
  name: string;
  position: [number, number]; // [x%, y%]
  isGoalkeeper: boolean;
}

export interface Formation {
  label: string;
  positions: [number, number][];
}

export type FormationKey =
  | "4-3-3"
  | "4-4-2"
  | "4-2-3-1"
  | "3-5-2"
  | "5-3-2"
  | "4-1-4-1"
  | "3-4-3";
