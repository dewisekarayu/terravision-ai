import { useFrame } from '@react-three/fiber';
import { useCameraStore } from '../../stores/useCameraStore';
import * as THREE from 'three';
import { useRef } from 'react';

const reusableTarget = new THREE.Vector3();
const reusableIdealPos = new THREE.Vector3();
const offsetVector = new THREE.Vector3(0, 30, 40);

export function CameraController() {
  const { mode, targetPosition, targetFov, railPoints, setMode } = useCameraStore();
  const currentRailIndex = useRef(0);

  useFrame((state, delta) => {
    if (mode === 'free') return;
    const cam = state.camera as THREE.PerspectiveCamera;

    if (mode === 'fly' && targetPosition) {
      reusableTarget.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      reusableIdealPos.copy(reusableTarget).add(offsetVector);

      cam.position.lerp(reusableIdealPos, delta * 2.5);
      cam.lookAt(reusableTarget);
      
      if (cam.position.distanceTo(reusableIdealPos) < 1) {
        setMode('free');
      }
    }

    if (mode === 'dolly' && targetPosition) {
      // 1. Interpolate FOV
      if (cam.fov !== undefined) {
        cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, delta * 2);
        cam.updateProjectionMatrix();
      }

      // 2. Adjust distance to maintain subject size (Dolly effect)
      reusableTarget.set(targetPosition[0], targetPosition[1], targetPosition[2]);
      
      const idealDistance = 60; 
      
      reusableIdealPos.copy(cam.position).sub(reusableTarget).normalize().multiplyScalar(idealDistance).add(reusableTarget);
      
      cam.position.lerp(reusableIdealPos, delta * 1.5);
      cam.lookAt(reusableTarget);
    }

    if (mode === 'rail' && railPoints.length > 0) {
      const targetIdx = currentRailIndex.current;
      const point = railPoints[targetIdx];
      const target = new THREE.Vector3(point[0], point[1], point[2]);
      
      state.camera.position.lerp(target, delta * 2);

      if (state.camera.position.distanceTo(target) < 2) {
        if (currentRailIndex.current < railPoints.length - 1) {
          currentRailIndex.current += 1;
        } else {
          setMode('free');
          currentRailIndex.current = 0;
        }
      }
    }
  });

  return null;
}
