"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import CreateModeDialog from "@/components/modals/CreateModeDialog";
import AddFormationDialog from "@/components/modals/AddFormationDialog";
import { GameMode, CustomMode, CustomFormation } from "@/types";
import { DEFAULT_FORMATION_FOR_MODE } from "@/lib/formations";
import {
  loadCustomModes,
  saveCustomModes,
  loadExtraFormations,
  saveExtraFormations,
  PLAYER_COUNT_FOR_BUILTIN_MODE,
} from "@/lib/customModes";

const DEFAULT_NAMES = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);

interface HomeClientProps {
  userEmail: string | null;
  isPro: boolean;
}

function SidebarToggleIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="18.5" height="14.5" rx="3.25" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.75" y1="1" x2="6.75" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function HomeClient({ userEmail, isPro }: HomeClientProps) {
  const [mode, setMode] = useState<string>("11v11");
  const [formation, setFormation] = useState<string>("4-3-3");
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_NAMES]);
  const [customModes, setCustomModes] = useState<CustomMode[]>([]);
  const [extraFormations, setExtraFormations] = useState<Record<string, CustomFormation[]>>({});
  const [showCreateMode, setShowCreateMode] = useState(false);
  const [showAddFormation, setShowAddFormation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth >= 768 : true)
  );
  const [hintVisible, setHintVisible] = useState(true);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load custom modes and extra formations from localStorage on mount
  useEffect(() => {
    setCustomModes(loadCustomModes());
    setExtraFormations(loadExtraFormations());
  }, []);

  useEffect(() => {
    hintTimer.current = setTimeout(() => setHintVisible(false), 6000);
    return () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    };
  }, []);

  function handleToggle() {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setHintVisible(false);
    setSidebarOpen((v) => !v);
  }

  function handleModeChange(newMode: string) {
    setMode(newMode);
    const cm = customModes.find((m) => m.id === newMode);
    if (cm) {
      const firstFormation = [...cm.formations, ...(extraFormations[newMode] ?? [])][0];
      setFormation(firstFormation?.id ?? "");
    } else {
      setFormation(DEFAULT_FORMATION_FOR_MODE[newMode as GameMode]);
    }
  }

  function handleNameChange(index: number, name: string) {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }

  function handleCreateMode(newMode: CustomMode) {
    const updated = [...customModes, newMode];
    setCustomModes(updated);
    saveCustomModes(updated);
    setShowCreateMode(false);
    // Immediately select the new mode and its first formation
    setMode(newMode.id);
    setFormation(newMode.formations[0].id);
  }

  function handleAddFormation(modeId: string, newFormation: CustomFormation) {
    const cm = customModes.find((m) => m.id === modeId);
    if (cm) {
      // Custom mode: add to customModes formations
      const updated = customModes.map((m) =>
        m.id === modeId ? { ...m, formations: [...m.formations, newFormation] } : m
      );
      setCustomModes(updated);
      saveCustomModes(updated);
    } else {
      // Built-in mode: add to extraFormations
      const updated = {
        ...extraFormations,
        [modeId]: [...(extraFormations[modeId] ?? []), newFormation],
      };
      setExtraFormations(updated);
      saveExtraFormations(updated);
    }
    setShowAddFormation(false);
    // Immediately select the new formation
    setFormation(newFormation.id);
  }

  // Compute custom positions for Field when a custom mode/formation is selected
  const customPositions = useMemo(() => {
    const cm = customModes.find((m) => m.id === mode);
    if (cm) {
      const cf = [...cm.formations, ...(extraFormations[mode] ?? [])].find((f) => f.id === formation);
      return cf?.positions;
    }
    // Check extra formations for built-in modes
    const extra = (extraFormations[mode] ?? []).find((f) => f.id === formation);
    return extra?.positions;
  }, [mode, formation, customModes, extraFormations]);

  // Determine player count for AddFormationDialog
  const addFormationPlayerCount = (() => {
    const cm = customModes.find((m) => m.id === mode);
    if (cm) return cm.playerCount;
    return PLAYER_COUNT_FOR_BUILTIN_MODE[mode as GameMode] ?? 11;
  })();

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="relative h-full flex-shrink-0">
        <div
          className={`h-full overflow-hidden transition-[width] duration-300 ease-in-out ${sidebarOpen ? "w-60" : "w-0"}`}
        >
          <Sidebar
            mode={mode}
            formation={formation}
            onModeChange={handleModeChange}
            onFormationChange={setFormation}
            userEmail={userEmail}
            isPro={isPro}
            customModes={customModes}
            onCreateMode={() => setShowCreateMode(true)}
            extraFormations={extraFormations}
            onAddFormation={() => setShowAddFormation(true)}
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
            className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs text-zinc-400 whitespace-nowrap pointer-events-none transition-opacity duration-500 animate-shake ${hintVisible ? "opacity-100" : "opacity-0"}`}
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
            customPositions={customPositions}
          />
        </div>
      </main>
      {showCreateMode && (
        <CreateModeDialog onSave={handleCreateMode} onClose={() => setShowCreateMode(false)} />
      )}
      {showAddFormation && (
        <AddFormationDialog
          playerCount={addFormationPlayerCount}
          onSave={(f) => handleAddFormation(mode, f)}
          onClose={() => setShowAddFormation(false)}
        />
      )}
    </div>
  );
}
