"use client";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import { FORMATIONS_BY_MODE } from "@/lib/formations";
import { GameMode, CustomMode, CustomFormation } from "@/types";

interface FormationCardProps {
  mode: string;
  value: string;
  onChange: (value: string) => void;
  customModes: CustomMode[];
  isPro: boolean;
  onAddFormation: () => void;
  extraFormations: Record<string, CustomFormation[]>;
}

function FormationOptions({
  mode,
  value,
  onChange,
  customModes,
  isPro,
  onAddFormation,
  extraFormations,
}: FormationCardProps) {
  const close = useAccordionClose();

  const customMode = customModes.find((m) => m.id === mode);

  const options: { key: string; label: string }[] = customMode
    ? [
        ...customMode.formations.map((f) => ({ key: f.id, label: f.name })),
        ...(extraFormations[mode] ?? []).map((f) => ({ key: f.id, label: f.name })),
      ]
    : [
        ...(FORMATIONS_BY_MODE[mode as GameMode] ?? []).map((k) => ({ key: k, label: k })),
        ...(extraFormations[mode] ?? []).map((f) => ({ key: f.id, label: f.name })),
      ];

  return (
    <>
      {options.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            onChange(key);
            close();
          }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
            ${
              value === key
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
            }`}
        >
          {label}
        </button>
      ))}
      {!isPro ? (
        <div className="relative w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-500 border border-zinc-600 text-left cursor-not-allowed flex items-center justify-between">
          <span>+ Custom Formation</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-green-600 text-white px-1.5 py-0.5 rounded">
            Pro
          </span>
        </div>
      ) : (
        <button
          onClick={() => {
            onAddFormation();
            close();
          }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600 text-left transition-colors"
        >
          + Custom Formation
        </button>
      )}
    </>
  );
}

export default function FormationCard({
  mode,
  value,
  onChange,
  customModes,
  isPro,
  onAddFormation,
  extraFormations,
}: FormationCardProps) {
  const selectedLabel = (() => {
    const cm = customModes.find((m) => m.id === mode);
    if (cm) {
      const allFormations = [...cm.formations, ...(extraFormations[mode] ?? [])];
      return allFormations.find((f) => f.id === value)?.name ?? value;
    }
    // Check extra formations for built-in modes
    const extra = (extraFormations[mode] ?? []).find((f) => f.id === value);
    if (extra) return extra.name;
    return value;
  })();

  return (
    <AccordionCard label="Formation" selectedLabel={selectedLabel}>
      <FormationOptions
        mode={mode}
        value={value}
        onChange={onChange}
        customModes={customModes}
        isPro={isPro}
        onAddFormation={onAddFormation}
        extraFormations={extraFormations}
      />
    </AccordionCard>
  );
}
