"use client";

import { FORMATIONS_BY_MODE } from "@/lib/formations";
import { FormationKey, GameMode } from "@/types";

interface FormationCardProps {
  mode: GameMode;
  value: FormationKey;
  onChange: (value: FormationKey) => void;
}

export default function FormationCard({ mode, value, onChange }: FormationCardProps) {
  const options = FORMATIONS_BY_MODE[mode];

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
        Formation
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as FormationKey)}
        className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg
          px-3 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
