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

export function KpiGrid() {
  const { data: climateData, isLoading: climateLoading } = useQuery<ClimateResponse>({
    queryKey: ["climateData"],
    queryFn: () => fetchWithApiKey("/api/climate"),
  });

  const { data: cityData, isLoading: cityLoading } = useQuery<CityResponse>({
    queryKey: ["cityData"],
    queryFn: () => fetchWithApiKey("/api/city"),
  });

  const { disasterScenario } = useSimulationStore();
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

  // Base Targets
  let targetAqi = 42;
  let targetCo2 = 412;
  let targetEnergy = 68.4;
  let targetWater = 3200;

  // Base Status and Colors
  let aqiStatus = "Excellent"; let aqiColor = "text-emerald-400";
  let co2Status = "Greenhouse Index"; let co2Color = "text-emerald-400";
  let energyStatus = "98% capacity"; let energyColor = "text-cyan-400";
  let waterStatus = "100% capacity"; let waterColor = "text-slate-400";

  // SDG Reactivity
  if (!sdg13Active) { targetCo2 = 480; co2Status = "Warning"; co2Color = "text-yellow-500"; }
  if (!sdg7Active) { targetEnergy = 42.1; energyStatus = "Capacity Dropping"; energyColor = "text-yellow-500"; }
  if (!sdg6Active) { targetWater = 1100; waterStatus = "Shortage Detected"; waterColor = "text-yellow-500"; }

  // Disaster Reactivity (Overrides SDGs)
  if (disasterScenario === "pollution") {
    targetAqi = 210; aqiStatus = "Hazardous"; aqiColor = "text-red-500";
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
  const currentAqi = Math.max(0, targetAqi + fluct.aqi);
  const currentCo2 = Math.max(0, targetCo2 + fluct.co2);
  const currentEnergy = Math.max(0, Math.min(100, targetEnergy + fluct.energy));
  const currentWater = Math.max(0, targetWater + fluct.water);

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
