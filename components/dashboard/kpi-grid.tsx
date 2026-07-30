"use client";

import React from "react";
import { GlassCard } from "./glass-card";
import { Wind, Leaf, Droplets, Zap, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchWithApiKey } from "@/lib/fetcher";
import { useSimulationStore } from "@/three/stores/useSimulationStore";
import { useSdgStore } from "@/store/useSdgStore";

interface ClimateResponse {
  sensors: {
    co2Level: string;
    temperature: string;
    humidity: string;
  };
}

interface CityResponse {
  networks: {
    electricity: string;
    water: string;
  };
}

import { calculatePollution } from "@/three/simulation/algorithms";

export function KpiGrid() {
  const { data: climateData, isLoading: climateLoading } = useQuery<ClimateResponse>({
    queryKey: ["climateData"],
    queryFn: () => fetchWithApiKey("/api/climate"),
  });

  const { data: cityData, isLoading: cityLoading } = useQuery<CityResponse>({
    queryKey: ["cityData"],
    queryFn: () => fetchWithApiKey("/api/city"),
  });

  const { disasterScenario, carbonScore, forestScore, renewableScore } = useSimulationStore();
  const { sdgs } = useSdgStore();
  
  // Real-time AI Sensor Fluctuations
  const [fluct, setFluct] = React.useState({ aqi: 0, co2: 0, energy: 0, water: 0 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFluct({
        aqi: Math.floor(Math.random() * 5) - 2,
        co2: Math.floor(Math.random() * 9) - 4,
        energy: (Math.random() * 0.8) - 0.4,
        water: Math.floor(Math.random() * 40) - 20,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (climateLoading || cityLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-[92px]">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="flex items-center justify-center py-4 px-5">
            <Loader2 className="h-5 w-5 text-cyan-500 animate-spin" />
          </GlassCard>
        ))}
      </div>
    );
  }

  const sdg6Active = sdgs.find(s => s.id === 6)?.isActive !== false; // Clean water
  const sdg7Active = sdgs.find(s => s.id === 7)?.isActive !== false; // Clean energy
  const sdg13Active = sdgs.find(s => s.id === 13)?.isActive !== false; // Climate action

  // AI Simulation Reactivity
  const pollution = calculatePollution(carbonScore, forestScore);
  
  // Base Targets derived from AI sliders
  let targetAqi = 15 + pollution * 285; // 15 to 300
  let targetCo2 = 350 + carbonScore * 500; // 350 to 850
  let targetEnergy = renewableScore * 100; // 0 to 100%
  let targetWater = 3800 - forestScore * 1000; // 2800 to 3800

  // Dynamic Status and Colors
  let aqiStatus = targetAqi < 50 ? "Excellent" : targetAqi < 150 ? "Moderate" : "Hazardous";
  let aqiColor = targetAqi < 50 ? "text-emerald-400" : targetAqi < 150 ? "text-yellow-500" : "text-red-500";

  let co2Status = targetCo2 < 450 ? "Optimal" : targetCo2 < 600 ? "Warning" : "Critical";
  let co2Color = targetCo2 < 450 ? "text-emerald-400" : targetCo2 < 600 ? "text-yellow-500" : "text-red-500";

  let energyStatus = targetEnergy > 80 ? "Optimal" : targetEnergy > 40 ? "Stable" : "Grid Strain";
  let energyColor = targetEnergy > 80 ? "text-cyan-400" : targetEnergy > 40 ? "text-amber-400" : "text-red-500";

  let waterStatus = targetWater < 3000 ? "Efficient" : "High Demand";
  let waterColor = targetWater < 3000 ? "text-blue-400" : "text-slate-400";

  // SDG Reactivity
  if (!sdg13Active) { targetCo2 += 100; co2Status = "Warning"; co2Color = "text-yellow-500"; }
  if (!sdg7Active) { targetEnergy -= 30; energyStatus = "Capacity Dropping"; energyColor = "text-yellow-500"; }
  if (!sdg6Active) { targetWater += 800; waterStatus = "Shortage Detected"; waterColor = "text-yellow-500"; }

  // Disaster Reactivity (Overrides SDGs & AI)
  if (disasterScenario === "pollution") {
    targetAqi = 280; aqiStatus = "Hazardous"; aqiColor = "text-red-500";
    targetCo2 = 800; co2Status = "Critical"; co2Color = "text-red-500";
  } else if (disasterScenario === "flood" || disasterScenario === "rainfall") {
    targetWater = 9800; waterStatus = "CRITICAL OVERFLOW"; waterColor = "text-red-500";
  } else if (disasterScenario === "earthquake") {
    targetEnergy = 12.4; energyStatus = "Grid Failure"; energyColor = "text-red-500";
    targetWater = 400; waterStatus = "Pipe Bursts"; waterColor = "text-red-500";
  } else if (disasterScenario === "heatwave") {
    targetEnergy = 98.9; energyStatus = "Grid Overload"; energyColor = "text-red-500";
    targetWater = 5400; waterStatus = "High Demand"; waterColor = "text-orange-500";
  }

  // Apply Live Fluctuations
  const currentAqi = Math.round(Math.max(0, targetAqi + fluct.aqi));
  const currentCo2 = Math.round(Math.max(0, targetCo2 + fluct.co2));
  const currentEnergy = Math.max(0, Math.min(100, targetEnergy + fluct.energy));
  const currentWater = Math.round(Math.max(0, targetWater + fluct.water));

  const kpis = [
    {
      title: "Air Quality Index",
      value: `${currentAqi} AQI`,
      status: aqiStatus,
      statusColor: aqiColor,
      icon: Wind,
      percent: Math.max(0, Math.min(100, 100 - (currentAqi / 300) * 100)),
    },
    {
      title: "Carbon Emissions",
      value: `${currentCo2} ppm`,
      status: co2Status,
      statusColor: co2Color,
      icon: Leaf,
      percent: Math.max(0, Math.min(100, 100 - (currentCo2 / 800) * 100)),
    },
    {
      title: "Renewable Energy",
      value: `${currentEnergy.toFixed(1)}%`,
      status: energyStatus,
      statusColor: energyColor,
      icon: Zap,
      percent: currentEnergy,
    },
    {
      title: "Water Consumption",
      value: `${currentWater.toLocaleString('en-US')} m³`,
      status: waterStatus,
      statusColor: waterColor,
      icon: Droplets,
      percent: Math.max(0, Math.min(100, (currentWater / 10000) * 100)),
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
