"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  CloudLightning,
  AlertTriangle,
  BarChart3,
  Globe2,
  Settings,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/city", label: "Smart Infrastructure", icon: Building2 },
  { href: "/dashboard/climate", label: "AI Climate", icon: CloudLightning },
  { href: "/dashboard/disaster", label: "Disaster Sim", icon: AlertTriangle },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/sdgs", label: "SDG Progress", icon: Globe2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-64 glass-panel rounded-2xl flex flex-col justify-between py-6 px-4 z-40">
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white shadow-lg">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wider bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TERRAVISION
            </h1>
            <span className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase">
              AI Digital Twin
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200 cursor-pointer z-10",
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-950/40 to-slate-900/40 border border-cyan-500/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-800/40 pt-4 px-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-xs font-bold text-cyan-400">TV</span>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">Municipal Operations</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Platform Connected
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
