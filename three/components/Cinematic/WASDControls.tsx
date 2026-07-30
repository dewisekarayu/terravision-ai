import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useCameraStore } from '../../stores/useCameraStore';

export function WASDControls({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  
  const { mode } = useCameraStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: true })); break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': setMovement(m => ({ ...m, right: false })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (mode !== 'free') return;
    
    if (!movement.forward && !movement.backward && !movement.left && !movement.right) return;
    if (!controlsRef.current) return;

    // Use a reasonable speed for walking around the city
    const speed = 60 * delta; 
    const camera = state.camera;
    
    // Get forward and right directions from camera
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0; // Lock to horizontal plane
    forward.normalize();
    
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0; // Lock to horizontal plane
    right.normalize();

    const moveVector = new THREE.Vector3();
    if (movement.forward) moveVector.add(forward.clone().multiplyScalar(speed));
    if (movement.backward) moveVector.add(forward.clone().multiplyScalar(-speed));
    if (movement.right) moveVector.add(right.clone().multiplyScalar(speed));
    if (movement.left) moveVector.add(right.clone().multiplyScalar(-speed));

    if (moveVector.lengthSq() > 0) {
      camera.position.add(moveVector);
      controlsRef.current.target.add(moveVector);
    }
  });

  return null;
}
