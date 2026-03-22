"use client";

import { logout } from "@/app/actions/auth";

interface UserButtonProps {
  email: string;
}

export default function UserButton({ email }: UserButtonProps) {
  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-zinc-700">
      <p className="text-xs text-zinc-500 truncate">{email}</p>
      <form action={logout}>
        <button
          type="submit"
          className="w-full text-left text-xs text-zinc-400 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
