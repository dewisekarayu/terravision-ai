import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../stores/useCityStore';
import { InstancedBuildings } from './Buildings/InstancedBuildings';
import { CityLights } from './Buildings/CityLights';
import { InstancedTrees } from './Vegetation/InstancedTrees';
import { InstancedRoads } from './Infrastructure/InstancedRoads';
import { MovingTraffic } from './Infrastructure/MovingTraffic';
import { useCameraStore } from '../../stores/useCameraStore';
import * as THREE from 'three';

export function CityManager() {
  const { setCityLayoutData, setIsGenerating } = useCityStore();
  const { targetPosition } = useCameraStore();
  const groupRef = useRef<THREE.Group>(null);

  // Generate city on mount using WebWorker to avoid freezing UI
  useEffect(() => {
    setIsGenerating(true);
    
    // Added ?v=2 to force Next.js to recompile the worker so the intersection gap fix applies!
    const worker = new Worker(new URL('../../services/city.worker.ts?v=2', import.meta.url));
    
    worker.onmessage = (e) => {
      setCityLayoutData(e.data);
      setIsGenerating(false);
      worker.terminate();
    };

    // Generate a massive 150x150 grid (22,500 cells) asynchronously
    worker.postMessage({ gridSize: 150, cellSize: 2, density: 0.6 });

    return () => worker.terminate();
  }, [setCityLayoutData, setIsGenerating]);

  // Adjust visibility based on camera distance (LOD)
  useFrame((state) => {
    if (groupRef.current && targetPosition) {
      const target = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
      const distance = state.camera.position.distanceTo(target);
      // Only show city when camera is close to the surface (zoom distance < 40 from surface)
      groupRef.current.visible = distance < 80;
    } else if (groupRef.current) {
      groupRef.current.visible = false;
    }
  });

  if (!targetPosition) return null;

  return (
    <group 
      ref={groupRef} 
      position={targetPosition as [number, number, number]}
      // Simplistic rotation to somewhat align with the surface normal
      // For a real globe, lookAt(0,0,0) and rotate would be used
    >
      <InstancedBuildings />
      <CityLights />
      <InstancedTrees />
      <InstancedRoads />
      <MovingTraffic />
    </group>
  );
}
