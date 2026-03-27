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

export type GameMode = "11v11" | "4+1" | "5+1";

export type FormationKey =
  // 11v11
  | "4-3-3"
  | "4-3-2-1"
  // 4+1
  | "2-2"
  | "2-1-1"
  // 5+1
  | "2-2-1"
  | "2-1-2";

export interface CustomFormation {
  id: string;
  name: string;
  positions: [number, number][];
  hasGoalkeeper: boolean;
}

export interface CustomMode {
  id: string;
  name: string;
  playerCount: number;
  formations: CustomFormation[];
}
