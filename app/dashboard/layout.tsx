import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { GlobalCanvas } from "@/components/layout/global-canvas";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      {/* Layer 0: Full Screen 3D Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <GlobalCanvas />
      </div>

      {/* Layer 1: HUD UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Dashboard viewport container */}
        <div className="flex-1 flex flex-col pl-[288px] pr-6 py-4 h-full overflow-hidden gap-4">
          <div className="pointer-events-auto w-full">
            <Header />
          </div>

          <main className="flex-1 relative flex flex-col min-h-0 overflow-hidden pointer-events-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
