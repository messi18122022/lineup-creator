import { Formation, FormationKey, GameMode } from "@/types";

export const FORMATIONS: Record<FormationKey, Formation> = {
  // ── 11v11 ──
  "4-3-3": {
    label: "4-3-3",
    positions: [
      [50, 90],                                           // GK
      [15, 73], [35, 73], [58, 73], [80, 73],            // DEF
      [22, 54], [50, 51], [78, 54],                      // MID
      [18, 28], [50, 22], [82, 28],                      // FWD
    ],
  },
  "4-3-2-1": {
    label: "4-3-2-1",
    positions: [
      [50, 90],                                           // GK
      [15, 73], [35, 73], [58, 73], [80, 73],            // DEF
      [22, 57], [50, 54], [78, 57],                      // MID
      [30, 35], [70, 35],                                // ATT MID
      [50, 18],                                          // ST
    ],
  },

  // ── 4+1 (5 players: GK + 4) ──
  "2-2": {
    label: "2-2",
    positions: [
      [50, 90],                                           // GK
      [30, 68], [70, 68],                                // DEF
      [30, 25], [70, 25],                                // FWD
    ],
  },
  "2-1-1": {
    label: "2-1-1",
    positions: [
      [50, 90],                                           // GK
      [30, 68], [70, 68],                                // DEF
      [50, 48],                                          // MID
      [50, 22],                                          // FWD
    ],
  },

  // ── 5+1 (6 players: GK + 5) ──
  "2-2-1": {
    label: "2-2-1",
    positions: [
      [50, 90],                                           // GK
      [30, 70], [70, 70],                                // DEF
      [30, 48], [70, 48],                                // MID
      [50, 22],                                          // FWD
    ],
  },
  "2-1-2": {
    label: "2-1-2",
    positions: [
      [50, 90],                                           // GK
      [30, 70], [70, 70],                                // DEF
      [50, 50],                                          // MID
      [28, 25], [72, 25],                                // FWD
    ],
  },
};

export const FORMATIONS_BY_MODE: Record<GameMode, FormationKey[]> = {
  "11v11": ["4-3-3", "4-3-2-1"],
  "4+1":   ["2-2", "2-1-1"],
  "5+1":   ["2-2-1", "2-1-2"],
};

export const DEFAULT_FORMATION_FOR_MODE: Record<GameMode, FormationKey> = {
  "11v11": "4-3-3",
  "4+1":   "2-2",
  "5+1":   "2-2-1",
};
