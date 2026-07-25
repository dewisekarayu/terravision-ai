import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../stores/useWeatherStore';
import { useCameraStore } from '../../stores/useCameraStore';

const reusableTarget = new THREE.Vector3();

export function PrecipitationSystem() {
  const { weatherType } = useWeatherStore();
  const { targetPosition } = useCameraStore();
  const pointsRef = useRef<THREE.Points>(null);

  const isRaining = weatherType === 'rain' || weatherType === 'storm';
  const isSnowing = weatherType === 'fog'; // fallback to fog for snow in this context, or maybe just disable snow
  const count = weatherType === 'storm' ? 10000 : isRaining ? 5000 : 0;

  const positions = useMemo(() => {
    if (count === 0) return new Float32Array(0);
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 150;     // X
      arr[i + 1] = Math.random() * 80;          // Y (Height)
      arr[i + 2] = (Math.random() - 0.5) * 150; // Z
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || count === 0) return;
    
    // Fall animation
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = isSnowing ? 5 : 30;

    for (let i = 1; i < count * 3; i += 3) {
      pos[i] -= speed * delta;
      if (pos[i] < 0) pos[i] = 80; // Reset to top
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Follow camera/target if in city view
    if (targetPosition) {
      reusableTarget.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      const distance = state.camera.position.distanceTo(reusableTarget);
      
      // Only show rain if camera is somewhat close to ground
      pointsRef.current.visible = distance < 120;

      // Position the rain box around the target
      pointsRef.current.position.set(reusableTarget.x, reusableTarget.y, reusableTarget.z);
    } else {
      pointsRef.current.visible = false;
    }
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial 
        color={isSnowing ? "#ffffff" : "#a8c0ff"} 
        size={isSnowing ? 0.3 : 0.15} 
        transparent 
        opacity={isSnowing ? 0.8 : 0.5} 
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
