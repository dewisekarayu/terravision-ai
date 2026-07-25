import React from 'react';
import { EffectComposer, Bloom, N8AO, Vignette, Noise, BrightnessContrast } from '@react-three/postprocessing';
import { usePerformanceStore } from '../stores/usePerformanceStore';
import { CinematicDoF } from './CinematicDoF';
import { useSimulationStore } from '@/three/stores/useSimulationStore';

export function Effects() {
  const { isLowEnd, enableAdvancedEffects } = usePerformanceStore();
  const { disasterScenario } = useSimulationStore();

  const isDisaster = disasterScenario !== "normal";

  // Disable heavy effects on low-end devices
  if (isLowEnd) {
    return null;
  }

  return (
    <EffectComposer>
      <N8AO 
        aoRadius={2} 
        intensity={1} 
        distanceFalloff={0.2}
        color="#000000"
      />
      
      {/* Dynamic Disaster Effects */}
      {isDisaster && (
        <Vignette eskil={false} offset={0.2} darkness={1.5} />
      )}
      
      {disasterScenario === "earthquake" && (
        <Noise opacity={0.15} />
      )}
      
      {disasterScenario === "flood" && (
        <BrightnessContrast brightness={-0.2} contrast={0.1} />
      )}

      <Bloom 
        mipmapBlur 
        intensity={disasterScenario === "flood" ? 0.2 : 0.5} 
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.025} 
      />
      {enableAdvancedEffects && !isLowEnd ? (
        <CinematicDoF />
      ) : <React.Fragment />}
    </EffectComposer>
  );
}
