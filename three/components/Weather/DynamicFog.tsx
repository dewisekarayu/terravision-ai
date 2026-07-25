import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';

const reusableColor = new THREE.Color();

export function DynamicFog() {
  const { scene } = useThree();
  const { weatherType, timeOfDay } = useWeatherStore();

  useEffect(() => {
    // Initial setup
    const isDay = timeOfDay >= 6 && timeOfDay <= 18;
    const baseColor = isDay ? "#020617" : "#02020f";
    scene.fog = new THREE.Fog(baseColor, 80, 180);
    scene.background = new THREE.Color(baseColor);
    
    return () => {
      scene.fog = null;
    };
  }, [scene, timeOfDay]);

  useFrame((_, delta) => {
    if (scene.fog instanceof THREE.Fog) {
      const isDay = timeOfDay >= 6 && timeOfDay <= 18;
      
      let targetNear = 80;
      let targetFar = 180;
      reusableColor.set(isDay ? "#020617" : "#02020f");

      switch (weatherType) {
        case 'rain':
          reusableColor.set("#334155"); // slate
          targetNear = 40;
          targetFar = 120;
          break;
        case 'storm':
          reusableColor.set("#0f172a"); // dark slate
          targetNear = 20;
          targetFar = 80;
          break;
        case 'fog':
          reusableColor.set("#cbd5e1"); // light slate / snow fog
          targetNear = 30;
          targetFar = 100;
          break;
        default:
          break;
      }

      // Smoothly transition fog properties
      scene.fog.color.lerp(reusableColor, delta * 2);
      if (scene.background instanceof THREE.Color) {
        scene.background.lerp(reusableColor, delta * 2);
      }
      
      scene.fog.near = THREE.MathUtils.lerp(scene.fog.near, targetNear, delta * 2);
      scene.fog.far = THREE.MathUtils.lerp(scene.fog.far, targetFar, delta * 2);
    }
  });

  return null;
}
