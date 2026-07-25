"use client";

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useSimulationStore } from '@/three/stores/useSimulationStore';
import { GlassCard } from '../glass-card';
import { Activity } from 'lucide-react';

export function SdgRadarChart() {
  const { carbonScore, educationScore, povertyScore, healthcareScore, forestScore, renewableScore } = useSimulationStore();

  const data = [
    { subject: 'Carbon', value: Math.round((1 - carbonScore) * 100) }, // Inverted: lower carbon = higher score
    { subject: 'Education', value: Math.round(educationScore * 100) },
    { subject: 'Health', value: Math.round(healthcareScore * 100) },
    { subject: 'Poverty', value: Math.round((1 - povertyScore) * 100) },
    { subject: 'Forest', value: Math.round(forestScore * 100) },
    { subject: 'Energy', value: Math.round(renewableScore * 100) },
  ];

  return (
    <GlassCard className="p-4 flex flex-col gap-2 h-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100 tracking-wider">SDG BALANCE</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Radar name="Country" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
