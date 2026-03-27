import { CustomMode } from "@/types";

const STORAGE_KEY = "lineup_custom_modes";

export function loadCustomModes(): CustomMode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomModes(modes: CustomMode[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
}

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
