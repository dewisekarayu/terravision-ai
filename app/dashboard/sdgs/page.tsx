"use client";

import React from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Globe2, ShieldAlert, Cpu, CheckCircle2 } from "lucide-react";

export default function SdgsPage() {
  const sdgDetails = [
    {
      goal: "SDG 9",
      title: "Industry, Innovation & Infrastructure",
      subtitle: "Build resilient infrastructure, promote sustainable industrialization, and foster innovation.",
      icon: Cpu,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
      targets: [
        { label: "Upgrade infrastructure with clean, resource-efficient technologies.", progress: "82% Complete" },
        { label: "Ensure 100% stable internet & IoT communication node network coverage.", progress: "99% Complete" },
      ],
    },
    {
      goal: "SDG 11",
      title: "Sustainable Cities & Communities",
      subtitle: "Make cities inclusive, safe, resilient, and sustainable.",
      icon: Globe2,
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-950/10",
      targets: [
        { label: "Reduce adverse per capita environmental impact (waste & air quality).", progress: "64% Complete" },
        { label: "Provide universal access to safe, inclusive, green public spaces.", progress: "78% Complete" },
      ],
    },
    {
      goal: "SDG 13",
      title: "Climate Action",
      subtitle: "Take urgent action to combat climate change and its impacts.",
      icon: ShieldAlert,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/10",
      targets: [
        { label: "Strengthen resilience and adaptive capacity to climate-related hazards.", progress: "75% Complete" },
        { label: "Integrate carbon emission abatement measures into local planning.", progress: "68% Complete" },
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">SDG Impact Monitoring</h1>
        <p className="text-xs text-slate-400">
          Measure municipal performance metrics against UN Sustainable Development Goals (SDG 9, 11, and 13).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sdgDetails.map((sdg, idx) => {
          const Icon = sdg.icon;
          return (
            <GlassCard key={idx} className={`flex flex-col gap-4 border ${sdg.color}`}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-80">
                    {sdg.goal} Target
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">{sdg.title}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-normal">{sdg.subtitle}</p>

              <div className="border-t border-slate-800/60 pt-3 flex flex-col gap-3 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Key Metrics & Actions:
                </p>
                {sdg.targets.map((t, tIdx) => (
                  <div key={tIdx} className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 flex flex-col gap-1">
                    <p className="text-[10px] text-slate-300 leading-relaxed flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{t.label}</span>
                    </p>
                    <div className="flex justify-between items-center text-[9px] font-bold text-cyan-400 mt-1 pl-5">
                      <span>PROGRESS</span>
                      <span>{t.progress}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
