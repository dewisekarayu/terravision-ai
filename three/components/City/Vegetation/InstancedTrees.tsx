import React from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useCityStore } from '../../../stores/useCityStore';
import * as THREE from 'three';

export function InstancedTrees() {
  const { cityLayoutData } = useCityStore();

  if (!cityLayoutData || cityLayoutData.trees.length === 0) return null;

  return (
    <Instances limit={10000} range={cityLayoutData.trees.length} castShadow receiveShadow>
      {/* Simple Tree geometry: A cylinder trunk + cone top combined, or just a cone for performance */}
      <coneGeometry args={[0.3, 1, 4]} />
      <meshStandardMaterial color="#22c55e" roughness={0.8} />
      
      {cityLayoutData.trees.map((t, i) => (
        <Instance 
          key={i} 
          position={[t.position[0], t.position[1] + (t.scale / 2), t.position[2]] as [number, number, number]} 
          scale={[t.scale, t.scale, t.scale] as [number, number, number]} 
        />
      ))}
    </Instances>
  );
}
