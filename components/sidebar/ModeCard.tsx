"use client";

import { GameMode } from "@/types";

const MODES: GameMode[] = ["11v11", "4+1", "5+1"];

interface ModeCardProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

export default function ModeCard({ value, onChange }: ModeCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Mode
      </p>
      <div className="flex flex-col gap-2">
        {MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors
              ${value === mode
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600"
              }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}
