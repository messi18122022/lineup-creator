"use client";

import { useRef } from "react";
import AccordionCard, { useAccordionClose } from "@/components/ui/AccordionCard";
import ThreeDotMenu from "@/components/ui/ThreeDotMenu";
import { Team } from "@/types";

interface TeamCardProps {
  teams: Team[];
  selectedTeamId: string | null;
  onSelect: (teamId: string | null) => void;
  onCreateTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  isPro: boolean;
}

function TeamRow({ team, isSelected, onSelect, onEdit, onDelete }: {
  team: Team;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={rowRef}
      className={`flex items-center w-full rounded-lg transition-colors
        ${isSelected ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}
    >
      <button
        onClick={onSelect}
        className={`flex-1 px-3 py-2 text-sm font-semibold text-left truncate
          ${isSelected ? "text-white" : "text-zinc-300"}`}
      >
        {team.name}
      </button>
      <div className="pr-2">
        <ThreeDotMenu
          anchorRef={rowRef}
          items={[
            { label: "Edit", onClick: onEdit },
            { label: "Delete", onClick: onDelete, danger: true },
          ]}
        />
      </div>
    </div>
  );
}

function TeamOptions({ teams, selectedTeamId, onSelect, onCreateTeam, onEditTeam, onDeleteTeam, isPro }: TeamCardProps) {
  const close = useAccordionClose();
  return (
    <>
      <div
        onClick={() => { onSelect(null); close(); }}
        className={`flex items-center w-full rounded-lg transition-colors cursor-pointer px-3 py-2
          ${!selectedTeamId ? "bg-green-600" : "bg-zinc-800 border border-zinc-600 hover:bg-zinc-700"}`}
      >
        <span className={`text-sm font-semibold ${!selectedTeamId ? "text-white" : "text-zinc-300"}`}>None</span>
      </div>

      {teams.map(team => (
        <TeamRow
          key={team.id}
          team={team}
          isSelected={selectedTeamId === team.id}
          onSelect={() => { onSelect(team.id); close(); }}
          onEdit={() => { onEditTeam(team); close(); }}
          onDelete={() => onDeleteTeam(team.id)}
        />
      ))}

      {isPro ? (
        <button
          onClick={() => { onCreateTeam(); close(); }}
          className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors text-left bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          + New team
        </button>
      ) : (
        <div className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-semibold bg-zinc-800 text-zinc-500 border border-dashed border-zinc-700 cursor-not-allowed">
          <span>+ New team</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-green-600 text-white px-1.5 py-0.5 rounded">Pro</span>
        </div>
      )}
    </>
  );
}

export default function TeamCard({ teams, selectedTeamId, onSelect, onCreateTeam, onEditTeam, onDeleteTeam, isPro }: TeamCardProps) {
  const selectedLabel = selectedTeamId ? (teams.find(t => t.id === selectedTeamId)?.name ?? "None") : "None";
  return (
    <AccordionCard label="Team" selectedLabel={selectedLabel}>
      <TeamOptions
        teams={teams}
        selectedTeamId={selectedTeamId}
        onSelect={onSelect}
        onCreateTeam={onCreateTeam}
        onEditTeam={onEditTeam}
        onDeleteTeam={onDeleteTeam}
        isPro={isPro}
      />
    </AccordionCard>
  );
}
