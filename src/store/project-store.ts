import { create } from "zustand";

import type { ArtifactKey, ProjectArtifacts, ProjectPayload } from "@/types/project";

type SavingState = "idle" | "saving" | "saved" | "error";

interface ProjectStoreState {
  project: ProjectPayload | null;
  selectedArtifact: ArtifactKey;
  savingState: SavingState;
  lastError?: string | null;
  dirtyArtifacts: Set<ArtifactKey>;
  setProject: (project: ProjectPayload) => void;
  selectArtifact: (artifact: ArtifactKey) => void;
  updateArtifact: <K extends ArtifactKey>(key: K, data: ProjectArtifacts[K]) => void;
  setSavingState: (state: SavingState, error?: string | null) => void;
  markArtifactsSynced: (keys?: ArtifactKey[]) => void;
  hydrateProject: (project: ProjectPayload) => void;
  reset: () => void;
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  project: null,
  selectedArtifact: "leanCanvas",
  savingState: "idle",
  lastError: null,
  dirtyArtifacts: new Set<ArtifactKey>(),
  setProject: (project) =>
    set({
      project,
      selectedArtifact: "leanCanvas",
      savingState: "idle",
      lastError: null,
      dirtyArtifacts: new Set<ArtifactKey>(),
    }),
  selectArtifact: (artifact) => set({ selectedArtifact: artifact }),
  updateArtifact: (key, data) =>
    set((state) => {
      if (!state.project) return state;
      const nextDirty = new Set(state.dirtyArtifacts);
      nextDirty.add(key);
      return {
        project: {
          ...state.project,
          artifacts: {
            ...state.project.artifacts,
            [key]: data,
          },
          updatedAt: new Date().toISOString(),
        },
        dirtyArtifacts: nextDirty,
        savingState: "idle",
      };
    }),
  setSavingState: (savingState, error) => set({ savingState, lastError: error ?? null }),
  markArtifactsSynced: (keys) =>
    set((state) => {
      const nextDirty = new Set(state.dirtyArtifacts);
      if (keys && keys.length > 0) {
        keys.forEach((key) => nextDirty.delete(key));
      } else {
        nextDirty.clear();
      }
      return { dirtyArtifacts: nextDirty };
    }),
  hydrateProject: (project) =>
    set((state) => ({
      project,
      savingState: "saved",
      lastError: null,
      // Conservamos artifacts marcados como sucios hasta que se confirme sincronización.
      dirtyArtifacts: new Set(state.dirtyArtifacts),
    })),
  reset: () =>
    set({
      project: null,
      savingState: "idle",
      lastError: null,
      selectedArtifact: "leanCanvas",
      dirtyArtifacts: new Set<ArtifactKey>(),
    }),
}));

