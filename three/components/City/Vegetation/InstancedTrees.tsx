import React from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useCityStore } from '../../../stores/useCityStore';
import * as THREE from 'three';

export function InstancedTrees() {
  const { cityLayoutData } = useCityStore();

  if (!cityLayoutData || cityLayoutData.trees.length === 0) return null;

  return (
    <Instances limit={10000} range={cityLayoutData.trees.length} castShadow receiveShadow>
      {/* More realistic tree geometry: slightly rounder cone, natural forest green */}
      <coneGeometry args={[0.4, 1.2, 5]} />
      <meshStandardMaterial color="#166534" roughness={0.9} />
      
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
