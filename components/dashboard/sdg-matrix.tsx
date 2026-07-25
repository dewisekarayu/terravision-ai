"use client";

import React from "react";
import { useSdgStore } from "@/store/useSdgStore";
import { cn } from "@/lib/utils";

export function SdgMatrix() {
  const { sdgs, toggleSdg } = useSdgStore();

  return (
    <div className="absolute bottom-6 left-[290px] right-[460px] z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-center pointer-events-auto">
      <div className="flex flex-wrap justify-center gap-2">
        {sdgs.map((sdg) => (
          <button
            key={sdg.id}
            onClick={() => toggleSdg(sdg.id)}
            style={{ 
              backgroundColor: sdg.isActive ? sdg.color : "transparent",
              borderColor: sdg.color,
            }}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 group relative",
              !sdg.isActive && "hover:bg-white/10 opacity-60 hover:opacity-100",
              sdg.isActive && "shadow-[0_0_20px_rgba(0,0,0,0.6)] scale-105 z-10"
            )}
          >
            <span 
              className={cn(
                "text-sm font-black", 
                sdg.isActive ? "text-white" : "text-white drop-shadow-md"
              )}
            >
              {sdg.id}
            </span>
            
            {/* Tooltip (Fixed to prevent clipping) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 hidden group-hover:block w-48 bg-slate-950/95 backdrop-blur-md text-white text-xs p-3 rounded-xl border border-slate-700 pointer-events-none shadow-2xl z-[100]">
              <p className="font-bold text-sm mb-1" style={{ color: sdg.color }}>{sdg.title}</p>
              <p className="text-slate-300 font-medium">Impact Score: {sdg.score}%</p>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
