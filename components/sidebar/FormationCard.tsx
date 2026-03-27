"use client";

import { useState } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";
import { FORMATIONS_BY_MODE } from "@/lib/formations";
import { FormationKey, GameMode, CustomFormation, CustomMode } from "@/types";

interface FormationCardProps {
  mode: string;
  value: string;
  onChange: (value: string) => void;
  isPro: boolean;
  customModes: CustomMode[];
  extraFormations: Record<string, CustomFormation[]>;
  onAddFormation: () => void;
  onRenameFormation: (id: string, name: string) => void;
  onDeleteFormation: (id: string) => void;
  onEditFormation: (id: string) => void;
}

function CustomFormationButton({
  formation,
  isSelected,
  onSelect,
  close,
  onRename,
  onDelete,
  onEdit,
}: {
  formation: CustomFormation;
  isSelected: boolean;
  onSelect: () => void;
  close: () => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(formation.name);

  function commitRename() {
    if (draft.trim()) onRename(formation.id, draft.trim());
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
          {formation.name}
        </button>
      )}
      {!renaming && (
        <div className="pr-2">
          <ThreeDotMenu
            items={[
              { label: "Rename", onClick: () => { setRenaming(true); setDraft(formation.name); } },
              { label: "Edit", onClick: () => onEdit(formation.id) },
              { label: "Delete", onClick: () => onDelete(formation.id), danger: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function FormationOptions({
  mode,
  value,
  onChange,
  isPro,
  customModes,
  extraFormations,
  onAddFormation,
  onRenameFormation,
  onDeleteFormation,
  onEditFormation,
}: FormationCardProps) {
  const close = useAccordionClose();

  const customMode = customModes.find(m => m.id === mode);

  const isBuiltIn = Object.keys(FORMATIONS_BY_MODE).includes(mode);

  type FormationOption = { key: string; label: string; isCustom: boolean };

  let options: FormationOption[];
  if (customMode) {
    options = customMode.formations
      .map(f => ({ key: f.id, label: f.name, isCustom: true }))
      .concat((extraFormations[mode] ?? []).map(f => ({ key: f.id, label: f.name, isCustom: true })));
  } else if (isBuiltIn) {
    options = (FORMATIONS_BY_MODE[mode as GameMode] ?? [])
      .map((k): FormationOption => ({ key: k, label: k, isCustom: false }))
      .concat((extraFormations[mode] ?? []).map(f => ({ key: f.id, label: f.name, isCustom: true })));
  } else {
    options = (extraFormations[mode] ?? []).map(f => ({ key: f.id, label: f.name, isCustom: true }));
  }

  // Find CustomFormation objects for the custom entries
  function findCustomFormation(id: string): CustomFormation | undefined {
    if (customMode) {
      const found = customMode.formations.find(f => f.id === id);
      if (found) return found;
    }
    return (extraFormations[mode] ?? []).find(f => f.id === id);
  }

  return (
    <>
      {options.map(opt => {
        if (!opt.isCustom) {
          return (
            <button
              key={opt.key}
              onClick={() => { onChange(opt.key); close(); }}
              className={`w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left
                ${value === opt.key
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
                }`}
            >
              {opt.label}
            </button>
          );
        }
        const cf = findCustomFormation(opt.key);
        if (!cf) return null;
        return (
          <CustomFormationButton
            key={opt.key}
            formation={cf}
            isSelected={value === opt.key}
            onSelect={() => onChange(opt.key)}
            close={close}
            onRename={onRenameFormation}
            onDelete={onDeleteFormation}
            onEdit={onEditFormation}
          />
        );
      })}
      {isPro ? (
        <button
          onClick={() => { onAddFormation(); close(); }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
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

export default function FormationCard({
  mode,
  value,
  onChange,
  isPro,
  customModes,
  extraFormations,
  onAddFormation,
  onRenameFormation,
  onDeleteFormation,
  onEditFormation,
}: FormationCardProps) {
  const customMode = customModes.find(m => m.id === mode);
  let displayLabel = value;
  if (customMode) {
    const cf = [...customMode.formations, ...(extraFormations[mode] ?? [])].find(f => f.id === value);
    if (cf) displayLabel = cf.name;
  } else {
    const extra = (extraFormations[mode] ?? []).find(f => f.id === value);
    if (extra) displayLabel = extra.name;
  }

  return (
    <AccordionCard label="Formation" selectedLabel={displayLabel}>
      <FormationOptions
        mode={mode}
        value={value}
        onChange={onChange}
        isPro={isPro}
        customModes={customModes}
        extraFormations={extraFormations}
        onAddFormation={onAddFormation}
        onRenameFormation={onRenameFormation}
        onDeleteFormation={onDeleteFormation}
        onEditFormation={onEditFormation}
      />
    </AccordionCard>
  );
}
