import { CustomMode, CustomFormation, GameMode } from "@/types";

const STORAGE_KEY = "lineup_custom_modes";
const EXTRA_FORMATIONS_KEY = "lineup_extra_formations";
const MODE_OVERRIDES_KEY = "lineup_mode_overrides";
const FORMATION_OVERRIDES_KEY = "lineup_formation_overrides";

// ── Custom modes ────────────────────────────────────────────────────────────

export function loadCustomModes(): CustomMode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomModes(modes: CustomMode[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
}

// ── Extra formations (added to any mode via "+") ─────────────────────────────

export function loadExtraFormations(): Record<string, CustomFormation[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(EXTRA_FORMATIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveExtraFormations(data: Record<string, CustomFormation[]>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EXTRA_FORMATIONS_KEY, JSON.stringify(data));
}

// ── Overrides for built-in modes (renames + deletes) ─────────────────────────

export interface ModeOverrides {
  renames: Record<string, string>; // mode id → display name
  deleted: string[];               // deleted mode ids
}

export function loadModeOverrides(): ModeOverrides {
  if (typeof window === "undefined") return { renames: {}, deleted: [] };
  try {
    const raw = localStorage.getItem(MODE_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : { renames: {}, deleted: [] };
  } catch { return { renames: {}, deleted: [] }; }
}

export function saveModeOverrides(data: ModeOverrides): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_OVERRIDES_KEY, JSON.stringify(data));
}

// ── Overrides for built-in formations (renames + deletes + position edits) ───

export interface FormationOverrides {
  renames: Record<string, string>;           // formation id → display name
  deleted: string[];                         // deleted formation ids
  edits: Record<string, [number, number][]>; // formation id → modified positions
}

export function loadFormationOverrides(): FormationOverrides {
  if (typeof window === "undefined") return { renames: {}, deleted: [], edits: {} };
  try {
    const raw = localStorage.getItem(FORMATION_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : { renames: {}, deleted: [], edits: {} };
  } catch { return { renames: {}, deleted: [], edits: {} }; }
}

export function saveFormationOverrides(data: FormationOverrides): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FORMATION_OVERRIDES_KEY, JSON.stringify(data));
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export const PLAYER_COUNT_FOR_BUILTIN_MODE: Record<GameMode, number> = {
  "11v11": 11,
  "4+1": 5,
  "5+1": 6,
};

export function generateDefaultPositions(count: number): [number, number][] {
  const positions: [number, number][] = [];
  if (count === 0) return positions;
  if (count === 1) return [[50, 45]];

  const rows = count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
  const playersPerRow = Math.ceil(count / rows);
  let placed = 0;

  for (let row = 0; row < rows && placed < count; row++) {
    const inRow = Math.min(playersPerRow, count - placed);
    const y = rows === 1 ? 45 : 20 + (row / (rows - 1)) * 55;
    for (let col = 0; col < inRow; col++) {
      const x = (100 / (inRow + 1)) * (col + 1);
      positions.push([Math.round(x), Math.round(y)]);
      placed++;
    }
  }
  return positions;
}
