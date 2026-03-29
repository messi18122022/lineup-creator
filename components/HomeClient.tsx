"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import Field from "@/components/field/Field";
import CreateModeDialog from "@/components/modals/CreateModeDialog";
import AddFormationDialog from "@/components/modals/AddFormationDialog";
import FormationBuilderSheet from "@/components/modals/FormationBuilderSheet";
import { GameMode, CustomMode, CustomFormation, FormationKey } from "@/types";
import { DEFAULT_FORMATION_FOR_MODE, FORMATIONS_BY_MODE, FORMATIONS } from "@/lib/formations";
import {
  loadCustomModes, saveCustomModes,
  loadExtraFormations, saveExtraFormations,
  loadModeOverrides, saveModeOverrides,
  loadFormationOverrides, saveFormationOverrides,
  ModeOverrides, FormationOverrides,
} from "@/lib/customModes";
import { loadUserData, saveUserData } from "@/lib/userDataStorage";
import LoadingScreen, { WAVE_MS } from "@/components/LoadingScreen";

const BUILTIN_MODES: GameMode[] = ["11v11", "4+1", "5+1"];
const DEFAULT_NAMES = Array.from({ length: 11 }, (_, i) => `Player ${i + 1}`);

interface HomeClientProps {
  userEmail: string | null;
  isPro: boolean;
  userId: string | null;
}

function SidebarToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function HomeClient({ userEmail, isPro, userId }: HomeClientProps) {
  const [mode, setMode] = useState<string>("11v11");
  const [formation, setFormation] = useState<string>("4-3-3");
  const [playerNames, setPlayerNames] = useState<string[]>([...DEFAULT_NAMES]);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [hintVisible, setHintVisible] = useState(!(userEmail && isPro));
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [customModes, setCustomModes] = useState<CustomMode[]>([]);
  const [extraFormations, setExtraFormations] = useState<Record<string, CustomFormation[]>>({});
  const [modeOverrides, setModeOverrides] = useState<ModeOverrides>({ renames: {}, deleted: [] });
  const [formationOverrides, setFormationOverrides] = useState<FormationOverrides>({ renames: {}, deleted: [], edits: {} });

  const [showCreateMode, setShowCreateMode] = useState(false);
  const [showAddFormation, setShowAddFormation] = useState(false);
  const [editFormationId, setEditFormationId] = useState<string | null>(null);
  const [addFormationPlayerCount, setAddFormationPlayerCount] = useState(11);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const mountTime = useRef(Date.now());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load: only for Pro users — free/logged-out users always see default built-ins
  useEffect(() => {
    if (!userId || !isPro) {
      setDataLoaded(true);
      return;
    }
    loadUserData(userId).then(remoteData => {
      if (remoteData) {
        setCustomModes(remoteData.custom_modes);
        setExtraFormations(remoteData.extra_formations);
        setModeOverrides(remoteData.mode_overrides);
        setFormationOverrides(remoteData.formation_overrides);
      }
      setDataLoaded(true);
    });
  }, [userId, isPro]);

  // After data loads, validate the active mode — it might have been deleted
  useEffect(() => {
    if (!dataLoaded) return;
    const availableModes = [
      ...BUILTIN_MODES.filter(m => !modeOverrides.deleted.includes(m)),
      ...customModes.map(m => m.id),
    ];
    if (!availableModes.includes(mode)) {
      handleModeChange(availableModes[0] ?? "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoaded]);

  // Save to Supabase (debounced) whenever data changes, after initial load
  useEffect(() => {
    if (!userId || !isPro || !dataLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveUserData(userId, { custom_modes: customModes, extra_formations: extraFormations, mode_overrides: modeOverrides, formation_overrides: formationOverrides });
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [userId, isPro, dataLoaded, customModes, extraFormations, modeOverrides, formationOverrides]);

  // Wait for the next full wave cycle before showing content
  useEffect(() => {
    if (!dataLoaded) return;
    const elapsed = Date.now() - mountTime.current;
    const nextCycle = Math.max(1, Math.ceil(elapsed / WAVE_MS));
    const delay = nextCycle * WAVE_MS - elapsed;
    const t = setTimeout(() => setShowContent(true), delay);
    return () => clearTimeout(t);
  }, [dataLoaded]);

  useEffect(() => {
    hintTimer.current = setTimeout(() => setHintVisible(false), 6000);
    return () => { if (hintTimer.current) clearTimeout(hintTimer.current); };
  }, []);

  function handleToggle() {
    if (hintTimer.current) clearTimeout(hintTimer.current);
    setHintVisible(false);
    setSidebarOpen(v => !v);
  }

  // ── Computed sidebar lists ────────────────────────────────────────────────

  const displayModes = useMemo(() => [
    ...BUILTIN_MODES
      .filter(m => !modeOverrides.deleted.includes(m))
      .map(m => ({ id: m, name: modeOverrides.renames[m] ?? m })),
    ...customModes.map(cm => ({ id: cm.id, name: modeOverrides.renames[cm.id] ?? cm.name })),
  ], [customModes, modeOverrides]);

  const displayFormations = useMemo(() => {
    const isBuiltin = BUILTIN_MODES.includes(mode as GameMode);
    const builtinKeys: string[] = isBuiltin ? (FORMATIONS_BY_MODE[mode as GameMode] ?? []) : [];
    const cm = customModes.find(m => m.id === mode);
    const customForMode: CustomFormation[] = cm
      ? [...cm.formations, ...(extraFormations[mode] ?? [])]
      : (extraFormations[mode] ?? []);
    return [
      ...builtinKeys
        .filter(k => !formationOverrides.deleted.includes(k))
        .map(k => ({ id: k, name: formationOverrides.renames[k] ?? k })),
      ...customForMode
        .filter(f => !formationOverrides.deleted.includes(f.id))
        .map(f => ({ id: f.id, name: formationOverrides.renames[f.id] ?? f.name })),
    ];
  }, [mode, customModes, extraFormations, formationOverrides]);

  const selectedFormationName = useMemo(
    () => displayFormations.find(f => f.id === formation)?.name ?? formation,
    [displayFormations, formation]
  );

  // ── Field positions ───────────────────────────────────────────────────────

  const currentPositions = useMemo((): [number, number][] | undefined => {
    if (formationOverrides.edits[formation]) return formationOverrides.edits[formation];
    const cm = customModes.find(m => m.id === mode);
    if (cm) {
      return [...cm.formations, ...(extraFormations[mode] ?? [])].find(f => f.id === formation)?.positions;
    }
    return (extraFormations[mode] ?? []).find(f => f.id === formation)?.positions;
  }, [mode, formation, customModes, extraFormations, formationOverrides]);

  // ── Mode change ───────────────────────────────────────────────────────────

  function handleModeChange(newMode: string) {
    setMode(newMode);
    const builtinDefault = DEFAULT_FORMATION_FOR_MODE[newMode as GameMode];
    if (builtinDefault) {
      const available = (FORMATIONS_BY_MODE[newMode as GameMode] ?? [])
        .filter(k => !formationOverrides.deleted.includes(k));
      setFormation(available[0] ?? builtinDefault);
    } else {
      const cm = customModes.find(m => m.id === newMode);
      const allForMode = cm
        ? [...cm.formations, ...(extraFormations[newMode] ?? [])]
        : (extraFormations[newMode] ?? []);
      setFormation(allForMode.filter(f => !formationOverrides.deleted.includes(f.id))[0]?.id ?? "");
    }
  }

  function handleNameChange(index: number, name: string) {
    setPlayerNames(prev => { const next = [...prev]; next[index] = name; return next; });
  }

  // ── Create mode ───────────────────────────────────────────────────────────

  function handleCreateMode(newMode: CustomMode) {
    const updated = [...customModes, newMode];
    setCustomModes(updated);
    saveCustomModes(updated);
    setShowCreateMode(false);
    setMode(newMode.id);
    setFormation(newMode.formations[0]?.id ?? "");
  }

  // ── Rename / delete mode ──────────────────────────────────────────────────

  function handleRenameMode(id: string, newName: string) {
    if (BUILTIN_MODES.includes(id as GameMode)) {
      const updated = { ...modeOverrides, renames: { ...modeOverrides.renames, [id]: newName } };
      setModeOverrides(updated); saveModeOverrides(updated);
    } else {
      const updated = customModes.map(m => m.id === id ? { ...m, name: newName } : m);
      setCustomModes(updated); saveCustomModes(updated);
    }
  }

  function handleDeleteMode(id: string) {
    if (BUILTIN_MODES.includes(id as GameMode)) {
      const updated = { ...modeOverrides, deleted: [...modeOverrides.deleted, id] };
      setModeOverrides(updated); saveModeOverrides(updated);
    } else {
      const updated = customModes.filter(m => m.id !== id);
      setCustomModes(updated); saveCustomModes(updated);
    }
    if (mode === id) {
      const remaining = BUILTIN_MODES.filter(m => m !== id && !modeOverrides.deleted.includes(m));
      const remainingCustom = customModes.filter(m => m.id !== id);
      const next = remaining[0] ?? remainingCustom[0]?.id;
      if (next) handleModeChange(next);
      else { setMode(""); setFormation(""); }
    }
  }

  // ── Add formation ─────────────────────────────────────────────────────────

  function handleOpenAddFormation() {
    const cm = customModes.find(m => m.id === mode);
    let playerCount = 11;
    if (cm) {
      playerCount = cm.playerCount;
    } else {
      const keys = FORMATIONS_BY_MODE[mode as GameMode];
      if (keys) playerCount = FORMATIONS[keys[0] as FormationKey]?.positions.length ?? 11;
    }
    setAddFormationPlayerCount(playerCount);
    setEditFormationId(null);
    setShowAddFormation(true);
  }

  function handleAddFormation(modeId: string, f: CustomFormation) {
    const updated = { ...extraFormations, [modeId]: [...(extraFormations[modeId] ?? []), f] };
    setExtraFormations(updated); saveExtraFormations(updated);
    setFormation(f.id);
    setShowAddFormation(false);
  }

  // ── Rename / delete formation ─────────────────────────────────────────────

  function handleRenameFormation(formationId: string, newName: string) {
    if (formationId in FORMATIONS) {
      const updated = { ...formationOverrides, renames: { ...formationOverrides.renames, [formationId]: newName } };
      setFormationOverrides(updated); saveFormationOverrides(updated);
      return;
    }
    let foundExtra = false;
    const updatedExtra = Object.fromEntries(Object.entries(extraFormations).map(([mId, fs]) => {
      const mapped = fs.map(f => f.id === formationId ? { ...f, name: newName } : f);
      if (JSON.stringify(mapped) !== JSON.stringify(fs)) foundExtra = true;
      return [mId, mapped];
    }));
    if (foundExtra) { setExtraFormations(updatedExtra); saveExtraFormations(updatedExtra); return; }
    const updatedModes = customModes.map(m => ({
      ...m, formations: m.formations.map(f => f.id === formationId ? { ...f, name: newName } : f),
    }));
    setCustomModes(updatedModes); saveCustomModes(updatedModes);
  }

  function handleDeleteFormation(formationId: string) {
    if (formationId in FORMATIONS) {
      const updated = { ...formationOverrides, deleted: [...formationOverrides.deleted, formationId] };
      setFormationOverrides(updated); saveFormationOverrides(updated);
    } else {
      let found = false;
      const updatedExtra = Object.fromEntries(Object.entries(extraFormations).map(([mId, fs]) => {
        const filtered = fs.filter(f => f.id !== formationId);
        if (filtered.length !== fs.length) found = true;
        return [mId, filtered];
      }));
      if (found) { setExtraFormations(updatedExtra); saveExtraFormations(updatedExtra); }
      else {
        const updatedModes = customModes.map(m => ({ ...m, formations: m.formations.filter(f => f.id !== formationId) }));
        setCustomModes(updatedModes); saveCustomModes(updatedModes);
      }
    }
    if (formation === formationId) {
      setFormation(displayFormations.find(f => f.id !== formationId)?.id ?? "");
    }
  }

  // ── Edit formation ────────────────────────────────────────────────────────

  function handleEditFormation(formationId: string) {
    let playerCount = 11;
    if (formationId in FORMATIONS) {
      playerCount = FORMATIONS[formationId as FormationKey]?.positions.length ?? 11;
    } else {
      const cm = customModes.find(m => m.id === mode);
      const allForMode = cm ? [...cm.formations, ...(extraFormations[mode] ?? [])] : (extraFormations[mode] ?? []);
      playerCount = allForMode.find(f => f.id === formationId)?.positions.length ?? 11;
    }
    setAddFormationPlayerCount(playerCount);
    setEditFormationId(formationId);
    setShowAddFormation(true);
  }

  function handleSaveEditedFormation(updated: CustomFormation) {
    if (updated.id in FORMATIONS) {
      const fo = {
        ...formationOverrides,
        edits: { ...formationOverrides.edits, [updated.id]: updated.positions },
        renames: { ...formationOverrides.renames, [updated.id]: updated.name },
      };
      setFormationOverrides(fo); saveFormationOverrides(fo);
    } else {
      let found = false;
      const updatedExtra = Object.fromEntries(Object.entries(extraFormations).map(([mId, fs]) => {
        const mapped = fs.map(f => f.id === updated.id ? updated : f);
        if (JSON.stringify(mapped) !== JSON.stringify(fs)) found = true;
        return [mId, mapped];
      }));
      if (found) { setExtraFormations(updatedExtra); saveExtraFormations(updatedExtra); }
      else {
        const updatedModes = customModes.map(m => ({ ...m, formations: m.formations.map(f => f.id === updated.id ? updated : f) }));
        setCustomModes(updatedModes); saveCustomModes(updatedModes);
      }
    }
    setShowAddFormation(false);
    setEditFormationId(null);
  }

  function getEditFormationData(): CustomFormation | undefined {
    if (!editFormationId) return undefined;
    if (editFormationId in FORMATIONS) {
      return {
        id: editFormationId,
        name: formationOverrides.renames[editFormationId] ?? editFormationId,
        positions: formationOverrides.edits[editFormationId] ?? FORMATIONS[editFormationId as FormationKey].positions,
        hasGoalkeeper: false,
      };
    }
    const cm = customModes.find(m => m.id === mode);
    const allForMode = cm ? [...cm.formations, ...(extraFormations[mode] ?? [])] : (extraFormations[mode] ?? []);
    return allForMode.find(f => f.id === editFormationId);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (!showContent) return <LoadingScreen />;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100" style={{ animation: "lcFadeIn 0.4s ease-out forwards" }}>
      <style>{`@keyframes lcFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={handleToggle} />
      )}
      <div className="fixed inset-y-0 left-0 z-40 h-full md:relative md:inset-y-auto md:left-auto md:z-auto md:flex-shrink-0">
        <div className={`h-full overflow-hidden transition-[width] duration-300 ease-in-out ${sidebarOpen ? "w-60" : "w-0"}`}>
          <Sidebar
            mode={mode} formation={formation}
            onModeChange={handleModeChange} onFormationChange={setFormation}
            userEmail={userEmail} isPro={isPro}
            modes={displayModes} formations={displayFormations}
            selectedFormationName={selectedFormationName}
            onCreateMode={() => setShowCreateMode(true)}
            onAddFormation={handleOpenAddFormation}
            onRenameMode={handleRenameMode} onDeleteMode={handleDeleteMode}
            onRenameFormation={handleRenameFormation} onDeleteFormation={handleDeleteFormation}
            onEditFormation={handleEditFormation}
          />
        </div>
        <div className="absolute bottom-8 md:bottom-auto md:top-[38px] md:-translate-y-1/2 -right-10 md:-right-7">
          <button onClick={handleToggle}
            className="flex items-center justify-center w-10 h-14 md:w-7 md:h-10 bg-zinc-900 border border-l-0 border-zinc-700 rounded-r-lg text-green-500 hover:text-green-400 transition-colors cursor-pointer"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}>
            <SidebarToggleIcon open={sidebarOpen} />
          </button>
          <span className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 text-xs text-zinc-400 whitespace-nowrap pointer-events-none transition-opacity duration-500 animate-shake ${hintVisible ? "opacity-100" : "opacity-0"}`}>
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

      {showCreateMode && (
        <CreateModeDialog onSave={handleCreateMode} onClose={() => setShowCreateMode(false)} />
      )}

      {showAddFormation && (() => {
        const editData = getEditFormationData();
        if (editFormationId && editData) {
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
