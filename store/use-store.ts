import { create } from "zustand";

export type DisasterScenario =
  | "normal"
  | "rainfall"
  | "flood"
  | "heatwave"
  | "pollution"
  | "earthquake";

export interface InfrastructureLayers {
  electricity: boolean;
  water: boolean;
  internet: boolean;
  transport: boolean;
}

interface SmartCityState {
  // Day/Night cycle
  timeOfDay: number; // 0 - 23 hours
  setTimeOfDay: (time: number) => void;

  // Selected district metrics
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;

  // Active Disaster Simulation
  disasterScenario: DisasterScenario;
  setDisasterScenario: (scenario: DisasterScenario) => void;

  // Active Infrastructure layers overlays
  layers: InfrastructureLayers;
  toggleLayer: (layer: keyof InfrastructureLayers) => void;
  resetLayers: () => void;
}

export const useStore = create<SmartCityState>((set) => ({
  timeOfDay: 12, // Default to noon
  setTimeOfDay: (time) => set({ timeOfDay: time }),

  selectedDistrict: null,
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),

  disasterScenario: "normal",
  setDisasterScenario: (scenario) => set({ disasterScenario: scenario }),

  layers: {
    electricity: false,
    water: false,
    internet: false,
    transport: false,
  },
  toggleLayer: (layer) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layer]: !state.layers[layer],
      },
    })),
  resetLayers: () =>
    set({
      layers: {
        electricity: false,
        water: false,
        internet: false,
        transport: false,
      },
    }),
}));
