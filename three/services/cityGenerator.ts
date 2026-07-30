import type { CityLayout } from '../stores/useCityStore';

export function generateCityGrid(
  gridSize: number, 
  cellSize: number, 
  density: number
): CityLayout {
  const buildings = [];
  const trees = [];
  const roads = [];
  let monasPosition: [number, number, number] | undefined;

  const offset = (gridSize * cellSize) / 2;

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const px = x * cellSize - offset;
      const pz = z * cellSize - offset;

      // Leave space for roads every 4 blocks
      const isRoadX = x % 4 === 0;
      const isRoadZ = z % 4 === 0;

      if (isRoadX || isRoadZ) {
        // Full cell size to eliminate gaps and connect perfectly to intersections
        // This still leaves a sidewalk gap because buildings are scaled to cellSize * 0.8
        if (isRoadX && isRoadZ) {
          // Intersection: just draw a square road piece
          roads.push({
            position: [px, 0.05, pz] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [cellSize, 1, cellSize] as [number, number, number],
          });
        } else if (isRoadX) {
          roads.push({
            position: [px, 0.05, pz] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [cellSize, 1, cellSize] as [number, number, number],
          });
        } else if (isRoadZ) {
          roads.push({
            position: [px, 0.05, pz] as [number, number, number],
            rotation: [0, Math.PI / 2, 0] as [number, number, number],
            scale: [cellSize, 1, cellSize] as [number, number, number],
          });
        }
        continue;
      }

      // Distance from center to create a realistic downtown core
      const distX = (x - gridSize / 2) / (gridSize / 2);
      const distZ = (z - gridSize / 2) / (gridSize / 2);
      const distanceFromCenter = Math.sqrt(distX * distX + distZ * distZ); // 0 at center, ~1.4 at corners
      
      // Downtown is denser, suburbs are sparser
      const localDensity = density * Math.max(0.2, 1.0 - distanceFromCenter * 0.5);

      const isTallestTower = (x === Math.floor(gridSize / 2) && z === Math.floor(gridSize / 2));

      if (Math.random() < localDensity || isTallestTower) {
        // More parks in suburbs, fewer in downtown
        const isPark = !isTallestTower && Math.random() < (0.1 + distanceFromCenter * 0.3);

        if (isPark) {
          // A lush park with 3-6 trees
          const treeCount = 3 + Math.floor(Math.random() * 4);
          for (let i = 0; i < treeCount; i++) {
            const offsetX = (Math.random() - 0.5) * cellSize * 0.8;
            const offsetZ = (Math.random() - 0.5) * cellSize * 0.8;
            trees.push({
              position: [px + offsetX, 0, pz + offsetZ] as [number, number, number],
              scale: 0.4 + Math.random() * 0.6,
            });
          }
        } else {
          // Buildings are tallest in the center, dropping off logarithmically
          const maxHeight = Math.max(4, (1.0 - distanceFromCenter) * 15);
          let height = 2 + Math.random() * maxHeight + Math.random() * 2; // Random variation
          
          // Realistic building colors (Glass, Concrete, Steel, Brick)
          const realisticPalettes = [
            "#e2e8f0", // Light Concrete / White
            "#94a3b8", // Steel Gray
            "#38bdf8", // Reflective Glass Blue
            "#cbd5e1", // Standard Gray
            "#f1f5f9", // Very White
            "#7dd3fc"  // Light Sky Glass
          ];
          
          // Taller buildings are more likely to be glass/steel
          let color = realisticPalettes[Math.floor(Math.random() * realisticPalettes.length)];
          
          if (isTallestTower) {
            monasPosition = [px, 0, pz];
          } else {
            if (height > 10 && Math.random() > 0.3) {
               // Force glass/steel for skyscrapers
               color = Math.random() > 0.5 ? "#38bdf8" : "#94a3b8";
            } else if (height < 4 && Math.random() > 0.7) {
               // Sometimes brick/brown for small buildings
               color = "#d6d3d1"; // Stone/Brownish
            }

            buildings.push({
              position: [px, height / 2, pz] as [number, number, number],
              // Make tall buildings slightly thinner for realism
              scale: [cellSize * (height > 20 ? 0.7 : 0.8), height, cellSize * (height > 20 ? 0.7 : 0.8)] as [number, number, number],
              color,
            });
          }
        }
      } else {
        // Empty spaces! The user requested to fill empty spaces with trees
        // Let's spawn 1-3 trees to make it a very green city
        const treeCount = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < treeCount; i++) {
          const offsetX = (Math.random() - 0.5) * cellSize * 0.7;
          const offsetZ = (Math.random() - 0.5) * cellSize * 0.7;
          trees.push({
            position: [px + offsetX, 0, pz + offsetZ] as [number, number, number],
            scale: 0.3 + Math.random() * 0.5,
          });
        }
      }
    }
  }

  return { buildings, trees, roads, monasPosition };
}
