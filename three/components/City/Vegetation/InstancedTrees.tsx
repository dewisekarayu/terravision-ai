import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../../stores/useCityStore';
import { useSimulationStore } from '../../../stores/useSimulationStore';
import * as THREE from 'three';

export function InstancedTrees() {
  const { cityLayoutData } = useCityStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current || !cityLayoutData || cityLayoutData.trees.length === 0) return;
    
    // Read forest score directly from Zustand without triggering React re-renders
    const { forestScore } = useSimulationStore.getState();
    
    // Smoothly scale trees based on the AI forest score (0.0 to 1.0)
    // If score is 0, trees are 0 size (dead/gone). If 1, trees are 150% size!
    const targetScaleMultiplier = forestScore * 1.5;

    cityLayoutData.trees.forEach((t, i) => {
      const currentScale = t.scale * targetScaleMultiplier;
      dummy.position.set(t.position[0], t.position[1] + (currentScale / 2), t.position[2]);
      
      // Add a tiny bit of sway based on time for realism
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!cityLayoutData || cityLayoutData.trees.length === 0) return null;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, cityLayoutData.trees.length]} 
      castShadow 
      receiveShadow
    >
      {/* More realistic tree geometry: slightly rounder cone, natural forest green */}
      <coneGeometry args={[0.4, 1.2, 5]} />
      <meshStandardMaterial color="#166534" roughness={0.9} />
    </instancedMesh>
  );
}
