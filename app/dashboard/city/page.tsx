import { GlassCard } from "@/components/dashboard/glass-card";
import { Building2 } from "lucide-react";

export default function CityPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <Building2 className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Smart Infrastructure</h1>
        <p className="text-slate-400 text-sm">
          Detailed grid analysis, smart utility networks (electricity & water), IoT telemetry streams, and transport routing management.
        </p>
      </GlassCard>
    </div>
  );
}
