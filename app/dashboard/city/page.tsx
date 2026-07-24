"use client";

import React from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { CustomBarChart, CustomLineChart } from "@/components/charts/custom-charts";
import { Zap, Droplet, Bus, Cpu } from "lucide-react";

const electricityData = [
  { time: "00:00", Generation: 45 },
  { time: "04:00", Generation: 32 },
  { time: "08:00", Generation: 68 },
  { time: "12:00", Generation: 85 },
  { time: "16:00", Generation: 92 },
  { time: "20:00", Generation: 64 },
];

const waterData = [
  { time: "00:00", Pressure: 82 },
  { time: "04:00", Pressure: 85 },
  { time: "08:00", Pressure: 74 },
  { time: "12:00", Pressure: 70 },
  { time: "16:00", Pressure: 78 },
  { time: "20:00", Pressure: 81 },
];

export default function CityPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">Smart Infrastructure</h1>
        <p className="text-xs text-slate-400">
          Monitor municipal power grids, water flow pressures, public transit routing, and internet nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Power Grid */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Power Grid Generation (MW)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">SDG 9 Infrastructure</p>
            </div>
          </div>
          <CustomBarChart data={electricityData} xKey="time" yKey="Generation" color="#10b981" />
        </GlassCard>

        {/* Water Pipelines */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Water Pipeline Pressure (kPa)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Utility Streams</p>
            </div>
          </div>
          <CustomLineChart data={waterData} xKey="time" yKey="Pressure" color="#38bdf8" />
        </GlassCard>
      </div>

      {/* Grid status & node summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* IoT Node Telemetry */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200">Municipal Sensor Nodes</h3>
            </div>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">
              1,240 Online
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: "NODE-EL-22", type: "Power", zone: "Zone A (Downtown)", status: "Operational", load: "78%" },
              { id: "NODE-WT-04", type: "Water", zone: "Zone B (Residential)", status: "Operational", load: "62%" },
              { id: "NODE-IT-10", type: "Internet", zone: "Zone C (Industrial)", status: "Maintenance", load: "14%" },
            ].map((node) => (
              <div key={node.id} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-200">{node.id} ({node.type})</p>
                  <p className="text-[10px] text-slate-500">{node.zone}</p>
                </div>
                <div className="text-right">
                  <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${node.status === "Operational" ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" : "bg-amber-950/40 border border-amber-500/20 text-amber-400"}`}>
                    {node.status}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Load: {node.load}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Transportation Alerts */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Bus className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200">Public Transit Status</h3>
          </div>

          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 text-xs flex flex-col gap-1">
              <span className="font-bold text-slate-300">Route Metro-Line 1</span>
              <p className="text-[10px] text-slate-500">Scheduled arrival interval: 5 mins</p>
              <span className="text-[10px] text-emerald-400 font-bold mt-1">Running Normal</span>
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 text-xs flex flex-col gap-1 border-amber-500/20">
              <span className="font-bold text-slate-300">Route Bus-Line 14</span>
              <p className="text-[10px] text-slate-500">Delays in Zone B due to road maintenance</p>
              <span className="text-[10px] text-amber-400 font-bold mt-1">Delayed (+8m)</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
