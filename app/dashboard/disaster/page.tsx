import { GlassCard } from "@/components/dashboard/glass-card";
import { AlertTriangle } from "lucide-react";

export default function DisasterPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <AlertTriangle className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Disaster Simulation Hub</h1>
        <p className="text-slate-400 text-sm">
          Run municipal evacuation plans, configure rain water thresholds, monitor seismic sensor activity, and trigger warning sirens.
        </p>
      </GlassCard>
    </div>
  );
}
