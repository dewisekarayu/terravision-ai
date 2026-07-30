"use client";

import React from "react";
import { useCityStore } from "@/three/stores/useCityStore";
import { GlassCard } from "./glass-card";
import { X, Users, AlertTriangle, Thermometer, Wind, Trees } from "lucide-react";

export function DistrictDetails() {
  const { selectedDistrict, setSelectedDistrict } = useCityStore();

  if (!selectedDistrict) return null;

  const isDowntown = selectedDistrict.includes("pusat") || selectedDistrict.includes("selatan");
  const population = isDowntown ? "1.12 - 2.28M residents" : "1.8M residents";
  const floodRisk = isDowntown ? "Medium (45%)" : "High (82%)";
  const aqi = isDowntown ? "64 (Moderate)" : "112 (Unhealthy)";
  const temp = isDowntown ? "30.4 °C" : "31.2 °C";
  const greenCover = isDowntown ? "12 - 28%" : "4%";

  return (
    <GlassCard className="relative flex flex-col gap-4 border border-cyan-500/30">
      <button
        onClick={() => setSelectedDistrict(null)}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all"
      >
        <X className="h-4 w-4" />
      </button>

      <div>
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">
          District Inspection
        </h3>
        <p className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase">
          ID: {selectedDistrict}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>Population</span>
          </div>
          <span className="text-xs font-bold text-white">{population}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Flood Hazard</span>
          </div>
          <span className="text-xs font-bold text-white">{floodRisk}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Wind className="h-3.5 w-3.5 text-emerald-400" />
            <span>Air Quality</span>
          </div>
          <span className="text-xs font-bold text-white">{aqi}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-800/40 pb-2">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Thermometer className="h-3.5 w-3.5 text-orange-400" />
            <span>Temperature</span>
          </div>
          <span className="text-xs font-bold text-white">{temp}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Trees className="h-3.5 w-3.5 text-emerald-400" />
            <span>Green Area</span>
          </div>
          <span className="text-xs font-bold text-white">{greenCover}</span>
        </div>
      </div>
    </GlassCard>
  );
}
