"use client";

import { logout } from "@/app/actions/auth";

interface UserButtonProps {
  email: string;
}

export default function UserButton({ email }: UserButtonProps) {
  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-zinc-700">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white uppercase">{email[0]}</span>
        </div>
        <p className="text-xs text-zinc-400 truncate">{email}</p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="w-full bg-red-700 hover:bg-red-600 transition-colors rounded-lg px-4 py-3 text-center"
        >
          <span className="text-sm font-semibold text-white">Logout</span>
        </button>
      </form>
    </div>
  );
}
