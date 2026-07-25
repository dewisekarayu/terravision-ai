import { create } from "zustand";

export type DisasterScenario =
  | "normal"
  | "rainfall"
  | "flood"
  | "heatwave"
  | "pollution"
  | "earthquake";

interface SimulationState {
  disasterScenario: DisasterScenario;
  setDisasterScenario: (scenario: DisasterScenario) => void;
  carbonScore: number;
  educationScore: number;
  povertyScore: number;
  healthcareScore: number;
  forestScore: number;
  renewableScore: number;
  setScores: (scores: Partial<Omit<SimulationState, 'disasterScenario' | 'setDisasterScenario' | 'setScores'>>) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  disasterScenario: "normal",
  setDisasterScenario: (scenario) => set({ disasterScenario: scenario }),
  carbonScore: 0.5,
  educationScore: 0.5,
  povertyScore: 0.5,
  healthcareScore: 0.5,
  forestScore: 0.5,
  renewableScore: 0.5,
  setScores: (scores) => set((state) => ({ ...state, ...scores })),
}));
