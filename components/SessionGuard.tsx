"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function SessionGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = "lc_session_active";

    if (!sessionStorage.getItem(key)) {
      // New browser session — sign out any persisted auth cookies
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        window.location.reload();
      });
    }

    sessionStorage.setItem(key, "1");
  }, []);

  return null;
}
