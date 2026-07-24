import { GlassCard } from "@/components/dashboard/glass-card";
import { CloudLightning } from "lucide-react";

export default function ClimatePage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <CloudLightning className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">AI Climate Predictions</h1>
        <p className="text-slate-400 text-sm">
          Deep learning climate hazard forecasting models, humidity trends, drought alerts, and AI mitigation workflow planning.
        </p>
      </GlassCard>
    </div>
  );
}
