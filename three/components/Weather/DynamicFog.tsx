import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useSimulationStore } from '../../stores/useSimulationStore';

const reusableColor = new THREE.Color();

export function DynamicFog() {
  const { scene } = useThree();
  const { weatherType, timeOfDay } = useWeatherStore();
  const { disasterScenario } = useSimulationStore();

  useEffect(() => {
    // Initial setup with FogExp2 for more realistic, thick atmospheric scattering
    const isDay = timeOfDay >= 6 && timeOfDay <= 18;
    const baseColor = isDay ? "#020617" : "#02020f";
    scene.fog = new THREE.FogExp2(baseColor, 0.002);
    scene.background = new THREE.Color(baseColor);
    
    return () => {
      scene.fog = null;
    };
  }, [scene, timeOfDay]);

  useFrame((_, delta) => {
    if (scene.fog instanceof THREE.FogExp2) {
      const isDay = timeOfDay >= 6 && timeOfDay <= 18;
      
      let targetDensity = 0.002; // Normal clear day density
      reusableColor.set(isDay ? "#020617" : "#02020f");

      if (disasterScenario === 'heatwave') {
        // Hot reddish haze
        reusableColor.set("#2e0d04");
        targetDensity = 0.006;
      } else if (disasterScenario === 'pollution') {
        // Very thick, blurry, bright ash-gray smog so it contrasts and creates a hazy look
        reusableColor.set("#52525b"); // zinc-600 (lighter gray for thick smoke)
        targetDensity = 0.06; // Extremely dense fog! Swallows buildings completely.
      } else {
        // Normal weather logic
        switch (weatherType) {
          case 'rain':
            reusableColor.set("#1e293b"); 
            targetDensity = 0.008;
            break;
          case 'storm':
            reusableColor.set("#0f172a"); 
            targetDensity = 0.015;
            break;
          case 'fog':
            reusableColor.set("#94a3b8"); 
            targetDensity = 0.02;
            break;
          default:
            break;
        }
      }

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
