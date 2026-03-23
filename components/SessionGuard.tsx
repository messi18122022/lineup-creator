"use client";

import { useEffect } from "react";

export default function SessionGuard() {
  useEffect(() => {
    const key = "lc_session_active";

    if (!sessionStorage.getItem(key)) {
      // New tab or browser session — force server-side signout
      sessionStorage.setItem(key, "1");
      window.location.href = "/auth/signout";
    }
  }, []);

  return null;
}
