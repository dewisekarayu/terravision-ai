"use client";

import React from "react";
import { GlassCard } from "./glass-card";
import { BrainCircuit, ShieldCheck, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithApiKey } from "@/lib/fetcher";

interface AiResponse {
  predictions: {
    flood: number;
    heatwave: number;
    pollution: number;
  };
  mitigation: string;
}

export function AiPredictor() {
  const { data: aiData, isLoading } = useQuery<AiResponse>({
    queryKey: ["aiPredictions"],
    queryFn: () => fetchWithApiKey("/api/ai"),
  });

  if (isLoading) {
    return (
      <GlassCard className="flex items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-6 w-6 text-cyan-500 animate-spin" />
      </GlassCard>
    );
  }

  const floodProb = aiData ? `${Math.round(aiData.predictions.flood * 100)}%` : "74%";
  const heatwaveRisk = aiData ? `${Math.round(aiData.predictions.heatwave * 100)}%` : "28%";
  const pollutionTrend = aiData ? `${Math.round(aiData.predictions.pollution * 100)}%` : "65%";
  const actionPlan = aiData?.mitigation || "Activate flood barriers in Lowlands Zone-B; redirect traffic routing to elevated highway sections.";

  const predictions = [
    { hazard: "Flood Prob.", conf: floodProb, level: aiData && aiData.predictions.flood > 0.5 ? "High Alert" : "Normal", color: "text-amber-400" },
    { hazard: "Heatwave Risk", conf: heatwaveRisk, level: "Low Risk", color: "text-emerald-400" },
    { hazard: "Air Pollution", conf: pollutionTrend, level: "Moderate", color: "text-cyan-400" },
  ];

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-cyan-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-200">AI CLIMATE PREDICTION</h3>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            Neural Forecast Engine
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {predictions.map((pred) => (
          <div key={pred.hazard} className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-300">{pred.hazard}</p>
              <p className={`text-[10px] font-bold ${pred.color}`}>{pred.level}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">{pred.conf}</span>
              <span className="block text-[8px] font-semibold text-slate-500 uppercase tracking-wider">
                CONFIDENCE
              </span>
            </div>
          </div>
        ))}

        <div className="border-t border-slate-800/60 pt-3">
          <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase mb-2">
            Recommended Action Plan:
          </p>
          <div className="flex items-start gap-2 bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-2.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-300 leading-normal">
              {actionPlan}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
