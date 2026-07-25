import { generateCityGrid } from './cityGenerator';

self.onmessage = (e: MessageEvent) => {
  const { gridSize, cellSize, density } = e.data;
  
  // Menjalankan algoritma berat di background thread
  const layout = generateCityGrid(gridSize, cellSize, density); 
  
  // Mengirim hasil kembali ke main thread
  self.postMessage(layout);
};
