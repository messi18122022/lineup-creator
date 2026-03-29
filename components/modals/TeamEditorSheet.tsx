"use client";

import { useState, useMemo } from "react";
import { Team, TeamPlayer, NameFormat } from "@/types";

interface RowData {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
}

function emptyRow(nextNum?: string): RowData {
  return { id: crypto.randomUUID(), number: nextNum ?? "", firstName: "", lastName: "" };
}

// A row is "untouched" if the user hasn't typed any name yet (number alone doesn't count)
function isUntouched(row: RowData) {
  return !row.firstName && !row.lastName;
}

// A row has no meaningful content at all
function isBlank(row: RowData) {
  return !row.number && !row.firstName && !row.lastName;
}

function initRows(team?: Team): RowData[] {
  if (!team || team.players.length === 0) return [emptyRow("1")];
  const rows = team.players.map(p => ({ id: p.id, number: p.number, firstName: p.firstName, lastName: p.lastName }));
  const lastNum = [...rows].reverse().find(r => r.number)?.number;
  rows.push(emptyRow(lastNum ? String(parseInt(lastNum) + 1) : ""));
  return rows;
}

const NAME_FORMAT_OPTIONS: { value: NameFormat; label: string; example: string }[] = [
  { value: "firstName",        label: "First name only",        example: "John" },
  { value: "firstLast",        label: "First + last initial",   example: "John D." },
  { value: "fullName",         label: "Full name",              example: "John Doe" },
  { value: "firstInitialLast", label: "Initial + last name",    example: "J. Doe" },
  { value: "lastOnly",         label: "Last name only",         example: "Doe" },
];

interface Props {
  team?: Team;
  onSave: (team: Team) => void;
  onClose: () => void;
}

export default function TeamEditorSheet({ team, onSave, onClose }: Props) {
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [rows, setRows] = useState<RowData[]>(() => initRows(team));
  const [nameFormat, setNameFormat] = useState<NameFormat>(team?.nameFormat ?? "lastOnly");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filledRows = useMemo(() => rows.filter(r => !isUntouched(r)), [rows]);

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleRemove() {
    setRows(prev => {
      const kept = prev.filter(r => !selectedIds.has(r.id));
      // Ensure trailing empty row
      const last = kept[kept.length - 1];
      if (!last || !isUntouched(last)) {
        const lastNum = [...kept].reverse().find(r => r.number)?.number;
        kept.push(emptyRow(lastNum ? String(parseInt(lastNum) + 1) : ""));
      }
      return kept;
    });
    setSelectedIds(new Set());
    setSelectMode(false);
  }

  function handleCellChange(id: string, field: "number" | "firstName" | "lastName", value: string) {
    setRows(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, [field]: value } : r);
      const last = updated[updated.length - 1];
      // Only add a trailing empty row if the last row has name content AND we're under the limit
      const filledCount = updated.filter(r => !isUntouched(r)).length;
      if (!isUntouched(last) && filledCount < 30) {
        const lastNum = [...updated].reverse().find(r => r.number)?.number;
        const nextNum = lastNum ? String(parseInt(lastNum) + 1) : String(filledCount + 1);
        updated.push(emptyRow(nextNum));
      }
      return updated;
    });
  }

  function handleSave() {
    const valid = rows.filter(r => !isBlank(r) && !isUntouched(r));
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
      nameFormat,
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
        {selectMode ? (
          <button
            onClick={() => { setSelectMode(false); setSelectedIds(new Set()); }}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => setSelectMode(true)}
            disabled={filledRows.length === 0}
            className="text-sm text-green-500 hover:text-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Select
          </button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-zinc-900 z-10">
            <tr>
              {selectMode && <th className="w-10" />}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 w-20">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">First Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Last Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={`border-t border-zinc-800/50 ${selectMode && selectedIds.has(row.id) ? "bg-zinc-800/60" : ""}`}>
                {selectMode && (
                  <td className="pl-4 py-2">
                    {!isUntouched(row) && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="w-4 h-4 accent-green-500 cursor-pointer"
                      />
                    )}
                  </td>
                )}
                <td className="px-4 py-2">
                  <input
                    value={row.number}
                    onChange={e => handleCellChange(row.id, "number", e.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    placeholder="—"
                    autoComplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"
                    className="w-16 bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all text-center"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.firstName}
                    onChange={e => handleCellChange(row.id, "firstName", e.target.value)}
                    placeholder="First name"
                    autoComplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"
                    className="w-full bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.lastName}
                    onChange={e => handleCellChange(row.id, "lastName", e.target.value)}
                    placeholder="Last name"
                    autoComplete="off" data-lpignore="true" data-1p-ignore data-form-type="other"
                    className="w-full bg-zinc-800 rounded-lg px-2 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800 flex-shrink-0 flex flex-col gap-4">
        {/* Name format selector */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Display name on field</span>
          <div className="grid grid-cols-2 gap-2">
            {NAME_FORMAT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setNameFormat(opt.value)}
                className={`rounded-lg px-3 py-2 text-sm text-left transition-colors border
                  ${nameFormat === opt.value
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"}`}
              >
                <span className="font-semibold">{opt.example}</span>
                <span className="block text-xs opacity-70 mt-0.5">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectMode && (
          <button
            onClick={handleRemove}
            disabled={selectedIds.size === 0}
            className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-lg px-4 py-3 text-sm font-semibold text-white"
          >
            Remove{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
        )}
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
