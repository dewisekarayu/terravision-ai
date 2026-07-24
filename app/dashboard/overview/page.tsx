"use client";

import React from "react";
import dynamic from "next/dynamic";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LayerControls } from "@/components/dashboard/layer-controls";
import { DisasterControls } from "@/components/dashboard/disaster-controls";
import { AiPredictor } from "@/components/dashboard/ai-predictor";
import { SdgImpact } from "@/components/dashboard/sdg-impact";
import { DistrictDetails } from "@/components/dashboard/district-details";

const CityCanvas = dynamic(
  () => import("@/three/scene/canvas").then((mod) => mod.CityCanvas),
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

export default function OverviewPage() {
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
        </div>

        {/* Right Side: Operational control panels */}
        <div className="xl:col-span-4 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-270px)] pr-1 pb-4 relative z-20 pointer-events-auto">
          <LayerControls />
          <DisasterControls />
          <AiPredictor />
          <SdgImpact />
        </div>
      </div>
    </div>
  );
}
