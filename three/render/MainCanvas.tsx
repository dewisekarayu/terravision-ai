"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, PerformanceMonitor, Stats } from "@react-three/drei";
import { useWeatherStore } from "../stores/useWeatherStore";
import { usePerformanceStore } from "../stores/usePerformanceStore";
import { EarthMesh } from "../components/Earth/EarthMesh";
import { CameraController } from "../components/Cinematic/CameraController";
import { Effects } from "../postprocessing/Effects";
import { PrecipitationSystem } from "../components/Weather/PrecipitationSystem";
import { DynamicFog } from "../components/Weather/DynamicFog";
import { FloodWater } from "../components/Weather/FloodWater";

export function MainCanvas() {
  const { timeOfDay } = useWeatherStore();
  const { setDpr, setFps, setLowEnd, dpr } = usePerformanceStore();

  // Calculate sun position based on timeOfDay (hour 0-23)
  const angle = (timeOfDay / 24) * Math.PI * 2 + Math.PI; // Offset to start midnight at bottom
  const radius = 100;
  const sunX = Math.cos(angle) * radius;
  const sunY = Math.sin(angle) * radius;
  const sunZ = 20;

  const isDay = timeOfDay >= 6 && timeOfDay < 18;
  const sunColor = isDay ? "#FFF3D6" : "#7A8CFF";
  const sunIntensity = isDay ? 2.0 : 0.5;
  const ambientIntensity = isDay ? 0.6 : 0.25;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-950/80">
      <Canvas
        shadows
        dpr={dpr}
        gl={{ 
          antialias: true, 
          alpha: false, 
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => {
            setDpr(1);
            setLowEnd(true);
          }}
          onChange={({ factor }) => setFps(Math.round(60 * factor))}
        >
          <PerspectiveCamera makeDefault position={[50, 45, 50]} fov={45} />
          
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={120}
          />

          <ambientLight intensity={ambientIntensity} color={isDay ? "#E0F2FE" : "#1E1B4B"} />

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

          <Suspense fallback={null}>
            <EarthMesh />
            <Effects />
          </Suspense>

          <CameraController />
          <DynamicFog />
          <PrecipitationSystem />
          <FloodWater />
          
          {/* Enable stats to monitor performance in dev mode */}
          {process.env.NODE_ENV === "development" && <Stats className="!absolute !right-0 !left-auto" />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
