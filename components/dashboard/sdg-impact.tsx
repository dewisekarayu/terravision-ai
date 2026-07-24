"use client";

import React from "react";
import { GlassCard } from "./glass-card";
import { Globe2 } from "lucide-react";

export function SdgImpact() {
  const sdgs = [
    {
      id: "SDG 9",
      title: "Industry & Infra",
      target: "Resilient Smart Grid",
      achieved: "82%",
      color: "border-emerald-500/20 text-emerald-400 bg-emerald-950/10",
      desc: "Integrate renewable solar/wind power hubs."
    },
    {
      id: "SDG 11",
      title: "Sustainable Cities",
      target: "Green Coverage Index",
      achieved: "64%",
      color: "border-cyan-500/20 text-cyan-400 bg-cyan-950/10",
      desc: "Ensure 30%+ urban green areas."
    },
    {
      id: "SDG 13",
      title: "Climate Action",
      target: "CO2 Abatement Rate",
      achieved: "75%",
      color: "border-indigo-500/20 text-indigo-400 bg-indigo-950/10",
      desc: "Reduce operational municipal carbon emissions."
    }
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Globe2 className="h-5 w-5 text-emerald-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-200">SDG IMPACT MONITOR</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Goal Index Metrics
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sdgs.map((sdg) => (
          <div key={sdg.id} className={`border rounded-xl p-3 flex flex-col gap-1.5 ${sdg.color}`}>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-slate-900/60 px-2 py-0.5 rounded-full">
                {sdg.id}
              </span>
              <span className="text-xs font-bold">{sdg.title}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-semibold text-slate-300">{sdg.target}</span>
              <span className="text-sm font-black">{sdg.achieved} Target</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-normal">{sdg.desc}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
