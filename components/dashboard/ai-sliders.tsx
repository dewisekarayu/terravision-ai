"use client";

import React from "react";
import { useSimulationStore } from "@/three/stores/useSimulationStore";
import { GlassCard } from "./glass-card";
import { Activity, Leaf, GraduationCap, DollarSign, HeartPulse, Zap } from "lucide-react";

export function AiSliders() {
  const { 
    carbonScore, educationScore, povertyScore, 
    healthcareScore, forestScore, renewableScore, setScores 
  } = useSimulationStore();

  const sliders = [
    { id: "carbonScore", label: "Carbon Emissions", icon: Activity, value: carbonScore, color: "text-red-400" },
    { id: "forestScore", label: "Forest Coverage", icon: Leaf, value: forestScore, color: "text-emerald-400" },
    { id: "educationScore", label: "Education Level", icon: GraduationCap, value: educationScore, color: "text-blue-400" },
    { id: "povertyScore", label: "Poverty Rate", icon: DollarSign, value: povertyScore, color: "text-orange-400" },
    { id: "healthcareScore", label: "Healthcare Quality", icon: HeartPulse, value: healthcareScore, color: "text-pink-400" },
    { id: "renewableScore", label: "Renewable Energy", icon: Zap, value: renewableScore, color: "text-yellow-400" },
  ];

  const handleChange = (id: string, val: number) => {
    setScores({ [id]: val });
  };

  return (
    <GlassCard className="p-6 flex flex-col gap-6 shrink-0">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100 tracking-wider">AI SIMULATION PARAMETERS</h3>
      </div>
      
      <div className="flex flex-col gap-6">
        {sliders.map((s) => (
          <div key={s.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-sm font-semibold text-slate-300">{s.label}</span>
              </div>
              <span className="text-sm font-mono font-bold text-cyan-400">{(s.value * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={s.value} 
              onChange={(e) => handleChange(s.id, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
