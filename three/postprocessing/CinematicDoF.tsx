import React, { useRef } from 'react';
import { DepthOfField } from '@react-three/postprocessing';
import { useFrame } from '@react-three/fiber';
import { useCameraStore } from '../stores/useCameraStore';
import * as THREE from 'three';

export function CinematicDoF() {
  const dofRef = useRef<any>(null);
  const { targetPosition, mode } = useCameraStore();

  useFrame((state, delta) => {
    if (!dofRef.current) return;

    let targetDistance = 100; // Default focus distance for global view

    if (mode !== 'free' && targetPosition) {
      const target = new THREE.Vector3(targetPosition[0], targetPosition[1], targetPosition[2]);
      targetDistance = state.camera.position.distanceTo(target);
    } else {
      // If free roaming, focus slightly ahead
      targetDistance = 50; 
    }

    // Convert world distance to the normalized postprocessing range (very tricky depending on near/far)
    // Actually, react-three/postprocessing DepthOfField uses absolute distance if worldFocusDistance is set,
    // but in newer versions it uses normalized depth or focusDistance property.
    // For simplicity, we just lerp the focus distance.
    const currentFocus = dofRef.current.target ? dofRef.current.target.distance : dofRef.current.focusDistance;
    dofRef.current.focusDistance = THREE.MathUtils.lerp(
      dofRef.current.focusDistance || 0.05, 
      Math.max(0.01, targetDistance / state.camera.far), 
      delta * 2
    );
  });

  return (
    <DepthOfField 
      ref={dofRef}
      focusDistance={0.05} // initial normalized distance
      focalLength={0.1}    // focal length
      bokehScale={3}       // blur intensity
      height={480}         // render target height (lower = better performance)
    />
  );
}
