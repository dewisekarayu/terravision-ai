import * as THREE from 'three';

// Optional custom easing functions
export const Easing = {
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

export function smoothDamp(
  current: number,
  target: number,
  currentVelocity: { value: number },
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number
) {
  // Spring damper function (like Unity's SmoothDamp)
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  
  let change = current - target;
  const originalTo = target;
  const maxChange = maxSpeed * smoothTime;

  change = THREE.MathUtils.clamp(change, -maxChange, maxChange);
  target = current - change;

  const temp = (currentVelocity.value + omega * change) * deltaTime;
  currentVelocity.value = (currentVelocity.value - omega * temp) * exp;

  let output = target + (change + temp) * exp;

  if (originalTo - current > 0.0 === output > originalTo) {
    output = originalTo;
    currentVelocity.value = (output - originalTo) / deltaTime;
  }
  return output;
}
