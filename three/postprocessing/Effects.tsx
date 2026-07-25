import React from 'react';
import { EffectComposer, Bloom, N8AO } from '@react-three/postprocessing';
import { usePerformanceStore } from '../stores/usePerformanceStore';
import { CinematicDoF } from './CinematicDoF';

export function Effects() {
  const { isLowEnd, enableAdvancedEffects } = usePerformanceStore();

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
      <Bloom 
        mipmapBlur 
        intensity={0.5} 
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.025} 
      />
      {enableAdvancedEffects && !isLowEnd ? (
        <CinematicDoF />
      ) : <React.Fragment />}
    </EffectComposer>
  );
}
