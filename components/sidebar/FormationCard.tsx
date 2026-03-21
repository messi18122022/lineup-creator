"use client";

import AccordionCard from "@/components/ui/AccordionCard";
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
    <AccordionCard label="Formation" selectedLabel={value}>
      {options.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${value === key
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {key}
        </button>
      ))}
    </AccordionCard>
  );
}
