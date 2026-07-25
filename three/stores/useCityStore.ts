import { create } from "zustand";

export interface InfrastructureLayers {
  electricity: boolean;
  water: boolean;
  internet: boolean;
  transport: boolean;
}

export interface CityLayout {
  buildings: { position: [number, number, number]; scale: [number, number, number]; color: string }[];
  trees: { position: [number, number, number]; scale: number }[];
  roads: { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }[];
}

interface CityState {
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
  layers: InfrastructureLayers;
  toggleLayer: (layer: keyof InfrastructureLayers) => void;
  resetLayers: () => void;
  cityLayoutData: CityLayout | null;
  setCityLayoutData: (data: CityLayout | null) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useCityStore = create<CityState>((set) => ({
  selectedDistrict: null,
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
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
  cityLayoutData: null,
  setCityLayoutData: (data) => set({ cityLayoutData: data }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
