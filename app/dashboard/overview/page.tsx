"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LayerControls } from "@/components/dashboard/layer-controls";
import { DisasterControls } from "@/components/dashboard/disaster-controls";
import { AiPredictor } from "@/components/dashboard/ai-predictor";
import { SdgImpact } from "@/components/dashboard/sdg-impact";
import { DistrictDetails } from "@/components/dashboard/district-details";
import { AiSliders } from "@/components/dashboard/ai-sliders";
import { SdgMatrix } from "@/components/dashboard/sdg-matrix";
import { useCityStore } from "@/three/stores/useCityStore";

const SdgRadarChart = dynamic(() => import("@/components/dashboard/charts/SdgRadarChart").then(mod => mod.SdgRadarChart), { ssr: false });
const CarbonTrendLine = dynamic(() => import("@/components/dashboard/charts/CarbonTrendLine").then(mod => mod.CarbonTrendLine), { ssr: false });

export default function OverviewPage() {
  const { isGenerating } = useCityStore();
  const [activeTab, setActiveTab] = useState<"operations" | "disasters" | "analytics">("operations");

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none">
      {/* Top level KPI cards - Top HUD */}
      <div className="w-full pointer-events-auto px-4 mt-2">
        <KpiGrid />
      </div>

      {/* Floating district inspector - Top Left HUD */}
      <div className="absolute top-28 left-4 w-72 z-20 pointer-events-auto">
        <DistrictDetails />
      </div>

      {/* Right Side HUD: Operational control panels */}
      <div className="absolute top-32 right-8 w-[420px] flex flex-col gap-5 max-h-[calc(100vh-220px)] z-20 pointer-events-auto">
        {/* Tabs Navigation */}
        <div className="flex bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-xl border border-slate-700/50 shadow-2xl">
          <button 
            onClick={() => setActiveTab("operations")}
            className={`flex-1 text-[11px] uppercase font-bold py-2.5 rounded-lg transition-all ${activeTab === "operations" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Operations
          </button>
          <button 
            onClick={() => setActiveTab("disasters")}
            className={`flex-1 text-[11px] uppercase font-bold py-2.5 rounded-lg transition-all ${activeTab === "disasters" ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Disasters
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 text-[11px] uppercase font-bold py-2.5 rounded-lg transition-all ${activeTab === "analytics" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-8 flex flex-col gap-5 pr-2">
          {activeTab === "operations" && (
            <>
              <LayerControls />
              <AiSliders />
              <SdgImpact />
            </>
          )}
          
          {activeTab === "disasters" && (
            <>
              <DisasterControls />
              <AiPredictor />
            </>
          )}

          {activeTab === "analytics" && (
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl flex flex-col gap-4">
              <SdgRadarChart />
              <CarbonTrendLine />
            </div>
          )}
        </div>
      </div>

      {/* Generating Status */}
      {isGenerating && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/50 px-6 py-4 rounded-2xl flex flex-col items-center gap-3 z-50 shadow-[0_0_50px_rgba(6,182,212,0.3)] pointer-events-auto">
          <div className="h-8 w-8 rounded-full border-2 border-t-cyan-400 border-r-cyan-400/30 border-b-cyan-400/30 border-l-cyan-400/30 animate-spin" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">Generating Digital Twin...</span>
        </div>
      )}

      {/* Bottom Center HUD: 17 SDGs Matrix */}
      <div className="pointer-events-auto">
        <SdgMatrix />
      </div>
    </div>
  );
}
