// Default fragment shader for THREE.ShaderMaterial
// Simple diffuse lighting + color uniform

precision highp float;

const vec4 baseCol = vec4(0.4, 0.4, 1.0, 0.6);
const vec4 rCol = vec4(0.93, 0.2, 0.2, 0.8);
const vec4 wCol = vec4(0.9, 0.9, 0.9, 0.8);

uniform vec3 lightDirection;  // in view space
uniform float redConcentration[128];
uniform float whiteConcentration[128];

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

vec4 concColor() {
  // Simple color modulation based on concentrations
  float rConc = redConcentration[int(vUv.y * 127.0)];
  float wConc = whiteConcentration[int(vUv.y * 127.0)];
  return mix(baseCol, rCol, rConc) + mix(vec4(0.0), wCol, wConc);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 L = normalize(lightDirection);
  vec3 V = normalize(vViewPosition);

  // Basic diffuse term
  float diff = max(dot(N, L), 0.0);

  // Simple rim lighting
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.0);

  // Modulate color by concentrations
  vec4 color = concColor();

  // Combine lighting
  color = color * (0.3 + 0.7 * diff) + 0.4 * color * rim;

  gl_FragColor = color;
}
