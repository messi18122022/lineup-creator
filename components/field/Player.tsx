"use client";

import { useRef, useState } from "react";

interface PlayerProps {
  index: number;
  name: string;
  x: number;
  y: number;
  isGoalkeeper: boolean;
  onNameChange: (index: number, name: string) => void;
}

export default function Player({ index, name, x, y, isGoalkeeper, onNameChange }: PlayerProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commit() {
    const trimmed = draft.trim() || name;
    onNameChange(index, trimmed);
    setEditing(false);
  }

  return (
    <div
      className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Dot */}
      <div
        className={`w-9 h-9 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center
          text-white text-[0.6rem] font-bold transition-transform hover:scale-110
          ${isGoalkeeper ? "bg-zinc-500" : "bg-green-700"}`}
      >
        {index + 1}
      </div>

      {/* Name / input */}
      {editing ? (
        <input
          ref={inputRef}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="text-[0.65rem] font-semibold text-slate-900 bg-white rounded px-1 py-0.5
            outline outline-2 outline-yellow-400 w-20 text-center"
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          className="text-[0.65rem] font-semibold text-white bg-black/40 rounded px-1 py-0.5
            whitespace-nowrap cursor-default"
          title="Double-click to edit"
        >
          {name}
        </span>
      )}
    </div>
  );
}
