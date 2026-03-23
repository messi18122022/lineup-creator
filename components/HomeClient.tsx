"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import { FormationKey, GameMode } from "@/types";
import { DEFAULT_FORMATION_FOR_MODE } from "@/lib/formations";

const DEFAULT_NAMES = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);

interface HomeClientProps {
  userEmail: string | null;
}

export default function HomeClient({ userEmail }: HomeClientProps) {
  const [mode, setMode] = useState<GameMode>("11v11");
  const [formation, setFormation] = useState<FormationKey>("4-3-3");
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_NAMES]);

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
      <Sidebar
        mode={mode}
        formation={formation}
        onModeChange={handleModeChange}
        onFormationChange={setFormation}
        userEmail={userEmail}
      />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="h-full" style={{ aspectRatio: "68 / 105" }}>
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
