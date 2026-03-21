import PlayerCountCard from "./PlayerCountCard";
import FormationCard from "./FormationCard";
import { FormationKey } from "@/types";

interface SidebarProps {
  playerCount: number;
  formation: FormationKey;
  onPlayerCountChange: (count: number) => void;
  onFormationChange: (formation: FormationKey) => void;
}

export default function Sidebar({
  playerCount,
  formation,
  onPlayerCountChange,
  onFormationChange,
}: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 bg-slate-800 border-r border-slate-700 flex flex-col gap-4 p-5">
      <h1 className="text-sm font-bold uppercase tracking-widest text-slate-200">
        Lineup Creator
      </h1>
      <PlayerCountCard count={playerCount} onChange={onPlayerCountChange} />
      <FormationCard value={formation} onChange={onFormationChange} />
    </aside>
  );
}
