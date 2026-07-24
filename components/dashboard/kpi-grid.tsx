"use client";

import React from "react";
import { GlassCard } from "./glass-card";
import { Wind, Leaf, Droplets, Zap } from "lucide-react";

export function KpiGrid() {
  const kpis = [
    {
      title: "Air Quality Index",
      value: "42 AQI",
      status: "Excellent",
      statusColor: "text-emerald-400",
      icon: Wind,
      percent: 85,
    },
    {
      title: "Carbon Emissions",
      value: "1.2t / day",
      status: "-12% vs last month",
      statusColor: "text-emerald-400",
      icon: Leaf,
      percent: 74,
    },
    {
      title: "Renewable Energy",
      value: "68.4%",
      status: "Solar/Wind Active",
      statusColor: "text-cyan-400",
      icon: Zap,
      percent: 68,
    },
    {
      title: "Water Consumption",
      value: "3,200 m³",
      status: "Within Normal Range",
      statusColor: "text-slate-400",
      icon: Droplets,
      percent: 54,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <GlassCard key={kpi.title} delay={idx * 0.1} className="py-4 px-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                {kpi.title}
              </span>
              <Icon className="h-4 w-4 text-cyan-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{kpi.value}</span>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className={`text-[10px] font-bold ${kpi.statusColor}`}>{kpi.status}</span>
              
              <div className="relative h-6 w-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-slate-800"
                    strokeWidth="2.5"
                    fill="transparent"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-cyan-500"
                    strokeWidth="2.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 9}
                    strokeDashoffset={2 * Math.PI * 9 * (1 - kpi.percent / 100)}
                  />
                </svg>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
