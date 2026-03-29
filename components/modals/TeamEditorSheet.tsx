"use client";

import { useState } from "react";
import { Team, TeamPlayer } from "@/types";

interface RowData {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
}

function emptyRow(nextNum?: string): RowData {
  return { id: crypto.randomUUID(), number: nextNum ?? "", firstName: "", lastName: "" };
}

function isRowEmpty(row: RowData) {
  return !row.number && !row.firstName && !row.lastName;
}

function initRows(team?: Team): RowData[] {
  if (!team || team.players.length === 0) return [emptyRow("1")];
  const rows = team.players.map(p => ({ id: p.id, number: p.number, firstName: p.firstName, lastName: p.lastName }));
  const lastNum = [...rows].reverse().find(r => r.number)?.number;
  rows.push(emptyRow(lastNum ? String(parseInt(lastNum) + 1) : ""));
  return rows;
}

interface Props {
  team?: Team;
  onSave: (team: Team) => void;
  onClose: () => void;
}

export default function TeamEditorSheet({ team, onSave, onClose }: Props) {
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [rows, setRows] = useState<RowData[]>(() => initRows(team));

  function handleCellChange(id: string, field: "number" | "firstName" | "lastName", value: string) {
    setRows(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, [field]: value } : r);
      const last = updated[updated.length - 1];
      const filledCount = updated.filter(r => !isRowEmpty(r)).length;
      if (!isRowEmpty(last) && filledCount < 30) {
        const lastNum = [...updated].reverse().find(r => r.number)?.number;
        const nextNum = lastNum ? String(parseInt(lastNum) + 1) : String(updated.length + 1);
        updated.push(emptyRow(nextNum));
      }
      return updated;
    });
  }

  function handleSave() {
    const valid = rows.filter(r => !isRowEmpty(r));
    const sorted = [...valid].sort((a, b) => {
      const na = parseInt(a.number) || Infinity;
      const nb = parseInt(b.number) || Infinity;
      return na - nb;
    });
    const players: TeamPlayer[] = sorted.map(r => ({
      id: r.id,
      number: r.number,
      firstName: r.firstName,
      lastName: r.lastName,
    }));
    onSave({
      id: team?.id ?? crypto.randomUUID(),
      name: teamName.trim() || "My Team",
      players,
    });
  }

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-zinc-800 flex-shrink-0">
        <input
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder="Team name"
          className="flex-1 text-xl font-bold bg-transparent text-zinc-100 placeholder-zinc-600 outline-none border-b-2 border-transparent focus:border-green-500 transition-colors pb-0.5"
        />
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-200 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-zinc-900 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 w-24">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">First Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Last Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-t border-zinc-800/50">
                <td className="px-4 py-2">
                  <input
                    value={row.number}
                    onChange={e => handleCellChange(row.id, "number", e.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    placeholder="—"
                    className="w-16 bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all text-center"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.firstName}
                    onChange={e => handleCellChange(row.id, "firstName", e.target.value)}
                    placeholder="First name"
                    className="w-full bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.lastName}
                    onChange={e => handleCellChange(row.id, "lastName", e.target.value)}
                    placeholder="Last name"
                    className="w-full bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0">
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-500 transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}
