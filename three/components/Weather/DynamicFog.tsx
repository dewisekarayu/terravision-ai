import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { calculatePollution } from '../../simulation/algorithms';

const reusableColor = new THREE.Color();

export function DynamicFog() {
  const { scene } = useThree();
  const { weatherType, timeOfDay } = useWeatherStore();
  const { disasterScenario, carbonScore, forestScore } = useSimulationStore();

// Define color stops once outside the component to prevent massive garbage collection every frame
const SKY_STOPS = [
  { t: 0, c: new THREE.Color("#02020f") }, // Midnight
  { t: 5, c: new THREE.Color("#172554") }, // Pre-dawn
  { t: 6, c: new THREE.Color("#fb923c") }, // Sunrise
  { t: 7, c: new THREE.Color("#38bdf8") }, // 7 AM: Bright Blue
  { t: 16, c: new THREE.Color("#38bdf8") }, // 4 PM: Still Bright Blue (7-4 terang)
  { t: 16.5, c: new THREE.Color("#fde047") }, // 4:30 PM: Golden transition (prevents purple!)
  { t: 17, c: new THREE.Color("#f97316") }, // 5 PM: Orange starts
  { t: 18, c: new THREE.Color("#ea580c") }, // 6 PM: Deep Sunset Orange
  { t: 19, c: new THREE.Color("#1e1b4b") }, // 7 PM: Dusk indigo / Night
  { t: 24, c: new THREE.Color("#02020f") }, // Midnight
];

  // Real-time weather time state from global store is no longer read here directly in render
  // to avoid forcing React to re-render. We'll read it directly in useFrame.
  
  // Helper to get the sky color based on time of day
  const getSkyColor = (time: number) => {
    for (let i = 0; i < SKY_STOPS.length - 1; i++) {
      if (time >= SKY_STOPS[i].t && time <= SKY_STOPS[i + 1].t) {
        const progress = (time - SKY_STOPS[i].t) / (SKY_STOPS[i + 1].t - SKY_STOPS[i].t);
        const color = new THREE.Color();
        color.lerpColors(SKY_STOPS[i].c, SKY_STOPS[i + 1].c, progress);
        return color;
      }
    }
    return SKY_STOPS[0].c.clone();
  };

  useEffect(() => {
    // Initial setup with FogExp2 for more realistic, thick atmospheric scattering
    const baseColor = getSkyColor(timeOfDay);
    scene.fog = new THREE.FogExp2(baseColor, 0.002);
    scene.background = baseColor;
    
    return () => {
      scene.fog = null;
    };
  }, [scene, timeOfDay]);

  useFrame((state, delta) => {
    if (scene.fog instanceof THREE.FogExp2) {
      let targetDensity = 0.002; // Normal clear day density
      
      const skyColor = getSkyColor(timeOfDay);
      
      // Calculate how far the camera is from the center of the earth (radius ~50)
      const distance = state.camera.position.length();
      // If distance is > 80 (zoomed out to globe view), background becomes deep space.
      // If distance < 55 (zoomed into city), background becomes the atmospheric sky color.
      const spaceBlend = THREE.MathUtils.clamp((distance - 55) / 25, 0, 1);
      
      const spaceColor = new THREE.Color("#02020f"); // Deep space
      
      // Calculate final base color based on camera altitude
      const altitudeColor = new THREE.Color();
      altitudeColor.lerpColors(skyColor, spaceColor, spaceBlend);
      
      reusableColor.copy(altitudeColor);

      if (disasterScenario === 'heatwave') {
        // Hot reddish haze
        reusableColor.lerp(new THREE.Color("#2e0d04"), 1.0 - spaceBlend); // Only apply disaster haze near the ground
        targetDensity = 0.006;
      } else if (disasterScenario === 'pollution') {
        // Very thick, blurry, bright ash-gray smog
        reusableColor.lerp(new THREE.Color("#52525b"), 1.0 - spaceBlend); 
        targetDensity = 0.06; 
      } else {
        // AI Simulation: Real-time Pollution Overlay
        const pollution = calculatePollution(carbonScore, forestScore);
        
        if (pollution > 0) {
          // As pollution goes from 0 to 1, the sky gets more gray/brown and thicker
          const smogColor = new THREE.Color("#52525b"); // dark zinc
          // Mix smog based on pollution severity
          reusableColor.lerp(smogColor, pollution * 0.95 * (1.0 - spaceBlend));
          // Increase fog density heavily based on pollution
          targetDensity += pollution * 0.05; 
        }

        // Normal weather logic applies on top
        switch (weatherType) {
          case 'rain':
            reusableColor.lerp(new THREE.Color("#1e293b"), 1.0 - spaceBlend); 
            targetDensity = Math.max(targetDensity, 0.008);
            break;
          case 'storm':
            reusableColor.lerp(new THREE.Color("#0f172a"), 1.0 - spaceBlend); 
            targetDensity = Math.max(targetDensity, 0.015);
            break;
          case 'fog':
            reusableColor.lerp(new THREE.Color("#94a3b8"), 1.0 - spaceBlend); 
            targetDensity = Math.max(targetDensity, 0.02);
            break;
          default:
            break;
        }
      }

      // Density should also drop when zooming out so we can actually see the globe
      targetDensity = THREE.MathUtils.lerp(targetDensity, 0.0005, spaceBlend);

      if (disasterScenario === 'normal') {
        // Snap instantly back to normal
        scene.fog.color.copy(reusableColor);
        if (scene.background instanceof THREE.Color) {
          scene.background.copy(reusableColor);
        }
        scene.fog.density = targetDensity;
      } else {
        // Smoothly transition fog properties
        scene.fog.color.lerp(reusableColor, delta * 2);
        if (scene.background instanceof THREE.Color) {
          scene.background.lerp(reusableColor, delta * 2);
        }
        scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetDensity, delta * 2);
      }
    }
  });

  return null;
}
