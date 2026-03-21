"use client";

import { useState } from "react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-zinc-900
        text-sm font-bold rounded-lg py-2.5 transition-colors"
    >
      {loading ? "Loading..." : "⚡ Upgrade to Pro — 2€/yr"}
    </button>
  );
}
