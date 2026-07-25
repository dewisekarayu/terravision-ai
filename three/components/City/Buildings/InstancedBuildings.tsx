import React from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../../stores/useCityStore';
import { useSimulationStore } from '../../../stores/useSimulationStore';
import { calculateCityHealth } from '../../../simulation/algorithms';
import * as THREE from 'three';

export function InstancedBuildings() {
  const { cityLayoutData } = useCityStore();
  const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      const state = useSimulationStore.getState();
      const health = calculateCityHealth(state.povertyScore, state.educationScore, state.healthcareScore);
      
      // Interpolate building base color: 0 health (poverty) = dark/grey, 1 health = white
      const poorColor = new THREE.Color(0x475569); // slate-600
      const healthyColor = new THREE.Color(0xffffff); // white
      materialRef.current.color.lerpColors(poorColor, healthyColor, health);
    }
  });

  if (!cityLayoutData || cityLayoutData.buildings.length === 0) return null;

  return (
    <Instances limit={20000} range={cityLayoutData.buildings.length} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color="#ffffff" roughness={0.5} />
      
      {cityLayoutData.buildings.map((b, i) => (
        <Instance 
          key={i} 
          position={b.position} 
          scale={b.scale} 
          color={b.color} 
        />
      ))}
    </Instances>
  );
}
