import { GlassCard } from "@/components/dashboard/glass-card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <BarChart3 className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Advanced Data Analytics</h1>
        <p className="text-slate-400 text-sm">
          Consolidated Recharts logs mapping resource usage, population flow density, recycling rates, and energy telemetry trends.
        </p>
      </GlassCard>
    </div>
  );
}
