import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AtmosphereVertexShader, AtmosphereFragmentShader } from '../../shaders/atmosphereShader';
import { useSimulationStore } from '../../stores/useSimulationStore';
import { calculatePollution } from '../../simulation/algorithms';

export function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    if (materialRef.current) {
      const state = useSimulationStore.getState();
      const pollution = calculatePollution(state.carbonScore, state.forestScore);
      
      // Interpolate between clean blue (0x3399ff) and dirty brown/grey (0x8b7355)
      const cleanColor = new THREE.Color(0x3399ff);
      const dirtyColor = new THREE.Color(0x8b7355);
      materialRef.current.uniforms.color.value.lerpColors(cleanColor, dirtyColor, pollution);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[52, 12]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={AtmosphereVertexShader}
        fragmentShader={AtmosphereFragmentShader}
        uniforms={{
          color: { value: new THREE.Color(0x3399ff) },
          coefficient: { value: 0.6 },
          power: { value: 3.0 },
        }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}
