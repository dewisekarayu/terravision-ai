"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "@/store/use-store";
import * as THREE from "three";

interface CityGridCell {
  id: string;
  x: number;
  z: number;
  type: "residential" | "commercial" | "industrial" | "park" | "river" | "utility";
  height: number;
  width: number;
  depth: number;
}

export function DigitalTwin() {
  const { disasterScenario, layers, selectedDistrict, setSelectedDistrict } = useStore();
  const waterRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Points>(null);

  // Generate procedural city layout
  const gridCells = useMemo(() => {
    const cells: CityGridCell[] = [];
    const size = 10;
    const spacing = 8;

    for (let i = -size / 2; i < size / 2; i++) {
      for (let j = -size / 2; j < size / 2; j++) {
        const x = i * spacing + 4;
        const z = j * spacing + 4;

        if (j === 0) {
          cells.push({
            id: `river-${i}`,
            x,
            z,
            type: "river",
            height: 0.1,
            width: spacing,
            depth: spacing,
          });
          continue;
        }

        let type: CityGridCell["type"] = "residential";
        let height = 4 + Math.random() * 8;
        
        if (Math.abs(i) <= 1 && Math.abs(j) <= 2) {
          type = "commercial";
          height = 12 + Math.random() * 15;
        } else if (i === -4 || i === 3) {
          type = "industrial";
          height = 3 + Math.random() * 4;
        } else if (Math.abs(i) === 3 && Math.abs(j) === 3) {
          type = "park";
          height = 0.5;
        } else if (i === 2 && j === -2) {
          type = "utility";
          height = 2;
        }

        cells.push({
          id: `cell-${i}-${j}`,
          x,
          z,
          type,
          height,
          width: 3.5 + Math.random() * 1.5,
          depth: 3.5 + Math.random() * 1.5,
        });
      }
    }
    return cells;
  }, []);

  // Animate elements frame by frame
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (waterRef.current) {
      const targetY = disasterScenario === "flood" ? 1.8 : 0.1;
      waterRef.current.position.y = THREE.MathUtils.lerp(
        waterRef.current.position.y,
        targetY,
        0.02
      );
      waterRef.current.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.005);
    }

    if (particleRef.current) {
      const positions = particleRef.current.geometry.attributes.position.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const index = i * 3;
        if (disasterScenario === "rainfall" || disasterScenario === "flood") {
          positions[index + 1] -= 0.6;
        } else if (disasterScenario === "pollution") {
          positions[index + 1] -= 0.05;
          positions[index] += Math.sin(elapsed + i) * 0.02;
        }

        if (positions[index + 1] < 0) {
          positions[index + 1] = 60 + Math.random() * 20;
        }
      }
      particleRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const getBuildingColor = (cell: CityGridCell) => {
    const isSelected = selectedDistrict === cell.id;
    if (isSelected) return "#06b6d4";

    switch (cell.type) {
      case "commercial":
        return "#1e293b";
      case "industrial":
        return "#334155";
      case "utility":
        return "#475569";
      case "residential":
      default:
        return "#0f172a";
    }
  };

  const getEmissiveColor = (cell: CityGridCell) => {
    if (disasterScenario === "earthquake") return "#ef4444";
    if (disasterScenario === "heatwave") return "#f97316";

    switch (cell.type) {
      case "commercial":
        return "#38bdf8";
      case "industrial":
        return "#10b981";
      case "utility":
        return "#eab308";
      case "residential":
      default:
        return "#f1f5f9";
    }
  };

  const particles = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 160;
      positions[i + 1] = Math.random() * 80;
      positions[i + 2] = (Math.random() - 0.5) * 160;
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color={disasterScenario === "heatwave" ? "#1a0f0a" : "#020617"}
          roughness={0.8}
        />
      </mesh>

      {/* River Basin */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[200, 16]} />
        <meshStandardMaterial
          color={
            disasterScenario === "flood"
              ? "#5c4d3c"
              : disasterScenario === "pollution"
              ? "#11221b"
              : "#006688"
          }
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Buildings and Parks */}
      {gridCells.map((cell) => {
        if (cell.type === "river") return null;

        if (cell.type === "park") {
          return (
            <group key={cell.id} position={[cell.x, 0, cell.z]}>
              <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[6, 0.2, 6]} />
                <meshStandardMaterial color="#064e3b" roughness={0.9} />
              </mesh>
              {[...Array(4)].map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 3,
                    1,
                    (Math.random() - 0.5) * 3,
                  ]}
                  castShadow
                >
                  <coneGeometry args={[0.8, 2, 4]} />
                  <meshStandardMaterial
                    color={disasterScenario === "heatwave" ? "#78350f" : "#059669"}
                    roughness={0.9}
                  />
                </mesh>
              ))}
            </group>
          );
        }

        return (
          <mesh
            key={cell.id}
            position={[cell.x, cell.height / 2, cell.z]}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDistrict(selectedDistrict === cell.id ? null : cell.id);
            }}
          >
            <boxGeometry args={[cell.width, cell.height, cell.depth]} />
            <meshStandardMaterial
              color={getBuildingColor(cell)}
              roughness={0.2}
              metalness={0.9}
              emissive={getEmissiveColor(cell)}
              emissiveIntensity={
                disasterScenario === "earthquake"
                  ? Math.sin(Date.now() * 0.01) * 0.8 + 0.8
                  : 0.25
              }
            />
          </mesh>
        );
      })}

      {/* Layers Overlays */}
      {layers.electricity && (
        <gridHelper args={[160, 40, "#10b981", "#10b981"]} position={[0, 0.5, 0]}>
          <lineBasicMaterial attach="material" color="#10b981" transparent opacity={0.6} />
        </gridHelper>
      )}

      {layers.water && (
        <gridHelper args={[160, 40, "#0ea5e9", "#0ea5e9"]} position={[0, 0.3, 0]}>
          <lineBasicMaterial attach="material" color="#0ea5e9" transparent opacity={0.6} />
        </gridHelper>
      )}

      {layers.internet && (
        <gridHelper args={[160, 30, "#8b5cf6", "#8b5cf6"]} position={[0, 0.7, 0]}>
          <lineBasicMaterial attach="material" color="#8b5cf6" transparent opacity={0.5} />
        </gridHelper>
      )}

      {layers.transport && (
        <gridHelper args={[160, 50, "#f59e0b", "#f59e0b"]} position={[0, 0.4, 0]}>
          <lineBasicMaterial attach="material" color="#f59e0b" transparent opacity={0.6} />
        </gridHelper>
      )}

      {/* Particle Weather Streams */}
      {(disasterScenario === "rainfall" ||
        disasterScenario === "flood" ||
        disasterScenario === "pollution") && (
        <points ref={particleRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={disasterScenario === "pollution" ? 0.3 : 0.15}
            color={
              disasterScenario === "pollution"
                ? "#64748b"
                : "#38bdf8"
            }
            transparent
            opacity={0.6}
          />
        </points>
      )}
    </group>
  );
}
