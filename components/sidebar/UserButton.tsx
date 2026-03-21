"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function UserButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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
