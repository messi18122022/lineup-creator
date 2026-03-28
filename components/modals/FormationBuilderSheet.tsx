"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import FieldLines from "@/components/field/FieldLines";
import { CustomFormation } from "@/types";
import { generateDefaultPositions } from "@/lib/customModes";

interface FormationBuilderSheetProps {
  playerCount: number;
  onSave: (formation: CustomFormation) => void;
  onBack: () => void;
  backLabel?: string;
  // Edit mode props
  initialPositions?: [number, number][];
  initialHasGoalkeeper?: boolean;
  initialFormationName?: string;
  editingId?: string;
}

export default function FormationBuilderSheet({
  playerCount,
  onSave,
  onBack,
  backLabel = "← Back",
  initialPositions,
  initialHasGoalkeeper,
  initialFormationName,
  editingId,
}: FormationBuilderSheetProps) {
  const [positions, setPositions] = useState<[number, number][]>(() => {
    if (initialPositions) return initialPositions;
    const defaults = generateDefaultPositions(playerCount);
    if ((initialHasGoalkeeper ?? true) && defaults.length > 0) {
      defaults[0] = [50, 90];
    }
    return defaults;
  });
  const [hasGoalkeeper, setHasGoalkeeper] = useState(initialHasGoalkeeper ?? true);
  const [formationName, setFormationName] = useState(initialFormationName ?? "");
  const [dragging, setDragging] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = { overflow: document.body.style.overflow, position: document.body.style.position, width: document.body.style.width };
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.position = prev.position;
      document.body.style.width = prev.width;
    };
  }, []);

  function getRelativePosition(clientX: number, clientY: number): [number, number] {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return [x, y];
  }

  const onMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    if (hasGoalkeeper && index === 0) return;
    e.preventDefault();
    setDragging(index);
  }, [hasGoalkeeper]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging === null) return;
    const [x, y] = getRelativePosition(e.clientX, e.clientY);
    setPositions(prev => {
      const next = [...prev] as [number, number][];
      next[dragging] = [x, y];
      return next;
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const onTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    if (hasGoalkeeper && index === 0) return;
    e.preventDefault();
    setDragging(index);
  }, [hasGoalkeeper]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragging === null) return;
    const touch = e.touches[0];
    const [x, y] = getRelativePosition(touch.clientX, touch.clientY - 60);
    setPositions(prev => {
      const next = [...prev] as [number, number][];
      next[dragging] = [x, y];
      return next;
    });
  }, [dragging]);

  const onTouchEnd = useCallback(() => {
    setDragging(null);
  }, []);

  function handleSave() {
    const formation: CustomFormation = {
      id: editingId ?? `cf-${Date.now()}`,
      name: formationName.trim(),
      positions: [...positions],
      hasGoalkeeper,
    };
    onSave(formation);
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col touch-none">
      {/* Top toolbar */}
      <div className="flex-shrink-0 h-14 bg-zinc-900 border-b border-zinc-700 flex items-center gap-3 px-4">
        <button
          onClick={onBack}
          className="text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-semibold flex-shrink-0"
        >
          {backLabel}
        </button>
        <label className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={hasGoalkeeper}
            onChange={e => {
              const checked = e.target.checked;
              setHasGoalkeeper(checked);
              if (checked) {
                setPositions(prev => {
                  const next = [...prev] as [number, number][];
                  next[0] = [50, 90];
                  return next;
                });
              }
            }}
            className="w-4 h-4 accent-green-500"
          />
          <span className="text-sm text-zinc-200">Goalkeeper</span>
        </label>
        <input
          type="text"
          value={formationName}
          onChange={e => setFormationName(e.target.value)}
          placeholder="Formation name"
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 transition-colors min-w-0"
        />
        <button
          onClick={handleSave}
          disabled={!formationName.trim()}
          className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>

      {/* Main area */}
      <main className="flex flex-1 items-center justify-center p-4 overflow-hidden">
        <div className="w-full md:w-auto md:h-full" style={{ aspectRatio: "68 / 105" }}>
          <div
            ref={containerRef}
            className="relative w-full h-full rounded-lg border-4 border-green-800 overflow-hidden select-none"
            style={{ background: "linear-gradient(to bottom, #15803d 0%, #16a34a 100%)" }}
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
                  onMouseDown={e => onMouseDown(i, e)}
                  onTouchStart={e => onTouchStart(i, e)}
                >
                  <div
                    className={`w-9 h-9 rounded-full border-[3px] border-white shadow-lg ${
                      isGK ? "bg-yellow-300" : "bg-white"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
