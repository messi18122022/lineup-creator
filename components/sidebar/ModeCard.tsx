"use client";

import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import { GameMode } from "@/types";

const MODES: GameMode[] = ["11v11", "4+1", "5+1"];

interface ModeCardProps {
  value: GameMode;
  onChange: (mode: GameMode) => void;
}

function ModeOptions({ value, onChange }: ModeCardProps) {
  const close = useAccordionClose();
  return (
    <>
      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => { onChange(mode); close(); }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${value === mode
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {mode}
        </button>
      ))}
    </>
  );
}

export default function ModeCard({ value, onChange }: ModeCardProps) {
  return (
    <AccordionCard label="Mode" selectedLabel={value}>
      <ModeOptions value={value} onChange={onChange} />
    </AccordionCard>
  );
}
