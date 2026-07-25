import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { Atmosphere } from './Atmosphere';
import { Clouds } from './Clouds';
import { CityManager } from '../City/CityManager';
import { latLongToVector3 } from '../../utils/geoCoords';
import { useCameraStore } from '../../stores/useCameraStore';
import { useSelectionStore } from '../../stores/useSelectionStore';

export function EarthMesh() {
  const earthRef = useRef<THREE.Mesh>(null);
  const { setTargetPosition, setMode } = useCameraStore();
  const { setSelectedObject } = useSelectionStore();

  // Raycaster click on Earth
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // Simulate detecting a click on a coordinate
    // For now, let's just fly the camera to a dummy coordinate (e.g., Jakarta: -6.2, 106.8)
    const targetPos = latLongToVector3(-6.2, 106.8, 50);
    setTargetPosition([targetPos.x, targetPos.y, targetPos.z]);
    setMode('fly');
    setSelectedObject('Indonesia');
  };

  useFrame((state, delta) => {
    if (earthRef.current) {
      // Very slow rotation
      earthRef.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere */}
      <mesh ref={earthRef} onClick={handleClick} receiveShadow castShadow>
        <icosahedronGeometry args={[50, 12]} />
        <shaderMaterial
          transparent
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
              // Calculate Fresnel glow based on view angle
              vec3 viewDir = vec3(0.0, 0.0, 1.0);
              float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
              vec3 glowColor = vec3(0.02, 0.7, 0.8) * fresnel * 1.5;
              
              // Procedural lat/long grid lines
              float grid = max(
                step(0.96, fract(vPosition.y * 0.4)),
                step(0.96, fract(vPosition.x * 0.4))
              );
              
              // Base dark color + Grid + Glow
              vec3 baseColor = vec3(0.01, 0.05, 0.08);
              vec3 finalColor = baseColor + (vec3(0.0, 0.5, 0.7) * grid * 0.4) + glowColor;
              
              gl_FragColor = vec4(finalColor, 0.95);
            }
          `}
        />
      </mesh>

      {/* Dynamic Atmosphere Rim Lighting */}
      <Atmosphere />

      {/* Dynamic Clouds Layer */}
      <Clouds />

      {/* Procedural City Generation */}
      <CityManager />
    </group>
  );
}
