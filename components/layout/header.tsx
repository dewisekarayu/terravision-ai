"use client";

import { useStore } from "@/store/use-store";
import { Sun, Moon, Bell, Search, ShieldAlert } from "lucide-react";
import React from "react";

export function Header() {
  const { timeOfDay, setTimeOfDay, disasterScenario } = useStore();

  const getTimelineLabel = (hour: number) => {
    if (hour === 0) return "12:00 AM (Midnight)";
    if (hour === 12) return "12:00 PM (Noon)";
    return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  };

  return (
    <header className="relative glass-panel rounded-2xl h-20 px-6 flex items-center justify-between gap-6 z-30">
      {/* Title / Status */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-400">OPERATIONAL HUB</h2>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-wide">METROPOLIS-DX1</h1>
            {disasterScenario !== "normal" && (
              <span className="flex items-center gap-1 bg-red-950/80 border border-red-500/30 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">
                <ShieldAlert className="h-3 w-3" />
                SIM: {disasterScenario}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center Slider: Time of Day simulation */}
      <div className="flex-1 max-w-md bg-slate-900/40 border border-slate-800/60 rounded-xl px-4 py-2.5 flex items-center gap-4">
        <div className="text-slate-400">
          {timeOfDay >= 6 && timeOfDay < 18 ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-semibold tracking-wider text-slate-400">
            <span>TIMELINE CYCLE</span>
            <span className="text-cyan-400 font-bold">{getTimelineLabel(timeOfDay)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search districts, sensors..."
            className="bg-slate-900/50 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all w-52"
          />
        </div>

        {/* Notifications */}
        <button className="h-10 w-10 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800/40 transition-all flex items-center justify-center relative text-slate-300">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
