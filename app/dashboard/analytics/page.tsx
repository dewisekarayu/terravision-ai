"use client";

import React from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { CustomAreaChart, CustomBarChart } from "@/components/charts/custom-charts";
import { BarChart3, Download, RefreshCw, Layers } from "lucide-react";

const energySourceData = [
  { month: "Jan", Renewable: 45, Coal: 55 },
  { month: "Feb", Renewable: 50, Coal: 50 },
  { month: "Mar", Renewable: 55, Coal: 45 },
  { month: "Apr", Renewable: 60, Coal: 40 },
  { month: "May", Renewable: 68, Coal: 32 },
  { month: "Jun", Renewable: 74, Coal: 26 },
];

const recyclingData = [
  { district: "Dist-A", Rate: 65 },
  { district: "Dist-B", Rate: 42 },
  { district: "Dist-C", Rate: 58 },
  { district: "Dist-D", Rate: 72 },
  { district: "Dist-E", Rate: 39 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin pointer-events-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Advanced Data Analytics</h1>
          <p className="text-xs text-slate-400">
            Compare resource indices, municipal waste targets, and carbon mitigation progress.
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold hover:text-white transition-all">
          <Download className="h-3.5 w-3.5" />
          Export Datasets
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Energy Generation */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Renewable vs Coal Power (%)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Grid Source Mix</p>
            </div>
          </div>
          <CustomAreaChart data={energySourceData} xKey="month" yKey="Renewable" color="#06b6d4" gradientId="colorCyan" />
        </GlassCard>

        {/* Recycling rates */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Waste Recycling Rates by District (%)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">SDG 11 Indicators</p>
            </div>
          </div>
          <CustomBarChart data={recyclingData} xKey="district" yKey="Rate" color="#10b981" />
        </GlassCard>
      </div>

      {/* Grid status & node summary */}
      <GlassCard className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Aggregated Municipal Telemetries</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center mt-2">
          {[
            { metric: "Total Carbon Saved", val: "18.4 tons", change: "-14% vs 2025" },
            { metric: "Urban Heat Mitigation", val: "-0.8 °C", change: "Parks forest effect" },
            { metric: "Smart Grid Load Balance", val: "99.4% Efficiency", change: "9.2% Transmission loss" },
            { metric: "Resource Recovery Rate", val: "58% Circularity", change: "SDG Target 11.6" },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {item.metric}
              </span>
              <span className="text-lg font-black text-white">{item.val}</span>
              <span className="text-[9px] font-bold text-cyan-400">{item.change}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
