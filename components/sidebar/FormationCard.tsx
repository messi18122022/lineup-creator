"use client";

import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import { FORMATIONS_BY_MODE } from "@/lib/formations";
import { FormationKey, GameMode } from "@/types";

interface FormationCardProps {
  mode: GameMode;
  value: FormationKey;
  onChange: (value: FormationKey) => void;
}

function FormationOptions({ mode, value, onChange }: FormationCardProps) {
  const close = useAccordionClose();
  const options = FORMATIONS_BY_MODE[mode];
  return (
    <>
      {options.map((key) => (
        <button
          key={key}
          onClick={() => { onChange(key); close(); }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${value === key
              ? "bg-green-600 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {key}
        </button>
      ))}
    </>
  );
}

export default function FormationCard({ mode, value, onChange }: FormationCardProps) {
  return (
    <AccordionCard label="Formation" selectedLabel={value}>
      <FormationOptions mode={mode} value={value} onChange={onChange} />
    </AccordionCard>
  );
}
