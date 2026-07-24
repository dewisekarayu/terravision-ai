import { GlassCard } from "@/components/dashboard/glass-card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <Settings className="h-10 w-10 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">System Configurations</h1>
        <p className="text-slate-400 text-sm">
          Adjust WebGL rendering quality, configure Supabase connection links, set API endpoints, and manage user operational authorization.
        </p>
      </GlassCard>
    </div>
  );
}
