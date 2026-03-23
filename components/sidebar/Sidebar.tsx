import ModeCard from "./ModeCard";
import FormationCard from "./FormationCard";
import UserButton from "./UserButton";
import { FormationKey, GameMode } from "@/types";

function SidebarToggleIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="18.5" height="14.5" rx="3.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.75" y1="1" x2="6.75" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

interface SidebarProps {
  mode: GameMode;
  formation: FormationKey;
  onModeChange: (mode: GameMode) => void;
  onFormationChange: (formation: FormationKey) => void;
  userEmail: string | null;
  onCollapse: () => void;
}

export default function Sidebar({ mode, formation, onModeChange, onFormationChange, userEmail, onCollapse }: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 bg-zinc-900 border-r border-zinc-700 flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-sm font-bold uppercase tracking-widest text-center flex-1 bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3">
          <span className="text-green-500">Lineup</span>
          <span className="text-zinc-200"> Creator</span>
        </h1>
        <button
          onClick={onCollapse}
          className="text-green-500 hover:text-green-400 transition-colors cursor-pointer"
          title="Close sidebar"
        >
          <SidebarToggleIcon />
        </button>
      </div>
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
