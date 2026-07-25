import { create } from "zustand";

export type CameraMode = 'free' | 'fly' | 'dolly' | 'rail';

interface CameraState {
  mode: CameraMode;
  setMode: (mode: CameraMode) => void;
  targetPosition: [number, number, number] | null;
  setTargetPosition: (pos: [number, number, number] | null) => void;
  targetFov: number;
  setTargetFov: (fov: number) => void;
  railPoints: [number, number, number][];
  setRailPoints: (points: [number, number, number][]) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  mode: 'free',
  setMode: (mode) => set({ mode }),
  targetPosition: null,
  setTargetPosition: (pos) => set({ targetPosition: pos }),
  targetFov: 45,
  setTargetFov: (fov) => set({ targetFov: fov }),
  railPoints: [],
  setRailPoints: (points) => set({ railPoints: points }),
}));
