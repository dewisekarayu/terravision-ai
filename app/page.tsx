"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background overlays */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-950/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl text-center flex flex-col items-center gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-white shadow-xl shadow-cyan-500/10"
        >
          <Shield className="h-8 w-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            TERRAVISION AI
          </h1>
          <p className="text-sm md:text-lg text-cyan-400 font-bold tracking-widest uppercase">
            Smart City Digital Twin Operations
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-400 max-w-xl text-sm md:text-base leading-relaxed"
        >
          An enterprise monitoring and simulation suite for smart city grids, environmental
          predictive forecasting, and SDG impact planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 my-4"
        >
          {["SDG 9: Infrastructure", "SDG 11: Sustainable Cities", "SDG 13: Climate Action"].map(
            (sdg, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-300"
              >
                {sdg}
              </span>
            )
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-30"
        >
          <a
            href="/dashboard/overview"
            className="group flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer relative z-30"
          >
            <span>LAUNCH PLATFORM</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-6 text-[10px] text-slate-600 font-semibold tracking-widest uppercase">
        TERRAVISION PLATFORM © 2026 // SECURE DIGITAL TWIN INSTANCE
      </div>
    </div>
  );
}
