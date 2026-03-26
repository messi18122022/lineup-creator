"use client";

import { useActionState } from "react";
import { login, register } from "@/app/actions/auth";

interface AuthFormProps {
  initialMode: "login" | "register";
}

export default function AuthForm({ initialMode }: AuthFormProps) {
  const [loginState, loginAction] = useActionState(login, undefined);
  const [registerState, registerAction] = useActionState(register, undefined);

  const emailInput = (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400 uppercase tracking-wider">Email</label>
      <input
        type="email"
        name="email"
        required
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
        placeholder="you@example.com"
      />
    </div>
  );

  const passwordInput = (minLength?: number) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-zinc-400 uppercase tracking-wider">Password</label>
      <input
        type="password"
        name="password"
        required
        minLength={minLength}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
        placeholder="••••••••"
      />
    </div>
  );

  if (initialMode === "login") {
    return (
      <form action={loginAction} className="flex flex-col gap-4">
        {emailInput}
        {passwordInput()}
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
    );
  }

  return (
    <form action={registerAction} className="flex flex-col gap-4">
      {emailInput}
      {passwordInput(6)}
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
  );
}
