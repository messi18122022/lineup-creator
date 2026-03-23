"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import { FormationKey, GameMode } from "@/types";
import { DEFAULT_FORMATION_FOR_MODE } from "@/lib/formations";

const DEFAULT_NAMES = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);

interface HomeClientProps {
  userEmail: string | null;
}

function SidebarToggleIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="18.5" height="14.5" rx="3.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.75" y1="1" x2="6.75" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function HomeClient({ userEmail }: HomeClientProps) {
  const [mode, setMode] = useState<GameMode>("11v11");
  const [formation, setFormation] = useState<FormationKey>("4-3-3");
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_NAMES]);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [hintVisible, setHintVisible] = useState(true);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    hintTimer.current = setTimeout(() => setHintVisible(false), 3000);
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  function handleToggle() {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setHintVisible(false);
    setSidebarOpen((v) => !v);
  }

  function handleModeChange(newMode: GameMode) {
    setMode(newMode);
    setFormation(DEFAULT_FORMATION_FOR_MODE[newMode]);
  }

  function handleNameChange(index: number, name: string) {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="relative h-full flex-shrink-0">
        <div className={`h-full overflow-hidden transition-[width] duration-300 ease-in-out ${sidebarOpen ? "w-60" : "w-0"}`}>
          <Sidebar
            mode={mode}
            formation={formation}
            onModeChange={handleModeChange}
            onFormationChange={setFormation}
            userEmail={userEmail}
          />
        </div>
        <div className="absolute top-4 -right-8">
          <button
            onClick={handleToggle}
            className="text-green-500 hover:text-green-400 transition-colors cursor-pointer"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <SidebarToggleIcon />
          </button>
          <span
            className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs text-zinc-400 whitespace-nowrap pointer-events-none transition-opacity duration-500 ${hintVisible ? "opacity-100" : "opacity-0"}`}
          >
            {sidebarOpen ? "Click to hide sidebar" : "Click to show sidebar"}
          </span>
        </div>
      </div>
      <main className="flex flex-1 items-center justify-center p-4 overflow-hidden">
        <div className="w-full md:w-auto md:h-full" style={{ aspectRatio: "68 / 105" }}>
          <Field
            formation={formation}
            playerNames={playerNames}
            onNameChange={handleNameChange}
          />
        </div>
      </main>
    </div>
  );
}
