"use client";

import FormationBuilderSheet from "./FormationBuilderSheet";
import { CustomFormation } from "@/types";

interface AddFormationDialogProps {
  playerCount: number;
  onSave: (formation: CustomFormation) => void;
  onClose: () => void;
}

export default function AddFormationDialog({ playerCount, onSave, onClose }: AddFormationDialogProps) {
  return (
    <FormationBuilderSheet
      playerCount={playerCount}
      onSave={onSave}
      onBack={onClose}
      backLabel="Cancel"
    />
  );
}
