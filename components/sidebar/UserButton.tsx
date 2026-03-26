"use client";

import { logout } from "@/app/actions/auth";

interface UserButtonProps {
  email: string;
}

export default function UserButton({ email }: UserButtonProps) {
  return (
    <div className="flex items-center gap-2 pt-2 border-t border-zinc-700">
      <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-white uppercase">{email[0]}</span>
      </div>
      <form action={logout} className="ml-auto">
        <button
          type="submit"
          className="h-8 px-3 bg-red-700 hover:bg-red-600 transition-colors rounded text-sm font-semibold text-white"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
