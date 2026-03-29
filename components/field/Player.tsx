"use client";

import { useRef, useState } from "react";

interface PlayerProps {
  index: number;
  name: string;
  x: number;
  y: number;
  isGoalkeeper: boolean;
  onNameChange?: (index: number, name: string) => void;
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
    onNameChange?.(index, trimmed);
    setEditing(false);
  }

  return (
    <div
      className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {/* Dot */}
      <div
        className={`w-9 h-9 rounded-full border-[3px] border-white shadow-lg transition-transform hover:scale-110
          ${isGoalkeeper ? "bg-yellow-300" : "bg-yellow-400"}`}
      />

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
          className="text-xs font-semibold text-slate-900 bg-white rounded px-1 py-0.5
            outline outline-2 outline-yellow-400 w-20 text-center"
        />
      ) : (
        <span
          onDoubleClick={onNameChange ? startEdit : undefined}
          className={`text-xs font-semibold text-white rounded px-1 py-0.5 whitespace-nowrap bg-black/70 ${onNameChange ? "cursor-default" : "cursor-default"}`}
          title={onNameChange ? "Double-click to edit" : undefined}
        >
          {name}
        </span>
      )}
    </div>
  );
}
