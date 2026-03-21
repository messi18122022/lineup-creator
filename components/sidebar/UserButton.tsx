"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import UpgradeButton from "./UpgradeButton";

export default function UserButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("is_pro")
          .eq("id", user.id)
          .single();
        setIsPro(data?.is_pro ?? false);
      }
    }

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="mt-auto w-full bg-green-600 hover:bg-green-500 text-white text-sm
          font-semibold rounded-lg py-2.5 text-center transition-colors"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="mt-auto flex flex-col gap-2">
      {isPro ? (
        <span className="text-xs font-semibold text-yellow-400">⚡ Pro</span>
      ) : (
        <UpgradeButton />
      )}
      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
      <button
        onClick={handleSignOut}
        className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-300
          text-sm font-semibold rounded-lg py-2 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
