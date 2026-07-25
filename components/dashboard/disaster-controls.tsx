"use client";

import React from "react";
import { useSimulationStore, DisasterScenario } from "@/three/stores/useSimulationStore";
import { useWeatherStore } from "@/three/stores/useWeatherStore";
import { useCameraStore } from "@/three/stores/useCameraStore";
import { GlassCard } from "./glass-card";
import { ShieldCheck, CloudRain, ShieldAlert, Flame, EyeOff, Radio, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { latLongToVector3 } from "@/three/utils/geoCoords";

export function DisasterControls() {
  const { disasterScenario, setDisasterScenario } = useSimulationStore();
  const { setWeatherType } = useWeatherStore();
  const { setMode, setTargetPosition } = useCameraStore();

  const scenarios: { id: DisasterScenario; label: string; icon: LucideIcon }[] = [
    { id: "normal", label: "Normal Operations", icon: ShieldCheck },
    { id: "rainfall", label: "Heavy Rainfall", icon: CloudRain },
    { id: "flood", label: "River Flood Crisis", icon: ShieldAlert },
    { id: "heatwave", label: "Thermal Heatwave", icon: Flame },
    { id: "pollution", label: "Smog & Pollution", icon: EyeOff },
    { id: "earthquake", label: "Seismic Earthquake", icon: Radio },
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-200">DISASTER SIMULATION</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Morph 3D Twin Environment
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = disasterScenario === sc.id;

          return (
            <button
              key={sc.id}
              onClick={() => {
                setDisasterScenario(sc.id);
                // Trigger visual reactivity
                if (sc.id === 'rainfall' || sc.id === 'flood') setWeatherType('rain');
                else if (sc.id === 'earthquake' || sc.id === 'pollution') setWeatherType('storm');
                else if (sc.id === 'heatwave') setWeatherType('fog');
                else setWeatherType('clear');
                
                // Fly camera into the disaster zone
                if (sc.id !== 'normal') {
                  const targetPos = latLongToVector3(-6.2, 106.8, 50); // Hardcoded Jakarta for wow effect
                  setTargetPosition([targetPos.x, targetPos.y, targetPos.z]);
                  setMode('fly');
                } else {
                  setMode('free');
                }
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200",
                isActive
                  ? "bg-slate-800/80 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", isActive ? "text-cyan-400" : "text-slate-500")} />
                <span>{sc.label}</span>
              </div>
              {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
