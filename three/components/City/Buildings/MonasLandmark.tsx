import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../../stores/useCityStore';
import * as THREE from 'three';

export function MonasLandmark() {
  const { cityLayoutData } = useCityStore();
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flameRef.current) {
      // Gentle pulsing effect for the flame
      flameRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.08);
    }
  });

  if (!cityLayoutData || !cityLayoutData.monasPosition) return null;

  const [px, py, pz] = cityLayoutData.monasPosition;

  return (
    <group position={[px, py, pz]} scale={[0.7, 0.7, 0.7]}>
      {/* Base / Pelataran Bawah */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 3, 10]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>
      
      {/* Cup / Pelataran Atas */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 2, 7]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.9} />
      </mesh>

      {/* Obelisk / Tugu */}
      <mesh position={[0, 15, 0]} castShadow receiveShadow>
        {/* Tapering effect using CylinderGeometry with 4 radial segments */}
        <cylinderGeometry args={[1.5, 2.5, 20, 4]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.8} />
      </mesh>

      {/* Observation Deck / Puncak */}
      <mesh position={[0, 26, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.7} />
      </mesh>

      {/* Flame of Independence / Lidah Api */}
      <mesh ref={flameRef} position={[0, 29, 0]}>
        <coneGeometry args={[1.5, 4, 16]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#f59e0b" 
          emissiveIntensity={2.5} 
          roughness={0.2} 
          metalness={1} 
        />
        {/* Glow effect for the flame */}
        <pointLight color="#fbbf24" intensity={3} distance={40} decay={2} />
      </mesh>
    </group>
  );
}
