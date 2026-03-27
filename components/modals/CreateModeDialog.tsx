"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import FieldLines from "@/components/field/FieldLines";
import { CustomMode, CustomFormation } from "@/types";
import { generateDefaultPositions } from "@/lib/customModes";

interface CreateModeDialogProps {
  onSave: (mode: CustomMode) => void;
  onClose: () => void;
}

export default function CreateModeDialog({ onSave, onClose }: CreateModeDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 state
  const [playerCount, setPlayerCount] = useState(11);
  const [modeName, setModeName] = useState("");

  // Step 2 state
  const [hasGoalkeeper, setHasGoalkeeper] = useState(false);
  const [formationName, setFormationName] = useState("");
  const [positions, setPositions] = useState<[number, number][]>([]);

  const draggingIndex = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize positions when going to step 2
  function goToStep2() {
    setPositions(generateDefaultPositions(playerCount));
    setHasGoalkeeper(false);
    setFormationName("");
    setStep(2);
  }

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

  // Touch support
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
    const mode: CustomMode = {
      id: `cm-${Date.now()}`,
      name: modeName.trim(),
      playerCount,
      formations: [formation],
    };
    onSave(mode);
  }

  // Close on backdrop click
  function onBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onBackdropClick}
    >
      {step === 1 ? (
        <div
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-base font-bold text-zinc-100 mb-5">Create Custom Mode</h2>

          {/* Player count */}
          <div className="mb-4">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
              Number of Players
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPlayerCount((c) => Math.max(1, c - 1))}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-200 font-bold text-lg hover:bg-zinc-700 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="text-2xl font-bold text-zinc-100 w-8 text-center">{playerCount}</span>
              <button
                onClick={() => setPlayerCount((c) => Math.min(11, c + 1))}
                className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-600 text-zinc-200 font-bold text-lg hover:bg-zinc-700 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Mode name */}
          <div className="mb-6">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
              Mode Name
            </label>
            <input
              type="text"
              value={modeName}
              onChange={(e) => setModeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && modeName.trim()) goToStep2();
              }}
              placeholder="e.g. 7v7"
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={goToStep2}
              disabled={!modeName.trim()}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div
          className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-base font-bold text-zinc-100 mb-1">Create Formation</h2>
          <p className="text-xs text-zinc-400 mb-4">Drag players to position them</p>

          {/* Goalkeeper checkbox */}
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasGoalkeeper}
              onChange={(e) => toggleGoalkeeper(e.target.checked)}
              className="w-4 h-4 accent-green-500"
            />
            <span className="text-sm font-medium text-zinc-200">Goalkeeper</span>
          </label>

          {/* Field */}
          <div className="w-full mb-4" style={{ aspectRatio: "68 / 105" }}>
            <div
              ref={containerRef}
              className="relative w-full h-full rounded-lg border-2 border-green-800 overflow-hidden select-none"
              style={{
                background: "linear-gradient(to bottom, #15803d 0%, #16a34a 100%)",
                cursor: draggingIndex.current !== null ? "grabbing" : "default",
              }}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
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

          {/* Formation name */}
          <div className="mb-5">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400 block mb-2">
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
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
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
      )}
    </div>
  );
}
