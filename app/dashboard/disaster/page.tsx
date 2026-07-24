"use client";

import React from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { CustomAreaChart, CustomBarChart } from "@/components/charts/custom-charts";
import { AlertTriangle, ShieldCheck, Siren, Navigation } from "lucide-react";

const seismicData = [
  { time: "10:00", Magnitude: 0.1 },
  { time: "10:15", Magnitude: 0.2 },
  { time: "10:30", Magnitude: 1.8 },
  { time: "10:45", Magnitude: 0.4 },
  { time: "11:00", Magnitude: 0.2 },
  { time: "11:15", Magnitude: 0.1 },
];

const rainfallData = [
  { hour: "H-5", Rainfall: 10 },
  { hour: "H-4", Rainfall: 15 },
  { hour: "H-3", Rainfall: 45 },
  { hour: "H-2", Rainfall: 62 },
  { hour: "H-1", Rainfall: 80 },
  { hour: "Now", Rainfall: 95 },
];

export default function DisasterPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">Disaster Simulation Hub</h1>
        <p className="text-xs text-slate-400">
          Monitor seismological activity, live rain volume, sirens status, and evacuation pathway protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seismograph */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Seismograph Magnitude (Richter)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Tectonic Telemetry</p>
            </div>
          </div>
          <CustomAreaChart data={seismicData} xKey="time" yKey="Magnitude" color="#ef4444" gradientId="colorRed" />
        </GlassCard>

        {/* Rain volumes */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Siren className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Precipitation Accumulation (mm)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Hydrological Level</p>
            </div>
          </div>
          <CustomBarChart data={rainfallData} xKey="hour" yKey="Rainfall" color="#f59e0b" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sirens controller */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Siren className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">Alarm Siren Controls</h3>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            <button className="w-full bg-red-950/40 border border-red-500/30 text-red-400 py-3 rounded-xl font-bold text-xs hover:bg-red-900/30 transition-all flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4 animate-bounce" />
              TRIGGER WARNING SIRENS
            </button>
            <button className="w-full bg-slate-900 border border-slate-800 text-slate-400 py-3 rounded-xl font-bold text-xs hover:text-white transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              MUTE SIRENS (STANDBY)
            </button>
          </div>
        </GlassCard>

        {/* Evacuation status */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">Evacuation Pathway Status</h3>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { route: "Highway Route Alpha (North)", capacity: "84% Load", hazard: "None", status: "Clear" },
              { route: "River Boulevard Pathway (West)", capacity: "0% Load", hazard: "Water Level Warning", status: "Blocked" },
              { route: "Subway Bypass System (Underground)", capacity: "12% Load", hazard: "Standby protocol active", status: "Open" },
            ].map((r, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-200">{r.route}</p>
                  <p className="text-[10px] text-slate-500">Hazard: {r.hazard}</p>
                </div>
                <div className="text-right">
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${r.status === "Clear" || r.status === "Open" ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" : "bg-red-950/40 border border-red-500/20 text-red-400"}`}>
                    {r.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">{r.capacity}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
