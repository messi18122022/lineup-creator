import ModeCard, { ModeItem } from "./ModeCard";
import FormationCard, { FormationItem } from "./FormationCard";
import UserButton from "./UserButton";
import { logout } from "@/app/actions/auth";

interface SidebarProps {
  mode: string;
  formation: string;
  onModeChange: (mode: string) => void;
  onFormationChange: (formation: string) => void;
  userEmail: string | null;
  isPro: boolean;
  modes: ModeItem[];
  formations: FormationItem[];
  selectedFormationName: string;
  onCreateMode: () => void;
  onAddFormation: () => void;
  onRenameMode: (id: string, name: string) => void;
  onDeleteMode: (id: string) => void;
  onRenameFormation: (id: string, name: string) => void;
  onDeleteFormation: (id: string) => void;
  onEditFormation: (id: string) => void;
}

export default function Sidebar({
  mode, formation, onModeChange, onFormationChange,
  userEmail, isPro, modes, formations, selectedFormationName,
  onCreateMode, onAddFormation, onRenameMode, onDeleteMode,
  onRenameFormation, onDeleteFormation, onEditFormation,
}: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 h-full bg-zinc-900 border-r border-zinc-700 flex flex-col gap-4 p-5">
      <h1 className="text-sm font-bold uppercase tracking-widest text-center bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3">
        <span className="text-green-500">Lineup</span>
        <span className="text-zinc-200"> Creator</span>
      </h1>
      <ModeCard
        value={mode} onChange={onModeChange} isPro={isPro} modes={modes}
        onCreateMode={onCreateMode} onRenameMode={onRenameMode} onDeleteMode={onDeleteMode}
      />
      <FormationCard
        value={formation} onChange={onFormationChange} isPro={isPro}
        formations={formations} selectedFormationName={selectedFormationName}
        onAddFormation={onAddFormation} onRenameFormation={onRenameFormation}
        onDeleteFormation={onDeleteFormation} onEditFormation={onEditFormation}
      />
      <div className="mt-auto flex flex-col gap-2">
        {!userEmail ? (
          <>
            <a href="/auth?mode=login"
              className="block w-full text-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-2">
              Sign in to Pro Account
            </a>
            <a href="/pro"
              className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-center">
              <span className="text-sm font-semibold text-white">Go Pro</span>
            </a>
          </>
        ) : isPro ? (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-700">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white uppercase">{userEmail![0]}</span>
            </div>
            <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">Pro</span>
            <form action={logout} className="ml-auto">
              <button type="submit"
                className="h-8 px-3 bg-red-700 hover:bg-red-600 transition-colors rounded text-sm font-semibold text-white">
                Logout
              </button>
            </form>
          </div>
        ) : (
          <>
            <a href="/pro"
              className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-center">
              <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
            </a>
            <UserButton email={userEmail} />
          </>
        )}
      </div>
    </aside>
  );
}
