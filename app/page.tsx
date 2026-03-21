"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import { FormationKey } from "@/types";

const DEFAULT_NAMES = [
  "Müller", "Meier", "Schmidt", "Hofmann", "Weber",
  "Fischer", "Bauer", "Koch", "Richter", "Klein", "Wolf",
];

export default function HomePage() {
  const [playerCount, setPlayerCount] = useState(11);
  const [formation, setFormation] = useState<FormationKey>("4-3-3");
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_NAMES]);

  function handleNameChange(index: number, name: string) {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar
        playerCount={playerCount}
        formation={formation}
        onPlayerCountChange={setPlayerCount}
        onFormationChange={setFormation}
      />
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="h-full" style={{ aspectRatio: "68 / 105" }}>
          <Field
            formation={formation}
            playerCount={playerCount}
            playerNames={playerNames}
            onNameChange={handleNameChange}
          />
        </div>
      </main>
    </div>
  );
}
