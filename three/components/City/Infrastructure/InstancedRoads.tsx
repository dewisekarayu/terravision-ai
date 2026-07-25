import React from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useCityStore } from '../../../stores/useCityStore';

export function InstancedRoads() {
  const { cityLayoutData } = useCityStore();

  if (!cityLayoutData || cityLayoutData.roads.length === 0) return null;

  return (
    <Instances limit={5000} range={cityLayoutData.roads.length} receiveShadow>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#334155" roughness={0.9} />
      
      {cityLayoutData.roads.map((r, i) => (
        <Instance 
          key={i} 
          position={r.position} 
          rotation={[-Math.PI / 2, r.rotation[1], 0] as [number, number, number]} 
          scale={r.scale} 
        />
      ))}
    </Instances>
  );
}
