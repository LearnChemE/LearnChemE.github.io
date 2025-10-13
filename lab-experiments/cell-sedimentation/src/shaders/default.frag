// Default fragment shader for THREE.ShaderMaterial
// Simple diffuse lighting + color uniform

precision highp float;

const vec3 baseColor = vec3(0.93, 0.2, 0.2);

uniform vec3 lightDirection;  // in view space

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightDirection);
  vec3 V = normalize(vViewPosition);

  // Basic diffuse term
  float diff = max(dot(N, L), 0.0);

  // Simple rim lighting
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.0);

  // Combine lighting
  vec3 color = baseColor * (0.3 + 0.7 * diff) + 0.4 * baseColor * rim;

  gl_FragColor = vec4(color, 1.0);
}
