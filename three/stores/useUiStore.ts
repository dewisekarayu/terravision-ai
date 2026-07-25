import { create } from "zustand";

interface UiState {
  activePanel: string | null;
  setActivePanel: (panel: string | null) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  isLoading: true, // initially loading scene
  setLoading: (loading) => set({ isLoading: loading }),
}));
