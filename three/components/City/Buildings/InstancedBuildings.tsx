import React, { useMemo, useLayoutEffect } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCityStore } from '../../../stores/useCityStore';
import { useSimulationStore } from '../../../stores/useSimulationStore';
import { calculateCityHealth } from '../../../simulation/algorithms';
import * as THREE from 'three';

export function InstancedBuildings() {
  const { cityLayoutData } = useCityStore();
  const materialRef = React.useRef<THREE.MeshStandardMaterial>(null);
  const geoRef = React.useRef<THREE.BoxGeometry>(null);

  // Generate a procedural emissive (glowing) window texture
  const emissiveTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Base color (black = no light emission)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 512);
      
      const rows = 16;
      const cols = 8;
      const winW = 512 / cols;
      const winH = 512 / rows;
      
      for (let r = 0; r < rows; r++) {
        // Skip some floors to simulate mechanical floors or empty offices
        if (Math.random() > 0.8) continue;
        
        for (let c = 0; c < cols; c++) {
          // Skip some columns 
          if (Math.random() > 0.9) continue;
          
          // Only 30% of windows are lit up to look realistic
          if (Math.random() > 0.7) {
            // Colors: Warm light, bright white, or cool blue
            const colors = ['#fef08a', '#ffffff', '#e0f2fe'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            // Leave a border for the frame
            ctx.fillRect(c * winW + winW * 0.15, r * winH + winH * 0.15, winW * 0.7, winH * 0.7);
          }
        }
      }

      // Ensure the top-left corner is strictly black for the roof/bottom UV mapping
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 10, 10);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
  }, []);

  // Remove windows from the roofs and bottoms by shifting their UVs to the black corner
  useLayoutEffect(() => {
    if (geoRef.current) {
      const uvAttribute = geoRef.current.attributes.uv;
      // Vertices 8 through 15 are the top and bottom faces in BoxGeometry(1,1,1)
      for (let i = 8; i < 16; i++) {
        uvAttribute.setXY(i, 0, 0); // Point to top-left pixel (which is black)
      }
      uvAttribute.needsUpdate = true;
    }
  }, []);

  useFrame(() => {
    if (materialRef.current) {
      const state = useSimulationStore.getState();
      const targetColor = new THREE.Color();
      
      if (state.disasterScenario === 'heatwave') {
        // Soft warm reddish-orange tint for heatwave (not too intense)
        targetColor.setHex(0xffbb99);
      } else if (state.disasterScenario === 'pollution') {
        // Thick, dirty ash/gray smog
        targetColor.setHex(0x3f3f46); // zinc-700 (dark ash)
      } else if (state.disasterScenario === 'rainfall' || state.disasterScenario === 'flood') {
        // Cool blueish/grayish tint for rain or floods
        targetColor.setHex(0x93c5fd);
      } else {
        // Normal city health interpolation
        const health = calculateCityHealth(state.povertyScore, state.educationScore, state.healthcareScore);
        const poorColor = new THREE.Color(0xd1d5db); // slate-300
        const healthyColor = new THREE.Color(0xffffff); // white
        targetColor.lerpColors(poorColor, healthyColor, health);
      }

      // Smoothly transition the material color to the target color for awesome visual feedback
      materialRef.current.color.lerp(targetColor, 0.02);
    }
  });

  if (!cityLayoutData || cityLayoutData.buildings.length === 0) return null;

  return (
    <Instances limit={20000} range={cityLayoutData.buildings.length} castShadow receiveShadow>
      <boxGeometry ref={geoRef} args={[1, 1, 1]} />
      <meshStandardMaterial 
        ref={materialRef} 
        color="#ffffff" 
        emissive="#ffffff"
        emissiveMap={emissiveTexture}
        emissiveIntensity={1.5}
        roughness={0.2} 
        metalness={0.7} 
      />
      
      {cityLayoutData.buildings.map((b, i) => (
        <Instance 
          key={i} 
          position={b.position} 
          scale={b.scale} 
          color={b.color} 
        />
      ))}
    </Instances>
  );
}
