"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useStore } from "@/store/use-store";
import { useMounted } from "@/hooks/use-mounted";
import { DigitalTwin } from "../city/digital-twin";

export function CityCanvas() {
  const mounted = useMounted();
  const { timeOfDay } = useStore();

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-950 flex items-center justify-center relative overflow-hidden rounded-2xl border border-slate-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.15),transparent)] animate-pulse" />
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-t-cyan-500 border-r-cyan-500/30 border-b-cyan-500/30 border-l-cyan-500/30 animate-spin" />
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Initializing Engine...
          </p>
        </div>
      </div>
    );
  }

  // Calculate sun position based on timeOfDay (hour 0-23)
  const angle = (timeOfDay / 24) * Math.PI * 2 + Math.PI; // Offset to start midnight at bottom
  const radius = 100;
  const sunX = Math.cos(angle) * radius;
  const sunY = Math.sin(angle) * radius;
  const sunZ = 20; // Slight depth angle

  const isDay = timeOfDay >= 6 && timeOfDay < 18;
  const sunColor = isDay ? "#FFF3D6" : "#7A8CFF";
  const sunIntensity = isDay ? 1.5 : 0.2;
  const ambientIntensity = isDay ? 0.4 : 0.08;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-950/80">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        {/* Camera config */}
        <PerspectiveCamera makeDefault position={[50, 45, 50]} fov={45} />
        
        {/* Orbit controls with zoom boundaries */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.1} // Limit under horizon view
          minDistance={10}
          maxDistance={120}
        />

        {/* Ambient lighting */}
        <ambientLight intensity={ambientIntensity} color={isDay ? "#E0F2FE" : "#1E1B4B"} />

        {/* Directional Sun/Moon light */}
        <directionalLight
          castShadow
          position={[sunX, sunY, sunZ]}
          intensity={sunIntensity}
          color={sunColor}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={250}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
          shadow-bias={-0.0005}
        />

        {/* Dynamic Digital Twin City */}
        <DigitalTwin />

        {/* Grid helper */}
        <gridHelper args={[200, 100, "#1e293b", "#0f172a"]} position={[0, -0.01, 0]} />

        {/* Atmosphere/Fog */}
        <fog attach="fog" args={[isDay ? "#020617" : "#02020f", 80, 180]} />
      </Canvas>
    </div>
  );
}
