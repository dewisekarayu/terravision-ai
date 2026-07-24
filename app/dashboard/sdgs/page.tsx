import { GlassCard } from "@/components/dashboard/glass-card";
import { Globe2 } from "lucide-react";

export default function SdgsPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <Globe2 className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">SDG Target Monitoring</h1>
        <p className="text-slate-400 text-sm">
          Tracking indicators and sustainability metrics for Sustainable Development Goal 9 (Infra), 11 (Cities), and 13 (Climate Action).
        </p>
      </GlassCard>
    </div>
  );
}
