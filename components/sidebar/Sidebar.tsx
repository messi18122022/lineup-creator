import ModeCard from "./ModeCard";
import FormationCard from "./FormationCard";
import UserButton from "./UserButton";
import { FormationKey, GameMode } from "@/types";

interface SidebarProps {
  mode: GameMode;
  formation: FormationKey;
  onModeChange: (mode: GameMode) => void;
  onFormationChange: (formation: FormationKey) => void;
  userEmail: string | null;
}

export default function Sidebar({ mode, formation, onModeChange, onFormationChange, userEmail }: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 bg-zinc-900 border-r border-zinc-700 flex flex-col gap-4 p-5">
      <h1 className="text-sm font-bold uppercase tracking-widest text-center bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3">
        <span className="text-green-500">Lineup</span>
        <span className="text-zinc-200"> Creator</span>
      </h1>
      <ModeCard value={mode} onChange={onModeChange} />
      <FormationCard mode={mode} value={formation} onChange={onFormationChange} />
      <div className="mt-auto">
        {userEmail ? (
          <UserButton email={userEmail} />
        ) : (
          <a
            href="/auth"
            className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-center"
          >
            <span className="block text-sm font-semibold text-white">Unlock Pro</span>
            <span className="block text-xs text-green-200 mt-0.5">Pro version coming soon</span>
          </a>
        )}
      </div>
    </aside>
  );
}
