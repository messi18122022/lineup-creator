"use client";

import { useState } from "react";
import { logout } from "@/app/actions/auth";

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="h-8 px-3 bg-red-700 hover:bg-red-600 transition-colors rounded text-sm font-semibold text-white"
      >
        Logout
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-72 flex flex-col gap-4 shadow-xl">
            <p className="text-sm text-zinc-200 text-center">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-9 rounded-lg border border-zinc-600 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 h-9 rounded-lg bg-red-700 hover:bg-red-600 transition-colors text-sm font-semibold text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
