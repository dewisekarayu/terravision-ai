import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../../stores/useCityStore';

export function MovingTraffic() {
  const { cityLayoutData } = useCityStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Create cars based on the roads
  const cars = useMemo(() => {
    if (!cityLayoutData || cityLayoutData.roads.length === 0) return [];
    
    const roads = cityLayoutData.roads;
    const generatedCars = [];
    
    // Generate around 1500 cars scattered on random roads for busy traffic
    const numCars = Math.min(1500, roads.length * 2);
    
    for (let i = 0; i < numCars; i++) {
      const road = roads[Math.floor(Math.random() * roads.length)];
      
      // If road.rotation[1] is 0, it's Z-axis road. 
      // If it's Math.PI/2, it's X-axis road.
      const isAxisZ = road.rotation[1] === 0;
      
      const speed = (Math.random() * 2.0 + 1.0) * (Math.random() > 0.5 ? 1 : -1) * 4.0; // speed and direction
      
      const carColors = [
        new THREE.Color("#ffffff"), // White
        new THREE.Color("#e2e8f0"), // Silver
        new THREE.Color("#1e293b"), // Dark Grey / Black
        new THREE.Color("#ef4444"), // Red
        new THREE.Color("#3b82f6"), // Blue
        new THREE.Color("#f59e0b"), // Taxi Yellow
      ];
      const color = carColors[Math.floor(Math.random() * carColors.length)];
      
      generatedCars.push({
        position: new THREE.Vector3(
          road.position[0] + (isAxisZ ? (Math.random() > 0.5 ? 0.35 : -0.35) : (Math.random() - 0.5) * road.scale[0]),
          0.12, // center Y so it touches the road
          road.position[2] + (isAxisZ ? (Math.random() - 0.5) * road.scale[2] : (Math.random() > 0.5 ? 0.35 : -0.35))
        ),
        speed,
        isAxisZ,
        color
      });
    }
    
    return generatedCars;
  }, [cityLayoutData]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update car positions every frame
  useFrame((state, delta) => {
    if (!meshRef.current || cars.length === 0) return;
    
    cars.forEach((car, i) => {
      // Move car
      if (car.isAxisZ) {
        car.position.z += car.speed * delta;
        // Wrap around city bounds roughly (-150 to +150)
        if (car.position.z > 150) car.position.z = -150;
        if (car.position.z < -150) car.position.z = 150;
      } else {
        car.position.x += car.speed * delta;
        if (car.position.x > 150) car.position.x = -150;
        if (car.position.x < -150) car.position.x = 150;
      }

      dummy.position.copy(car.position);
      // Orient and scale car to look like a realistic vehicle (width, height, length)
      dummy.rotation.y = car.isAxisZ ? 0 : Math.PI / 2;
      dummy.scale.set(0.25, 0.15, 0.5); 
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, car.color);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  if (cars.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, cars.length]} castShadow receiveShadow>
      {/* Box with slightly smoothed edges or just a simple box for performance */}
      <boxGeometry args={[1, 1, 1]} />
      {/* Realistic car paint material */}
      <meshStandardMaterial roughness={0.3} metalness={0.7} />
    </instancedMesh>
  );
}
