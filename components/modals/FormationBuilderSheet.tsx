"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import FieldLines from "@/components/field/FieldLines";
import { CustomFormation } from "@/types";
import { generateDefaultPositions } from "@/lib/customModes";

export interface FormationBuilderSheetProps {
  playerCount: number;
  onSave: (formation: CustomFormation) => void;
  onBack: () => void;
  onCancel: () => void;
  backLabel?: string;
}

export default function FormationBuilderSheet({
  playerCount,
  onSave,
  onBack,
  onCancel,
  backLabel = "← Back",
}: FormationBuilderSheetProps) {
  const [positions, setPositions] = useState<[number, number][]>(() =>
    generateDefaultPositions(playerCount)
  );
  const [hasGoalkeeper, setHasGoalkeeper] = useState(false);
  const [formationName, setFormationName] = useState("");

  const draggingIndex = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Goalkeeper toggle
  function toggleGoalkeeper(checked: boolean) {
    setHasGoalkeeper(checked);
    if (checked) {
      setPositions((prev) => {
        const next = [...prev] as [number, number][];
        next[0] = [50, 90];
        return next;
      });
    }
  }

  // Drag handlers
  function onMouseDown(index: number, e: React.MouseEvent) {
    if (hasGoalkeeper && index === 0) return;
    e.preventDefault();
    draggingIndex.current = index;
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingIndex.current === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));
    const idx = draggingIndex.current;
    setPositions((prev) => {
      const next = [...prev] as [number, number][];
      next[idx] = [Math.round(x), Math.round(y)];
      return next;
    });
  }, []);

  function onMouseUp() {
    draggingIndex.current = null;
  }

  const onTouchStart = useCallback(
    (index: number, e: React.TouchEvent) => {
      if (hasGoalkeeper && index === 0) return;
      e.preventDefault();
      draggingIndex.current = index;
    },
    [hasGoalkeeper]
  );

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (draggingIndex.current === null || !containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(2, Math.min(98, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(2, Math.min(98, ((touch.clientY - rect.top) / rect.height) * 100));
    const idx = draggingIndex.current;
    setPositions((prev) => {
      const next = [...prev] as [number, number][];
      next[idx] = [Math.round(x), Math.round(y)];
      return next;
    });
  }, []);

  function onTouchEnd() {
    draggingIndex.current = null;
  }

  function handleSave() {
    const formation: CustomFormation = {
      id: `cf-${Date.now()}`,
      name: formationName.trim(),
      positions: [...positions],
      hasGoalkeeper,
    };
    onSave(formation);
  }

  // Escape key -> onCancel
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm sm:max-h-[95dvh] h-[92dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-4 pt-4 pb-2">
          <h2 className="text-base font-bold text-zinc-100 mb-1">Create Formation</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasGoalkeeper}
              onChange={(e) => toggleGoalkeeper(e.target.checked)}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-sm font-medium text-zinc-200">Goalkeeper</span>
          </label>
        </div>

        {/* Field - flex-1 so it fills available space */}
        <div className="flex-1 min-h-0 flex items-center justify-center px-3 py-2">
          <div
            ref={containerRef}
            className="relative rounded-lg border-2 border-green-800 overflow-hidden select-none"
            style={{
              aspectRatio: "68 / 105",
              height: "100%",
              maxWidth: "100%",
              background: "linear-gradient(to bottom, #15803d 0%, #16a34a 100%)",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Grass stripes */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0px, transparent 38px, rgba(0,0,0,0.07) 38px, rgba(0,0,0,0.07) 76px)",
              }}
            />
            <FieldLines />
            {positions.map((pos, i) => {
              const isGK = hasGoalkeeper && i === 0;
              return (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pos[0]}%`,
                    top: `${pos[1]}%`,
                    cursor: isGK ? "not-allowed" : "grab",
                  }}
                  onMouseDown={(e) => onMouseDown(i, e)}
                  onTouchStart={(e) => onTouchStart(i, e)}
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-white shadow-md ${
                      isGK ? "bg-yellow-300" : "bg-white"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div className="mb-3">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
              Formation Name
            </label>
            <input
              type="text"
              value={formationName}
              onChange={(e) => setFormationName(e.target.value)}
              placeholder="e.g. 3-3-1"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div className="flex justify-between gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {backLabel}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formationName.trim()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
