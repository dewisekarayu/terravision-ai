"use client";

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulationStore } from '@/three/stores/useSimulationStore';
import { GlassCard } from '../glass-card';
import { Activity } from 'lucide-react';

export function CarbonTrendLine() {
  const { carbonScore } = useSimulationStore();
  const [data, setData] = useState<{ time: string, carbon: number }[]>([]);

  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    setData(prev => {
      const newData = [...prev, { time: timeStr, carbon: Math.round(carbonScore * 100) }];
      if (newData.length > 20) newData.shift();
      return newData;
    });
  }, [carbonScore]);

  return (
    <GlassCard className="p-4 flex flex-col gap-2 h-[250px]">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-red-400" />
        <h3 className="text-sm font-bold text-slate-100 tracking-wider">CARBON EMISSION TREND</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f87171' }}
            />
            <Line type="monotone" dataKey="carbon" stroke="#f87171" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
