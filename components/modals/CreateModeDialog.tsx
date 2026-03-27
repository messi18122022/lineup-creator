"use client";

import { useState } from "react";
import FormationBuilderSheet from "./FormationBuilderSheet";
import { CustomFormation, CustomMode } from "@/types";

interface CreateModeDialogProps {
  onSave: (mode: CustomMode) => void;
  onClose: () => void;
}

export default function CreateModeDialog({ onSave, onClose }: CreateModeDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [modeName, setModeName] = useState("");
  const [playerCount, setPlayerCount] = useState(7);

  function handleStep1Next() {
    if (!modeName.trim()) return;
    setStep(2);
  }

  function handleSaveFormation(formation: CustomFormation) {
    const newMode: CustomMode = {
      id: `cm-${Date.now()}`,
      name: modeName.trim(),
      playerCount,
      formations: [formation],
    };
    onSave(newMode);
  }

  if (step === 2) {
    return (
      <FormationBuilderSheet
        playerCount={playerCount}
        onSave={handleSaveFormation}
        onBack={() => setStep(1)}
        backLabel="← Back"
      />
    );
  }

  // Step 1: mode name + player count
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-80 flex flex-col gap-4">
        <h2 className="text-base font-bold text-zinc-100">Create Custom Mode</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Mode Name
          </label>
          <input
            autoFocus
            type="text"
            value={modeName}
            onChange={e => setModeName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleStep1Next()}
            placeholder="e.g. 7-a-side"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Players per team (including GK)
          </label>
          <input
            type="number"
            min={2}
            max={15}
            value={playerCount}
            onChange={e => setPlayerCount(Math.max(2, Math.min(15, Number(e.target.value))))}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none focus:border-green-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors border border-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleStep1Next}
            disabled={!modeName.trim()}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
