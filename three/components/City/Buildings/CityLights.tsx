import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../../stores/useCityStore';
import { useSimulationStore } from '../../../stores/useSimulationStore';

export function CityLights() {
  const { cityLayoutData } = useCityStore();
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Create a soft glowing circular texture for the lights instead of hard squares
  const lightTexture = useMemo(() => {
    if (typeof document === 'undefined') return null; // Handle SSR
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, colors] = useMemo(() => {
    if (!cityLayoutData || cityLayoutData.buildings.length === 0) {
      return [new Float32Array(), new Float32Array()];
    }

    const posArray: number[] = [];
    const colArray: number[] = [];
    const colorObj = new THREE.Color();

    cityLayoutData.buildings.forEach((b) => {
      // Structure lights like vertical neon strips or windows along the building edges
      const numFloors = Math.floor(b.scale[1] / 1.2);
      
      if (numFloors > 1) {
        for (let i = 1; i < numFloors; i++) {
          if (Math.random() > 0.4) continue; // 40% chance to place a light per floor
          
          const y = (i * 1.2); // floor height
          // Attach to edges of the building to look like corner neons or windows
          const onXEdge = Math.random() > 0.5;
          let x = b.position[0];
          let z = b.position[2];
          
          if (onXEdge) {
            x += (Math.random() > 0.5 ? b.scale[0]/2 : -b.scale[0]/2);
            z += (Math.random() - 0.5) * b.scale[2];
          } else {
            x += (Math.random() - 0.5) * b.scale[0];
            z += (Math.random() > 0.5 ? b.scale[2]/2 : -b.scale[2]/2);
          }

          posArray.push(x, y, z);
          
          // Use the building's neon color for its lights, but make it brighter
          colorObj.set(b.color);
          colArray.push(colorObj.r * 1.5, colorObj.g * 1.5, colorObj.b * 1.5);
        }
      }
    });

    return [new Float32Array(posArray), new Float32Array(colArray)];
  }, [cityLayoutData]);

  useFrame(() => {
    if (materialRef.current) {
      const { renewableScore } = useSimulationStore.getState();
      
      // If renewable is 0 (fossil fuels), lights are dim orange/yellow
      // If renewable is 1 (clean energy), lights are bright cyan/white
      const fossilColor = new THREE.Color("#fb923c");
      const cleanColor = new THREE.Color("#22d3ee");
      
      // Lerp the global tint of the points
      materialRef.current.color.lerpColors(fossilColor, cleanColor, renewableScore);
      
      // Renewable energy makes the city visually brighter!
      materialRef.current.opacity = 0.4 + renewableScore * 0.6;
    }
  });

  if (positions.length === 0 || !lightTexture) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        ref={materialRef}
        size={1.2} 
        vertexColors 
        transparent 
        opacity={1.0} 
        map={lightTexture}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}
