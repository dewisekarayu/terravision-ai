"use client";

import React from "react";
import { CityCanvas } from "@/three/scene/canvas";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LayerControls } from "@/components/dashboard/layer-controls";
import { DisasterControls } from "@/components/dashboard/disaster-controls";
import { AiPredictor } from "@/components/dashboard/ai-predictor";
import { SdgImpact } from "@/components/dashboard/sdg-impact";
import { DistrictDetails } from "@/components/dashboard/district-details";

export default function OverviewPage() {
  return (
    <div className="flex-1 flex flex-col gap-4 min-h-0">
      {/* Top level KPI cards */}
      <KpiGrid />

      {/* Main dashboard splitscreen */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4 min-h-0">
        {/* Left Side: 3D City Digital Twin Canvas */}
        <div className="xl:col-span-8 relative min-h-[450px] xl:min-h-0 flex flex-col">
          <CityCanvas />
          
          {/* Absolute floating district inspector */}
          <div className="absolute top-4 left-4 w-72 z-20 pointer-events-auto">
            <DistrictDetails />
          </div>
        </div>

        {/* Right Side: Operational control panels */}
        <div className="xl:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[85vh] xl:max-h-[calc(100vh-250px)] pr-1">
          <LayerControls />
          <DisasterControls />
          <AiPredictor />
          <SdgImpact />
        </div>
      </div>
    </div>
  );
}
