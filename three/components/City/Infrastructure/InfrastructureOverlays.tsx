import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../../stores/useCityStore';

export function InfrastructureOverlays() {
  const { layers } = useCityStore();
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly animate the uniform values to fade the layers in and out
      materialRef.current.uniforms.uElec.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uElec.value, layers.electricity ? 1 : 0, 0.05);
      materialRef.current.uniforms.uWater.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uWater.value, layers.water ? 1 : 0, 0.05);
      materialRef.current.uniforms.uNet.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uNet.value, layers.internet ? 1 : 0, 0.05);
      materialRef.current.uniforms.uTrans.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uTrans.value, layers.transport ? 1 : 0, 0.05);
    }
  });

  return (
    <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[300, 300]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uElec: { value: 0 },
          uWater: { value: 0 },
          uNet: { value: 0 },
          uTrans: { value: 0 }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uElec;
          uniform float uWater;
          uniform float uNet;
          uniform float uTrans;
          varying vec2 vUv;

          // Simple 2D noise
          float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

          void main() {
            vec3 color = vec3(0.0);
            float alpha = 0.0;
            
            // Grid UVs (150x150 cells -> 300x300 size)
            vec2 grid = fract(vUv * 150.0);
            vec2 cell = floor(vUv * 150.0);
            
            // Distance from center for fading out at edges
            float dist = distance(vUv, vec2(0.5));
            float edgeFade = smoothstep(0.5, 0.2, dist);

            // 1. ELECTRICITY (Emerald/Yellow pulsing grid nodes)
            if (uElec > 0.0) {
              float pulse = sin(uTime * 3.0 + hash(cell) * 10.0) * 0.5 + 0.5;
              float node = smoothstep(0.3, 0.0, distance(grid, vec2(0.5)));
              vec3 elecColor = mix(vec3(0.0, 1.0, 0.5), vec3(1.0, 0.8, 0.0), pulse);
              color += elecColor * node * pulse * uElec * 1.5;
              
              // Connecting lines
              float lines = smoothstep(0.1, 0.0, abs(grid.x - 0.5)) + smoothstep(0.1, 0.0, abs(grid.y - 0.5));
              color += vec3(0.1, 0.8, 0.4) * lines * 0.4 * uElec;
              alpha += (node + lines * 0.4) * uElec;
            }

            // 2. WATER (Blue flowing pipes)
            if (uWater > 0.0) {
              float flowX = sin(grid.x * 10.0 - uTime * 5.0);
              float flowY = sin(grid.y * 10.0 - uTime * 5.0);
              float pipeX = smoothstep(0.15, 0.0, abs(grid.x - 0.5));
              float pipeY = smoothstep(0.15, 0.0, abs(grid.y - 0.5));
              
              // Only draw pipes on roads (every 4th cell)
              float isRoadX = step(0.1, max(0.0, 1.0 - mod(cell.x, 4.0))); // simplified road check
              float isRoadY = step(0.1, max(0.0, 1.0 - mod(cell.y, 4.0)));
              
              float waterLines = (pipeX * isRoadX * (flowY * 0.5 + 0.5)) + (pipeY * isRoadY * (flowX * 0.5 + 0.5));
              color += vec3(0.0, 0.6, 1.0) * waterLines * uWater * 1.5;
              alpha += waterLines * uWater;
            }

            // 3. IOT INTERNET (Purple expanding rings)
            if (uNet > 0.0) {
              float ringDist = distance(vUv, vec2(0.5));
              float ring = sin(ringDist * 100.0 - uTime * 4.0);
              float ringMask = smoothstep(0.9, 1.0, ring) * smoothstep(0.0, 0.5, 1.0 - ringDist * 2.0);
              
              // Node blips
              float blip = smoothstep(0.1, 0.0, distance(grid, vec2(0.5))) * step(0.95, hash(cell + floor(uTime * 2.0)));
              
              color += vec3(0.6, 0.2, 1.0) * ringMask * uNet;
              color += vec3(0.8, 0.4, 1.0) * blip * uNet * 2.0;
              alpha += (ringMask + blip) * uNet;
            }

            // 4. TRANSPORT (Amber moving traffic dots)
            if (uTrans > 0.0) {
              float isRoadX = step(0.1, max(0.0, 1.0 - mod(cell.x, 4.0)));
              float isRoadY = step(0.1, max(0.0, 1.0 - mod(cell.y, 4.0)));
              
              float dotX = smoothstep(0.9, 1.0, sin(grid.y * 20.0 + uTime * 10.0)) * smoothstep(0.1, 0.0, abs(grid.x - 0.3));
              float dotY = smoothstep(0.9, 1.0, sin(grid.x * 20.0 - uTime * 10.0)) * smoothstep(0.1, 0.0, abs(grid.y - 0.7));
              
              float traffic = (dotX * isRoadX) + (dotY * isRoadY);
              color += vec3(1.0, 0.6, 0.0) * traffic * uTrans * 2.0;
              alpha += traffic * uTrans;
            }

            gl_FragColor = vec4(color * edgeFade, clamp(alpha * edgeFade, 0.0, 1.0));
          }
        `}
      />
    </mesh>
  );
}
