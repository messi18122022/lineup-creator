import ModeCard from "./ModeCard";
import FormationCard from "./FormationCard";
import { FormationKey, GameMode } from "@/types";

interface SidebarProps {
  mode: GameMode;
  formation: FormationKey;
  onModeChange: (mode: GameMode) => void;
  onFormationChange: (formation: FormationKey) => void;
}

export default function Sidebar({ mode, formation, onModeChange, onFormationChange }: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 bg-slate-800 border-r border-slate-700 flex flex-col gap-4 p-5">
      <h1 className="text-sm font-bold uppercase tracking-widest text-slate-200">
        Lineup Creator
      </h1>
      <ModeCard value={mode} onChange={onModeChange} />
      <FormationCard mode={mode} value={formation} onChange={onFormationChange} />
    </aside>
  );
}
