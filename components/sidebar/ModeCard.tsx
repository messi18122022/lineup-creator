"use client";

import { useState, useRef } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";

export interface ModeItem {
  id: string;
  name: string;
}

interface ModeCardProps {
  value: string;
  onChange: (mode: string) => void;
  isPro: boolean;
  modes: ModeItem[];
  onCreateMode: () => void;
  onRenameMode: (id: string, name: string) => void;
  onDeleteMode: (id: string) => void;
}

function ModeButton({
  item,
  isSelected,
  onSelect,
  close,
  onRename,
  onDelete,
  isPro,
}: {
  item: ModeItem;
  isSelected: boolean;
  onSelect: () => void;
  close: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  isPro: boolean;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const rowRef = useRef<HTMLDivElement>(null);

  function commitRename() {
    if (draft.trim()) onRename(item.id, draft.trim());
    setRenaming(false);
  }

  return (
    <div ref={rowRef} className={`flex items-center w-full rounded-lg transition-colors
      ${isSelected ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}>
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
          className={`flex-1 px-3 py-2 text-sm font-semibold text-left
            ${isSelected ? "text-white" : "text-zinc-300"}`}
        >
          {item.name}
        </button>
      )}
      {!renaming && (
        <div className="pr-2">
          <ThreeDotMenu anchorRef={rowRef} locked={!isPro} items={[
            { label: "Rename", onClick: () => { setRenaming(true); setDraft(item.name); } },
            { label: "Delete", onClick: () => onDelete(item.id), danger: true },
          ]} />
        </div>
      )}
    </div>
  );
}

function ModeOptions({ value, onChange, isPro, modes, onCreateMode, onRenameMode, onDeleteMode }: ModeCardProps) {
  const close = useAccordionClose();
  return (
    <>
      {modes.map(item => (
        <ModeButton
          key={item.id}
          item={item}
          isSelected={value === item.id}
          onSelect={() => onChange(item.id)}
          close={close}
          onRename={onRenameMode}
          onDelete={onDeleteMode}
          isPro={isPro}
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

export default function ModeCard({ value, onChange, isPro, modes, onCreateMode, onRenameMode, onDeleteMode }: ModeCardProps) {
  const selected = modes.find(m => m.id === value);
  const selectedLabel = selected?.name ?? value;

  return (
    <AccordionCard label="Mode" selectedLabel={selectedLabel}>
      <ModeOptions
        value={value}
        onChange={onChange}
        isPro={isPro}
        modes={modes}
        onCreateMode={onCreateMode}
        onRenameMode={onRenameMode}
        onDeleteMode={onDeleteMode}
      />
    </AccordionCard>
  );
}
