import { create } from "zustand";

interface WeatherState {
  timeOfDay: number; // 0 - 23 hours
  setTimeOfDay: (time: number) => void;
  weatherType: "clear" | "rain" | "fog" | "storm";
  setWeatherType: (type: "clear" | "rain" | "fog" | "storm") => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  timeOfDay: 12, // Default to noon
  setTimeOfDay: (time) => set({ timeOfDay: time }),
  weatherType: "clear",
  setWeatherType: (type) => set({ weatherType: type }),
}));
