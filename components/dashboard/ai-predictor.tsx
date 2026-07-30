"use client";

import React from "react";
import { GlassCard } from "./glass-card";
import { BrainCircuit, ShieldCheck, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";


export function AiPredictor() {
  const { data: realTimeData, isLoading } = useQuery({
    queryKey: ["realTimePredictionData"],
    queryFn: async () => {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch("https://api.open-meteo.com/v1/forecast?latitude=-6.2088&longitude=106.8456&current=temperature_2m,precipitation,weather_code"),
        fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-6.2088&longitude=106.8456&current=european_aqi")
      ]);
      const weather = await weatherRes.json();
      const aqi = await aqiRes.json();
      return { weather: weather.current, aqi: aqi.current };
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <GlassCard className="flex items-center justify-center p-6 min-h-[200px]">
        <Loader2 className="h-6 w-6 text-cyan-500 animate-spin" />
      </GlassCard>
    );
  }

  // Calculate real-world risk based on actual data
  const temp = realTimeData?.weather?.temperature_2m || 30;
  const precip = realTimeData?.weather?.precipitation || 0;
  const aqi = realTimeData?.aqi?.european_aqi || 50;

  // Simple heuristic for realistic probabilities
  const floodRisk = Math.min(100, Math.max(5, precip * 10 + 5)); // 0mm = 5%, 10mm = 105%
  const heatRisk = Math.min(100, Math.max(5, (temp - 30) * 15 + 10)); // 30C = 10%, 36C = 100%
  const polRisk = Math.min(100, Math.max(5, (aqi / 150) * 100)); // 150 AQI = 100%

  const floodProb = `${Math.round(floodRisk)}%`;
  const heatwaveRisk = `${Math.round(heatRisk)}%`;
  const pollutionTrend = `${Math.round(polRisk)}%`;
  
  // Determine biggest real threat for action plan
  let actionPlan = "Normal operations. Monitor localized drainage in low-lying areas.";
  if (floodRisk > 70) actionPlan = "High precipitation detected. Activate flood barriers in Pluit and warn citizens near Ciliwung river.";
  else if (heatRisk > 70) actionPlan = "Heatwave conditions detected. Activate cooling centers and issue public health warnings for vulnerable groups.";
  else if (polRisk > 70) actionPlan = "Hazardous air quality. Restrict heavy vehicle traffic in central district and advise indoor activities.";

  const predictions = [
    { hazard: "Flood Prob.", conf: floodProb, level: floodRisk > 60 ? "High Alert" : "Normal", color: floodRisk > 60 ? "text-amber-400" : "text-emerald-400" },
    { hazard: "Heatwave Risk", conf: heatwaveRisk, level: heatRisk > 60 ? "High Risk" : "Low Risk", color: heatRisk > 60 ? "text-red-400" : "text-emerald-400" },
    { hazard: "Air Pollution", conf: pollutionTrend, level: polRisk > 60 ? "Hazardous" : polRisk > 30 ? "Moderate" : "Good", color: polRisk > 60 ? "text-red-400" : polRisk > 30 ? "text-cyan-400" : "text-emerald-400" },
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
