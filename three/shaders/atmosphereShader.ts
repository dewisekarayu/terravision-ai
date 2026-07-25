export const AtmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const AtmosphereFragmentShader = `
uniform vec3 color;
uniform float coefficient;
uniform float power;

varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  float intensity = pow(coefficient - dot(vNormal, vPositionNormal), power);
  gl_FragColor = vec4(color, 1.0) * intensity;
}
`;
