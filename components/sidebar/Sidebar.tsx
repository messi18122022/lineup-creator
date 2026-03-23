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
      <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-200">
        Lineup Creator
      </h1>
      <ModeCard value={mode} onChange={onModeChange} />
      <FormationCard mode={mode} value={formation} onChange={onFormationChange} />
      <div className="mt-auto">
        {userEmail ? (
          <UserButton email={userEmail} />
        ) : (
          <a
            href="/auth"
            className="block text-xs text-zinc-400 hover:text-zinc-200 transition-colors pt-2 border-t border-zinc-700"
          >
            Login / Register
          </a>
        )}
      </div>
    </aside>
  );
}
