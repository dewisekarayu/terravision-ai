"use client";

import React from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { CustomAreaChart, CustomLineChart } from "@/components/charts/custom-charts";
import { BrainCircuit, Thermometer, Wind, ShieldCheck } from "lucide-react";

const temperatureForecast = [
  { day: "Mon", Temp: 28 },
  { day: "Tue", Temp: 29 },
  { day: "Wed", Temp: 31 },
  { day: "Thu", Temp: 32 },
  { day: "Fri", Temp: 30 },
  { day: "Sat", Temp: 28 },
  { day: "Sun", Temp: 29 },
];

const co2Data = [
  { year: "2020", CO2: 408 },
  { year: "2021", CO2: 410 },
  { year: "2022", CO2: 411 },
  { year: "2023", CO2: 412 },
  { year: "2024", CO2: 410 },
  { year: "2025", CO2: 407 },
  { year: "2026", CO2: 405 },
];

export default function ClimatePage() {
  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">AI Climate Predictions</h1>
        <p className="text-xs text-slate-400">
          Environmental telemetries, carbon output trajectories, and machine learning forecast indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature forecast */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Thermal Forecast Trend (°C)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">SDG 13 Climate Action</p>
            </div>
          </div>
          <CustomAreaChart data={temperatureForecast} xKey="day" yKey="Temp" color="#f97316" gradientId="colorOrange" />
        </GlassCard>

        {/* CO2 Emissions */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Carbon Abatement Profile (ppm)</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Greenhouse Gases</p>
            </div>
          </div>
          <CustomLineChart data={co2Data} xKey="year" yKey="CO2" color="#10b981" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ML Forecast Logs */}
        <GlassCard className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">AI Warning Diagnostic Center</h3>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { title: "Flood Probability Forecast", hazard: "Heavy Rainfall Event", confidence: "74%", time: "Next 48 Hours", status: "Active warning" },
              { title: "Air Pollution Spike Forecast", hazard: "Dust & Smog Accumulation", confidence: "65%", time: "Aug 12 - Aug 15", status: "Pre-alert warning" },
            ].map((alert, idx) => (
              <div key={idx} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex flex-col gap-1.5 border-l-cyan-500 border-l-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{alert.title}</span>
                  <span className="text-[10px] font-black text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                    {alert.confidence} Conf.
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Cause: {alert.hazard}</span>
                  <span>Timeline: {alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Action Recommendation */}
        <GlassCard className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200">Active Adaptation Response</h3>
          </div>

          <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 text-xs flex flex-col gap-2 flex-1 justify-center">
            <span className="font-bold text-slate-300">Adaptation Plan DX-09:</span>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Based on the 74% flood hazard projection, the automated municipal gate systems in District West will deploy flood barriers when water levels surpass 1.6 meters. Emergency services have been placed on standby.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
