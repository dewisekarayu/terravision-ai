"use client";

import React from "react";
import { useCityStore, InfrastructureLayers } from "@/three/stores/useCityStore";
import { GlassCard } from "./glass-card";
import { Zap, Droplet, Wifi, Bus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LayerControls() {
  const { layers, toggleLayer } = useCityStore();

  const layerItems: { id: keyof InfrastructureLayers; label: string; icon: LucideIcon; color: string }[] = [
    { id: "electricity", label: "Power Network Grid", icon: Zap, color: "text-emerald-400" },
    { id: "water", label: "Water Pipeline Grid", icon: Droplet, color: "text-blue-400" },
    { id: "internet", label: "IoT Internet Coverage", icon: Wifi, color: "text-violet-400" },
    { id: "transport", label: "Public Transport Routes", icon: Bus, color: "text-amber-400" },
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-slate-200">INFRASTRUCTURE LAYERS</h3>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Toggle 3D Shaders Overlays
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {layerItems.map((layer) => {
          const Icon = layer.icon;
          const isActive = layers[layer.id];

          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200",
                isActive
                  ? "bg-slate-800/80 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", isActive ? layer.color : "text-slate-500")} />
                <span>{layer.label}</span>
              </div>
              <div
                className={cn(
                  "w-8 h-4 rounded-full relative transition-all duration-300",
                  isActive ? "bg-cyan-500" : "bg-slate-800"
                )}
              >
                <div
                  className={cn(
                    "w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.5 transition-all duration-300",
                    isActive ? "right-0.5" : "left-0.5"
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
