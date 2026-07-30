"use client";

import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { GlassCard } from '../glass-card';
import { Activity } from 'lucide-react';

export function SdgRadarChart() {
  const [data, setData] = useState([
    { subject: 'PM2.5', value: 0 },
    { subject: 'PM10', value: 0 },
    { subject: 'CO (x0.1)', value: 0 },
    { subject: 'NO2', value: 0 },
    { subject: 'SO2', value: 0 },
    { subject: 'Ozone', value: 0 },
  ]);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const res = await fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-6.2088&longitude=106.8456&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone");
        const json = await res.json();
        
        if (mounted && json.current) {
          setData([
             { subject: 'PM2.5', value: json.current.pm2_5 },
             { subject: 'PM10', value: json.current.pm10 },
             { subject: 'CO (x0.1)', value: json.current.carbon_monoxide / 10 },
             { subject: 'NO2', value: json.current.nitrogen_dioxide },
             { subject: 'SO2', value: json.current.sulphur_dioxide },
             { subject: 'Ozone', value: json.current.ozone },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch AQI:", err);
      }
    }
    
    fetchData();
    // Poll every minute
    const interval = setInterval(fetchData, 60000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <GlassCard className="p-4 flex flex-col gap-2 h-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100 tracking-wider">REAL-TIME POLLUTANTS (JKT)</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Radar name="Level" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
