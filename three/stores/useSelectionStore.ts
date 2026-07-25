import { create } from "zustand";

interface SelectionState {
  hoveredObject: string | null;
  selectedObject: string | null;
  setHoveredObject: (id: string | null) => void;
  setSelectedObject: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  hoveredObject: null,
  selectedObject: null,
  setHoveredObject: (id) => set({ hoveredObject: id }),
  setSelectedObject: (id) => set({ selectedObject: id }),
}));
