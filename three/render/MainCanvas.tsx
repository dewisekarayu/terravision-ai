"use client";

import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, PerformanceMonitor, Stats } from "@react-three/drei";
import { useWeatherStore } from "../stores/useWeatherStore";
import { usePerformanceStore } from "../stores/usePerformanceStore";
import { EarthMesh } from "../components/Earth/EarthMesh";
import { CameraController } from "../components/Cinematic/CameraController";
import { WASDControls } from "../components/Cinematic/WASDControls";
import { Effects } from "../postprocessing/Effects";
import { PrecipitationSystem } from "../components/Weather/PrecipitationSystem";
import { DynamicFog } from "../components/Weather/DynamicFog";
import { FloodWater } from "../components/Weather/FloodWater";

// Define color stops once outside the component
const SUN_STOPS = [
  { t: 0, c: new THREE.Color("#3b82f6") }, // Midnight moon (blue)
  { t: 5, c: new THREE.Color("#60a5fa") }, // Pre-dawn moon
  { t: 6, c: new THREE.Color("#fb923c") }, // Sunrise (orange)
  { t: 7, c: new THREE.Color("#ffffff") }, // 7 AM: Bright Sun
  { t: 16, c: new THREE.Color("#ffffff") }, // 4 PM: Still Bright Sun (7-4 terang)
  { t: 16.5, c: new THREE.Color("#fef08a") }, // 4:30 PM: Golden yellow transition
  { t: 17, c: new THREE.Color("#fb923c") }, // 5 PM: Orange
  { t: 18, c: new THREE.Color("#ea580c") }, // 6 PM: Deep Sunset Orange
  { t: 19, c: new THREE.Color("#60a5fa") }, // 7 PM: Dusk moon
  { t: 24, c: new THREE.Color("#3b82f6") }, // Midnight moon
];

// Helper to get the sun color based on time of day using multiple realistic stops
const getSunColor = (time: number) => {
  for (let i = 0; i < SUN_STOPS.length - 1; i++) {
    if (time >= SUN_STOPS[i].t && time <= SUN_STOPS[i + 1].t) {
      const progress = (time - SUN_STOPS[i].t) / (SUN_STOPS[i + 1].t - SUN_STOPS[i].t);
      const color = new THREE.Color();
      color.lerpColors(SUN_STOPS[i].c, SUN_STOPS[i + 1].c, progress);
      return color;
    }
  }
  return SUN_STOPS[0].c.clone();
};

export function MainCanvas() {
  const controlsRef = React.useRef(null);
  const { timeOfDay } = useWeatherStore();
  const { setDpr, setFps, setLowEnd, dpr } = usePerformanceStore();

  // Calculate sun position based on timeOfDay (hour 0-23)
  // Shift by -PI/2 so 0 (midnight) is at bottom (-Y), 12 (noon) is at top (+Y)
  const angle = (timeOfDay / 24) * Math.PI * 2 - Math.PI / 2;
  const radius = 100;
  const sunX = Math.cos(angle) * radius;
  const sunY = Math.sin(angle) * radius;
  const sunZ = 20;

  // We want shadows to always cast from above, so if it's night (sunY < 0), 
  // we invert the Y and X to simulate a moon rising opposite the sun.
  const isNight = sunY < 0;
  const lightX = isNight ? -sunX : sunX;
  const lightY = isNight ? -sunY : sunY;
  
  // Smoothly calculate light intensity based on height in the sky (lightY goes from 0 to 100)
  const heightFactor = Math.max(0, lightY / 100); 
  
  let sunIntensity = 0;
  let ambientIntensity = 0;
  let sunColor = new THREE.Color();
  let ambientColor = new THREE.Color();

  sunColor.copy(getSunColor(timeOfDay));

  if (!isNight) {
    // Daytime
    // Base intensity is much higher now so it's never too dark, peaking at noon
    sunIntensity = 2.0 + heightFactor * 3.0; // 2.0 at dawn/dusk, 5.0 at noon
    ambientIntensity = 0.8 + heightFactor * 0.4; // 0.8 to 1.2
    ambientColor.set("#E0F2FE"); // Bright sky reflection
  } else {
    // Nighttime (Moonlight)
    // Increased night time brightness so it's not pitch black
    sunIntensity = 0.3 + heightFactor * 0.7; // 0.3 at dusk/dawn, 1.0 at midnight
    ambientIntensity = 0.4; // Prevents shadows from being completely black
    ambientColor.set("#1E1B4B"); // Deep dark ambient
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800/40 bg-slate-950/80">
      <Canvas
        shadows
        dpr={Math.min(dpr, 1.5)}
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(1.5)}
          onDecline={() => {
            setDpr(1);
            setLowEnd(true);
          }}
          onChange={({ factor }) => setFps(Math.round(60 * factor))}
        >
          <PerspectiveCamera makeDefault position={[50, 45, 50]} fov={45} />
          
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={10}
            maxDistance={120}
            enableZoom={true}
            enablePan={false}
            mouseButtons={{
              LEFT: THREE.MOUSE.NONE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.ROTATE
            }}
          />

          <ambientLight intensity={ambientIntensity} color={ambientColor} />

          <directionalLight
            castShadow
            position={[lightX, lightY, sunZ]}
            intensity={sunIntensity}
            color={sunColor}
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
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
          <WASDControls controlsRef={controlsRef} />
          <DynamicFog />
          <PrecipitationSystem />
          <FloodWater />
          
          {/* Enable stats to monitor performance in dev mode */}
          {process.env.NODE_ENV === "development" && <Stats className="!absolute !right-0 !left-auto !scale-[0.6] !origin-top-right !opacity-50 pointer-events-none mt-2 mr-2" />}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
