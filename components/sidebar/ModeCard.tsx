"use client";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import { GameMode, CustomMode } from "@/types";

const MODES: GameMode[] = ["11v11", "4+1", "5+1"];

interface ModeCardProps {
  value: string;
  onChange: (mode: string) => void;
  isPro: boolean;
  customModes: CustomMode[];
  onCreateMode: () => void;
}

function ModeOptions({ value, onChange, isPro, customModes, onCreateMode }: ModeCardProps) {
  const close = useAccordionClose();
  return (
    <>
      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => {
            onChange(mode);
            close();
          }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${
              value === mode
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {mode}
        </button>
      ))}
      {customModes.map((cm) => (
        <button
          key={cm.id}
          onClick={() => {
            onChange(cm.id);
            close();
          }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${
              value === cm.id
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {cm.name}
        </button>
      ))}
      {!isPro ? (
        <div className="relative w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-500 border border-zinc-600 text-left cursor-not-allowed flex items-center justify-between">
          <span>+ Custom Mode</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-amber-500 text-black px-1.5 py-0.5 rounded">
            Pro
          </span>
        </div>
      ) : (
        <button
          onClick={() => {
            onCreateMode();
            close();
          }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600 text-left transition-colors"
        >
          + Custom Mode
        </button>
      )}
    </>
  );
}

export default function ModeCard({ value, onChange, isPro, customModes, onCreateMode }: ModeCardProps) {
  // Determine the label to display in the accordion header
  const customMode = customModes.find((cm) => cm.id === value);
  const selectedLabel = customMode ? customMode.name : value;

  return (
    <AccordionCard label="Mode" selectedLabel={selectedLabel}>
      <ModeOptions
        value={value}
        onChange={onChange}
        isPro={isPro}
        customModes={customModes}
        onCreateMode={onCreateMode}
      />
    </AccordionCard>
  );
}
