"use client";

import dynamic from "next/dynamic";

export const GlobalCanvas = dynamic(
  () => import("@/three/render/MainCanvas").then((mod) => mod.MainCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center relative overflow-hidden min-h-[450px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.15),transparent)] animate-pulse" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-t-cyan-500 border-r-cyan-500/30 border-b-cyan-500/30 border-l-cyan-500/30 animate-spin" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Initializing Engine...
          </p>
        </div>
      </div>
    ),
  }
);
