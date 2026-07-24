"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/dashboard/glass-card";
import { Shield, HardDrive, Sliders } from "lucide-react";

export default function SettingsPage() {
  const [renderQuality, setRenderQuality] = useState("high");
  const [apiKey, setApiKey] = useState("terravision-key-9");

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full max-h-full pb-4 scrollbar-thin">
      <div>
        <h1 className="text-xl font-bold text-white tracking-wide">System Configurations</h1>
        <p className="text-xs text-slate-400">
          Adjust visual rendering qualities, API credentials, and database synchronizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WebGL config */}
        <GlassCard className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">WebGL Graphic Settings</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Rendering Presets</p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            <label className="text-slate-400 font-semibold uppercase text-[10px]">Select Quality Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {["low", "medium", "high"].map((q) => (
                <button
                  key={q}
                  onClick={() => setRenderQuality(q)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    renderQuality === q
                      ? "bg-slate-800 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              "High" utilizes full shadow-mapping resolutions and post-processing filters. Reduce profile to "Medium" or "Low" if you experience stuttering.
            </p>
          </div>
        </GlassCard>

        {/* API Credentials */}
        <GlassCard className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-200">Access Credentials</h3>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Router Authentication</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Active API key</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              This API key must match the valid credential (`terravision-key-9`) when issuing requests to the backend endpoints (`/api/*`).
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Database syncing */}
      <GlassCard className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200">Supabase Database Synchronization</h3>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-4 text-xs flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-300">Synchronize Telemetries status</span>
            <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase animate-pulse">
              Active Sync
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Realtime database syncing retrieves hourly readings for air indices, rainfall precipitation, and structural stress loads. Ensure your supabase credentials are set up in your `.env.local` file to start storing persistent logs.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
