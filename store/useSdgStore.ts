import { create } from "zustand";

export type Sdg = {
  id: number;
  title: string;
  color: string;
  score: number;
  isActive: boolean;
};

const INITIAL_SDGS: Sdg[] = [
  { id: 1, title: "No Poverty", color: "#E5243B", score: 85, isActive: false },
  { id: 2, title: "Zero Hunger", color: "#DDA63A", score: 72, isActive: false },
  { id: 3, title: "Good Health and Well-being", color: "#4C9F38", score: 90, isActive: false },
  { id: 4, title: "Quality Education", color: "#C5192D", score: 88, isActive: false },
  { id: 5, title: "Gender Equality", color: "#FF3A21", score: 95, isActive: false },
  { id: 6, title: "Clean Water and Sanitation", color: "#26BDE2", score: 82, isActive: true },
  { id: 7, title: "Affordable and Clean Energy", color: "#FCC30B", score: 78, isActive: true },
  { id: 8, title: "Decent Work and Economic Growth", color: "#A21942", score: 85, isActive: false },
  { id: 9, title: "Industry, Innovation and Infrastructure", color: "#FD6925", score: 92, isActive: true },
  { id: 10, title: "Reduced Inequality", color: "#DD1367", score: 70, isActive: false },
  { id: 11, title: "Sustainable Cities and Communities", color: "#FD9D24", score: 85, isActive: true },
  { id: 12, title: "Responsible Consumption and Production", color: "#BF8B2E", score: 76, isActive: false },
  { id: 13, title: "Climate Action", color: "#3F7E44", score: 80, isActive: true },
  { id: 14, title: "Life Below Water", color: "#0A97D9", score: 85, isActive: false },
  { id: 15, title: "Life on Land", color: "#56C02B", score: 88, isActive: false },
  { id: 16, title: "Peace and Justice Strong Institutions", color: "#00689D", score: 90, isActive: false },
  { id: 17, title: "Partnerships to achieve the Goal", color: "#19486A", score: 95, isActive: false },
];

interface SdgState {
  sdgs: Sdg[];
  toggleSdg: (id: number) => void;
  getGlobalScore: () => number;
}

export const useSdgStore = create<SdgState>((set, get) => ({
  sdgs: INITIAL_SDGS,
  toggleSdg: (id) =>
    set((state) => ({
      sdgs: state.sdgs.map((sdg) =>
        sdg.id === id ? { ...sdg, isActive: !sdg.isActive } : sdg
      ),
    })),
  getGlobalScore: () => {
    const { sdgs } = get();
    const total = sdgs.reduce((acc, sdg) => acc + sdg.score, 0);
    return Math.round(total / sdgs.length);
  },
}));
