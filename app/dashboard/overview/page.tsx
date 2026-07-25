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

const SdgRadarChart = dynamic(() => import("@/components/dashboard/charts/SdgRadarChart").then(mod => mod.SdgRadarChart), { ssr: false });
const CarbonTrendLine = dynamic(() => import("@/components/dashboard/charts/CarbonTrendLine").then(mod => mod.CarbonTrendLine), { ssr: false });

const CityCanvas = dynamic(
  () => import("@/three/render/MainCanvas").then((mod) => mod.MainCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-800/40 min-h-[450px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.15),transparent)] animate-pulse" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-t-cyan-500 border-r-cyan-500/30 border-b-cyan-500/30 border-l-cyan-500/30 animate-spin" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Loading Canvas...
          </p>
        </div>
      </div>
    ),
  }
);

import { useCityStore } from "@/three/stores/useCityStore";

export default function OverviewPage() {
  const { isGenerating } = useCityStore();
  const [activeTab, setActiveTab] = useState<"operations" | "disasters" | "analytics">("operations");

  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0 overflow-hidden">
      {/* Top level KPI cards */}
      <KpiGrid />

      {/* Main dashboard splitscreen */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Left Side: 3D City Digital Twin Canvas */}
        <div className="xl:col-span-8 relative min-h-[450px] xl:min-h-0 flex flex-col h-[calc(100vh-270px)] z-10 pointer-events-auto">
          <CityCanvas />
          
          {/* Absolute floating district inspector */}
          <div className="absolute top-4 left-4 w-72 z-20 pointer-events-auto">
            <DistrictDetails />
          </div>

          {isGenerating && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-cyan-500/50 px-4 py-2 rounded-full flex items-center gap-2 z-20">
              <div className="h-4 w-4 rounded-full border-2 border-t-cyan-400 border-r-cyan-400/30 border-b-cyan-400/30 border-l-cyan-400/30 animate-spin" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Generating Digital Twin...</span>
            </div>
          )}
        </div>

        {/* Right Side: Operational control panels (Tabbed) */}
        <div className="xl:col-span-4 flex flex-col gap-4 h-[calc(100vh-270px)] pr-1 relative z-20 pointer-events-auto">
          {/* Tabs Navigation */}
          <div className="flex bg-slate-900/60 backdrop-blur-md p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab("operations")}
              className={`flex-1 text-[10px] uppercase font-bold py-2 rounded-lg transition-all ${activeTab === "operations" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"}`}
            >
              Operations
            </button>
            <button 
              onClick={() => setActiveTab("disasters")}
              className={`flex-1 text-[10px] uppercase font-bold py-2 rounded-lg transition-all ${activeTab === "disasters" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-400 hover:text-slate-200"}`}
            >
              Disasters
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 text-[10px] uppercase font-bold py-2 rounded-lg transition-all ${activeTab === "analytics" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"}`}
            >
              Analytics
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto scrollbar-thin pb-4 flex flex-col gap-4">
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
              <>
                <SdgRadarChart />
                <CarbonTrendLine />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
