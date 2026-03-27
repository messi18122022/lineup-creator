"use client";
import { useState, useEffect } from "react";
import FormationBuilderSheet from "@/components/modals/FormationBuilderSheet";
import { CustomMode, CustomFormation } from "@/types";

interface CreateModeDialogProps {
  onSave: (mode: CustomMode) => void;
  onClose: () => void;
}

export default function CreateModeDialog({ onSave, onClose }: CreateModeDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [playerCount, setPlayerCount] = useState(11);
  const [modeName, setModeName] = useState("");

  function goToStep2() {
    setStep(2);
  }

  // Close on backdrop click (step 1 only)
  function onBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape (step 1 only — step 2 handled by FormationBuilderSheet)
  useEffect(() => {
    if (step !== 1) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  if (step === 2) {
    return (
      <FormationBuilderSheet
        playerCount={playerCount}
        onSave={(formation: CustomFormation) => {
          const mode: CustomMode = {
            id: `cm-${Date.now()}`,
            name: modeName.trim(),
            playerCount,
            formations: [formation],
          };
          onSave(mode);
        }}
        onBack={() => setStep(1)}
        onCancel={onClose}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onBackdropClick}
    >
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
    </div>
  );
}
