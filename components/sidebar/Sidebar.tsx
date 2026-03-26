import ModeCard from "./ModeCard";
import FormationCard from "./FormationCard";
import UserButton from "./UserButton";
import { logout } from "@/app/actions/auth";
import { FormationKey, GameMode } from "@/types";

interface SidebarProps {
  mode: GameMode;
  formation: FormationKey;
  onModeChange: (mode: GameMode) => void;
  onFormationChange: (formation: FormationKey) => void;
  userEmail: string | null;
  isPro: boolean;
}

export default function Sidebar({ mode, formation, onModeChange, onFormationChange, userEmail, isPro }: SidebarProps) {
  return (
    <aside className="w-60 min-w-60 h-full bg-zinc-900 border-r border-zinc-700 flex flex-col gap-4 p-5">
      <h1 className="text-sm font-bold uppercase tracking-widest text-center bg-zinc-800 border border-zinc-700 rounded-lg py-2 px-3">
        <span className="text-green-500">Lineup</span>
        <span className="text-zinc-200"> Creator</span>
      </h1>
      <ModeCard value={mode} onChange={onModeChange} />
      <FormationCard mode={mode} value={formation} onChange={onFormationChange} />
      <div className="mt-auto flex flex-col gap-2">
        {!userEmail ? (
          <>
            <a
              href="/auth?mode=login"
              className="block w-full text-center text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-2"
            >
              Sign in to Pro Account
            </a>
            <a
              href="/pro"
              className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-center"
            >
              <span className="text-sm font-semibold text-white">Go Pro</span>
            </a>
          </>
        ) : isPro ? (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-700">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white uppercase">{userEmail![0]}</span>
            </div>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Pro</span>
            <form action={logout} className="ml-auto">
              <button
                type="submit"
                className="h-6 px-2 bg-red-700 hover:bg-red-600 transition-colors rounded text-xs font-semibold text-white"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <>
            <a
              href="/pro"
              className="block w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-center"
            >
              <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
            </a>
            <UserButton email={userEmail} />
          </>
        )}
      </div>
    </aside>
  );
}
