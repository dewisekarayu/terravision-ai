"use client";

import React from "react";
import { useCityStore } from "@/three/stores/useCityStore";
import { GlassCard } from "./glass-card";
import { X, Users, AlertTriangle, Thermometer, Wind, Trees } from "lucide-react";

export function DistrictDetails() {
  const { selectedDistrict, setSelectedDistrict } = useCityStore();

  if (!selectedDistrict) return null;

  const isDowntown = selectedDistrict.includes("0") || selectedDistrict.includes("1");
  const population = isDowntown ? "24,500 residents" : "12,200 residents";
  const floodRisk = isDowntown ? "Low (12%)" : "Medium (45%)";
  const aqi = isDowntown ? "64 (Moderate)" : "28 (Good)";
  const temp = isDowntown ? "29.4 °C" : "27.2 °C";
  const greenCover = isDowntown ? "14.2%" : "38.5%";

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
