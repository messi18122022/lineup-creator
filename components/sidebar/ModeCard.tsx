"use client";

import { GameMode } from "@/types";

const MODES: GameMode[] = ["11v11", "4+1", "5+1"];

interface ModeCardProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export default function ModeCard({ value, onChange }: ModeCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
        Mode
      </p>
      <div className="flex flex-col gap-2">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors
              ${value === mode
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
              }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
