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
  const { getGlobalScore, sdgs } = useSdgStore();

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

  const isDisaster = disasterScenario !== "normal";
  const sdg6Active = sdgs.find(s => s.id === 6)?.isActive !== false; // Clean water
  const sdg7Active = sdgs.find(s => s.id === 7)?.isActive !== false; // Clean energy
  const sdg13Active = sdgs.find(s => s.id === 13)?.isActive !== false; // Climate action

  // Base Values
  let aqi = "42 AQI";
  let aqiStatus = "Excellent";
  let aqiColor = "text-emerald-400";
  let aqiPercent = 85;

  let co2 = climateData?.sensors?.co2Level || "412 ppm";
  let co2Status = "Greenhouse Index";
  let co2Color = "text-emerald-400";
  let co2Percent = 74;

  let energy = "68.4%";
  let energyStatus = cityData?.networks?.electricity || "98% capacity";
  let energyColor = "text-cyan-400";
  let energyPercent = 68;

  let water = "3,200 m³";
  let waterStatus = cityData?.networks?.water || "100% capacity";
  let waterColor = "text-slate-400";
  let waterPercent = 54;

  // SDG Reactivity
  if (!sdg13Active) {
    co2 = "480 ppm"; co2Status = "Warning"; co2Color = "text-yellow-500"; co2Percent = 40;
  }
  if (!sdg7Active) {
    energy = "42.1%"; energyStatus = "Capacity Dropping"; energyColor = "text-yellow-500"; energyPercent = 42;
  }
  if (!sdg6Active) {
    water = "1,100 m³"; waterStatus = "Shortage Detected"; waterColor = "text-yellow-500"; waterPercent = 20;
  }

  // Disaster Reactivity (Overrides SDGs)
  if (disasterScenario === "pollution") {
    aqi = "210 AQI"; aqiStatus = "Hazardous"; aqiColor = "text-red-500"; aqiPercent = 10;
  } else if (disasterScenario === "flood" || disasterScenario === "rainfall") {
    water = "9,800 m³"; waterStatus = "CRITICAL OVERFLOW"; waterColor = "text-red-500"; waterPercent = 100;
  } else if (disasterScenario === "earthquake") {
    energy = "12.4%"; energyStatus = "Grid Failure"; energyColor = "text-red-500"; energyPercent = 12;
    water = "400 m³"; waterStatus = "Pipe Bursts"; waterColor = "text-red-500"; waterPercent = 5;
  } else if (disasterScenario === "heatwave") {
    energy = "98.9%"; energyStatus = "Grid Overload"; energyColor = "text-red-500"; energyPercent = 99;
    water = "5,400 m³"; waterStatus = "High Demand"; waterColor = "text-orange-500"; waterPercent = 80;
  }

  const kpis = [
    {
      title: "Air Quality Index",
      value: aqi,
      status: aqiStatus,
      statusColor: aqiColor,
      icon: Wind,
      percent: aqiPercent,
    },
    {
      title: "Carbon Emissions",
      value: co2,
      status: co2Status,
      statusColor: co2Color,
      icon: Leaf,
      percent: co2Percent,
    },
    {
      title: "Renewable Energy",
      value: energy,
      status: energyStatus,
      statusColor: energyColor,
      icon: Zap,
      percent: energyPercent,
    },
    {
      title: "Water Consumption",
      value: water,
      status: waterStatus,
      statusColor: waterColor,
      icon: Droplets,
      percent: waterPercent,
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
