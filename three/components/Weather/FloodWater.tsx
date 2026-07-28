import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulationStore } from '../../stores/useSimulationStore';

export function FloodWater() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      const { disasterScenario } = useSimulationStore.getState();
      
      // Target height: 1.5 (covers roads and cars, reaches building bases)
      const targetY = 1.5;
      
      if (disasterScenario === 'normal') {
        // Snap instantly back to just below ground level
        meshRef.current.position.y = -0.5;
      } else if (disasterScenario === 'flood') {
        // Rise at a VERY slow, creeping speed: 0.05 units per second
        // Math.min clamps the delta to max 0.1s to prevent sudden jumps
        if (meshRef.current.position.y < targetY) {
          meshRef.current.position.y += Math.min(delta, 0.1) * 0.05;
        }
      }
      
      // Hide completely if underground to save GPU
      meshRef.current.visible = meshRef.current.position.y > -0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      {/* Massive plane covering the whole city */}
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#0f172a" // dark murky slate water
        roughness={0.05} // Very smooth, reflective
        metalness={0.9}  // Highly reflective like water
        transparent={true}
        opacity={0.9}
      />
    </mesh>
  );
}
