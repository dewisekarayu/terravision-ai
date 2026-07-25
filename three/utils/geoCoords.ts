import * as THREE from 'three';

/**
 * Converts Latitude and Longitude to a Vector3 position on a sphere.
 * 
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @param radius Radius of the sphere
 * @returns THREE.Vector3 position
 */
export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Spherical to Cartesian coordinates
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = (radius * Math.sin(phi) * Math.sin(theta));
  const y = (radius * Math.cos(phi));

  return new THREE.Vector3(x, y, z);
}
