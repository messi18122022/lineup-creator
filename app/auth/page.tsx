"use client";

import { useActionState, useState } from "react";
import { login, register } from "@/app/actions/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [loginState, loginAction, loginPending] = useActionState(
    login,
    undefined
  );
  const [registerState, registerAction, registerPending] = useActionState(
    register,
    undefined
  );

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-8 flex flex-col gap-6">
        <h1 className="text-lg font-bold uppercase tracking-widest text-zinc-200 text-center">
          Lineup Creator
        </h1>

        <div className="flex rounded-lg overflow-hidden border border-zinc-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isLogin
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isLogin
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Register
          </button>
        </div>

        {isLogin ? (
          <form action={loginAction} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-600"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-600"
            />
            {loginState?.error && (
              <p className="text-red-400 text-xs">{loginState.error}</p>
            )}
            <button
              type="submit"
              disabled={loginPending}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              {loginPending ? "Logging in…" : "Login"}
            </button>
          </form>
        ) : (
          <form action={registerAction} className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-600"
            />
            <input
              name="password"
              type="password"
              placeholder="Password (min. 6 characters)"
              required
              minLength={6}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-green-600"
            />
            {registerState?.error && (
              <p className="text-red-400 text-xs">{registerState.error}</p>
            )}
            <button
              type="submit"
              disabled={registerPending}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              {registerPending ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
