"use client";

import FieldLines from "./FieldLines";
import Player from "./Player";
import { FORMATIONS } from "@/lib/formations";
import { FormationKey } from "@/types";

interface FieldProps {
  formation: FormationKey;
  playerCount: number;
  playerNames: string[];
  onNameChange: (index: number, name: string) => void;
}

export default function Field({ formation, playerCount, playerNames, onNameChange }: FieldProps) {
  const positions = FORMATIONS[formation].positions;
  const count = Math.min(playerCount, positions.length);

  return (
    <div className="relative h-full" style={{ aspectRatio: "68 / 105" }}>
      {/* Green pitch */}
      <div
        className="relative w-full h-full rounded-lg border-4 border-green-800 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #15803d 0%, #16a34a 100%)",
        }}
      >
        {/* Grass stripes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 38px, rgba(0,0,0,0.07) 38px, rgba(0,0,0,0.07) 76px)",
          }}
        />

        {/* SVG lines */}
        <FieldLines />

        {/* Players */}
        {Array.from({ length: count }).map((_, i) => {
          const [x, y] = positions[i];
          return (
            <Player
              key={i}
              index={i}
              name={playerNames[i] ?? `Player ${i + 1}`}
              x={x}
              y={y}
              isGoalkeeper={i === 0}
              onNameChange={onNameChange}
            />
          );
        })}
      </div>
    </div>
  );
}
