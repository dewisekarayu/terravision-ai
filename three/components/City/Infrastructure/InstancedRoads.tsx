import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../../stores/useCityStore';

export function InstancedRoads() {
  const { cityLayoutData } = useCityStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const roadTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark asphalt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 256);
      
      // Edge lines (White)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(16, 0, 8, 256);
      ctx.fillRect(232, 0, 8, 256);
      
      // Center dashed line (Yellow)
      ctx.fillStyle = '#eab308';
      for (let y = 0; y < 256; y += 64) {
        ctx.fillRect(124, y + 16, 8, 32);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current || !cityLayoutData || cityLayoutData.roads.length === 0) return;
    
    cityLayoutData.roads.forEach((road, i) => {
      dummy.position.set(road.position[0], road.position[1], road.position[2]);
      dummy.rotation.set(road.rotation[0], road.rotation[1], road.rotation[2]);
      dummy.scale.set(road.scale[0], road.scale[1], road.scale[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!cityLayoutData || cityLayoutData.roads.length === 0) return null;

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, cityLayoutData.roads.length]} 
      receiveShadow
    >
      <boxGeometry args={[1, 0.05, 1]} />
      <meshStandardMaterial 
        map={roadTexture || undefined} 
        color={roadTexture ? "#ffffff" : "#0f172a"}
        roughness={0.7} 
        metalness={0.2}
      />
    </instancedMesh>
  );
}
