"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '../glass-card';
import { Activity } from 'lucide-react';

export function CarbonTrendLine() {
  const [data, setData] = useState<{ time: string, pm25: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      try {
        const res = await fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-6.2088&longitude=106.8456&hourly=pm2_5&past_days=1&forecast_days=1");
        const json = await res.json();
        
        if (mounted && json.hourly && json.hourly.time) {
          const times: string[] = json.hourly.time;
          const pm25s: number[] = json.hourly.pm2_5;
          
          let currentHourIndex = times.findIndex(t => new Date(t).getTime() > Date.now());
          if (currentHourIndex === -1) currentHourIndex = times.length;
          
          const startIndex = Math.max(0, currentHourIndex - 24);
          
          const chartData = [];
          for (let i = startIndex; i < startIndex + 24; i++) {
            if (times[i] && pm25s[i] !== null) {
              const d = new Date(times[i]);
              const timeStr = `${d.getHours().toString().padStart(2, '0')}:00`;
              chartData.push({ time: timeStr, pm25: pm25s[i] });
            }
          }
          setData(chartData);
        }
      } catch (err) {
        console.error("Failed to fetch PM2.5 trend:", err);
      }
    }
    
    fetchData();
  }, []);

  return (
    <GlassCard className="p-4 flex flex-col gap-2 h-[250px]">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-red-400" />
        <h3 className="text-sm font-bold text-slate-100 tracking-wider">24H PM2.5 TREND (JKT)</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f87171' }}
            />
            <Line type="monotone" dataKey="pm25" stroke="#f87171" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
