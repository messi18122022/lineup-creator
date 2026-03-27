"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import { FormationKey, GameMode, CustomFormation, CustomMode } from "@/types";
import { DEFAULT_FORMATION_FOR_MODE, FORMATIONS_BY_MODE, FORMATIONS } from "@/lib/formations";
import {
  loadCustomModes,
  saveCustomModes,
  loadExtraFormations,
  saveExtraFormations,
} from "@/lib/customModes";
import AddFormationDialog from "@/components/modals/AddFormationDialog";
import CreateModeDialog from "@/components/modals/CreateModeDialog";
import FormationBuilderSheet from "@/components/modals/FormationBuilderSheet";

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
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [hintVisible, setHintVisible] = useState(true);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Custom modes & formations state
  const [customModes, setCustomModes] = useState<CustomMode[]>([]);
  const [extraFormations, setExtraFormations] = useState<Record<string, CustomFormation[]>>({});

  // Dialog state
  const [showCreateMode, setShowCreateMode] = useState(false);
  const [showAddFormation, setShowAddFormation] = useState(false);
  const [editFormationId, setEditFormationId] = useState<string | null>(null);
  const [addFormationPlayerCount, setAddFormationPlayerCount] = useState(11);

  // Load persisted data on mount
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
    // Set default formation for the new mode
    const builtInDefault = DEFAULT_FORMATION_FOR_MODE[newMode as GameMode];
    if (builtInDefault) {
      setFormation(builtInDefault);
    } else {
      // Custom mode — pick first formation
      const cm = customModes.find(m => m.id === newMode);
      const firstFormation = cm?.formations[0] ?? (extraFormations[newMode] ?? [])[0];
      setFormation(firstFormation?.id ?? "");
    }
  }

  function handleNameChange(index: number, name: string) {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  }

  function handleOpenAddFormation() {
    // Determine player count for the current mode
    const cm = customModes.find(m => m.id === mode);
    const builtInFormations = FORMATIONS_BY_MODE[mode as GameMode];
    let playerCount = 11;
    if (cm) {
      playerCount = cm.playerCount;
    } else if (builtInFormations) {
      const firstKey = builtInFormations[0];
      playerCount = FORMATIONS[firstKey]?.positions.length ?? 11;
    }
    setAddFormationPlayerCount(playerCount);
    setEditFormationId(null);
    setShowAddFormation(true);
  }

  // ----- Custom mode handlers -----

  function handleCreateMode(newMode: CustomMode) {
    const updated = [...customModes, newMode];
    setCustomModes(updated);
    saveCustomModes(updated);
    setShowCreateMode(false);
    // Switch to new mode
    setMode(newMode.id);
    const firstFormation = newMode.formations[0];
    setFormation(firstFormation?.id ?? "");
  }

  function handleRenameMode(id: string, newName: string) {
    const updated = customModes.map(m => m.id === id ? { ...m, name: newName } : m);
    setCustomModes(updated);
    saveCustomModes(updated);
  }

  function handleDeleteMode(id: string) {
    const updated = customModes.filter(m => m.id !== id);
    setCustomModes(updated);
    saveCustomModes(updated);
    if (mode === id) {
      setMode("11v11");
      setFormation(DEFAULT_FORMATION_FOR_MODE["11v11"]);
    }
  }

  // ----- Formation handlers -----

  function handleAddFormation(modeId: string, f: CustomFormation) {
    const updated = {
      ...extraFormations,
      [modeId]: [...(extraFormations[modeId] ?? []), f],
    };
    setExtraFormations(updated);
    saveExtraFormations(updated);
    setFormation(f.id);
    setShowAddFormation(false);
  }

  function handleRenameFormation(formationId: string, newName: string) {
    // Check extraFormations first
    const updatedExtra = Object.fromEntries(
      Object.entries(extraFormations).map(([modeId, formations]) => [
        modeId,
        formations.map(f => f.id === formationId ? { ...f, name: newName } : f),
      ])
    );
    const extraChanged = JSON.stringify(updatedExtra) !== JSON.stringify(extraFormations);
    if (extraChanged) {
      setExtraFormations(updatedExtra);
      saveExtraFormations(updatedExtra);
      return;
    }
    // Check custom modes
    const updatedModes = customModes.map(m => ({
      ...m,
      formations: m.formations.map(f => f.id === formationId ? { ...f, name: newName } : f),
    }));
    setCustomModes(updatedModes);
    saveCustomModes(updatedModes);
  }

  function handleDeleteFormation(formationId: string) {
    let found = false;
    const updatedExtra = Object.fromEntries(
      Object.entries(extraFormations).map(([modeId, formations]) => {
        const filtered = formations.filter(f => f.id !== formationId);
        if (filtered.length !== formations.length) found = true;
        return [modeId, filtered];
      })
    );
    if (found) {
      setExtraFormations(updatedExtra);
      saveExtraFormations(updatedExtra);
    } else {
      const updatedModes = customModes.map(m => ({
        ...m,
        formations: m.formations.filter(f => f.id !== formationId),
      }));
      setCustomModes(updatedModes);
      saveCustomModes(updatedModes);
    }
    if (formation === formationId) {
      const cm = customModes.find(m => m.id === mode);
      if (cm) {
        const remaining = [...cm.formations, ...(extraFormations[mode] ?? [])].filter(
          f => f.id !== formationId
        );
        setFormation(remaining[0]?.id ?? "");
      } else {
        setFormation(DEFAULT_FORMATION_FOR_MODE[mode as GameMode] ?? "4-3-3");
      }
    }
  }

  function handleEditFormation(formationId: string) {
    setEditFormationId(formationId);
    setShowAddFormation(true);
  }

  function handleSaveEditedFormation(updated: CustomFormation) {
    let found = false;
    const updatedExtra = Object.fromEntries(
      Object.entries(extraFormations).map(([modeId, formations]) => {
        const mapped = formations.map(f => f.id === updated.id ? updated : f);
        if (JSON.stringify(mapped) !== JSON.stringify(formations)) found = true;
        return [modeId, mapped];
      })
    );
    if (found) {
      setExtraFormations(updatedExtra);
      saveExtraFormations(updatedExtra);
    } else {
      const updatedModes = customModes.map(m => ({
        ...m,
        formations: m.formations.map(f => f.id === updated.id ? updated : f),
      }));
      setCustomModes(updatedModes);
      saveCustomModes(updatedModes);
    }
    setShowAddFormation(false);
    setEditFormationId(null);
  }

  // Determine field positions to render
  function getCurrentPositions(): [number, number][] | undefined {
    const cm = customModes.find(m => m.id === mode);
    if (cm) {
      const cf = [...cm.formations, ...(extraFormations[mode] ?? [])].find(f => f.id === formation);
      return cf?.positions;
    }
    const extra = (extraFormations[mode] ?? []).find(f => f.id === formation);
    return extra?.positions;
  }

  const currentPositions = getCurrentPositions();

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
            isPro={isPro}
            customModes={customModes}
            extraFormations={extraFormations}
            onCreateMode={() => setShowCreateMode(true)}
            onAddFormation={handleOpenAddFormation}
            onRenameMode={handleRenameMode}
            onDeleteMode={handleDeleteMode}
            onRenameFormation={handleRenameFormation}
            onDeleteFormation={handleDeleteFormation}
            onEditFormation={handleEditFormation}
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
            positions={currentPositions}
            playerNames={playerNames}
            onNameChange={handleNameChange}
          />
        </div>
      </main>

      {/* Dialogs */}
      {showCreateMode && (
        <CreateModeDialog
          onSave={handleCreateMode}
          onClose={() => setShowCreateMode(false)}
        />
      )}

      {showAddFormation && (() => {
        if (editFormationId) {
          const cm = customModes.find(m => m.id === mode);
          let editData: CustomFormation | undefined;
          if (cm) {
            editData = [...cm.formations, ...(extraFormations[mode] ?? [])].find(f => f.id === editFormationId);
          } else {
            editData = (extraFormations[mode] ?? []).find(f => f.id === editFormationId);
          }
          if (editData) {
            return (
              <FormationBuilderSheet
                playerCount={addFormationPlayerCount}
                initialPositions={editData.positions}
                initialHasGoalkeeper={editData.hasGoalkeeper}
                initialFormationName={editData.name}
                editingId={editData.id}
                onSave={handleSaveEditedFormation}
                onBack={() => { setShowAddFormation(false); setEditFormationId(null); }}
                backLabel="← Cancel"
              />
            );
          }
        }
        return (
          <AddFormationDialog
            playerCount={addFormationPlayerCount}
            onSave={f => handleAddFormation(mode, f)}
            onClose={() => setShowAddFormation(false)}
          />
        );
      })()}
    </div>
  );
}
