import { create } from "zustand";

export type DisasterPhase = "NORMAL" | "WARNING" | "DISASTER_ACTIVE" | "RECOVERY";
export type DisasterType = "NONE" | "FLOOD" | "EARTHQUAKE" | "HEATWAVE";

interface DisasterState {
  phase: DisasterPhase;
  type: DisasterType;
  intensity: number; // 0 to 1
  triggerDisaster: (type: DisasterType, intensity: number) => void;
  resetDisaster: () => void;
}

export const useDisasterStore = create<DisasterState>((set) => ({
  phase: "NORMAL",
  type: "NONE",
  intensity: 0,
  triggerDisaster: (type, intensity) => set({ phase: "DISASTER_ACTIVE", type, intensity }),
  resetDisaster: () => set({ phase: "NORMAL", type: "NONE", intensity: 0 }),
}));
