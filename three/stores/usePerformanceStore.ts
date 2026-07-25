import { create } from "zustand";

interface PerformanceState {
  fps: number;
  setFps: (fps: number) => void;
  dpr: number; // device pixel ratio
  setDpr: (dpr: number) => void;
  isLowEnd: boolean;
  setLowEnd: (isLow: boolean) => void;
  enableAdvancedEffects: boolean;
  setEnableAdvancedEffects: (enable: boolean) => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  fps: 60,
  setFps: (fps) => set({ fps }),
  dpr: 1, // default dpr, gets adjusted by performance monitor
  setDpr: (dpr) => set({ dpr }),
  isLowEnd: false,
  setLowEnd: (isLow) => set({ isLowEnd: isLow }),
  enableAdvancedEffects: true,
  setEnableAdvancedEffects: (enable) => set({ enableAdvancedEffects: enable }),
}));
