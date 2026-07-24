import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-950/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Dashboard viewport container */}
      <div className="flex-1 flex flex-col pl-[288px] pr-6 py-4 min-h-screen gap-4">
        <Header />

        <main className="flex-1 relative flex flex-col min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
