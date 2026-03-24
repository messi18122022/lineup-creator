"use client";

import { useActionState, useState } from "react";
import { login, register } from "@/app/actions/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction] = useActionState(login, undefined);
  const [registerState, registerAction] = useActionState(register, undefined);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 flex flex-col gap-6">
        <h1 className="text-sm font-bold uppercase tracking-widest text-center">
          <span className="text-green-500">Lineup</span>
          <span className="text-zinc-200"> Creator</span>
        </h1>

        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === "login"
                ? "bg-zinc-700 text-zinc-100"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              mode === "register"
                ? "bg-zinc-700 text-zinc-100"
                : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form action={loginAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {loginState?.error && (
              <p className="text-xs text-red-400">{loginState.error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form action={registerAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            {registerState?.error && (
              <p className="text-xs text-red-400">{registerState.error}</p>
            )}
            {registerState?.confirm ? (
              <p className="text-xs text-green-400 text-center">
                Check your email to confirm your account.
              </p>
            ) : (
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
              >
                Create Account
              </button>
            )}
          </form>
        )}

        <a
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-center"
        >
          ← Back to app
        </a>
      </div>
    </div>
  );
}
