import type { CityLayout } from '../stores/useCityStore';

export function generateCityGrid(
  gridSize: number, 
  cellSize: number, 
  density: number
): CityLayout {
  const buildings = [];
  const trees = [];
  const roads = [];

  const offset = (gridSize * cellSize) / 2;

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const px = x * cellSize - offset;
      const pz = z * cellSize - offset;

      // Leave space for roads every 4 blocks
      const isRoadX = x % 4 === 0;
      const isRoadZ = z % 4 === 0;

      if (isRoadX || isRoadZ) {
        // Simple road mesh setup
        if (isRoadX && !isRoadZ) {
          roads.push({
            position: [px, 0.05, pz] as [number, number, number],
            rotation: [0, 0, 0] as [number, number, number],
            scale: [cellSize * 0.8, 1, cellSize] as [number, number, number],
          });
        } else if (isRoadZ && !isRoadX) {
          roads.push({
            position: [px, 0.05, pz] as [number, number, number],
            rotation: [0, Math.PI / 2, 0] as [number, number, number],
            scale: [cellSize * 0.8, 1, cellSize] as [number, number, number],
          });
        }
        continue;
      }

      // Procedural probability based on density
      if (Math.random() < density) {
        const isPark = Math.random() < 0.2; // 20% chance of being a park/tree

        if (isPark) {
          trees.push({
            position: [px, 0, pz] as [number, number, number],
            scale: 0.5 + Math.random() * 0.5,
          });
        } else {
          const height = 1 + Math.random() * 8; // Random building height
          // Vibrant cyberpunk / neon color palette for a digital twin look
          const palettes = [
            "#0ea5e9", // Sky Blue
            "#8b5cf6", // Violet
            "#ec4899", // Pink
            "#10b981", // Emerald
            "#f59e0b", // Amber
            "#06b6d4", // Cyan
            "#6366f1"  // Indigo
          ];
          // Assign color based on position or height to group similar colors, or just random
          // Let's use a mix of randomness and height for a nice distribution
          const colorIndex = Math.floor(Math.random() * palettes.length);
          const color = palettes[colorIndex];

          buildings.push({
            position: [px, height / 2, pz] as [number, number, number],
            scale: [cellSize * 0.8, height, cellSize * 0.8] as [number, number, number],
            color,
          });
        }
      }
    }
  }

  return { buildings, trees, roads };
}
