"use client";

import { useState, useRef } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";
import { SavedLineup } from "@/types";

interface LineupCardProps {
  lineups: SavedLineup[];
  selectedLineupId: string | null;
  selectedTeamId: string | null;
  onSelect: (lineupId: string) => void;
  onRename: (lineupId: string, name: string) => void;
  onDelete: (lineupId: string) => void;
  onCreateLineup: () => void;
}

function LineupRow({ lineup, isSelected, onSelect, onRename, onDelete }: {
  lineup: SavedLineup;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(lineup.name);

  function commitRename() {
    if (draft.trim()) onRename(draft.trim());
    setRenaming(false);
  }

  return (
    <div
      ref={rowRef}
      className={`flex items-center w-full rounded-lg transition-colors
        ${isSelected ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}
    >
      {renaming ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenaming(false); }}
          className="flex-1 px-3 py-2 text-sm font-semibold bg-transparent text-white outline-none"
        />
      ) : (
        <button
          onClick={onSelect}
          className={`flex-1 px-3 py-2 text-sm font-semibold text-left truncate
            ${isSelected ? "text-white" : "text-zinc-300"}`}
        >
          {lineup.name}
        </button>
      )}
      {!renaming && (
        <div className="pr-2">
          <ThreeDotMenu
            anchorRef={rowRef}
            items={[
              { label: "Rename", onClick: () => { setRenaming(true); setDraft(lineup.name); } },
              { label: "Delete", onClick: onDelete, danger: true },
            ]}
          />
        </div>
      )}
    </div>
  );
}

function LineupOptions({ lineups, selectedLineupId, onSelect, onRename, onDelete, onCreateLineup }: Omit<LineupCardProps, "selectedTeamId">) {
  const close = useAccordionClose();
  return (
    <>
      {lineups.map(lineup => (
        <LineupRow
          key={lineup.id}
          lineup={lineup}
          isSelected={selectedLineupId === lineup.id}
          onSelect={() => { onSelect(lineup.id); close(); }}
          onRename={name => onRename(lineup.id, name)}
          onDelete={() => onDelete(lineup.id)}
        />
      ))}
      <button
        onClick={() => { onCreateLineup(); close(); }}
        className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-dashed border-zinc-600"
      >
        + New lineup
      </button>
    </>
  );
}

export default function LineupCard({ lineups, selectedLineupId, selectedTeamId, onSelect, onRename, onDelete, onCreateLineup }: LineupCardProps) {
  const teamLineups = lineups.filter(l => l.teamId === selectedTeamId);
  const selectedLabel = selectedLineupId ? (teamLineups.find(l => l.id === selectedLineupId)?.name ?? "—") : "—";

  if (!selectedTeamId) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl opacity-40 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-zinc-400">Lineup</span>
            <span className="text-sm font-semibold text-zinc-100">—</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AccordionCard label="Lineup" selectedLabel={selectedLabel}>
      <LineupOptions
        lineups={teamLineups}
        selectedLineupId={selectedLineupId}
        onSelect={onSelect}
        onRename={onRename}
        onDelete={onDelete}
        onCreateLineup={onCreateLineup}
      />
    </AccordionCard>
  );
}
