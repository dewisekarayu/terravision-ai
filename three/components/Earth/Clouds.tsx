import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Clouds() {
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.02; // Rotate clouds slowly
    }
  });

  return (
    <mesh ref={cloudsRef}>
      {/* Slightly larger than the Earth (radius 50) */}
      <icosahedronGeometry args={[50.5, 12]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent={true}
        opacity={0.4}
        depthWrite={false}
        roughness={1}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
