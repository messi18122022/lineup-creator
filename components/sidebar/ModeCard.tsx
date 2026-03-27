"use client";

import { useState } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";
import { GameMode, CustomMode } from "@/types";

const MODES: GameMode[] = ["11v11", "4+1", "5+1"];

interface ModeCardProps {
  value: string;
  onChange: (mode: string) => void;
  isPro: boolean;
  customModes: CustomMode[];
  onCreateMode: () => void;
  onRenameMode: (id: string, name: string) => void;
  onDeleteMode: (id: string) => void;
}

function CustomModeButton({
  cm,
  isSelected,
  onSelect,
  close,
  onRename,
  onDelete,
}: {
  cm: CustomMode;
  isSelected: boolean;
  onSelect: () => void;
  close: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(cm.name);

  function commitRename() {
    if (draft.trim()) onRename(cm.id, draft.trim());
    setRenaming(false);
  }

  return (
    <div
      className={`flex items-center w-full rounded-lg transition-colors
        ${isSelected ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}
    >
      {renaming ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") setRenaming(false);
          }}
          className="flex-1 px-3 py-2 text-sm font-semibold bg-transparent text-white outline-none"
        />
      ) : (
        <button
          onClick={() => { onSelect(); close(); }}
          className={`flex-1 px-3 py-2 text-sm font-semibold text-left ${isSelected ? "text-white" : "text-zinc-300"}`}
        >
          {cm.name}
        </button>
      )}
      {!renaming && (
        <div className="pr-2">
          <ThreeDotMenu
            items={[
              { label: "Rename", onClick: () => { setRenaming(true); setDraft(cm.name); } },
              { label: "Delete", onClick: () => onDelete(cm.id), danger: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function ModeOptions({
  value,
  onChange,
  isPro,
  customModes,
  onCreateMode,
  onRenameMode,
  onDeleteMode,
}: ModeCardProps) {
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
      {customModes.map((cm) => (
        <CustomModeButton
          key={cm.id}
          cm={cm}
          isSelected={value === cm.id}
          onSelect={() => onChange(cm.id)}
          close={close}
          onRename={onRenameMode}
          onDelete={onDeleteMode}
        />
      ))}
      {isPro ? (
        <button
          onClick={() => { onCreateMode(); close(); }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          + New mode
        </button>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-500 border border-dashed border-zinc-700 cursor-not-allowed">
          <span>+ New mode</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-green-600 text-white px-1.5 py-0.5 rounded">Pro</span>
        </div>
      )}
    </>
  );
}

export default function ModeCard({
  value,
  onChange,
  isPro,
  customModes,
  onCreateMode,
  onRenameMode,
  onDeleteMode,
}: ModeCardProps) {
  const displayLabel =
    MODES.includes(value as GameMode)
      ? value
      : (customModes.find(m => m.id === value)?.name ?? value);

  return (
    <AccordionCard label="Mode" selectedLabel={displayLabel}>
      <ModeOptions
        value={value}
        onChange={onChange}
        isPro={isPro}
        customModes={customModes}
        onCreateMode={onCreateMode}
        onRenameMode={onRenameMode}
        onDeleteMode={onDeleteMode}
      />
    </AccordionCard>
  );
}
