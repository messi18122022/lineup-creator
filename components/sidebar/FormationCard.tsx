"use client";

import { useState } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";

export interface FormationItem {
  id: string;
  name: string;
}

interface FormationCardProps {
  value: string;
  onChange: (value: string) => void;
  isPro: boolean;
  formations: FormationItem[];
  selectedFormationName: string;
  onAddFormation: () => void;
  onRenameFormation: (id: string, name: string) => void;
  onDeleteFormation: (id: string) => void;
  onEditFormation: (id: string) => void;
}

function FormationButton({
  item, isSelected, onSelect, close, onRename, onDelete, onEdit,
}: {
  item: FormationItem; isSelected: boolean; onSelect: () => void; close: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(item.name);

  function commitRename() {
    if (draft.trim()) onRename(item.id, draft.trim());
    setRenaming(false);
  }

  return (
    <div className={`flex items-center w-full rounded-lg transition-colors
      ${isSelected ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}>
      {renaming ? (
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(false); }}
          className="flex-1 px-3 py-2 text-sm font-semibold bg-transparent text-white outline-none"
        />
      ) : (
        <button onClick={() => { onSelect(); close(); }}
          className={`flex-1 px-3 py-2 text-sm font-semibold text-left ${isSelected ? "text-white" : "text-zinc-300"}`}>
          {item.name}
        </button>
      )}
      {!renaming && (
        <div className="pr-2">
          <ThreeDotMenu items={[
            { label: "Rename", onClick: () => { setRenaming(true); setDraft(item.name); } },
            { label: "Edit", onClick: () => onEdit(item.id) },
            { label: "Delete", onClick: () => onDelete(item.id), danger: true },
          ]} />
        </div>
      )}
    </div>
  );
}

function FormationOptions({ value, onChange, isPro, formations, onAddFormation, onRenameFormation, onDeleteFormation, onEditFormation }: FormationCardProps) {
  const close = useAccordionClose();
  return (
    <>
      {formations.map(item => (
        <FormationButton key={item.id} item={item} isSelected={value === item.id}
          onSelect={() => onChange(item.id)} close={close}
          onRename={onRenameFormation} onDelete={onDeleteFormation} onEdit={onEditFormation} />
      ))}
      {isPro ? (
        <button onClick={() => { onAddFormation(); close(); }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-dashed border-zinc-600">
          + Add formation
        </button>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-500 border border-dashed border-zinc-700 cursor-not-allowed">
          <span>+ Add formation</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-green-600 text-white px-1.5 py-0.5 rounded">Pro</span>
        </div>
      )}
    </>
  );
}

export default function FormationCard({ value, onChange, isPro, formations, selectedFormationName, onAddFormation, onRenameFormation, onDeleteFormation, onEditFormation }: FormationCardProps) {
  return (
    <AccordionCard label="Formation" selectedLabel={selectedFormationName}>
      <FormationOptions value={value} onChange={onChange} isPro={isPro} formations={formations}
        selectedFormationName={selectedFormationName} onAddFormation={onAddFormation}
        onRenameFormation={onRenameFormation} onDeleteFormation={onDeleteFormation} onEditFormation={onEditFormation} />
    </AccordionCard>
  );
}
